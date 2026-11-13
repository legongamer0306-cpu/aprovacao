import { CycleDay, DailyTask, SavedAISchedule } from './types';
import { parsePastedSyllabus } from './syllabusParser';

export interface GenerateScheduleOptions {
  studentId: string;
  targetId: string;
  targetName: string;
  title?: string;
  editalText: string;
  weeklyHours: number;
  methodology: 'ciclo_intercalado' | 'foco_questoes' | 'reta_final';
  focusWeaknesses: boolean;
  includeDiscursivas: boolean;
  existingScheduleId?: string;
  existingCreatedAt?: string;
}

const WEEK_DAYS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

function shortenTopic(text: string, maxLen = 62): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= maxLen) return clean;
  return clean.slice(0, maxLen - 3).trim() + '...';
}

export function generateScheduleFromEdital(options: GenerateScheduleOptions): SavedAISchedule {
  const {
    studentId,
    targetId,
    targetName,
    title,
    editalText,
    weeklyHours,
    methodology,
    focusWeaknesses,
    includeDiscursivas,
    existingScheduleId,
    existingCreatedAt,
  } = options;

  const trimmedEdital = editalText.trim();
  const scheduleTitle =
    (title && title.trim()) ||
    `Cronograma IA • ${targetName}`;

  const parsedSyllabus = parsePastedSyllabus(trimmedEdital, targetId, scheduleTitle);

  const extractedSubjects = parsedSyllabus.subjects
    .map((s) => s.subject)
    .filter(Boolean);

  const subjectsList =
    parsedSyllabus.subjects.length > 0
      ? parsedSyllabus.subjects
      : [
          {
            id: 'subj-fallback-1',
            subject: targetName || 'Conteúdo Geral do Edital',
            totalTopics: 1,
            completedTopics: 0,
            topics: [
              {
                id: 'top-fallback-1',
                name: shortenTopic(trimmedEdital, 80) || 'Estudo Direcionado do Edital',
                completed: false,
                weight: 'Alto' as const,
              },
            ],
          },
        ];

  const totalTopicsCount = subjectsList.reduce((acc, s) => acc + s.topics.length, 0);

  // Collect high-weight topics and general topics across subjects
  const allTopicEntries: Array<{ subject: string; topic: string; weight: string }> = [];
  subjectsList.forEach((subj) => {
    subj.topics.forEach((t) => {
      allTopicEntries.push({
        subject: subj.subject,
        topic: t.name,
        weight: t.weight || 'Médio',
      });
    });
  });

  // Sort to prioritize high weight if focusWeaknesses is enabled
  const prioritizedEntries = focusWeaknesses
    ? [...allTopicEntries].sort((a, b) => (a.weight === 'Alto' ? -1 : 1) - (b.weight === 'Alto' ? -1 : 1))
    : allTopicEntries;

  // Determine daily hours distribution across 7 days matching weeklyHours
  const baseDailyHours = Number((weeklyHours / 7).toFixed(1));
  const saturdayHours = Number(Math.min(10, Math.max(baseDailyHours + 1, 3)).toFixed(1));
  const sundayHours = Number(Math.max(1.5, baseDailyHours - 0.5).toFixed(1));
  const weekdayTotal = Math.max(5, weeklyHours - saturdayHours - sundayHours);
  const weekdayHours = Number((weekdayTotal / 5).toFixed(1));

  // Build 7-day cycle strictly from extracted subjects & topics
  const cycleDays: CycleDay[] = WEEK_DAYS.map((day, idx) => {
    const isToday = idx === 0; // First day active on new schedule
    const status: CycleDay['status'] = isToday ? 'hoje' : 'pendente';

    if (idx === 5) {
      // Sábado: Simulado e Revisão dos assuntos do edital
      const topSubjects = subjectsList.slice(0, 2).map((s) => s.subject).join(' + ');
      return {
        day,
        block:
          methodology === 'reta_final'
            ? `Simulado Cronometrado: ${topSubjects}`
            : `Bateria de Questões: ${topSubjects}`,
        status,
        hours: saturdayHours,
      };
    }

    if (idx === 6) {
      // Domingo: Revisão / Discursivas
      const reviewTarget = subjectsList[subjectsList.length - 1]?.subject || 'Edital Completo';
      return {
        day,
        block: includeDiscursivas
          ? `Discursiva + Revisão (${reviewTarget})`
          : `Revisão Periódica & Caderno de Erros`,
        status,
        hours: sundayHours,
      };
    }

    // Weekdays: rotate extracted subjects cleanly
    const primarySubj = subjectsList[idx % subjectsList.length];
    const secondarySubj =
      subjectsList.length > 1
        ? subjectsList[(idx + 1) % subjectsList.length]
        : null;

    const firstTopic = primarySubj.topics[idx % primarySubj.topics.length]?.name || '';
    const blockLabel = secondarySubj
      ? `${primarySubj.subject} + ${secondarySubj.subject}`
      : `${primarySubj.subject}: ${shortenTopic(firstTopic, 32)}`;

    return {
      day,
      block: blockLabel,
      status,
      hours: weekdayHours,
    };
  });

  // Build Daily Tasks based on extracted topics & selected methodology
  const nowTs = Date.now();
  const dailyBudgetMinutes = Math.max(60, Math.round((weeklyHours / 7) * 60));
  const tasks: DailyTask[] = [];

  const maxDailyTasks = Math.min(6, Math.max(3, Math.min(prioritizedEntries.length + 1, 5)));
  const perTaskMinutes = Math.max(20, Math.round(dailyBudgetMinutes / maxDailyTasks));

  for (let i = 0; i < Math.min(prioritizedEntries.length, 4); i++) {
    const entry = prioritizedEntries[i];
    let taskType: DailyTask['type'] = 'teoria';
    let prefix = 'Teoria & Mapeamento';
    let targetCount = 1;

    if (methodology === 'foco_questoes') {
      taskType = i % 3 === 2 ? 'revisao' : 'questoes';
      prefix = taskType === 'revisao' ? 'Engenharia Reversa' : 'Bateria de Questões';
      targetCount = taskType === 'revisao' ? 15 : 25;
    } else if (methodology === 'reta_final') {
      taskType = i === 0 ? 'simulado' : i % 2 === 1 ? 'lei_seca' : 'questoes';
      prefix =
        taskType === 'simulado'
          ? 'Simulado Rápido'
          : taskType === 'lei_seca'
          ? 'Lei Seca & Súmulas'
          : 'Questões Recentes';
      targetCount = 30;
    } else {
      // ciclo_intercalado
      const cycleTypes: DailyTask['type'][] = ['teoria', 'questoes', 'lei_seca', 'revisao'];
      taskType = cycleTypes[i % cycleTypes.length];
      prefix =
        taskType === 'teoria'
          ? 'Estudo Base'
          : taskType === 'questoes'
          ? 'Resolução Ativa'
          : taskType === 'lei_seca'
          ? 'Leitura Direcionada'
          : 'Revisão Espaçada';
      targetCount = taskType === 'questoes' ? 20 : taskType === 'revisao' ? 15 : 1;
    }

    tasks.push({
      id: `task-ai-${nowTs}-${i + 1}`,
      title: `${prefix}: ${shortenTopic(entry.topic, 70)}`,
      subject: entry.subject,
      type: taskType,
      durationMinutes: perTaskMinutes,
      completed: false,
      targetCount,
      currentCount: 0,
    });
  }

  if (includeDiscursivas) {
    const mainSubject = subjectsList[0]?.subject || 'Temas do Edital';
    tasks.push({
      id: `task-ai-${nowTs}-disc`,
      title: `Treino de Redação / Discursiva: ${shortenTopic(mainSubject, 55)}`,
      subject: mainSubject,
      type: 'teoria',
      durationMinutes: Math.max(30, Math.round(perTaskMinutes * 0.9)),
      completed: false,
      targetCount: 1,
      currentCount: 0,
    });
  }

  const formattedNow = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return {
    id: existingScheduleId || `sched-ai-${nowTs}`,
    studentId,
    title: scheduleTitle,
    editalText: trimmedEdital,
    weeklyHours,
    methodology,
    focusWeaknesses,
    includeDiscursivas,
    subjectsCount: subjectsList.length,
    topicsCount: totalTopicsCount,
    extractedSubjects: subjectsList.map((s) => s.subject),
    tasks,
    cycleDays,
    syllabus: parsedSyllabus,
    createdAt: existingCreatedAt || formattedNow,
    updatedAt: formattedNow,
  };
}
