import { ExamTarget, ExamQuestion, Flashcard, DailyTask, SubjectPerformance, MindMap, ManagedUser, LegalItem, StudyPDF, CycleDay, AuditEntry, CustomSyllabus, MockExamRankingEntry } from './types';

export const TARGET_EXAMS: ExamTarget[] = [
  {
    id: 'rfb-auditor',
    name: 'Receita Federal do Brasil (Curso Oficial)',
    code: 'RFB 2026',
    agency: 'Receita Federal',
    role: 'Auditor-Fiscal da Receita Federal',
    totalSeats: 699,
    salary: 'R$ 22.921,71',
    examDate: '15 de Novembro de 2026',
    daysRemaining: 36,
    progressPercent: 78,
    category: 'Fiscal & Controle',
    workloadHours: 420,
    instructor: 'Prof. Alexandre Meirelles & Auditores',
    isOpenForEnrollment: true,
    enrolledStudentsCount: 384,
    enrolledStudentIds: ['usr-1'],
    enrollmentDeadline: '10/11/2026',
    description: 'Preparatório avançado para Auditor da RFB. Abrange Direito Tributário, Legislação Tributária e Aduaneira, Contabilidade Geral e Auditoria com questões inéditas comentadas.',
  },
  {
    id: 'oab-43',
    name: 'Exame de Ordem Unificado (1ª Fase)',
    code: 'OAB 43º',
    agency: 'Conselho Federal OAB / FGV',
    role: 'Advocacia Geral',
    totalSeats: 0,
    salary: 'Habilitação Profissional',
    examDate: '29 de Novembro de 2026',
    daysRemaining: 50,
    progressPercent: 64,
    category: 'Carreira Jurídica',
    workloadHours: 280,
    instructor: 'Profa. Mariana Silveira & Equipe OAB',
    isOpenForEnrollment: true,
    enrolledStudentsCount: 612,
    enrolledStudentIds: ['usr-2', 'usr-7'],
    enrollmentDeadline: '20/11/2026',
    description: 'Curso intensivo com foco nos 80 tópicos mais recorrentes da FGV: Ética Profissional (8 questões garantidas), Direito Constitucional, Civil e Penal.',
  },
  {
    id: 'tcu-auditor',
    name: 'Tribunal de Contas da União (Controle Externo)',
    code: 'TCU 2026',
    agency: 'TCU',
    role: 'Auditor Federal de Controle Externo',
    totalSeats: 45,
    salary: 'R$ 24.120,00',
    examDate: '12 de Dezembro de 2026',
    daysRemaining: 63,
    progressPercent: 52,
    category: 'Fiscal & Controle',
    workloadHours: 390,
    instructor: 'Equipe de Auditores de Controle',
    isOpenForEnrollment: true,
    enrolledStudentsCount: 195,
    enrolledStudentIds: ['usr-3'],
    enrollmentDeadline: '30/11/2026',
    description: 'Preparação completa para o TCU: Controle Externo, Auditoria Governamental, Análise de Dados e AFO com foco rigoroso nas bancas Cebraspe e FGV.',
  },
  {
    id: 'magistratura-tjsp',
    name: 'Tribunal de Justiça de SP (191º Concurso)',
    code: 'TJSP 191º',
    agency: 'TJ-SP / Vunesp',
    role: 'Juiz Substituto',
    totalSeats: 220,
    salary: 'R$ 33.689,11',
    examDate: '24 de Janeiro de 2027',
    daysRemaining: 106,
    progressPercent: 41,
    category: 'Carreira Jurídica',
    workloadHours: 520,
    instructor: 'Magistrados e Doutrinadores Convidados',
    isOpenForEnrollment: true,
    enrolledStudentsCount: 148,
    enrolledStudentIds: ['usr-5'],
    enrollmentDeadline: '15/12/2026',
    description: 'Trilha de excelência para a Magistratura Estadual Paulista. Humanística, Jurisprudência temática do STJ/STF e Resoluções vigentes do CNJ.',
  },
  {
    id: 'dpf-delegado',
    name: 'Polícia Federal - Delegado de Polícia',
    code: 'DPF 2026',
    agency: 'Polícia Federal / Cebraspe',
    role: 'Delegado de Polícia Federal',
    totalSeats: 150,
    salary: 'R$ 25.825,00',
    examDate: '28 de Fevereiro de 2027',
    daysRemaining: 141,
    progressPercent: 25,
    category: 'Policial',
    workloadHours: 450,
    instructor: 'Delegados de Carreira e Peritos Federais',
    isOpenForEnrollment: true,
    enrolledStudentsCount: 230,
    enrolledStudentIds: ['usr-6'],
    enrollmentDeadline: '10/01/2027',
    description: 'Treinamento intensivo para a carreira de Delegado Federal: Direito Penal e Processual Penal Especial, Criminologia, Direito Administrativo e Constitucional.',
  },
];

export const MOCK_QUESTIONS: ExamQuestion[] = [
  {
    id: 'q-101',
    code: 'Q-98421',
    year: 2024,
    board: 'FGV',
    agency: 'Receita Federal',
    role: 'Auditor-Fiscal',
    subject: 'Direito Constitucional',
    topic: 'Direitos e Garantias Fundamentais - Remédios Constitucionais',
    difficulty: 'Média',
    statement: `Determinada autoridade administrativa federal negou a João o acesso a dados e informações relativas à sua própria pessoa, constantes de banco de dados oficial de entidade governamental de caráter público, sob o pretexto de que tais registros estariam protegidos por sigilo discricionário da pasta.\n\nConsiderando a sistemática dos remédios constitucionais positivada na Constituição da República de 1988 e a jurisprudência sumulada do Supremo Tribunal Federal, assinale a alternativa correta a respeito da medida cabível para tutelar a pretensão de João.`,
    options: [
      {
        id: 'opt-a',
        label: 'A',
        text: 'Cabe Mandado de Segurança repressivo, haja vista que o Habeas Data restringe-se exclusivamente a bancos de dados privados ou sigilosos bancários.',
        explanation: 'Incorreto. O Habeas Data é expressamente a via constitucional adequada para assegurar o conhecimento de informações relativas à pessoa do impetrante em registros governamentais (Art. 5º, LXXII, "a").'
      },
      {
        id: 'opt-b',
        label: 'B',
        text: 'Cabe Habeas Data, sendo indispensável a prévia recusa administrativa ou decurso de prazo sem resposta como condição de procedibilidade.',
        explanation: 'Correto! Conforme a Súmula 2 do STJ e o Art. 8º da Lei nº 9.507/1997, o Habeas Data pressupõe a prova da recusa de informações por parte da autoridade ou o decurso do prazo legal de resposta.'
      },
      {
        id: 'opt-c',
        label: 'C',
        text: 'Não é cabível qualquer remédio constitucional sem o prévio esgotamento de todas as instâncias recursais administrativas.',
        explanation: 'Incorreto. A garantia constitucional da inafastabilidade da jurisdição (Art. 5º, XXXV) não exige exaurimento das vias administrativas, exigindo apenas a recusa inicial para configuração do interesse de agir.'
      },
      {
        id: 'opt-d',
        label: 'D',
        text: 'Cabe Ação Popular, por se tratar de preservação da moralidade e da publicidade dos atos praticados por agente público federal.',
        explanation: 'Incorreto. A Ação Popular tutela o patrimônio público, histórico, ambiental e a moralidade administrativa genérica, não direitos subjetivos individuais personalíssimos.'
      },
      {
        id: 'opt-e',
        label: 'E',
        text: 'Cabe Mandado de Injunção, em razão da ausência de norma regulamentadora específica sobre o sigilo discricionário dos atos executivos.',
        explanation: 'Incorreto. O Mandado de Injunção aplica-se estritamente à falta de norma regulamentadora que inviabilize o exercício de direitos e liberdades constitucionais.'
      }
    ],
    correctOptionId: 'opt-b',
    legalBasis: 'CF/88, Art. 5º, LXXII; Súmula 2/STJ; Lei nº 9.507/1997, Art. 8º.',
    tags: ['Habeas Data', 'Súmula 2 STJ', 'Remédios Constitucionais', 'CF/88']
  },
  {
    id: 'q-102',
    code: 'Q-98422',
    year: 2024,
    board: 'FGV',
    agency: 'Receita Federal',
    role: 'Auditor-Fiscal',
    subject: 'Direito Tributário',
    topic: 'Princípios Tributários e Imunidades Constitucionais',
    difficulty: 'Difícil',
    statement: `Lei Ordinária Federal publicada em 28 de dezembro de 2024 majorou a alíquota das Contribuições Sociais destinadas ao financiamento da Seguridade Social incidentes sobre a folha de salários (Art. 195, I, 'a', da CF/88), estabelecendo expressamente que seus efeitos financeiros teriam início imediato a partir de 1º de janeiro de 2025.\n\nÀ luz do regime jurídico das limitações constitucionais ao poder de tributar, assinale a opção que reflete a constitucionalidade e a vigência temporal da referida norma.`,
    options: [
      {
        id: 'opt-a',
        label: 'A',
        text: 'A exigência em 1º de janeiro de 2025 é inconstitucional, pois as contribuições sociais sobre a folha submetem-se exclusivamente ao princípio da anterioridade anual de exercício.',
        explanation: 'Incorreto. As contribuições para a seguridade social submetem-se à anterioridade nonagesimal (noventena), e não à anterioridade de exercício comum (Art. 195, §6º, CF/88).'
      },
      {
        id: 'opt-b',
        label: 'B',
        text: 'A lei é plenamente constitucional e imediatamente eficaz no dia 1º de janeiro, pois as contribuições para a seguridade social são imunes a qualquer regra de anterioridade.',
        explanation: 'Incorreto. Elas são exceção à anterioridade geral do exercício, porém submetem-se compulsoriamente à noventena constitucional de 90 dias.'
      },
      {
        id: 'opt-c',
        label: 'C',
        text: 'A lei é inconstitucional no tocante à eficácia imediata, só podendo ser exigida após decorridos 90 (noventa) dias da data de sua publicação, respeitando a anterioridade nonagesimal mitigada.',
        explanation: 'Correto! Nos termos do Art. 195, §6º da CF/88, as contribuições da seguridade social só poderão ser exigidas após decorridos noventa dias da data da publicação da lei que as houver instituído ou modificado.'
      },
      {
        id: 'opt-d',
        label: 'D',
        text: 'A exigência é válida apenas a partir de 1º de janeiro de 2026, pois deve cumular de modo irrenunciável tanto a anterioridade anual quanto a nonagesimal.',
        explanation: 'Incorreto. O §6º do Art. 195 expressamente afasta o Art. 150, III, "b" (anterioridade anual), exigindo exclusivamente a observância do prazo de 90 dias.'
      },
      {
        id: 'opt-e',
        label: 'E',
        text: 'A lei padece de vício de iniciativa formal, pois contribuições para a seguridade social demandam obrigatoriamente edição de Lei Complementar.',
        explanation: 'Incorreto. Apenas novas contribuições residuais não previstas no texto (Art. 195, §4º) demandam lei complementar. As ordinárias do inciso I admitem lei ordinária.'
      }
    ],
    correctOptionId: 'opt-c',
    legalBasis: 'CF/88, Art. 195, § 6º e Art. 150, § 1º.',
    tags: ['Anterioridade Nonagesimal', 'Art. 195 §6º', 'Seguridade Social']
  },
  {
    id: 'q-103',
    code: 'Q-98423',
    year: 2023,
    board: 'Cebraspe',
    agency: 'TCU',
    role: 'Auditor Federal',
    subject: 'Direito Administrativo',
    topic: 'Atos Administrativos - Atributos e Extinção',
    difficulty: 'Fácil',
    statement: `Acerca dos atributos dos atos administrativos e das modalidades de sua extinção, assinale a opção correta consoante a sólida doutrina de Direito Administrativo.`,
    options: [
      {
        id: 'opt-a',
        label: 'A',
        text: 'A anulação do ato administrativo com vício insanável produz efeitos ex nunc, resguardando sempre os efeitos pretéritos.',
        explanation: 'Incorreto. A anulação opera efeitos retroativos (ex tunc), desfazendo as consequências jurídicas desde a sua origem.'
      },
      {
        id: 'opt-b',
        label: 'B',
        text: 'A revogação de um ato administrativo legítimo fundamenta-se em juízo de conveniência e oportunidade, operando efeitos proativos (ex nunc).',
        explanation: 'Correto! A revogação incide sobre atos legais e perfeitos por razões de mérito administrativo (conveniência e oportunidade), produzindo efeitos não retroativos (ex nunc).'
      },
      {
        id: 'opt-c',
        label: 'C',
        text: 'O Poder Judiciário possui competência para revogar atos administrativos do Poder Executivo quando considerá-los inoportunos.',
        explanation: 'Incorreto. O Judiciário jamais revoga ato do Executivo por mérito/conveniência (apenas anula por ilegalidade). Apenas pode revogar os seus próprios atos na função atípica administrativa.'
      },
      {
        id: 'opt-d',
        label: 'D',
        text: 'A autoexecutoriedade é atributo presente de forma indistinta e absoluta em todos os atos administrativos da Administração Pública.',
        explanation: 'Incorreto. A autoexecutoriedade não existe em todos os atos (ex.: cobrança de multas administrativas pecuniárias requer execução fiscal judicial).'
      },
      {
        id: 'opt-e',
        label: 'E',
        text: 'A presunção de legitimidade dos atos administrativos é absoluta (juris et de jure), não admitindo prova em contrário por parte do administrado.',
        explanation: 'Incorreto. Trata-se de presunção relativa (juris tantum), cabendo ao administrado o ônus de comprovar a desconformidade do ato com a lei.'
      }
    ],
    correctOptionId: 'opt-b',
    legalBasis: 'Súmula 473 do STF; Lei nº 9.784/1999, Art. 53.',
    tags: ['Súmula 473 STF', 'Revogação x Anulação', 'Atributos dos Atos']
  },
  {
    id: 'q-104',
    code: 'Q-98424',
    year: 2024,
    board: 'FGV',
    agency: 'Receita Federal',
    role: 'Auditor-Fiscal',
    subject: 'Contabilidade Geral',
    topic: 'Pronunciamentos Técnicos CPC - Reconhecimento de Receita (CPC 47)',
    difficulty: 'Difícil',
    statement: `Segundo o Pronunciamento Técnico CPC 47 (Receita de Contrato com Cliente), o modelo de 5 etapas para reconhecimento de receita estabelece uma sistemática rigorosa de alocação e apropriação ao longo do tempo ou em momento específico no tempo.\n\nAssinale a opção que indica corretamente o critério exigido para que uma obrigação de desempenho seja satisfeita e reconhecida ao longo do tempo (over time).`,
    options: [
      {
        id: 'opt-a',
        label: 'A',
        text: 'O cliente recebe e consome simultaneamente os benefícios gerados pelo desempenho da entidade à medida que este ocorre.',
        explanation: 'Correto! É exatamente o primeiro critério do CPC 47 (item 35(a)): se o cliente simultaneamente recebe e consome os benefícios, a receita é reconhecida ao longo do tempo.'
      },
      {
        id: 'opt-b',
        label: 'B',
        text: 'A entidade transfere a posse física do ativo e a nota fiscal com aceite formal na data da entrega final.',
        explanation: 'Incorreto. A posse física com aceite na entrega final caracteriza reconhecimento em momento determinado no tempo (point in time), e não ao longo do tempo.'
      },
      {
        id: 'opt-c',
        label: 'C',
        text: 'O pagamento total pelo cliente foi integralmente liquidado à vista em momento anterior ao início da produção.',
        explanation: 'Incorreto. Recebimento financeiro antecipado gera Passivo (Adiantamento de Clientes) e não determina o momento da transferência de controle do bem ou serviço.'
      },
      {
        id: 'opt-d',
        label: 'D',
        text: 'A margem bruta estimada do contrato supera 25% de lucro líquido auditado ao término do exercício social.',
        explanation: 'Incorreto. Margem de lucro não é critério para classificação de obrigação de desempenho segundo o CPC 47.'
      },
      {
        id: 'opt-e',
        label: 'E',
        text: 'O produto resultante possui uso alternativo viável e imediato para outros clientes no mercado concorrente.',
        explanation: 'Incorreto. O requisito é exatamente o inverso: a entidade não cria um ativo com uso alternativo e possui direito executável ao pagamento pelo desempenho concluído até a data.'
      }
    ],
    correctOptionId: 'opt-a',
    legalBasis: 'Pronunciamento Técnico CPC 47 / IFRS 15, item 35.',
    tags: ['CPC 47', 'Receita de Contratos', 'Contabilidade Avançada'],
    origin: 'oficial'
  },
  {
    id: 'q-ia-201',
    code: 'DOC-77312',
    year: 2026,
    board: 'Coordenação Pedagógica',
    agency: 'Simulado Inédito Especial',
    role: 'Auditor-Fiscal da RFB',
    subject: 'Direito Tributário',
    topic: 'Reforma Tributária (EC 132/2023) - IBS e CBS',
    difficulty: 'Difícil',
    origin: 'oficial',
    statement: `Com o advento da Emenda Constitucional nº 132/2023 (Reforma Tributária sobre o Consumo), instituiu-se o Imposto sobre Bens e Serviços (IBS) e a Contribuição sobre Bens e Serviços (CBS), conformando um modelo de IVA Dual no ordenamento jurídico pátrio.\n\nConsiderando a conformação das imunidades e a não cumulatividade plena aplicável ao novo regime, assinale a opção correta acerca da incidência do IBS e CBS.`,
    options: [
      {
        id: 'opt-a',
        label: 'A',
        text: 'O IBS e a CBS integram suas próprias bases de cálculo (cálculo "por dentro"), incidindo de maneira cumulativa sobre a receita bruta total.',
        explanation: 'Incorreto. A EC 132/2023 vedou expressamente o cálculo "por dentro": o IBS e a CBS não integrarão sua própria base de cálculo nem a base de cálculo um do outro.'
      },
      {
        id: 'opt-b',
        label: 'B',
        text: 'O IBS e a CBS não integram a base de cálculo um do outro nem de quaisquer outros tributos, adotando o princípio do destino e a não cumulatividade com apropriação ampla de créditos.',
        explanation: 'Correto! Conforme a redação dada pela EC 132/2023 (art. 156-A, § 1º, e art. 195, § 16), o IBS e a CBS seguem a regra da cobrança "por fora", não cumulatividade ampla e tributação no destino.'
      },
      {
        id: 'opt-c',
        label: 'C',
        text: 'A competência para instituir o IBS é privativa da União, enquanto a CBS compete concorrentemente aos Estados e ao Distrito Federal.',
        explanation: 'Incorreto. A CBS é federal (União), enquanto o IBS é de competência compartilhada entre Estados, Distrito Federal e Municípios.'
      },
      {
        id: 'opt-d',
        label: 'D',
        text: 'As operações de exportação para o exterior sofrem incidência integral do IBS à alíquota de referência para preservação do pacto federativo.',
        explanation: 'Incorreto. As exportações para o exterior são desoneradas (imunes) de IBS e CBS, com manutenção e aproveitamento integral dos créditos da cadeia produtiva.'
      },
      {
        id: 'opt-e',
        label: 'E',
        text: 'A CBS sujeita-se à anterioridade anual comum de exercício financeiro, sendo dispensada da observância de prazo nonagesimal.',
        explanation: 'Incorreto. Sendo contribuição da seguridade social (art. 195), a CBS sujeita-se estritamente à anterioridade nonagesimal (noventena), e não à anual.'
      }
    ],
    correctOptionId: 'opt-b',
    legalBasis: 'CF/88, art. 156-A e art. 195, XVI (incluídos pela EC nº 132/2023).',
    tags: ['EC 132/2023', 'Reforma Tributária', 'IBS e CBS', 'IVA Dual']
  },
  {
    id: 'q-doc-202',
    code: 'DOC-77313',
    year: 2026,
    board: 'Coordenação Pedagógica',
    agency: 'Simulado FGV Oficial',
    role: 'Auditor Federal de Controle Externo',
    subject: 'Direito Constitucional',
    topic: 'Processo Legislativo - Medidas Provisórias e Emendas Constitucionais',
    difficulty: 'Média',
    origin: 'oficial',
    statement: `Suponha que durante a vigência de Estado de Defesa decretado em determinado estado da federação, o Congresso Nacional pretenda aprovar Emenda Constitucional que altere a repartição constitucional das receitas tributárias entre a União e os Municípios.\n\nÀ luz das limitações circunstanciais e materiais ao poder constituinte derivado reformador, assinale a opção correta.`,
    options: [
      {
        id: 'opt-a',
        label: 'A',
        text: 'A Constituição Federal pode ser emendada normalmente durante a vigência do Estado de Defesa, desde que com quórum qualificado de quatro quintos em dois turnos.',
        explanation: 'Incorreto. A CF/88 não pode ser emendada na vigência de intervenção federal, de estado de defesa ou de estado de sítio (art. 60, § 1º) — trata-se de limitação circunstancial intransponível.'
      },
      {
        id: 'opt-b',
        label: 'B',
        text: 'A proposta de emenda não pode ser votada nem promulgada, tendo em vista a vedação expressa à reforma constitucional durante a vigência de Estado de Defesa.',
        explanation: 'Correto! Nos termos do Art. 60, § 1º, da CF/88: "A Constituição não poderá ser emendada na vigência de intervenção federal, de estado de defesa ou de estado de sítio" (limitações circunstanciais).'
      },
      {
        id: 'opt-c',
        label: 'C',
        text: 'Apenas propostas que versem sobre direitos fundamentais individuais são suspensas durante o Estado de Defesa, sendo livre a alteração tributária.',
        explanation: 'Incorreto. A proibição circunstancial do art. 60, § 1º é absoluta e abrange qualquer matéria de Emenda Constitucional.'
      },
      {
        id: 'opt-d',
        label: 'D',
        text: 'O Presidente da República poderá suprir o impedimento mediante edição de Medida Provisória de urgência fiscal.',
        explanation: 'Incorreto. É terminantemente vedada a edição de Medida Provisória sobre matéria reservada a Emenda Constitucional (art. 62, § 1º, I, "a").'
      },
      {
        id: 'opt-e',
        label: 'E',
        text: 'A limitação aplica-se apenas caso o Estado de Defesa tenha sido decretado na totalidade do território nacional.',
        explanation: 'Incorreto. A jurisprudência e a doutrina unânime entendem que mesmo a decretação de Estado de Defesa em área delimitada obsta a emenda constitucional.'
      }
    ],
    correctOptionId: 'opt-b',
    legalBasis: 'CF/88, Art. 60, § 1º e Art. 62, § 1º, I, "a".',
    tags: ['Art. 60 §1º', 'Limitação Circunstancial', 'Estado de Defesa', 'Emenda']
  },
  {
    id: 'q-mem-301',
    code: 'MB-44101',
    year: 2026,
    board: 'Comunidade Elite',
    agency: 'Simulado dos Membros',
    role: 'Auditor-Fiscal RFB',
    subject: 'Direito Tributário',
    topic: 'Responsabilidade Tributária de Sócios e Gerentes - Art. 135 do CTN',
    difficulty: 'Difícil',
    origin: 'membros',
    author: {
      name: 'Eduardo Brandão (Aprovado RFB)',
      badge: 'Membro Elite',
    },
    statement: `Sociedade empresária limitada deixou de recolher o ICMS declarado em guia própria no prazo legal de vencimento, mantendo-se em pleno e regular funcionamento no seu domicílio fiscal societário.\n\nDiante do inadimplemento, a Fazenda Pública Estadual ajuizou execução fiscal e redirecionou a execução diretamente contra o sócio-administrador com fulcro no art. 135, III, do Código Tributário Nacional.\n\nCom base na reiterada jurisprudência sumulada do Superior Tribunal de Justiça (STJ), analise a legalidade do redirecionamento e assinale a afirmativa correta.`,
    options: [
      {
        id: 'opt-a',
        label: 'A',
        text: 'O redirecionamento é plenamente legítimo, pois a mera falta de pagamento de tributo configura infração à lei societária apta a responsabilizar o gestor.',
        explanation: 'Incorreto. A Súmula 430 do STJ estabelece expressamente que o simples inadimplemento da obrigação tributária não gera, por si só, a responsabilidade solidária do sócio-gerente.'
      },
      {
        id: 'opt-b',
        label: 'B',
        text: 'O mero inadimplemento da obrigação tributária pela sociedade não gera, por si só, a responsabilidade do sócio-administrador nos termos do art. 135 do CTN.',
        explanation: 'Gabarito Oficial fundamentado: Súmula 430 do STJ ("O inadimplemento da obrigação tributária pela sociedade não gera, por si só, a responsabilidade solidária do sócio-gerente"). Para redirecionar, exige-se comprovação de atos praticados com excesso de poderes, infração de lei/estatuto ou dissolução irregular da sociedade (Súmula 435/STJ).'
      },
      {
        id: 'opt-c',
        label: 'C',
        text: 'O redirecionamento só é cabível caso o sócio-administrador confesse formalmente a insolvência da sociedade perante o fisco estadual.',
        explanation: 'Incorreto. A confissão de insolvência não é requisito previsto no CTN ou na jurisprudência do STJ para o redirecionamento.'
      },
      {
        id: 'opt-d',
        label: 'D',
        text: 'O sócio responde objetivamente e em caráter primário por todas as dívidas tributárias constituídas pela sociedade durante o seu mandato de gestão.',
        explanation: 'Incorreto. A responsabilidade do art. 135 do CTN é subjetiva e excepcional, demandando dolo, fraude, excesso de poderes ou infração à lei societária.'
      },
      {
        id: 'opt-e',
        label: 'E',
        text: 'O redirecionamento prescreve em 10 (dez) anos a contar da citação da pessoa jurídica executada.',
        explanation: 'Incorreto. O prazo de redirecionamento submete-se ao prazo quinquenal (5 anos) do art. 174 do CTN, nos termos do Tema Repetitivo 444 do STJ.'
      }
    ],
    correctOptionId: 'opt-b',
    legalBasis: 'Súmula 430 do STJ; CTN, art. 135, III; Tema 444/STJ.',
    tags: ['Súmula 430 STJ', 'Art. 135 CTN', 'Responsabilidade dos Sócios', 'FGV']
  }
];

export const MOCK_FLASHCARDS: Flashcard[] = [
  {
    id: 'fc-1',
    subject: 'Direito Tributário',
    deckName: 'Imunidades & Limitações ao Poder de Tributar',
    front: 'Qual o quórum qualificado e a espécie normativa para instituição do Empréstimo Compulsório previsto no Art. 148 da CF/88?',
    back: 'Exige-se expressamente LEI COMPLEMENTAR (quórum de maioria absoluta dos membros da Câmara e do Senado Federal), conforme Art. 148, caput, da CF/88.',
    legalRef: 'CF/88, Art. 148, caput.',
    difficulty: 'Média',
    nextReview: 'Hoje, 18:00',
    intervalDays: 4,
    masteryPercent: 85,
  },
  {
    id: 'fc-2',
    subject: 'Direito Constitucional',
    deckName: 'Controle de Constitucionalidade Concentrado',
    front: 'Quem são os legitimados universais para propositura de ADI e ADC perante o STF (dispensam comprovação de pertinência temática)?',
    back: 'São 4 legitimados universais (Art. 103, I, II, III e VI da CF/88):\n1. Presidente da República\n2. Mesa do Senado Federal\n3. Mesa da Câmara dos Deputados\n4. Procurador-Geral da República (PGR)',
    legalRef: 'CF/88, Art. 103 c/c Jurisprudência STF.',
    difficulty: 'Difícil',
    nextReview: 'Amanhã, 09:00',
    intervalDays: 2,
    masteryPercent: 62,
  },
  {
    id: 'fc-3',
    subject: 'Direito Administrativo',
    deckName: 'Responsabilidade Civil do Estado',
    front: 'Qual a teoria da responsabilidade civil adotada pelo ordenamento brasileiro para condutas omissivas da Administração Pública?',
    back: 'Regra geral: Teoria da Culpa Administrativa (Responsabilidade Subjetiva por "faute du service" - omissão genérica: o serviço não funcionou, funcionou mal ou funcionou com atraso).\nExceção: Responsabilidade Objetiva para omissões específicas quando o Estado possui o dever de custódia (ex: presidiários, escolas públicas).',
    legalRef: 'STF - RE 841.526 (Tema 592 de Repercussão Geral).',
    difficulty: 'Média',
    nextReview: 'Hoje, 20:30',
    intervalDays: 5,
    masteryPercent: 91,
  },
  {
    id: 'fc-4',
    subject: 'Auditoria Privada e Governamental',
    deckName: 'NBC TA 200 - Objetivos Gerais do Auditor',
    front: 'Diferença conceitual entre Risco Inerente, Risco de Controle e Risco de Detecção na matriz de risco da auditoria.',
    back: '• Risco de Distorção Relevante (RDR) = Risco Inerente (suscetibilidade da conta antes do controle) × Risco de Controle (falha do controle interno em prevenir ou detectar).\n• Risco de Detecção: Risco de que os procedimentos do auditor não identifiquem uma distorção relevante. É o único controlado diretamente pelo auditor!',
    legalRef: 'NBC TA 200 (R1) do CFC / ISSAI 200.',
    difficulty: 'Difícil',
    nextReview: 'Em 3 dias',
    intervalDays: 7,
    masteryPercent: 70,
  }
];

export const MOCK_DAILY_TASKS: DailyTask[] = [
  {
    id: 'task-1',
    title: 'Meta de Resolução: Direito Tributário (Imunidades)',
    subject: 'Direito Tributário',
    type: 'questoes',
    durationMinutes: 45,
    completed: true,
    targetCount: 20,
    currentCount: 20,
  },
  {
    id: 'task-2',
    title: 'Lei Seca: CF/88 Artigos 145 ao 162 (Do Sistema Tributário)',
    subject: 'Legislação Constitucional',
    type: 'lei_seca',
    durationMinutes: 30,
    completed: true,
    targetCount: 18,
    currentCount: 18,
  },
  {
    id: 'task-3',
    title: 'Ciclo de Revisão Ativa SRS: Flashcards Vencidos',
    subject: 'Revisão Espaçada',
    type: 'revisao',
    durationMinutes: 25,
    completed: false,
    targetCount: 35,
    currentCount: 14,
  },
  {
    id: 'task-4',
    title: 'Bloco de Simulação Cronometrada: Contabilidade Geral',
    subject: 'Contabilidade Geral',
    type: 'simulado',
    durationMinutes: 60,
    completed: false,
    targetCount: 15,
    currentCount: 0,
  },
  {
    id: 'task-5',
    title: 'Teoria Focada: Jurisprudência em Teses STJ (Edição 194)',
    subject: 'Direito Administrativo',
    type: 'teoria',
    durationMinutes: 40,
    completed: false,
    targetCount: 1,
    currentCount: 0,
  }
];

export const MOCK_SUBJECT_PERFORMANCES: SubjectPerformance[] = [
  {
    subject: 'Direito Tributário',
    questionsAnswered: 482,
    correctCount: 418,
    accuracyRate: 86.7,
    trend: 'up',
    delta: '+3.4%',
    targetRate: 85.0,
    status: 'Domínio',
  },
  {
    subject: 'Direito Constitucional',
    questionsAnswered: 530,
    correctCount: 445,
    accuracyRate: 83.9,
    trend: 'up',
    delta: '+1.8%',
    targetRate: 82.0,
    status: 'Domínio',
  },
  {
    subject: 'Direito Administrativo',
    questionsAnswered: 395,
    correctCount: 308,
    accuracyRate: 77.9,
    trend: 'neutral',
    delta: '+0.2%',
    targetRate: 80.0,
    status: 'Em Evolução',
  },
  {
    subject: 'Contabilidade Geral & Avançada',
    questionsAnswered: 310,
    correctCount: 201,
    accuracyRate: 64.8,
    trend: 'down',
    delta: '-2.5%',
    targetRate: 75.0,
    status: 'Atenção Crítica',
  },
  {
    subject: 'Auditoria e Governança Pública',
    questionsAnswered: 245,
    correctCount: 203,
    accuracyRate: 82.8,
    trend: 'up',
    delta: '+5.1%',
    targetRate: 80.0,
    status: 'Domínio',
  },
  {
    subject: 'Legislação Tributária Federal',
    questionsAnswered: 180,
    correctCount: 135,
    accuracyRate: 75.0,
    trend: 'up',
    delta: '+2.0%',
    targetRate: 78.0,
    status: 'Em Evolução',
  },
];

// Mapeamento isolado de métricas e desempenho por conta de aluno (Multi-tenancy restrito)
export const STUDENT_PERFORMANCES_MAP: Record<string, SubjectPerformance[]> = {
  // Carlos Eduardo Fontes - RFB 2026 (Auditor-Fiscal)
  'usr-1': [
    {
      subject: 'Direito Tributário',
      questionsAnswered: 482,
      correctCount: 418,
      accuracyRate: 86.7,
      trend: 'up',
      delta: '+3.4%',
      targetRate: 85.0,
      status: 'Domínio',
    },
    {
      subject: 'Direito Constitucional',
      questionsAnswered: 530,
      correctCount: 445,
      accuracyRate: 83.9,
      trend: 'up',
      delta: '+1.8%',
      targetRate: 82.0,
      status: 'Domínio',
    },
    {
      subject: 'Direito Administrativo',
      questionsAnswered: 395,
      correctCount: 308,
      accuracyRate: 77.9,
      trend: 'neutral',
      delta: '+0.2%',
      targetRate: 80.0,
      status: 'Em Evolução',
    },
    {
      subject: 'Contabilidade Geral & Avançada',
      questionsAnswered: 310,
      correctCount: 201,
      accuracyRate: 64.8,
      trend: 'down',
      delta: '-2.5%',
      targetRate: 75.0,
      status: 'Atenção Crítica',
    },
    {
      subject: 'Auditoria e Governança Pública',
      questionsAnswered: 245,
      correctCount: 203,
      accuracyRate: 82.8,
      trend: 'up',
      delta: '+5.1%',
      targetRate: 80.0,
      status: 'Domínio',
    },
    {
      subject: 'Legislação Tributária Federal',
      questionsAnswered: 180,
      correctCount: 135,
      accuracyRate: 75.0,
      trend: 'up',
      delta: '+2.0%',
      targetRate: 78.0,
      status: 'Em Evolução',
    },
  ],

  // Mariana Silveira Ramos - OAB 43º Exame Unificado
  'usr-2': [
    {
      subject: 'Ética e Estatuto da Advocacia',
      questionsAnswered: 260,
      correctCount: 234,
      accuracyRate: 90.0,
      trend: 'up',
      delta: '+4.2%',
      targetRate: 85.0,
      status: 'Domínio',
    },
    {
      subject: 'Direito Constitucional',
      questionsAnswered: 210,
      correctCount: 160,
      accuracyRate: 76.2,
      trend: 'up',
      delta: '+1.5%',
      targetRate: 80.0,
      status: 'Em Evolução',
    },
    {
      subject: 'Direito Civil & Processo Civil',
      questionsAnswered: 220,
      correctCount: 145,
      accuracyRate: 65.9,
      trend: 'neutral',
      delta: '+0.4%',
      targetRate: 75.0,
      status: 'Em Evolução',
    },
    {
      subject: 'Direito Penal & Processo Penal',
      questionsAnswered: 200,
      correctCount: 105,
      accuracyRate: 52.5,
      trend: 'down',
      delta: '-3.1%',
      targetRate: 70.0,
      status: 'Atenção Crítica',
    },
  ],

  // Roberto Viana Mendonça - TCU 2026 (Auditor Federal)
  'usr-3': [
    {
      subject: 'Controle Externo da Administração',
      questionsAnswered: 120,
      correctCount: 72,
      accuracyRate: 60.0,
      trend: 'neutral',
      delta: '-1.0%',
      targetRate: 75.0,
      status: 'Em Evolução',
    },
    {
      subject: 'Auditoria Governamental',
      questionsAnswered: 90,
      correctCount: 45,
      accuracyRate: 50.0,
      trend: 'down',
      delta: '-4.5%',
      targetRate: 80.0,
      status: 'Atenção Crítica',
    },
    {
      subject: 'Direito Administrativo',
      questionsAnswered: 60,
      correctCount: 26,
      accuracyRate: 43.3,
      trend: 'down',
      delta: '-2.0%',
      targetRate: 75.0,
      status: 'Atenção Crítica',
    },
    {
      subject: 'Administração Financeira e Orçamentária (AFO)',
      questionsAnswered: 40,
      correctCount: 16,
      accuracyRate: 40.0,
      trend: 'down',
      delta: '-5.0%',
      targetRate: 75.0,
      status: 'Atenção Crítica',
    },
  ],
};

// Gerador de métricas iniciais para novos alunos cadastrados
export function getInitialStudentPerformance(studentId: string, targetExam: string): SubjectPerformance[] {
  if (STUDENT_PERFORMANCES_MAP[studentId]) {
    return STUDENT_PERFORMANCES_MAP[studentId];
  }
  const isJuridico = targetExam.toLowerCase().includes('oab') || targetExam.toLowerCase().includes('magistratura');
  if (isJuridico) {
    return [
      {
        subject: 'Ética Profissional',
        questionsAnswered: 0,
        correctCount: 0,
        accuracyRate: 0,
        trend: 'neutral',
        delta: '0.0%',
        targetRate: 85.0,
        status: 'Em Evolução',
      },
      {
        subject: 'Direito Constitucional',
        questionsAnswered: 0,
        correctCount: 0,
        accuracyRate: 0,
        trend: 'neutral',
        delta: '0.0%',
        targetRate: 80.0,
        status: 'Em Evolução',
      },
      {
        subject: 'Direito Civil',
        questionsAnswered: 0,
        correctCount: 0,
        accuracyRate: 0,
        trend: 'neutral',
        delta: '0.0%',
        targetRate: 75.0,
        status: 'Em Evolução',
      },
      {
        subject: 'Direito Penal',
        questionsAnswered: 0,
        correctCount: 0,
        accuracyRate: 0,
        trend: 'neutral',
        delta: '0.0%',
        targetRate: 75.0,
        status: 'Em Evolução',
      },
    ];
  }

  return [
    {
      subject: 'Direito Constitucional',
      questionsAnswered: 0,
      correctCount: 0,
      accuracyRate: 0,
      trend: 'neutral',
      delta: '0.0%',
      targetRate: 80.0,
      status: 'Em Evolução',
    },
    {
      subject: 'Direito Administrativo',
      questionsAnswered: 0,
      correctCount: 0,
      accuracyRate: 0,
      trend: 'neutral',
      delta: '0.0%',
      targetRate: 80.0,
      status: 'Em Evolução',
    },
    {
      subject: 'Língua Portuguesa',
      questionsAnswered: 0,
      correctCount: 0,
      accuracyRate: 0,
      trend: 'neutral',
      delta: '0.0%',
      targetRate: 85.0,
      status: 'Em Evolução',
    },
    {
      subject: 'Raciocínio Lógico & Estatística',
      questionsAnswered: 0,
      correctCount: 0,
      accuracyRate: 0,
      trend: 'neutral',
      delta: '0.0%',
      targetRate: 75.0,
      status: 'Em Evolução',
    },
  ];
}

// Mapeamento isolado de tarefas diárias (Cronograma) por conta de aluno
export const STUDENT_TASKS_MAP: Record<string, DailyTask[]> = {
  // Carlos Eduardo Fontes - RFB 2026
  'usr-1': [
    {
      id: 'task-c1',
      title: 'Meta de Resolução: Direito Tributário (Imunidades & FGV)',
      subject: 'Direito Tributário',
      type: 'questoes',
      durationMinutes: 45,
      completed: true,
      targetCount: 20,
      currentCount: 20,
    },
    {
      id: 'task-c2',
      title: 'Lei Seca: CF/88 Artigos 145 ao 162 (Do Sistema Tributário)',
      subject: 'Legislação Constitucional',
      type: 'lei_seca',
      durationMinutes: 30,
      completed: true,
      targetCount: 18,
      currentCount: 18,
    },
    {
      id: 'task-c3',
      title: 'Ciclo de Revisão Ativa SRS: Flashcards de NBC TA 200',
      subject: 'Revisão Espaçada',
      type: 'revisao',
      durationMinutes: 25,
      completed: false,
      targetCount: 35,
      currentCount: 14,
    },
    {
      id: 'task-c4',
      title: 'Bloco de Simulação Cronometrada: Contabilidade Geral',
      subject: 'Contabilidade Geral',
      type: 'simulado',
      durationMinutes: 60,
      completed: false,
      targetCount: 15,
      currentCount: 0,
    },
    {
      id: 'task-c5',
      title: 'Teoria Focada: Jurisprudência em Teses STJ (Edição 194)',
      subject: 'Direito Administrativo',
      type: 'teoria',
      durationMinutes: 40,
      completed: false,
      targetCount: 1,
      currentCount: 0,
    },
  ],

  // Mariana Silveira Ramos - OAB 43º
  'usr-2': [
    {
      id: 'task-m1',
      title: '8 Questões Garantidas: Estatuto e Código de Ética da OAB',
      subject: 'Ética Profissional',
      type: 'questoes',
      durationMinutes: 40,
      completed: true,
      targetCount: 16,
      currentCount: 16,
    },
    {
      id: 'task-m2',
      title: 'Lei Seca: Estatuto da Advocacia (Lei 8.906/94 Arts. 1º a 25)',
      subject: 'Legislação OAB',
      type: 'lei_seca',
      durationMinutes: 35,
      completed: true,
      targetCount: 25,
      currentCount: 25,
    },
    {
      id: 'task-m3',
      title: 'Revisão Ativa SRS: Prazos e Recursos no Novo CPC',
      subject: 'Direito Processual Civil',
      type: 'revisao',
      durationMinutes: 30,
      completed: false,
      targetCount: 20,
      currentCount: 8,
    },
    {
      id: 'task-m4',
      title: 'Simulado Rápido FGV: Direito Penal & Crimes Hediondos',
      subject: 'Direito Penal',
      type: 'simulado',
      durationMinutes: 45,
      completed: false,
      targetCount: 12,
      currentCount: 0,
    },
  ],

  // Roberto Viana Mendonça - TCU 2026
  'usr-3': [
    {
      id: 'task-r1',
      title: 'Controle Externo: Competências Constitucionais do TCU (CF Art. 71)',
      subject: 'Controle Externo',
      type: 'questoes',
      durationMinutes: 50,
      completed: false,
      targetCount: 20,
      currentCount: 6,
    },
    {
      id: 'task-r2',
      title: 'Auditoria Governamental: Matriz de Achados e Evidências',
      subject: 'Auditoria Governamental',
      type: 'teoria',
      durationMinutes: 45,
      completed: false,
      targetCount: 1,
      currentCount: 0,
    },
    {
      id: 'task-r3',
      title: 'Lei Seca: Lei 8.443/92 (Lei Orgânica do TCU Arts. 1º a 30)',
      subject: 'Legislação do TCU',
      type: 'lei_seca',
      durationMinutes: 35,
      completed: false,
      targetCount: 30,
      currentCount: 10,
    },
  ],
};

// Mapeamento isolado de Ciclo de Estudos semanal por conta de aluno
export const STUDENT_CYCLES_MAP: Record<string, CycleDay[]> = {
  // Carlos - Ciclo Fiscal
  'usr-1': [
    { day: 'Seg', block: 'Tributário + CPC 47', status: 'concluido', hours: 4.2 },
    { day: 'Ter', block: 'Constitucional + Súmulas', status: 'concluido', hours: 4.5 },
    { day: 'Qua', block: 'Administrativo + Revisão SRS', status: 'hoje', hours: 4.0 },
    { day: 'Qui', block: 'Auditoria Governamental', status: 'pendente', hours: 4.0 },
    { day: 'Sex', block: 'Legislação Aduaneira', status: 'pendente', hours: 4.0 },
    { day: 'Sáb', block: 'Simulado Geral 70Q', status: 'pendente', hours: 5.5 },
    { day: 'Dom', block: 'Discursivas & Diagnóstico', status: 'pendente', hours: 3.0 },
  ],
  // Mariana - Ciclo Jurídico OAB
  'usr-2': [
    { day: 'Seg', block: 'Ética Profissional (8Q) + Estatuto', status: 'concluido', hours: 4.0 },
    { day: 'Ter', block: 'Direito Constitucional + Remédios', status: 'concluido', hours: 4.2 },
    { day: 'Qua', block: 'Direito Civil & Processo Civil', status: 'hoje', hours: 4.5 },
    { day: 'Qui', block: 'Direito Penal & Processo Penal', status: 'pendente', hours: 4.0 },
    { day: 'Sex', block: 'Trabalho & Administrativo', status: 'pendente', hours: 3.5 },
    { day: 'Sáb', block: 'Simulado Oficial FGV 80Q', status: 'pendente', hours: 5.0 },
    { day: 'Dom', block: 'Revisão de Erros & Flashcards', status: 'pendente', hours: 2.5 },
  ],
  // Roberto - Ciclo Controle & Auditoria TCU
  'usr-3': [
    { day: 'Seg', block: 'Controle Externo & Jurisprudência TCU', status: 'hoje', hours: 4.0 },
    { day: 'Ter', block: 'Auditoria Governamental & ISSAI', status: 'pendente', hours: 4.5 },
    { day: 'Qua', block: 'AFO & Lei de Resp. Fiscal', status: 'pendente', hours: 4.0 },
    { day: 'Qui', block: 'Direito Administrativo & Licitações', status: 'pendente', hours: 4.0 },
    { day: 'Sex', block: 'Contabilidade Pública & Análise', status: 'pendente', hours: 3.5 },
    { day: 'Sáb', block: 'Simulado Cebraspe C/E 100Q', status: 'pendente', hours: 5.0 },
    { day: 'Dom', block: 'Redação de Parecer Técnico', status: 'pendente', hours: 3.0 },
  ],
};

// Mapeamento isolado de editais colados e verticalizados por aluno (alunoId -> targetId -> syllabus)
export const STUDENT_SYLLABI_MAP: Record<string, Record<string, CustomSyllabus>> = {
  'usr-1': {
    'rfb-auditor': {
      id: 'syl-carlos-rfb',
      targetId: 'rfb-auditor',
      title: 'Edital Verticalizado Personalizado • RFB Auditor (Carlos)',
      pastedContent: 'Direito Tributário: Imunidades, CTN, Vigência e Aplicação\nDireito Constitucional: Organização do Estado, Remédios Constitucionais\nContabilidade Geral: CPC 00, CPC 47, Balanço Patrimonial',
      createdAt: 'Hoje às 09:15',
      subjects: [
        {
          id: 'sub-trib',
          subject: 'Direito Tributário',
          totalTopics: 6,
          completedTopics: 4,
          topics: [
            { id: 'top-1', name: 'Princípios e Limitações Constitucionais ao Poder de Tributar', completed: true, weight: 'Alto' },
            { id: 'top-2', name: 'Imunidades Tributárias (CF/88 Art. 150, VI)', completed: true, weight: 'Alto' },
            { id: 'top-3', name: 'Obrigação Tributária e Fato Gerador (CTN)', completed: true, weight: 'Alto' },
            { id: 'top-4', name: 'Crédito Tributário: Suspensão, Extinção e Exclusão', completed: true, weight: 'Alto' },
            { id: 'top-5', name: 'Administração Tributária e Fiscalização', completed: false, weight: 'Médio' },
            { id: 'top-6', name: 'Impostos da União: IRPJ, CSLL, IPI, II, IE, IOF', completed: false, weight: 'Alto' },
          ]
        },
        {
          id: 'sub-const',
          subject: 'Direito Constitucional',
          totalTopics: 4,
          completedTopics: 3,
          topics: [
            { id: 'top-c1', name: 'Direitos e Deveres Individuais e Coletivos (Art. 5º)', completed: true, weight: 'Alto' },
            { id: 'top-c2', name: 'Remédios Constitucionais (MS, HD, HC, MI, AP)', completed: true, weight: 'Alto' },
            { id: 'top-c3', name: 'Organização Político-Administrativa da República', completed: true, weight: 'Médio' },
            { id: 'top-c4', name: 'Funções Essenciais à Justiça e Fiscalização Contábil', completed: false, weight: 'Médio' },
          ]
        }
      ]
    }
  },
  'usr-2': {
    'oab-43': {
      id: 'syl-mariana-oab',
      targetId: 'oab-43',
      title: 'Edital Verticalizado Estratégico • OAB 43º (Mariana)',
      pastedContent: 'Ética Profissional: Estatuto da OAB, Regulamento Geral, Código de Ética\nDireito Constitucional: Direitos Fundamentais, Controle de Constitucionalidade\nDireito Civil: Contratos, Responsabilidade Civil, Família',
      createdAt: 'Ontem às 14:30',
      subjects: [
        {
          id: 'sub-oab-etica',
          subject: 'Ética e Estatuto da OAB (8 Questões Garantidas)',
          totalTopics: 4,
          completedTopics: 3,
          topics: [
            { id: 'top-e1', name: 'Atividades e Prerrogativas do Advogado (Lei 8.906/94)', completed: true, weight: 'Alto' },
            { id: 'top-e2', name: 'Incompatibilidades e Impedimentos', completed: true, weight: 'Alto' },
            { id: 'top-e3', name: 'Infrações e Sanções Disciplinares', completed: true, weight: 'Alto' },
            { id: 'top-e4', name: 'Honorários Advocatícios e Sociedade de Advogados', completed: false, weight: 'Alto' },
          ]
        },
        {
          id: 'sub-oab-civil',
          subject: 'Direito Civil & Processo Civil',
          totalTopics: 3,
          completedTopics: 1,
          topics: [
            { id: 'top-civ1', name: 'Parte Geral: Pessoas Naturais, Bens e Negócio Jurídico', completed: true, weight: 'Médio' },
            { id: 'top-civ2', name: 'Direito das Obrigações e Contratos em Espécie', completed: false, weight: 'Alto' },
            { id: 'top-civ3', name: 'Tutela Provisória e Recursos no CPC/2015', completed: false, weight: 'Alto' },
          ]
        }
      ]
    }
  }
};

// Histórico de auditoria isolado por perfil de estudante
export const STUDENT_AUDIT_LOGS_MAP: Record<string, AuditEntry[]> = {
  'usr-1': [
    {
      id: 'aud-c1',
      studentId: 'usr-1',
      studentName: 'Carlos Eduardo Fontes',
      action: 'resolucao_questao',
      description: 'Acerto em questão FGV (Direito Constitucional - Habeas Data)',
      subject: 'Direito Constitucional',
      result: 'correto',
      timestamp: 'Hoje às 17:42',
      details: 'Gabarito fundamentado revisado com citação da Súmula 2 do STJ.',
    },
    {
      id: 'aud-c2',
      studentId: 'usr-1',
      studentName: 'Carlos Eduardo Fontes',
      action: 'revisao_lei_seca',
      description: 'Conclusão de leitura do Art. 150 da CF/88 (Imunidades Tributárias)',
      subject: 'Direito Tributário',
      result: 'concluido',
      timestamp: 'Hoje às 16:30',
      details: '30 minutos dedicados. Marcações de jurisprudência atualizadas.',
    },
    {
      id: 'aud-c3',
      studentId: 'usr-1',
      studentName: 'Carlos Eduardo Fontes',
      action: 'edital_colado',
      description: 'Atualização do Edital Verticalizado Personalizado para RFB 2026',
      subject: 'Planejamento',
      result: 'concluido',
      timestamp: 'Hoje às 09:15',
      details: '10 tópicos mapeados com pesos estratégicos.',
    },
  ],
  'usr-2': [
    {
      id: 'aud-m1',
      studentId: 'usr-2',
      studentName: 'Mariana Silveira Ramos',
      action: 'resolucao_questao',
      description: 'Acerto em questão FGV (Ética da Advocacia - Inviolabilidade do Escritório)',
      subject: 'Ética Profissional',
      result: 'correto',
      timestamp: 'Hoje às 15:10',
      details: 'Art. 7º, II do Estatuto da OAB memorizado.',
    },
    {
      id: 'aud-m2',
      studentId: 'usr-2',
      studentName: 'Mariana Silveira Ramos',
      action: 'edital_colado',
      description: 'Importação do Edital OAB 43º Unificado',
      subject: 'Planejamento',
      result: 'concluido',
      timestamp: 'Ontem às 14:30',
      details: 'Módulo prioritário de Ética com 8 questões garantidas.',
    },
  ],
  'usr-3': [
    {
      id: 'aud-r1',
      studentId: 'usr-3',
      studentName: 'Roberto Viana Mendonça',
      action: 'resolucao_questao',
      description: 'Erro em questão Cebraspe (Controle Externo - Tomada de Contas Especial)',
      subject: 'Controle Externo',
      result: 'incorreto',
      timestamp: 'Ontem às 22:15',
      details: 'Prazo prescricional da pretensão ressarcitória do TCU (Tema 899 STF).',
    },
  ]
};

export function getInitialStudentTasks(studentId: string, targetExam: string): DailyTask[] {
  if (STUDENT_TASKS_MAP[studentId]) {
    return STUDENT_TASKS_MAP[studentId];
  }
  const isJuridico = targetExam.toLowerCase().includes('oab') || targetExam.toLowerCase().includes('advogado');
  if (isJuridico) {
    return [
      {
        id: `task-gen-1-${Date.now()}`,
        title: 'Meta de Ética: 10 Questões do Estatuto da OAB',
        subject: 'Ética Profissional',
        type: 'questoes',
        durationMinutes: 40,
        completed: false,
        targetCount: 10,
        currentCount: 0,
      },
      {
        id: `task-gen-2-${Date.now()}`,
        title: 'Lei Seca: CF/88 Artigo 5º (Direitos e Garantias)',
        subject: 'Direito Constitucional',
        type: 'lei_seca',
        durationMinutes: 30,
        completed: false,
        targetCount: 15,
        currentCount: 0,
      },
      {
        id: `task-gen-3-${Date.now()}`,
        title: 'Revisão Ativa SRS: Conceitos Fundamentais',
        subject: 'Revisão Espaçada',
        type: 'revisao',
        durationMinutes: 25,
        completed: false,
        targetCount: 20,
        currentCount: 0,
      },
    ];
  }

  return [
    {
      id: `task-gen-1-${Date.now()}`,
      title: 'Meta de Resolução: 20 Questões de Concurso',
      subject: 'Direito Constitucional',
      type: 'questoes',
      durationMinutes: 45,
      completed: false,
      targetCount: 20,
      currentCount: 0,
    },
    {
      id: `task-gen-2-${Date.now()}`,
      title: 'Lei Seca: Leitura de Legislação Pertinente ao Cargo',
      subject: 'Legislação Específica',
      type: 'lei_seca',
      durationMinutes: 30,
      completed: false,
      targetCount: 15,
      currentCount: 0,
    },
    {
      id: `task-gen-3-${Date.now()}`,
      title: 'Revisão Espaçada: Flashcards e Súmulas Vinculantes',
      subject: 'Revisão Espaçada',
      type: 'revisao',
      durationMinutes: 25,
      completed: false,
      targetCount: 25,
      currentCount: 0,
    },
  ];
}

export function getInitialStudentCycle(studentId: string, targetExam: string): CycleDay[] {
  if (STUDENT_CYCLES_MAP[studentId]) {
    return STUDENT_CYCLES_MAP[studentId];
  }
  return [
    { day: 'Seg', block: 'Bloco 1 • Teoria & Questões Base', status: 'hoje', hours: 4.0 },
    { day: 'Ter', block: 'Bloco 2 • Disciplinas Específicas', status: 'pendente', hours: 4.0 },
    { day: 'Qua', block: 'Bloco 3 • Lei Seca & Revisão SRS', status: 'pendente', hours: 3.5 },
    { day: 'Qui', block: 'Bloco 4 • Jurisprudência & Súmulas', status: 'pendente', hours: 4.0 },
    { day: 'Sex', block: 'Bloco 5 • Treino de Questões Inéditas', status: 'pendente', hours: 3.5 },
    { day: 'Sáb', block: 'Simulado Diagnóstico Cronometrado', status: 'pendente', hours: 5.0 },
    { day: 'Dom', block: 'Auditoria de Erros & Descanso Ativo', status: 'pendente', hours: 2.5 },
  ];
}

export function getInitialStudentAuditLogs(studentId: string): AuditEntry[] {
  if (STUDENT_AUDIT_LOGS_MAP[studentId]) {
    return STUDENT_AUDIT_LOGS_MAP[studentId];
  }
  return [
    {
      id: `aud-init-${Date.now()}`,
      studentId,
      action: 'ciclo_ajustado',
      description: 'Conta de estudante inicializada com métricas, cronograma e auditoria isolados.',
      subject: 'Sistema',
      result: 'concluido',
      timestamp: 'Recente',
      details: 'Vault privado ativado. Proteção e isolamento total entre perfis.',
    }
  ];
}

export function getInitialStudentSyllabi(studentId: string): Record<string, CustomSyllabus> {
  return STUDENT_SYLLABI_MAP[studentId] || {};
}

export const MOCK_HOURLY_HEATMAP = [
  { day: 'Seg', hours: 4.2, questions: 65, accuracy: 84 },
  { day: 'Ter', hours: 5.1, questions: 82, accuracy: 88 },
  { day: 'Qua', hours: 3.8, questions: 50, accuracy: 78 },
  { day: 'Qui', hours: 5.5, questions: 95, accuracy: 86 },
  { day: 'Sex', hours: 4.0, questions: 60, accuracy: 82 },
  { day: 'Sáb', hours: 6.5, questions: 120, accuracy: 85 },
  { day: 'Dom', hours: 3.0, questions: 45, accuracy: 90 },
];

export const PDF_SUBJECT_CLASSES = [
  'Direito Constitucional',
  'Direito Tributário',
  'Direito Administrativo',
  'Contabilidade Geral & Avançada',
  'Auditoria e Governança',
  'Legislação Tributária Federal',
  'Língua Portuguesa & Redação',
  'Raciocínio Lógico & Estatística',
];

export const MOCK_PDFS: StudyPDF[] = [
  {
    id: 'pdf-1',
    title: 'Aula 00 - Princípios Tributários e Anterioridade Nonagesimal',
    subject: 'Direito Tributário',
    topic: 'Sistema Tributário Nacional (CF arts. 145 a 162)',
    courseId: 'rfb-auditor',
    courseName: 'Receita Federal do Brasil (Curso Oficial)',
    studentId: 'usr-1', // Carlos Eduardo Fontes
    fileName: 'DT_Aula00_Principios_Anterioridade.pdf',
    fileSize: '4.8 MB',
    totalPages: 94,
    currentPage: 62,
    uploadDate: '08/10/2026',
    notes: 'Atenção aos julgados recentes do STF sobre a revogação de benefícios fiscais e noventena.',
    favorite: true,
    tagColor: 'blue',
  },
  {
    id: 'pdf-2',
    title: 'Resumo Estratégico: Remédios Constitucionais e Súmulas',
    subject: 'Direito Constitucional',
    topic: 'Artigo 5º da CF/88 (Habeas Data, MS, MI, Ação Popular)',
    courseId: 'rfb-auditor',
    courseName: 'Receita Federal do Brasil (Curso Oficial)',
    studentId: 'usr-1', // Carlos Eduardo Fontes
    fileName: 'Const_Resumo_Remedios_STF_STJ.pdf',
    fileSize: '2.4 MB',
    totalPages: 56,
    currentPage: 56,
    uploadDate: '05/10/2026',
    notes: 'Leitura finalizada. Súmula 2 do STJ revisada para o simulado.',
    favorite: true,
    tagColor: 'purple',
  },
  {
    id: 'pdf-3',
    title: 'Manual de Contabilidade: Pronunciamento CPC 47 (Receita)',
    subject: 'Contabilidade Geral & Avançada',
    topic: 'Reconhecimento de Receita em 5 Etapas e Contratos',
    courseId: 'rfb-auditor',
    courseName: 'Receita Federal do Brasil (Curso Oficial)',
    studentId: 'usr-1', // Carlos Eduardo Fontes
    fileName: 'CPC_47_Receita_Contrato_Cliente_FGV.pdf',
    fileSize: '6.1 MB',
    totalPages: 112,
    currentPage: 34,
    uploadDate: '09/10/2026',
    notes: 'Ponto crítico! Focar no critério ao longo do tempo (over time) vs momento no tempo.',
    favorite: false,
    tagColor: 'amber',
  },
  {
    id: 'pdf-4',
    title: 'Atos Administrativos: Atributos, Presunções e Súmula 473',
    subject: 'Direito Administrativo',
    topic: 'Anulação, Revogação e Convalidação dos Atos',
    courseId: 'oab-43',
    courseName: 'Exame de Ordem Unificado (1ª Fase)',
    studentId: 'usr-2', // Mariana Silveira Ramos
    fileName: 'Admin_Aula03_Atos_Extincao_Regime.pdf',
    fileSize: '3.7 MB',
    totalPages: 78,
    currentPage: 18,
    uploadDate: '02/10/2026',
    notes: 'Estudar diferenças de competência judicial para anular vs revogar.',
    favorite: false,
    tagColor: 'emerald',
  },
  {
    id: 'pdf-5',
    title: 'Matriz de Risco em Auditoria: NBC TA 200 e RDR',
    subject: 'Auditoria e Governança',
    topic: 'Risco Inerente, Risco de Controle e Risco de Detecção',
    courseId: 'tcu-auditor',
    courseName: 'Tribunal de Contas da União (Controle Externo)',
    studentId: 'usr-3', // Roberto Viana Mendonça
    fileName: 'Auditoria_NBC_TA_200_MatrizRisco.pdf',
    fileSize: '3.1 MB',
    totalPages: 48,
    currentPage: 48,
    uploadDate: '01/10/2026',
    notes: '100% lido e resumido nos flashcards SRS.',
    favorite: false,
    tagColor: 'blue',
  },
  {
    id: 'pdf-6',
    title: 'Ética Profissional e Estatuto da OAB (8 Questões Garantidas)',
    subject: 'Direito Constitucional',
    topic: 'Direitos e Prerrogativas da Advocacia na Lei 8.906/94',
    courseId: 'oab-43',
    courseName: 'Exame de Ordem Unificado (1ª Fase)',
    studentId: 'usr-2', // Mariana Silveira Ramos
    fileName: 'OAB_Etica_Profissional_FGV.pdf',
    fileSize: '3.4 MB',
    totalPages: 42,
    currentPage: 28,
    uploadDate: '11/10/2026',
    notes: 'Regras de honorários advocatícios e infrações disciplinares.',
    favorite: true,
    tagColor: 'emerald',
  },
  {
    id: 'pdf-7',
    title: 'Controle Externo e Jurisprudência do TCU na Lei 8.443/92',
    subject: 'Auditoria e Governança',
    topic: 'Tomada de Contas Especial e Sanções do Tribunal',
    courseId: 'tcu-auditor',
    courseName: 'Tribunal de Contas da União (Controle Externo)',
    studentId: 'usr-3', // Roberto Viana Mendonça
    fileName: 'TCU_Controle_Externo_Completo.pdf',
    fileSize: '5.2 MB',
    totalPages: 88,
    currentPage: 12,
    uploadDate: '07/10/2026',
    notes: 'Diferença entre julgamento pela irregularidade das contas e aplicação de multa com eficácia de título executivo.',
    favorite: false,
    tagColor: 'purple',
  },
];

export const MOCK_SIMULADOS = [
  {
    id: 'sim-1',
    title: 'Simulado Nacional Oficial RFB 2026 - Prova 1 (Objetiva)',
    code: 'SIM-RFB-01',
    agency: 'Receita Federal do Brasil',
    board: 'FGV Conhecimento',
    totalQuestions: 70,
    durationMinutes: 240, // 4 horas
    cutoffRate: 82.0,
    completed: true,
    score: 84.3,
    correctAnswers: 59,
    userTimeSpentSeconds: 12480, // ~3h 28m
    submittedAt: '06/10/2026',
    status: 'concluido' as const,
    difficulty: 'Padrão Oficial' as const,
    questions: MOCK_QUESTIONS,
    subjectsCovered: [
      'Direito Constitucional',
      'Direito Tributário',
      'Direito Administrativo',
      'Contabilidade Geral',
      'Auditoria'
    ],
  },
  {
    id: 'sim-2',
    title: 'Simulado Avançado - Reforma Tributária & Jurisprudência',
    code: 'SIM-PRED-02',
    agency: 'Receita Federal / TCU',
    board: 'Coordenação Pedagógica Aprovação Total',
    totalQuestions: 50,
    durationMinutes: 180,
    cutoffRate: 80.0,
    completed: false,
    status: 'disponivel' as const,
    difficulty: 'Difícil' as const,
    questions: MOCK_QUESTIONS,
    subjectsCovered: [
      'Direito Tributário',
      'Direito Constitucional',
      'Legislação Aduaneira',
      'Contabilidade Avançada'
    ],
  },
  {
    id: 'sim-3',
    title: 'Simulado 1ª Fase OAB 43º Exame Unificado (FGV)',
    code: 'SIM-OAB-43',
    agency: 'Conselho Federal OAB',
    board: 'FGV',
    totalQuestions: 80,
    durationMinutes: 300, // 5 horas
    cutoffRate: 50.0, // 40 acertos de 80
    completed: false,
    status: 'disponivel' as const,
    difficulty: 'Padrão Oficial' as const,
    questions: MOCK_QUESTIONS,
    subjectsCovered: [
      'Ética Profissional',
      'Direito Constitucional',
      'Direito Administrativo',
      'Direito Tributário',
      'Direito Civil & Penal'
    ],
  },
  {
    id: 'sim-4',
    title: 'Simulado TCU - Auditor Federal de Controle Externo',
    code: 'SIM-TCU-2026',
    agency: 'Tribunal de Contas da União',
    board: 'Cebraspe / FGV',
    totalQuestions: 60,
    durationMinutes: 210,
    cutoffRate: 85.0,
    completed: false,
    status: 'disponivel' as const,
    difficulty: 'Difícil' as const,
    questions: MOCK_QUESTIONS,
    subjectsCovered: [
      'Controle Externo',
      'Direito Administrativo',
      'Direito Constitucional',
      'Auditoria Governamental'
    ],
  },
];

export const MOCK_MIND_MAPS: MindMap[] = [
  {
    id: 'mm-1',
    title: 'Imunidades Tributárias Constitucionais',
    subject: 'Direito Tributário',
    topic: 'Limitações Constitucionais ao Poder de Tributar',
    flashcardId: 'fc-1',
    summary: 'Esquematização completa do Art. 150, VI da CF/88, abrangendo imunidade recíproca, templos, partidos, livros e jurisprudência vinculante do STF.',
    difficulty: 'Média',
    viewsCount: 1420,
    lastUpdated: 'Atualizado com Súmula Vinculante 57',
    tags: ['Art. 150 CF/88', 'Imunidade Recíproca', 'SV 52', 'SV 57', 'Livro Eletrônico'],
    rootNode: {
      id: 'node-root-1',
      label: 'Imunidades Tributárias (CF/88 Art. 150, VI)',
      badge: 'Garantia Pétrea',
      description: 'Vedação constitucional absoluta aos entes políticos de instituir IMPOSTOS sobre determinadas pessoas, bens ou atividades.',
      legalArticle: 'CF/88, Art. 150, VI, alíneas "a" a "e"',
      color: 'blue',
      mnemonic: 'R-T-P-L-M (Recíproca, Templos, Partidos/Entidades, Livros, Músicas)',
      children: [
        {
          id: 'node-reciproca',
          label: 'Imunidade Recíproca (Alínea "a")',
          badge: 'Pacto Federativo',
          description: 'União, Estados, DF e Municípios não tributam reciprocamente patrimônio, renda e serviços.',
          legalArticle: 'Art. 150, VI, "a" e § 2º',
          color: 'blue',
          children: [
            {
              id: 'node-reciproca-extensao',
              label: 'Autarquias & Fundações Públicas',
              description: 'Alcança apenas patrimônio e serviços vinculados às finalidades essenciais ou delas decorrentes.',
              legalArticle: 'Art. 150, § 2º CF/88',
              color: 'slate',
            },
            {
              id: 'node-reciproca-sv52',
              label: 'Súmula Vinculante 52 (STF)',
              description: 'Imóvel de ente público locado a particular mantém imunidade de IPTU se a renda for revertida aos fins institucionais.',
              legalArticle: 'STF - SV 52',
              color: 'indigo',
            },
            {
              id: 'node-reciproca-excecao',
              label: 'Exceção: Empresas Estatais Concorrenciais',
              description: 'Sociedades de Economia Mista e Empresas Públicas explorando atividade econômica com finalidade lucrativa NÃO têm imunidade.',
              legalArticle: 'Art. 150, § 3º CF/88',
              color: 'rose',
            }
          ]
        },
        {
          id: 'node-templos',
          label: 'Templos de Qualquer Culto (Alínea "b")',
          badge: 'Liberdade Religiosa',
          description: 'Abarca organizações religiosas de qualquer credo. Alcance amplo do conceito de culto e suas dependências.',
          legalArticle: 'Art. 150, VI, "b" e § 4º',
          color: 'purple',
          children: [
            {
              id: 'node-templos-bens',
              label: 'Imóveis, Residências Pastorais & Cemitérios',
              description: 'O STF pacificou que o cemitério mantido por entidade religiosa e residências dos ministros religiosos integram o culto imune.',
              legalArticle: 'STF - RE 325.822 e RE 578.562',
              color: 'slate',
            }
          ]
        },
        {
          id: 'node-partidos',
          label: 'Partidos, Sindicatos & Educação/Assistência (Alínea "c")',
          badge: 'Pluralismo & Social',
          description: 'Partidos políticos, suas fundações, entidades sindicais dos trabalhadores e instituições de educação e assistência social sem fins lucrativos.',
          legalArticle: 'Art. 150, VI, "c" e CTN Art. 14',
          color: 'emerald',
          children: [
            {
              id: 'node-ctn-14',
              label: 'Requisitos do Art. 14 do CTN',
              description: '1. Não distribuir qualquer parcela de seu patrimônio ou rendas; 2. Aplicar integralmente seus recursos no país; 3. Manter escrituração contábil em dia.',
              legalArticle: 'CTN, Art. 14, I, II e III',
              color: 'emerald',
            }
          ]
        },
        {
          id: 'node-livros',
          label: 'Livros, Jornais, Periódicos & Papel (Alínea "d")',
          badge: 'Difusão Cultural',
          description: 'Imunidade objetiva para circulação de ideias e liberdade de imprensa.',
          legalArticle: 'Art. 150, VI, "d"',
          color: 'amber',
          children: [
            {
              id: 'node-livro-eletronico',
              label: 'Súmula Vinculante 57 (Livros Digitais)',
              description: 'A imunidade tributária da alínea d alcança livros eletrônicos (e-books) e suportes com função exclusiva de leitura (e-readers).',
              legalArticle: 'STF - SV 57 (Tema 593)',
              color: 'amber',
            }
          ]
        },
        {
          id: 'node-musica',
          label: 'Música & Fonogramas Nacionais (Alínea "e")',
          badge: 'Cultura Nacional',
          description: 'Fonogramas e videofonogramas musicais produzidos no Brasil contendo obras musicais de autores brasileiros.',
          legalArticle: 'EC 75/2013 (PEC da Música)',
          color: 'rose',
        }
      ]
    }
  },
  {
    id: 'mm-2',
    title: 'Controle Concentrado de Constitucionalidade',
    subject: 'Direito Constitucional',
    topic: 'Processo Constitucional e Fiscalização no STF',
    flashcardId: 'fc-2',
    summary: 'Estrutura sistêmica das ações constitucionais originárias no STF (ADI, ADC, ADO, ADPF), quóruns, legitimados e modulação de efeitos.',
    difficulty: 'Difícil',
    viewsCount: 2190,
    lastUpdated: 'Com Legitimados e Lei 9.868/99',
    tags: ['Art. 102 CF', 'Art. 103 CF', 'ADI', 'ADC', 'ADPF', 'Erga Omnes'],
    rootNode: {
      id: 'node-root-2',
      label: 'Controle Concentrado no STF (CF/88)',
      badge: 'Fiscalização Abstrata',
      description: 'Competência originária do Supremo Tribunal Federal para julgar diretamente a compatibilidade de normas com a Constituição Federal.',
      legalArticle: 'CF/88, Arts. 102, I, "a" e 103',
      color: 'purple',
      mnemonic: '3 Mesas + 3 Pessoas + 3 Entidades (Mesa Senado, Câmara, Assembleia / Pres., PGR, Gov / OAB, Partido, Confederação)',
      children: [
        {
          id: 'node-acoes',
          label: 'Espécies de Ações do Controle',
          badge: 'Instrumentos',
          color: 'blue',
          children: [
            {
              id: 'node-adi',
              label: 'ADI (Ação Direta de Inconstitucionalidade)',
              description: 'Ato normativo federal ou estadual posterior à CF/88. Busca declaração de nulidade.',
              legalArticle: 'Lei 9.868/1999',
              color: 'blue',
            },
            {
              id: 'node-adc',
              label: 'ADC (Ação Declaratória de Constitucionalidade)',
              description: 'Apenas lei ou ato normativo FEDERAL. Exige demonstração de controvérsia judicial relevante.',
              legalArticle: 'Art. 102, I, "a" c/c Lei 9.868/99',
              color: 'emerald',
            },
            {
              id: 'node-adpf',
              label: 'ADPF (Descumprimento de Preceito Fundamental)',
              description: 'Ato municipal, normas pré-constitucionais ou lesão a preceito fundamental. Rege-se pelo Princípio da Subsidiariedade.',
              legalArticle: 'Lei 9.882/1999',
              color: 'purple',
            }
          ]
        },
        {
          id: 'node-legitimados',
          label: 'Legitimados Ativos (CF Art. 103)',
          badge: 'Rol Taxativo',
          color: 'emerald',
          children: [
            {
              id: 'node-legitimados-universais',
              label: 'Legitimados Universais (Dispensam Pertinência)',
              description: '1. Presidente da República; 2. Mesa do Senado; 3. Mesa da Câmara; 4. PGR; 5. Conselho Federal da OAB; 6. Partido político com representação no CN.',
              legalArticle: 'Art. 103, I, II, III, VI, VII, VIII',
              color: 'emerald',
            },
            {
              id: 'node-legitimados-especiais',
              label: 'Legitimados Especiais (Exigem Pertinência Temática)',
              description: '1. Governador de Estado ou do DF; 2. Mesa de Assembleia Legislativa ou da CLDF; 3. Confederação sindical ou entidade de classe de âmbito nacional.',
              legalArticle: 'Art. 103, IV, V, IX',
              color: 'amber',
            }
          ]
        },
        {
          id: 'node-efeitos',
          label: 'Efeitos da Decisão de Mérito',
          badge: 'Eficácia Geral',
          color: 'rose',
          children: [
            {
              id: 'node-erga-omnes',
              label: 'Eficácia Erga Omnes & Efeito Vinculante',
              description: 'Vincula todo o Poder Judiciário e a Administração Pública direta e indireta federal, estadual e municipal.',
              legalArticle: 'Art. 102, § 2º CF/88',
              color: 'rose',
            },
            {
              id: 'node-modulacao',
              label: 'Modulação Temporal dos Efeitos (Quórum de 2/3)',
              description: 'Regra geral: Ex Tunc (retroativo). Exceção: por maioria de 2/3 de seus membros, o STF pode fixar efeitos Ex Nunc ou pro futuro.',
              legalArticle: 'Art. 27 da Lei 9.868/99',
              color: 'indigo',
            }
          ]
        }
      ]
    }
  },
  {
    id: 'mm-3',
    title: 'Responsabilidade Civil do Estado',
    subject: 'Direito Administrativo',
    topic: 'Regime Jurídico da Reparação e Nexo de Causalidade',
    flashcardId: 'fc-3',
    summary: 'Teoria do Risco Administrativo, responsabilidade objetiva do Art. 37 §6º, omissões genéricas e específicas, excludentes e direito de regresso.',
    difficulty: 'Média',
    viewsCount: 1850,
    lastUpdated: 'Atualizado com Tema 592 STF',
    tags: ['Art. 37 §6º', 'Teoria do Risco', 'Omissão Específica', 'Direito de Regresso'],
    rootNode: {
      id: 'node-root-3',
      label: 'Responsabilidade Civil do Estado (Art. 37, § 6º CF)',
      badge: 'Risco Administrativo',
      description: 'Obrigação imposta à Administração Pública de reparar danos materiais e morais causados a terceiros decorrentes de sua atuação funcional.',
      legalArticle: 'CF/88, Art. 37, § 6º',
      color: 'emerald',
      children: [
        {
          id: 'node-comissiva',
          label: 'Condutas Comissivas (Ação Estatal)',
          badge: 'Regra Objetiva',
          description: 'Adoção da Teoria do Risco Administrativo. Não há necessidade de provar dolo ou culpa do servidor perante a vítima.',
          legalArticle: 'CF Art. 37, § 6º, 1ª parte',
          color: 'emerald',
          children: [
            {
              id: 'node-triade',
              label: 'Tríade de Elementos Necessários',
              description: '1. Conduta oficial do agente; 2. Dano patrimonial ou moral; 3. Nexo causal direto e imediato entre ambos.',
              color: 'slate',
            }
          ]
        },
        {
          id: 'node-omissiva',
          label: 'Condutas Omissivas (Omissão Estatal)',
          badge: 'Subjetiva vs Objetiva',
          color: 'amber',
          children: [
            {
              id: 'node-omissao-generica',
              label: 'Omissão Genérica (Subjetiva)',
              description: 'Teoria da Culpa Administrativa ("Faute du service"): o serviço público não funcionou, funcionou mal ou funcionou tardiamente.',
              legalArticle: 'Doutrina e Jurisprudência STJ',
              color: 'amber',
            },
            {
              id: 'node-omissao-especifica',
              label: 'Omissão Específica (Objetiva)',
              description: 'Quando o Estado tem o DEVER JURÍDICO ESPECÍFICO de proteção e custódia (ex: integridade física de presidiários ou alunos em escola pública).',
              legalArticle: 'STF - RE 841.526 (Tema 592)',
              color: 'rose',
            }
          ]
        },
        {
          id: 'node-excludentes',
          label: 'Excludentes & Atenuantes do Nexo Causal',
          badge: 'Rompimento do Nexo',
          color: 'rose',
          children: [
            {
              id: 'node-culpa-exclusiva',
              label: 'Culpa Exclusiva da Vítima ou Terceiro',
              description: 'Elimina totalmente a responsabilidade do Estado por rompimento do nexo causal. Se concorrente, atenua a indenização.',
              color: 'rose',
            },
            {
              id: 'node-caso-fortuito',
              label: 'Caso Fortuito & Força Maior',
              description: 'Eventos imprevisíveis e irresistíveis da natureza sem concorrência da inércia estatal.',
              color: 'slate',
            }
          ]
        },
        {
          id: 'node-regresso',
          label: 'Ação Regressiva contra o Agente Público',
          badge: 'Subjetiva (Dolo/Culpa)',
          description: 'Após indenizar a vítima, o Estado pode cobrar o ressarcimento do agente responsável apenas se comprovado DOLO ou CULPA deste.',
          legalArticle: 'Art. 37, § 6º, in fine c/c Tema 940 STF',
          color: 'indigo',
        }
      ]
    }
  },
  {
    id: 'mm-4',
    title: 'Auditoria: Matriz de Riscos & Evidenciação',
    subject: 'Auditoria Privada e Governamental',
    topic: 'Normas Internacionais e Avaliação de Controle Interno',
    flashcardId: 'fc-4',
    summary: 'Inter-relação matemática entre Risco de Distorção Relevante (Risco Inerente x Risco de Controle) e o Risco de Detecção na NBC TA 200.',
    difficulty: 'Difícil',
    viewsCount: 940,
    lastUpdated: 'Alinhado ao CFC / NBC TA 200',
    tags: ['NBC TA 200', 'Risco Inerente', 'Risco de Controle', 'Risco de Detecção', 'ISSAI'],
    rootNode: {
      id: 'node-root-4',
      label: 'Matriz de Risco de Auditoria (RA = RDR × RD)',
      badge: 'NBC TA 200',
      description: 'O risco de que o auditor expresse uma opinião de auditoria inadequada quando as demonstrações contiverem distorção relevante.',
      legalArticle: 'NBC TA 200 (R1) do CFC / NBC TA 315',
      color: 'indigo',
      children: [
        {
          id: 'node-rdr',
          label: 'Risco de Distorção Relevante (RDR)',
          badge: 'Entidade / Independe do Auditor',
          description: 'Existe independentemente da auditoria e refere-se ao ambiente interno da entidade auditada.',
          color: 'rose',
          children: [
            {
              id: 'node-risco-inerente',
              label: 'Risco Inerente (RI)',
              description: 'Suscetibilidade de uma afirmação contábil a uma distorção relevante antes de se considerar qualquer controle interno.',
              color: 'slate',
            },
            {
              id: 'node-risco-controle',
              label: 'Risco de Controle (RC)',
              description: 'Risco de que uma distorção relevante não seja prevenida, detectada ou corrigida tempestivamente pelo controle interno da entidade.',
              color: 'rose',
            }
          ]
        },
        {
          id: 'node-rd',
          label: 'Risco de Detecção (RD)',
          badge: 'Controlado pelo Auditor',
          description: 'Risco de que os procedimentos executados pelo auditor não detectem uma distorção existente que possa ser relevante.',
          color: 'emerald',
          children: [
            {
              id: 'node-relacao-inversa',
              label: 'Relação Inversa de Risco',
              description: 'Quanto MAIOR o Risco de Distorção Relevante (RDR), MENOR deve ser o Risco de Detecção (RD) aceito pelo auditor, exigindo maior rigor nos testes.',
              color: 'emerald',
            }
          ]
        },
        {
          id: 'node-procedimentos',
          label: 'Procedimentos de Evidenciação',
          badge: 'Testes do Auditor',
          color: 'blue',
          children: [
            {
              id: 'node-testes-controle',
              label: 'Testes de Controle',
              description: 'Avaliam a eficácia operacional dos controles internos na prevenção e correção de distorções.',
              color: 'blue',
            },
            {
              id: 'node-procedimentos-substantivos',
              label: 'Procedimentos Substantivos',
              description: 'Executados para detectar distorções relevantes no nível de afirmações (Testes de Detalhes e Procedimentos Analíticos Substantivos).',
              color: 'indigo',
            }
          ]
        }
      ]
    }
  },
  {
    id: 'mm-5',
    title: 'Princípio da Anterioridade Tributária',
    subject: 'Direito Tributário',
    topic: 'Garantias do Contribuinte e Exceções Constitucionais',
    summary: 'Comparativo visual entre a Anterioridade Anual de Exercício e a Anterioridade Nonagesimal com todas as exceções clássicas cobradas pelas bancas.',
    difficulty: 'Média',
    viewsCount: 1680,
    lastUpdated: 'Com regras de IPVA, IPTU e CIDE',
    tags: ['Anterioridade Anual', 'Nonagesimal', 'Exceções', 'II/IE/IPI/IOF'],
    rootNode: {
      id: 'node-root-5',
      label: 'Princípio da Anterioridade (CF/88 Art. 150, III)',
      badge: 'Segurança Jurídica',
      description: 'Garante a não surpresa do contribuinte, impedindo a exigência de tributo no mesmo exercício financeiro ou sem antecedência mínima de 90 dias.',
      legalArticle: 'Art. 150, III, "b" e "c"',
      color: 'amber',
      mnemonic: 'Anual (1º de janeiro do ano seguinte) + Nonagesimal (esperar 90 dias completos)',
      children: [
        {
          id: 'node-anual-regra',
          label: 'Anterioridade Anual (Exercício Seguinte)',
          badge: 'Art. 150, III, "b"',
          description: 'Vedado cobrar tributos no mesmo exercício financeiro em que haja sido publicada a lei que os instituiu ou aumentou.',
          color: 'blue',
          children: [
            {
              id: 'node-anual-excecoes',
              label: 'Exceções (Cobrança Imediata no mesmo ano)',
              description: 'Tributos extrafiscais e de urgência: II, IE, IPI, IOF, Empréstimo Compulsório (calamidade/guerra), Imposto Extraordinário de Guerra (IEG), CIDE-Combustíveis e ICMS-Combustíveis.',
              legalArticle: 'Art. 150, § 1º CF/88',
              color: 'rose',
            }
          ]
        },
        {
          id: 'node-nona-regra',
          label: 'Anterioridade Nonagesimal (Noventena)',
          badge: 'Art. 150, III, "c"',
          description: 'Vedado cobrar tributos antes de decorridos 90 dias da data em que haja sido publicada a lei instituidora ou majoradora.',
          color: 'emerald',
          children: [
            {
              id: 'node-nona-excecoes',
              label: 'Exceções à Noventena (Não esperam 90 dias)',
              description: 'II, IE, IR, IOF, Empréstimo Compulsório (calamidade/guerra), IEG, e fixação da BASE DE CÁLCULO do IPTU e IPVA.',
              legalArticle: 'Art. 150, § 1º in fine',
              color: 'amber',
            }
          ]
        }
      ]
    }
  }
];

export const PRESET_STUDENT_AVATARS = [
  { id: 'av-1', label: 'Carlos (Auditor)', url: 'https://picsum.photos/seed/student-carlos/240/240' },
  { id: 'av-2', label: 'Mariana (OAB)', url: 'https://picsum.photos/seed/student-mariana/240/240' },
  { id: 'av-3', label: 'Roberto (Controle)', url: 'https://picsum.photos/seed/student-roberto/240/240' },
  { id: 'av-4', label: 'Juliana (Docente)', url: 'https://picsum.photos/seed/student-juliana/240/240' },
  { id: 'av-5', label: 'Felipe (Magistratura)', url: 'https://picsum.photos/seed/student-felipe/240/240' },
  { id: 'av-6', label: 'Gabriela (Defensoria)', url: 'https://picsum.photos/seed/student-gabriela/240/240' },
  { id: 'av-7', label: 'Lucas (Delegado PF)', url: 'https://picsum.photos/seed/student-lucas/240/240' },
  { id: 'av-8', label: 'Beatriz (Diplomacia)', url: 'https://picsum.photos/seed/student-beatriz/240/240' },
  { id: 'av-9', label: 'Rodrigo (Analista TRT)', url: 'https://picsum.photos/seed/student-rodrigo/240/240' },
  { id: 'av-10', label: 'Camila (Promotoria MP)', url: 'https://picsum.photos/seed/student-camila/240/240' },
  { id: 'av-11', label: 'André (Perito Criminal)', url: 'https://picsum.photos/seed/student-andre/240/240' },
  { id: 'av-12', label: 'Larissa (Técnico Judiciário)', url: 'https://picsum.photos/seed/student-larissa/240/240' },
];

export const MOCK_MANAGED_USERS: ManagedUser[] = [
  {
    id: 'usr-admin-01',
    name: 'Super Administrador Geral',
    email: 'admin@aprovacaototal.com',
    password: 'admin03061983', // Senha atual de administrador solicitada pelo usuário
    role: 'admin',
    targetExam: 'Administração & Controle Master',
    questionsAnswered: 0,
    accuracyRate: 100,
    status: 'ativo',
    avatarUrl: 'https://picsum.photos/seed/admin-master/240/240',
    phone: '(11) 98000-0306',
    registrationDate: '01/01/2026',
    lastActive: 'Agora'
  },
  {
    id: 'usr-admin-02',
    name: 'Administrador Geral (Lê Gonçalves)',
    email: 'legongamer0306@gmail.com',
    password: 'admin03061983', // Senha atual de administrador solicitada pelo usuário
    role: 'admin',
    targetExam: 'Gestão Master Aprovação Total',
    questionsAnswered: 0,
    accuracyRate: 100,
    status: 'ativo',
    avatarUrl: 'https://picsum.photos/seed/admin-legon/240/240',
    phone: '(11) 98000-0306',
    registrationDate: '01/01/2026',
    lastActive: 'Agora'
  },
  {
    id: 'usr-1',
    name: 'Carlos Eduardo Fontes',
    email: 'carlos.fontes@concursos.com',
    password: 'rfb2026', // Mínimo 6 dígitos
    role: 'aluno_premium',
    targetExam: 'RFB 2026 (Auditor-Fiscal)',
    questionsAnswered: 1420,
    accuracyRate: 84.5,
    status: 'ativo',
    avatarUrl: 'https://picsum.photos/seed/student-carlos/240/240',
    documentPhotoUrl: 'https://picsum.photos/seed/doc-carlos/400/260',
    phone: '(11) 98452-1102',
    registrationDate: '12/01/2026',
    lastActive: 'Hoje às 17:42'
  },
  {
    id: 'usr-2',
    name: 'Mariana Silveira Ramos',
    email: 'mariana.silveira@direito.br',
    password: 'oab2026', // Mínimo 6 dígitos
    role: 'aluno',
    targetExam: 'OAB 43º Exame Unificado',
    questionsAnswered: 890,
    accuracyRate: 72.3,
    status: 'ativo',
    avatarUrl: 'https://picsum.photos/seed/student-mariana/240/240',
    documentPhotoUrl: 'https://picsum.photos/seed/doc-mariana/400/260',
    phone: '(21) 99120-4493',
    registrationDate: '03/02/2026',
    lastActive: 'Hoje às 15:10'
  },
  {
    id: 'usr-3',
    name: 'Roberto Viana Mendonça',
    email: 'roberto.viana@tempmail.com',
    password: 'tcu2026', // Mínimo 6 dígitos
    role: 'aluno',
    targetExam: 'TCU 2026 (Auditor Federal)',
    questionsAnswered: 310,
    accuracyRate: 51.2,
    status: 'restrito',
    restrictionReason: 'Compartilhamento indevido de credenciais e excesso de IPs simultâneos.',
    avatarUrl: 'https://picsum.photos/seed/student-roberto/240/240',
    phone: '(61) 97788-3341',
    registrationDate: '20/03/2026',
    lastActive: 'Ontem às 22:15'
  },
  {
    id: 'usr-4',
    name: 'Juliana Beatriz Costa',
    email: 'juliana.costa@tce.sp.gov.br',
    password: 'prof1234', // Mínimo 6 dígitos
    role: 'professor',
    targetExam: 'Docente & Elaboradora de Questões',
    questionsAnswered: 2450,
    accuracyRate: 94.8,
    status: 'ativo',
    avatarUrl: 'https://picsum.photos/seed/student-juliana/240/240',
    phone: '(19) 98234-9988',
    registrationDate: '15/11/2025',
    lastActive: 'Hoje às 18:02'
  },
  {
    id: 'usr-5',
    name: 'Felipe Augusto Barreto',
    email: 'felipe.barreto@spamhub.net',
    password: 'magis2026', // Mínimo 6 dígitos
    role: 'aluno',
    targetExam: 'Magistratura Estadual',
    questionsAnswered: 45,
    accuracyRate: 35.0,
    status: 'suspenso',
    restrictionReason: 'Comentários ofensivos e violação reiterada aos termos da comunidade.',
    avatarUrl: 'https://picsum.photos/seed/student-felipe/240/240',
    phone: '(31) 98901-2244',
    registrationDate: '28/08/2026',
    lastActive: '05/10/2026'
  },
  {
    id: 'usr-6',
    name: 'Larissa Medeiros Prado',
    email: 'larissa.prado@concursanda.com',
    password: 'dpf2026', // Mínimo 6 dígitos
    role: 'aluno_premium',
    targetExam: 'Polícia Federal (Agente)',
    questionsAnswered: 0,
    accuracyRate: 0,
    status: 'pendente_aprovacao',
    avatarUrl: 'https://picsum.photos/seed/student-larissa/240/240',
    documentPhotoUrl: 'https://picsum.photos/seed/doc-larissa/400/260',
    phone: '(41) 99823-1122',
    registrationDate: '15/10/2026',
    lastActive: 'Cadastrado hoje'
  },
  {
    id: 'usr-7',
    name: 'Bruno Henrique Rocha',
    email: 'bruno.rocha@direito.com.br',
    password: 'oabadv26', // Mínimo 6 dígitos
    role: 'aluno',
    targetExam: 'OAB 43º Exame Unificado',
    questionsAnswered: 0,
    accuracyRate: 0,
    status: 'pendente_aprovacao',
    avatarUrl: 'https://picsum.photos/seed/student-andre/240/240',
    phone: '(81) 98711-4500',
    registrationDate: '15/10/2026',
    lastActive: 'Cadastrado hoje'
  }
];

export const DEFAULT_LEGAL_ITEMS_DATA: LegalItem[] = [
  {
    id: 'leg-sv-58',
    category: 'Súmula Vinculante',
    title: 'Súmula Vinculante nº 58 (STF)',
    source: 'Supremo Tribunal Federal',
    subject: 'Direito Tributário',
    articleNumber: 'Art. 150, VI, "c" da CF/88',
    statement: 'A imunidade tributária prevista no art. 150, VI, "c", da CF/88 abrange as entidades fechadas de previdência complementar desde que não haja contribuição dos empregadores.',
    practicalContext: 'Cai com enorme frequência nas provas da FGV para Receita Federal e Tribunais de Contas. Se houver contribuição patronal da empresa patrocinadora, NÃO há imunidade.',
    relevance: 'Alta Incidência'
  },
  {
    id: 'leg-sv-13',
    category: 'Súmula Vinculante',
    title: 'Súmula Vinculante nº 13 (STF)',
    source: 'Supremo Tribunal Federal',
    subject: 'Direito Administrativo',
    articleNumber: 'Art. 37, caput da CF/88',
    statement: 'A nomeação de cônjuge, companheiro ou parente em linha reta, colateral ou por afinidade, até o terceiro grau, inclusive, da autoridade nomeante ou de servidor da mesma pessoa jurídica investido em cargo de direção, chefia ou assessoramento viola a Constituição Federal.',
    practicalContext: 'Vedação ao nepotismo. Atenção para a exceção jurisprudencial: cargos políticos (Secretários Municipais/Estaduais e Ministros de Estado) em regra admitem parentes, salvo se comprovada a falta de qualificação técnica ou fraude.',
    relevance: 'Alta Incidência'
  },
  {
    id: 'leg-sv-37',
    category: 'Súmula Vinculante',
    title: 'Súmula Vinculante nº 37 (STF)',
    source: 'Supremo Tribunal Federal',
    subject: 'Direito Constitucional',
    articleNumber: 'Art. 37, X da CF/88',
    statement: 'Não cabe ao Poder Judiciário, que não tem função legislativa, aumentar vencimentos de servidores públicos sob o fundamento de isonomia.',
    practicalContext: 'Aplicação rígida do princípio da separação dos poderes e da reserva legal formal para remuneração de servidores.',
    relevance: 'Essencial'
  },
  {
    id: 'leg-stj-2',
    category: 'Súmula',
    title: 'Súmula nº 2 (STJ)',
    source: 'Superior Tribunal de Justiça',
    subject: 'Direito Constitucional',
    articleNumber: 'Art. 5º, LXXII, "a" da CF/88',
    statement: 'Não cabe o habeas data (CF, art. 5º, LXXII, a) se não houve recusa de informações por parte da autoridade administrativa.',
    practicalContext: 'Exigência de prévio esgotamento ou demonstração de recusa/omissão administrativa após 10 dias do pedido. Tema clássico em direito processual e constitucional.',
    relevance: 'Essencial'
  },
  {
    id: 'leg-stj-543',
    category: 'Súmula',
    title: 'Súmula nº 543 (STJ)',
    source: 'Superior Tribunal de Justiça',
    subject: 'Direito Civil / Consumidor',
    articleNumber: 'Art. 53 do CDC',
    statement: 'Na hipótese de resolução de contrato de promessa de compra e venda de imóvel submetido ao CDC, deve ocorrer a imediata restituição das parcelas pagas pelo promitente comprador - integralmente, em caso de culpa exclusiva do promitente vendedor/construtor, ou parcialmente, caso tenha sido o comprador quem deu causa ao desfazimento.',
    practicalContext: 'A devolução não pode ser parcelada nem diferida. Em caso de culpa da construtora (atraso na obra), a devolução é 100% integral.',
    relevance: 'Tema Quente'
  },
  {
    id: 'leg-rg-1048',
    category: 'Repercussão Geral',
    title: 'Tema 1.048 / STF (RE 1.287.019)',
    source: 'STF Pleno',
    subject: 'Direito Tributário',
    articleNumber: 'EC 87/2015 & LC 190/2022',
    statement: 'É necessária a edição de lei complementar federal para a cobrança do Diferencial de Alíquota do ICMS (DIFAL) nas operações interestaduais com consumidor final não contribuinte.',
    practicalContext: 'Julgamento paradigmático que invalidou cláusulas de convênios do CONFAZ e exigiu a promulgação da LC 190/2022 para disciplinar a repartição federativa do imposto.',
    relevance: 'Tema Quente'
  },
  {
    id: 'leg-rg-201',
    category: 'Repercussão Geral',
    title: 'Tema 201 / STF (RE 598.099)',
    source: 'STF Pleno',
    subject: 'Direito Administrativo',
    articleNumber: 'Art. 37, II e IV da CF/88',
    statement: 'O candidato aprovado em concurso público dentro do número de vagas previsto no edital possui direito subjetivo à nomeação, ressalvadas situações excepcionais devidamente motivadas pela Administração.',
    practicalContext: 'A Administração não tem mera discricionariedade durante o prazo de validade: se há vagas no edital, há dever constitucional de nomeação.',
    relevance: 'Alta Incidência'
  },
  {
    id: 'leg-ls-195',
    category: 'Lei Seca',
    title: 'Constituição Federal - Art. 195, §6º',
    source: 'CF/88 - Da Seguridade Social',
    subject: 'Direito Tributário',
    articleNumber: 'Art. 195, §6º da CF/88',
    statement: 'As contribuições sociais só poderão ser exigidas após decorridos noventa dias da data da publicação da lei que as houver instituído ou modificado, não se lhes aplicando o art. 150, III, "b".',
    practicalContext: 'Regra da Anterioridade Nonagesimal Mitigada (Noventena). Contribuições para seguridade social (PIS/COFINS/CSLL) respeitam apenas os 90 dias, dispensando a virada de ano civil.',
    relevance: 'Alta Incidência'
  },
  {
    id: 'leg-ls-14133',
    category: 'Lei Seca',
    title: 'Lei nº 14.133/2021 (NLLC) - Art. 11',
    source: 'Nova Lei de Licitações e Contratos',
    subject: 'Direito Administrativo',
    articleNumber: 'Art. 11 da Lei 14.133/2021',
    statement: 'O processo licitatório tem por objetivos: I - assegurar a seleção da proposta apta a gerar o resultado de contratação mais vantajoso; II - assegurar tratamento isonômico; III - evitar contratações com sobrepreço ou preços manifestamente inexequíveis; IV - incentivar a inovação e o desenvolvimento nacional sustentável.',
    practicalContext: 'Quadro de objetivos cobrado literalmente em provas para auditor e analista. Atenção à inclusão expressa da inovação e da governança.',
    relevance: 'Alta Incidência'
  },
  {
    id: 'leg-cnj-350',
    category: 'Resoluções do CNJ',
    title: 'Resolução CNJ nº 350/2020',
    source: 'Conselho Nacional de Justiça',
    subject: 'Poder Judiciário & Legislação do CNJ',
    articleNumber: 'Arts. 1º a 5º (Cooperação Judiciária)',
    statement: 'Estabelece diretrizes e mecanismos para a cooperação judiciária nacional entre os órgãos do Poder Judiciário e outras instituições, disciplinando atos concertados entre juízos, auxílio direto e compartilhamento de competências.',
    practicalContext: 'Item de altíssima incidência nas provas da magistratura e tribunais (FCC e FGV), regulamentando os arts. 67 a 69 do CPC/2015 no âmbito administrativo-judiciário.',
    relevance: 'Tema Quente'
  },
  {
    id: 'leg-cnj-230',
    category: 'Resoluções do CNJ',
    title: 'Resolução CNJ nº 230/2016',
    source: 'Conselho Nacional de Justiça',
    subject: 'Poder Judiciário & Direitos da Pessoa com Deficiência',
    articleNumber: 'Arts. 1º a 19 (Acessibilidade)',
    statement: 'Orienta a adequação das atividades dos órgãos do Poder Judiciário e de seus serviços auxiliares às determinações da Convenção Internacional sobre os Direitos das Pessoas com Deficiência e da Lei nº 13.146/2015.',
    practicalContext: 'Obrigatória em todos os concursos para Tribunais (TJ, TRF, TRT) por força das resoluções de acessibilidade e direitos fundamentais.',
    relevance: 'Essencial'
  },
  {
    id: 'leg-cnj-215',
    category: 'Resoluções do CNJ',
    title: 'Resolução CNJ nº 215/2015',
    source: 'Conselho Nacional de Justiça',
    subject: 'Poder Judiciário & Legislação do CNJ',
    articleNumber: 'Arts. 1º ao 8º (LAI no Judiciário)',
    statement: 'Dispõe sobre a aplicação da Lei de Acesso à Informação (Lei nº 12.527/2011) no âmbito do Poder Judiciário, regulamentando os portais de transparência, prazos de resposta (20 dias prorrogáveis por 10) e classificação de sigilo.',
    practicalContext: 'Cai com frequência em questões de Direito Administrativo e Legislação Institucional do Poder Judiciário.',
    relevance: 'Alta Incidência'
  }
];

export const MOCK_SIMULADO_RANKINGS: MockExamRankingEntry[] = [
  {
    id: 'rnk-1',
    examId: 'sim-1',
    examTitle: 'Simulado Nacional Oficial RFB 2026 - Prova 1 (Objetiva)',
    studentId: 'usr-4',
    studentName: 'Juliana Beatriz Costa',
    studentAvatar: 'https://picsum.photos/seed/student-juliana/240/240',
    correctAnswers: 66,
    totalQuestions: 70,
    pointsEarned: 132,
    totalPointsPossible: 140,
    percentage: 94.3,
    timeSpentSeconds: 10380,
    completedAt: 'Hoje às 14:20'
  },
  {
    id: 'rnk-2',
    examId: 'sim-1',
    examTitle: 'Simulado Nacional Oficial RFB 2026 - Prova 1 (Objetiva)',
    studentId: 'usr-1',
    studentName: 'Carlos Eduardo Fontes',
    studentAvatar: 'https://picsum.photos/seed/student-carlos/240/240',
    correctAnswers: 59,
    totalQuestions: 70,
    pointsEarned: 118,
    totalPointsPossible: 140,
    percentage: 84.3,
    timeSpentSeconds: 12480,
    completedAt: 'Ontem às 18:30'
  },
  {
    id: 'rnk-3',
    examId: 'sim-1',
    examTitle: 'Simulado Nacional Oficial RFB 2026 - Prova 1 (Objetiva)',
    studentId: 'usr-2',
    studentName: 'Mariana Silveira Ramos',
    studentAvatar: 'https://picsum.photos/seed/student-mariana/240/240',
    correctAnswers: 54,
    totalQuestions: 70,
    pointsEarned: 108,
    totalPointsPossible: 140,
    percentage: 77.1,
    timeSpentSeconds: 13100,
    completedAt: '28/10/2026'
  },
  {
    id: 'rnk-4',
    examId: 'sim-1',
    examTitle: 'Simulado Nacional Oficial RFB 2026 - Prova 1 (Objetiva)',
    studentId: 'usr-7',
    studentName: 'Lucas Ferreira Guimarães',
    studentAvatar: 'https://picsum.photos/seed/student-lucas/240/240',
    correctAnswers: 50,
    totalQuestions: 70,
    pointsEarned: 100,
    totalPointsPossible: 140,
    percentage: 71.4,
    timeSpentSeconds: 12900,
    completedAt: '27/10/2026'
  },
  {
    id: 'rnk-5',
    examId: 'sim-1',
    examTitle: 'Simulado Nacional Oficial RFB 2026 - Prova 1 (Objetiva)',
    studentId: 'usr-3',
    studentName: 'Roberto Viana Mendonça',
    studentAvatar: 'https://picsum.photos/seed/student-roberto/240/240',
    correctAnswers: 42,
    totalQuestions: 70,
    pointsEarned: 84,
    totalPointsPossible: 140,
    percentage: 60.0,
    timeSpentSeconds: 14100,
    completedAt: '26/10/2026'
  },
  {
    id: 'rnk-6',
    examId: 'sim-3',
    examTitle: 'Simulado 1ª Fase OAB 43º Exame Unificado (FGV)',
    studentId: 'usr-2',
    studentName: 'Mariana Silveira Ramos',
    studentAvatar: 'https://picsum.photos/seed/student-mariana/240/240',
    correctAnswers: 68,
    totalQuestions: 80,
    pointsEarned: 136,
    totalPointsPossible: 160,
    percentage: 85.0,
    timeSpentSeconds: 14200,
    completedAt: '29/10/2026'
  },
  {
    id: 'rnk-7',
    examId: 'sim-3',
    examTitle: 'Simulado 1ª Fase OAB 43º Exame Unificado (FGV)',
    studentId: 'usr-7',
    studentName: 'Lucas Ferreira Guimarães',
    studentAvatar: 'https://picsum.photos/seed/student-lucas/240/240',
    correctAnswers: 61,
    totalQuestions: 80,
    pointsEarned: 122,
    totalPointsPossible: 160,
    percentage: 76.3,
    timeSpentSeconds: 15400,
    completedAt: '28/10/2026'
  },
  {
    id: 'rnk-8',
    examId: 'sim-3',
    examTitle: 'Simulado 1ª Fase OAB 43º Exame Unificado (FGV)',
    studentId: 'usr-1',
    studentName: 'Carlos Eduardo Fontes',
    studentAvatar: 'https://picsum.photos/seed/student-carlos/240/240',
    correctAnswers: 58,
    totalQuestions: 80,
    pointsEarned: 116,
    totalPointsPossible: 160,
    percentage: 72.5,
    timeSpentSeconds: 16100,
    completedAt: '25/10/2026'
  }
];


