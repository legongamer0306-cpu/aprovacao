import { SyllabusSubject, CustomSyllabus } from './types';

/**
 * Intelligent parser for pasted edital/syllabus text.
 * Handles patterns such as:
 * - "DIREITO CONSTITUCIONAL: 1. Teoria da Constituição. 2. Direitos fundamentais..."
 * - "DISCIPLINA: DIREITO TRIBUTÁRIO \n - Conceito de tributo \n - Espécies tributárias..."
 * - Bullet lists, numbered points, or raw topic lines.
 */
export function parsePastedSyllabus(rawText: string, targetId: string, title: string): CustomSyllabus {
  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
  const subjectsMap: Record<string, string[]> = {};
  
  let currentSubject = 'Conteúdo Programático Geral';

  // Common subject detection keywords
  const subjectKeywordRegex = /^(disciplina|mat[ée]ria|conte[úu]do|bloco|m[óo]dulo|conhecimentos\s+(b[áa]sicos|espec[íi]ficos)|direito\s+[a-zçãõ]+|língua\s+portuguesa|portugu[êe]s|contabilidade|administra[çc][ãa]o|auditoria|inform[áa]tica|racioc[íi]nio\s+l[óo]gico|estat[íi]stica|economia|legisla[çc][ãa]o)[\s:–-]/i;

  for (const line of lines) {
    const isSubjectHeader = 
      line.length < 75 && 
      (line.endsWith(':') || 
       subjectKeywordRegex.test(line) || 
       (line.toUpperCase() === line && line.length > 4 && !line.startsWith('1.') && !line.startsWith('-')));

    if (isSubjectHeader) {
      currentSubject = line.replace(/[:–-]$/, '').trim();
      if (!subjectsMap[currentSubject]) {
        subjectsMap[currentSubject] = [];
      }
    } else {
      if (!subjectsMap[currentSubject]) {
        subjectsMap[currentSubject] = [];
      }

      // Check if line contains numbered list like "1. Item A. 2. Item B."
      if (line.includes('1.') && line.includes('2.')) {
        const subItems = line.split(/(?=\b\d+[\.\)])/).map(s => s.replace(/^\d+[\.\)]\s*/, '').trim()).filter(Boolean);
        for (const item of subItems) {
          if (item) subjectsMap[currentSubject].push(item);
        }
      } else {
        // Clean leading bullets or numbering
        const cleaned = line.replace(/^([•\-\*]|\d+[\.\)])\s*/, '').trim();
        if (cleaned) {
          // If semicolon separated
          if (cleaned.includes(';') && cleaned.split(';').length > 2) {
            const parts = cleaned.split(';').map(p => p.trim()).filter(Boolean);
            subjectsMap[currentSubject].push(...parts);
          } else {
            subjectsMap[currentSubject].push(cleaned);
          }
        }
      }
    }
  }

  // Convert map to structured SyllabusSubject array
  const subjects: SyllabusSubject[] = Object.entries(subjectsMap)
    .filter(([_, topics]) => topics.length > 0)
    .map(([subjectName, topics], sIdx) => ({
      id: `subj-${sIdx + 1}`,
      subject: subjectName,
      totalTopics: topics.length,
      completedTopics: 0,
      topics: topics.map((tName, tIdx) => ({
        id: `t-${sIdx + 1}-${tIdx + 1}`,
        name: tName,
        completed: false,
        weight: tIdx % 3 === 0 ? 'Alto' : tIdx % 3 === 1 ? 'Médio' : 'Baixo',
      })),
    }));

  // Fallback if no structured subjects were detected
  if (subjects.length === 0 && lines.length > 0) {
    subjects.push({
      id: 'subj-1',
      subject: title || 'Edital Importado',
      totalTopics: lines.length,
      completedTopics: 0,
      topics: lines.map((l, idx) => ({
        id: `t-1-${idx + 1}`,
        name: l.replace(/^([•\-\*]|\d+[\.\)])\s*/, ''),
        completed: false,
        weight: 'Alto',
      })),
    });
  }

  return {
    id: `syllabus-${Date.now()}`,
    targetId,
    title: title || 'Edital Personalizado',
    pastedContent: rawText,
    createdAt: new Date().toLocaleDateString('pt-BR'),
    subjects,
  };
}

export const SAMPLE_EDITAL_TEXT = `DIREITO CONSTITUCIONAL:
1. Constituição: conceito, classificações, princípios fundamentais.
2. Direitos e garantias fundamentais: direitos individuais e coletivos (Art. 5º), direitos sociais, nacionalidade e direitos políticos.
3. Remédios Constitucionais: Habeas Corpus, Mandado de Segurança, Habeas Data, Mandado de Injunção e Ação Popular.
4. Organização do Estado: competências da União, Estados e Municípios.
5. Poder Judiciário: estrutura, competências do STF e STJ, Súmulas Vinculantes.
6. Controle de Constitucionalidade: modelos difuso e concentrado, ações do controle (ADI, ADC, ADO e ADPF).

DIREITO TRIBUTÁRIO:
1. Sistema Tributário Nacional: princípios constitucionais tributários (legalidade, anterioridade comum e nonagesimal, irretroatividade).
2. Imunidades Tributárias: imunidade recíproca, templos de qualquer culto, partidos políticos e livros/periódicos.
3. Tributos: conceito, espécies (impostos, taxas, contribuições de melhoria, empréstimos compulsórios e contribuições especiais).
4. Obrigação Tributária: fato gerador, sujeitos ativo e passivo, responsabilidade dos sócios e sucessores.
5. Crédito Tributário: lançamento, suspensão, extinção e exclusão do crédito (CTN arts. 151 a 175).

CONTABILIDADE GERAL:
1. Pronunciamento Técnico CPC 00 (Estrutura Conceitual para Relatório Financeiro).
2. CPC 47: Receita de Contrato com Cliente (modelo de 5 etapas).
3. CPC 27 e 01: Ativo Imobilizado, Depreciação e Redução ao Valor Recuperável (Impairment).
4. Demonstrações Contábeis: Balanço Patrimonial, DRE, DRA, DMPL e DFC (Métodos Direto e Indireto).`;
