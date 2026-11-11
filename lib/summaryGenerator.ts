import { StudySummary } from './types';

export function extractSummaryAndKeywords(rawText: string, customTitle?: string, customSubject?: string): StudySummary {
  const clean = rawText.trim();
  const paragraphs = clean
    .split(/\n+/)
    .map(p => p.trim())
    .filter(p => p.length > 20);

  // Extract sentences
  const sentences = clean
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 25);

  // Stop words in Portuguese for TF-IDF / frequency analysis
  const stopWords = new Set([
    'de', 'a', 'o', 'que', 'e', 'do', 'da', 'em', 'um', 'para', 'com', 'não', 'uma', 'os', 'no', 'se',
    'na', 'por', 'mais', 'as', 'dos', 'como', 'mas', 'ao', 'ele', 'das', 'à', 'seu', 'sua', 'ou', 'quando',
    'muito', 'nos', 'já', 'eu', 'também', 'só', 'pelo', 'pela', 'até', 'isso', 'ela', 'entre', 'depois',
    'sem', 'mesmo', 'aos', 'seus', 'quem', 'nas', 'me', 'esse', 'eles', 'você', 'essa', 'num', 'nem',
    'suas', 'meu', 'às', 'minha', 'numa', 'pelos', 'elas', 'qual', 'nós', 'lhe', 'deles', 'essas', 'esses',
    'pelas', 'este', 'dele', 'tu', 'te', 'vocês', 'vos', 'lhes', 'meus', 'minhas', 'teu', 'tua', 'teus',
    'tuas', 'nosso', 'nossa', 'nossos', 'nossas', 'dela', 'delas', 'esta', 'estes', 'estas', 'aquele',
    'aquela', 'aqueles', 'aquelas', 'isto', 'aquilo', 'estou', 'está', 'estamos', 'estão', 'estive',
    'esteve', 'estivemos', 'estiveram', 'estava', 'estávamos', 'estavam', 'sou', 'somos', 'são', 'era',
    'éramos', 'eram', 'fui', 'foi', 'fomos', 'foram', 'ter', 'tem', 'temos', 'têm', 'tinha', 'tínhamos',
    'tinham', 'teve', 'tivemos', 'tiveram', 'sobre', 'sob', 'art', 'artigo', 'lei', 'parágrafo', 'inciso'
  ]);

  // Tokenize & count words / n-grams
  const words = clean.toLowerCase().match(/[a-záàâãéèêíïóôõöúçñ]{3,}/g) || [];
  const wordFreq: Record<string, number> = {};

  for (const w of words) {
    if (!stopWords.has(w) && w.length > 3) {
      wordFreq[w] = (wordFreq[w] || 0) + 1;
    }
  }

  // Identify high-frequency keywords
  const sortedKeywords = Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([w]) => w);

  // Capitalize word
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  // Find sentences containing the best keywords for summary points
  const keyPoints: string[] = [];
  const selectedSentences = new Set<string>();

  // Filter informative sentences
  for (const sentence of sentences) {
    const sLower = sentence.toLowerCase();
    const matchesKeyword = sortedKeywords.some(kw => sLower.includes(kw));
    // Prioritize sentences with legal or doctrinal indicators
    const hasCoreSignal = 
      /deve|não pode|vedado|obrigatório|exceção|regra|princípio|prazo|competência|sujeito|responsabilidade|sanção|nulo|eficácia|constitucional|tribunal|stf|stj/i.test(sentence);

    if (matchesKeyword || hasCoreSignal) {
      const cleanSentence = sentence.replace(/[\n\r\t]+/g, ' ').trim();
      if (!selectedSentences.has(cleanSentence) && cleanSentence.length >= 35 && cleanSentence.length <= 220) {
        selectedSentences.add(cleanSentence);
        keyPoints.push(cleanSentence + (cleanSentence.endsWith('.') ? '' : '.'));
        if (keyPoints.length >= 6) break;
      }
    }
  }

  // Fallback if keyPoints is short
  if (keyPoints.length < 3 && paragraphs.length > 0) {
    paragraphs.slice(0, 4).forEach(p => {
      const firstS = p.split('.')[0]?.trim();
      if (firstS && firstS.length > 25 && !selectedSentences.has(firstS)) {
        keyPoints.push(firstS + '.');
      }
    });
  }

  // Extract Key Terms with Contextual Definitions
  const keyTermsList: StudySummary['keyTerms'] = [];
  const usedTerms = new Set<string>();

  for (const kw of sortedKeywords) {
    if (usedTerms.has(kw)) continue;
    // Find the sentence that best explains or uses this term
    const matchSentence = sentences.find(s => s.toLowerCase().includes(kw));
    let def = '';
    if (matchSentence) {
      def = matchSentence.trim();
      if (def.length > 140) def = def.slice(0, 137) + '...';
    } else {
      def = `Conceito fundamental com ${wordFreq[kw]} ocorrências no texto base colado.`;
    }

    const freq = wordFreq[kw] || 1;
    const relevance: 'Alta' | 'Média' | 'Essencial' = freq >= 4 ? 'Essencial' : freq >= 2 ? 'Alta' : 'Média';

    keyTermsList.push({
      term: cap(kw),
      definition: def,
      relevance
    });
    usedTerms.add(kw);
    if (keyTermsList.length >= 6) break;
  }

  // Detect legal references (CF/88, leis, súmulas, arts)
  const legalMatches = clean.match(/(?:CF\/?88|Art(?:igo)?\.?\s*\d+[\w§º°\s,-]*|Lei\s*n?º?\s*[\d\.]+|Súmula(?:\s*Vinculante)?\s*n?º?\s*\d+|Tema\s*\d+)/gi);
  const legalRef = legalMatches ? Array.from(new Set(legalMatches)).slice(0, 3).join(' • ') : undefined;

  // Auto-detect subject if not passed
  let subject = customSubject || 'Direito Constitucional';
  if (!customSubject) {
    const textLower = clean.toLowerCase();
    if (/tribut|fisco|imposto|ctn|crédito tributário|icms|iss/i.test(textLower)) {
      subject = 'Direito Tributário';
    } else if (/licita|servidor|ato administrativo|8\.112|14\.133|desapropria|improbidade/i.test(textLower)) {
      subject = 'Direito Administrativo';
    } else if (/crime|pena|tipicidade|inquérito|código penal|homicídio|furto/i.test(textLower)) {
      subject = 'Direito Penal';
    } else if (/oab|estatuto da oab|ética|advocat|incompatibilidade|honorário/i.test(textLower)) {
      subject = 'Ética Profissional';
    } else if (/processo civil|cpc|recurso|agravo|apelação|tutela/i.test(textLower)) {
      subject = 'Direito Processual Civil';
    } else if (/contabilidade|balanço|dre|patrimônio|ativo|passivo/i.test(textLower)) {
      subject = 'Contabilidade Geral';
    }
  }

  // Generate Title
  const title = customTitle || (paragraphs[0] ? paragraphs[0].slice(0, 60).replace(/[^\w\s-]/gi, '') : `Resumo de ${subject}`);

  // Tips derived from core keywords
  const examTips: string[] = [];
  if (sortedKeywords.length >= 2) {
    examTips.push(`Atenção máxima às pegadinhas entre as distinções de ${cap(sortedKeywords[0])} e ${cap(sortedKeywords[1])}.`);
  }
  examTips.push('Bancas (FGV/Cebraspe) costumam trocar termos absolutos como "sempre" ou "nunca" nas assertivas deste tema.');
  if (legalRef) {
    examTips.push(`Memorize a literalidade do dispositivo legal citado: ${legalRef}.`);
  }

  // Calculate Reading Time
  const wordCount = words.length;
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 180));

  return {
    id: `resumo-${Date.now()}`,
    studentId: 'usr-1',
    title: title.trim(),
    subject,
    topic: keyTermsList[0]?.term ? `Tópico: ${keyTermsList[0].term}` : undefined,
    rawText: clean,
    summaryPoints: keyPoints.length > 0 ? keyPoints : ['Texto sintetizado com ênfase nos pontos de maior incidência em provas.'],
    keyTerms: keyTermsList,
    examTips,
    legalRef,
    createdAt: 'Hoje',
    readingTimeMinutes
  };
}
