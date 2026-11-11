'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  FileText, 
  Copy, 
  Check, 
  Trash2, 
  Plus, 
  BookOpen, 
  Search, 
  Clock, 
  Tag, 
  Lightbulb, 
  Scale, 
  ArrowRight,
  Bookmark,
  Share2,
  ListOrdered,
  Layers,
  CheckCircle2,
  Zap,
  Maximize2,
  X
} from 'lucide-react';
import { StudySummary } from '@/lib/types';
import { extractSummaryAndKeywords } from '@/lib/summaryGenerator';

interface ResumosViewProps {
  summaries: StudySummary[];
  onCreateSummary: (summary: StudySummary) => void;
  onDeleteSummary: (id: string) => void;
  onNavigateToQuestions?: (subject: string) => void;
}

export function ResumosView({
  summaries,
  onCreateSummary,
  onDeleteSummary,
  onNavigateToQuestions
}: ResumosViewProps) {
  const [selectedSummaryId, setSelectedSummaryId] = useState<string>(summaries[0]?.id || '');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeModalTerm, setActiveModalTerm] = useState<{
    term: string;
    definition: string;
    relevance: 'Alta' | 'Média' | 'Essencial';
  } | null>(null);

  // Generator form state
  const [pastedText, setPastedText] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  const [customSubject, setCustomSubject] = useState('Direito Constitucional');
  const [isGenerating, setIsGenerating] = useState(false);

  // Available subjects
  const subjects = ['all', ...Array.from(new Set(summaries.map(s => s.subject)))];

  const filteredSummaries = summaries.filter(s => {
    if (selectedSubject !== 'all' && s.subject !== selectedSubject) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const inTitle = s.title.toLowerCase().includes(q);
      const inSubject = s.subject.toLowerCase().includes(q);
      const inTerms = s.keyTerms.some(kt => kt.term.toLowerCase().includes(q));
      if (!inTitle && !inSubject && !inTerms) return false;
    }
    return true;
  });

  const activeSummary = summaries.find(s => s.id === selectedSummaryId) || filteredSummaries[0] || summaries[0];

  const handleProcessPastedText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pastedText.trim() || pastedText.trim().length < 30) return;

    setIsGenerating(true);
    setTimeout(() => {
      const generated = extractSummaryAndKeywords(pastedText, customTitle.trim() || undefined, customSubject);
      onCreateSummary(generated);
      setSelectedSummaryId(generated.id);
      setIsGenerating(false);
      setIsModalOpen(false);
      setPastedText('');
      setCustomTitle('');
    }, 400);
  };

  const handleCopySummary = () => {
    if (!activeSummary) return;
    const textToCopy = `📌 ${activeSummary.title} (${activeSummary.subject})\n\n` +
      `💡 PONTOS CHAVE:\n` +
      activeSummary.summaryPoints.map((pt, i) => `${i + 1}. ${pt}`).join('\n') +
      `\n\n🔑 PALAVRAS-CHAVE & CONCEITOS:\n` +
      activeSummary.keyTerms.map(kt => `• ${kt.term} [${kt.relevance}]: ${kt.definition}`).join('\n') +
      (activeSummary.legalRef ? `\n\n⚖️ FUNDAMENTO LEGAL: ${activeSummary.legalRef}` : '') +
      (activeSummary.examTips?.length ? `\n\n🎯 DICA DE PROVA: ${activeSummary.examTips.join(' ')}` : '');

    navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 md:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              Sintetizador Inteligente
            </span>
            <span className="text-xs text-slate-500 font-medium">Algoritmo de Extração de Palavras-Chave</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Criar Resumos & Síntese Rápida
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            Cole doutrina, capítulos de PDF ou dispositivos de lei seca. O algoritmo lê o texto, extrai os pontos capitais, identifica as palavras-chave prioritárias e gera cartões de fixação para revisão.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Criar Novo Resumo (Copia & Cola)</span>
        </button>
      </div>

      {/* Main Grid: Sidebar List + Reader Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Summary Library & Filter */}
        <div className="lg:col-span-4 bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-purple-600" />
              Meus Resumos ({summaries.length})
            </h2>
          </div>

          {/* Search & Subject Filter */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Buscar por título ou palavra-chave..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-purple-500 transition-all text-slate-800 placeholder-slate-400"
              />
            </div>

            {/* Subject selector */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {subjects.map((subj) => (
                <button
                  key={subj}
                  onClick={() => setSelectedSubject(subj)}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] whitespace-nowrap transition-colors cursor-pointer ${
                    selectedSubject === subj
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {subj === 'all' ? 'Todas' : subj}
                </button>
              ))}
            </div>
          </div>

          {/* Summary Cards List */}
          <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
            {filteredSummaries.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                Nenhum resumo encontrado com este filtro.
              </div>
            ) : (
              filteredSummaries.map((sum) => (
                <div
                  key={sum.id}
                  onClick={() => setSelectedSummaryId(sum.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left ${
                    selectedSummaryId === sum.id
                      ? 'bg-purple-50/70 border-purple-300 ring-1 ring-purple-400/50 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wide text-purple-700 bg-purple-100/80 px-2 py-0.5 rounded">
                      {sum.subject}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {sum.readingTimeMinutes} min
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-slate-900 line-clamp-1">
                    {sum.title}
                  </h3>

                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {sum.summaryPoints[0]}
                  </p>

                  {/* Keyword Pills Preview */}
                  <div className="mt-2.5 flex items-center gap-1 flex-wrap">
                    {sum.keyTerms.slice(0, 3).map((kt) => (
                      <span
                        key={kt.term}
                        className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200"
                      >
                        #{kt.term}
                      </span>
                    ))}
                    {sum.keyTerms.length > 3 && (
                      <span className="text-[9px] text-slate-400 font-bold">
                        +{sum.keyTerms.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Side: Active Summary Content Reader & Keywords */}
        <div className="lg:col-span-8 space-y-4">
          {activeSummary ? (
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs space-y-6">
              {/* Header of Active Summary */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-0.5 rounded-full">
                      {activeSummary.subject}
                    </span>
                    {activeSummary.topic && (
                      <span className="text-xs text-slate-500 font-medium">
                        {activeSummary.topic}
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl font-black text-slate-900 mt-1.5 tracking-tight">
                    {activeSummary.title}
                  </h2>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                    <span>Criado: {activeSummary.createdAt}</span>
                    <span>•</span>
                    <span>Tempo de leitura estimado: {activeSummary.readingTimeMinutes} min</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopySummary}
                    title="Copiar resumo estruturado"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                        <span>Copiar Resumo</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => onDeleteSummary(activeSummary.id)}
                    title="Excluir este resumo"
                    className="p-2 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Section 1: Palavras-Chave Extraídas pelo Algoritmo */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-purple-900 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-purple-600" />
                    Palavras-Chave e Conceitos Nucleares
                  </h3>
                  <span className="text-[11px] text-slate-400">Classificação por relevância conceitual</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {activeSummary.keyTerms.map((kt) => (
                    <div
                      key={kt.term}
                      onClick={() => setActiveModalTerm(kt)}
                      title="Clique para abrir e fazer a leitura completa do artigo resumido"
                      className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/60 hover:border-purple-400 hover:bg-purple-50/50 hover:shadow-md transition-all group cursor-pointer active:scale-[0.99]"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-black text-slate-900 group-hover:text-purple-700 flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                          {kt.term}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                            kt.relevance === 'Essencial'
                              ? 'bg-rose-100 text-rose-800'
                              : kt.relevance === 'Alta'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {kt.relevance}
                          </span>
                          <span className="text-[10px] text-purple-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                            <Maximize2 className="w-3 h-3" />
                            Ler
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 group-hover:text-slate-800">
                        {kt.definition}
                      </p>
                      <div className="mt-2 text-[10px] text-purple-600 font-semibold flex items-center gap-1">
                        <span>Ver leitura completa do artigo & contextualização</span>
                        <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 2: Pontos Chave Sintetizados */}
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2 mb-3">
                  <ListOrdered className="w-4 h-4 text-blue-600" />
                  Pontos Essenciais para Memorização
                </h3>

                <div className="space-y-2.5">
                  {activeSummary.summaryPoints.map((point, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-blue-50/40 border border-blue-100 flex items-start gap-3"
                    >
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-xs font-medium text-slate-800 leading-relaxed">
                        {point}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 3: Fundamento Legal & Dica de Banca */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {activeSummary.legalRef && (
                  <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200">
                    <div className="text-xs font-extrabold text-amber-900 flex items-center gap-1.5 mb-1.5">
                      <Scale className="w-4 h-4 text-amber-600" />
                      Fundamento Legal / Jurisprudência
                    </div>
                    <p className="text-xs text-amber-800 font-mono font-bold">
                      {activeSummary.legalRef}
                    </p>
                  </div>
                )}

                {activeSummary.examTips && activeSummary.examTips.length > 0 && (
                  <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200">
                    <div className="text-xs font-extrabold text-emerald-900 flex items-center gap-1.5 mb-1.5">
                      <Lightbulb className="w-4 h-4 text-emerald-600" />
                      Foco de Pegadinha das Bancas
                    </div>
                    <ul className="text-xs text-emerald-800 space-y-1">
                      {activeSummary.examTips.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span>•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Bottom Quick Action: Resolver questões sobre o assunto */}
              {onNavigateToQuestions && (
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    Fixe este conteúdo respondendo questões do tema:
                  </span>
                  <button
                    onClick={() => onNavigateToQuestions(activeSummary.subject)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    <span>Treinar Questões de {activeSummary.subject}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-12 text-center text-slate-400">
              <BookOpen className="w-12 h-12 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-bold text-slate-700">Nenhum resumo selecionado</p>
              <p className="text-xs text-slate-400 mt-1">Clique em Criar Novo Resumo para colar um texto e extrair palavras-chave.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Copia e Cola para Criar Resumo */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="fixed inset-0"
            onClick={() => !isGenerating && setIsModalOpen(false)}
          />
          <div className="relative bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl p-6 z-10 overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    Criar Resumo com Palavras-Chave
                  </h3>
                  <p className="text-xs text-slate-500">
                    Cole o conteúdo bruto: doutrina, artigo de lei, apostilas ou anotações
                  </p>
                </div>
              </div>
              <button
                disabled={isGenerating}
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleProcessPastedText} className="mt-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Título do Resumo (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Direitos Políticos e Inelegibilidades"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Disciplina
                  </label>
                  <select
                    value={customSubject}
                    onChange={(e) => setCustomSubject(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-purple-500 font-medium"
                  >
                    <option value="Direito Constitucional">Direito Constitucional</option>
                    <option value="Direito Administrativo">Direito Administrativo</option>
                    <option value="Direito Tributário">Direito Tributário</option>
                    <option value="Direito Penal">Direito Penal</option>
                    <option value="Direito Processual Civil">Direito Processual Civil</option>
                    <option value="Ética Profissional">Ética Profissional</option>
                    <option value="Contabilidade Geral">Contabilidade Geral</option>
                    <option value="Legislação Especial">Legislação Especial</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Cole o Texto Aqui (Doutrina, Lei Seca ou Aula):
                  </label>
                  <span className="text-[11px] text-slate-400">
                    {pastedText.length} caracteres
                  </span>
                </div>
                <textarea
                  rows={8}
                  required
                  placeholder="Cole aqui o trecho que você deseja resumir... Exemplo: 'Art. 5º Todos são iguais perante a lei, sem distinção de qualquer natureza, garantindo-se aos brasileiros e aos estrangeiros residentes no País a inviolabilidade do direito à vida, à liberdade, à igualdade, à segurança e à propriedade...'"
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-purple-500 font-sans leading-relaxed"
                />
              </div>

              <div className="p-3 bg-purple-50/70 rounded-xl border border-purple-100 flex items-start gap-2 text-xs text-purple-900">
                <Sparkles className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <span>
                  O algoritmo analisará a densidade semântica do texto, isolará as <strong>palavras-chave prioritárias</strong> com seus significados e gerará os <strong>pontos-chave</strong> estruturados.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  disabled={isGenerating}
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isGenerating || pastedText.trim().length < 30}
                  className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl transition-all shadow-md cursor-pointer"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Processando Síntese...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Gerar Resumo com Palavras-Chave</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Interativo: Leitura Completa do Artigo / Conceito Nuclear */}
      {activeModalTerm && activeSummary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="fixed inset-0"
            onClick={() => setActiveModalTerm(null)}
          />
          <div className="relative bg-white rounded-3xl max-w-3xl w-full border border-purple-200 shadow-2xl p-6 sm:p-8 z-10 overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-5 border-b border-slate-100 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center shadow-md shrink-0">
                  <Zap className="w-6 h-6 fill-amber-300 text-amber-200" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-black uppercase tracking-wider text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-0.5 rounded-full">
                      {activeSummary.subject}
                    </span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      activeModalTerm.relevance === 'Essencial'
                        ? 'bg-rose-100 text-rose-800'
                        : activeModalTerm.relevance === 'Alta'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      Relevância: {activeModalTerm.relevance}
                    </span>
                  </div>
                  <h3 className="font-black text-slate-900 text-xl sm:text-2xl mt-1 tracking-tight">
                    {activeModalTerm.term}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Conceito extraído do resumo: <strong>{activeSummary.title}</strong>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveModalTerm(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Scrollable Reader */}
            <div className="flex-1 overflow-y-auto py-5 space-y-6 pr-1">
              {/* Box 1: Definição Nuclear da Palavra-Chave */}
              <div className="p-4 rounded-2xl bg-purple-50/80 border border-purple-200/80">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-purple-900 mb-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span>Definição & Contexto Conceitual</span>
                </div>
                <p className="text-sm font-semibold text-purple-950 leading-relaxed">
                  {activeModalTerm.definition}
                </p>
              </div>

              {/* Box 2: Leitura Completa do Artigo / Texto Resumido */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    Leitura Integral do Artigo / Doutrina
                  </h4>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {activeSummary.rawText.length} caracteres • {activeSummary.readingTimeMinutes} min de leitura
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-sm leading-relaxed whitespace-pre-line font-serif shadow-inner">
                  {/* Highlight the keyword in the text */}
                  {activeSummary.rawText}
                </div>
              </div>

              {/* Box 3: Pontos Chave Sintetizados do Artigo */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <ListOrdered className="w-4 h-4 text-emerald-600" />
                  Pontos Capitais deste Artigo
                </h4>
                <div className="space-y-2">
                  {activeSummary.summaryPoints.map((pt, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-white border border-slate-200 flex items-start gap-3 shadow-2xs"
                    >
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {pt}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Box 4: Fundamento Legal e Dicas */}
              {(activeSummary.legalRef || (activeSummary.examTips && activeSummary.examTips.length > 0)) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {activeSummary.legalRef && (
                    <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200">
                      <div className="text-[11px] font-black uppercase tracking-wider text-amber-900 flex items-center gap-1.5 mb-1">
                        <Scale className="w-3.5 h-3.5 text-amber-600" />
                        Dispositivo Legal Aplicável
                      </div>
                      <p className="text-xs text-amber-900 font-mono font-bold">
                        {activeSummary.legalRef}
                      </p>
                    </div>
                  )}

                  {activeSummary.examTips && activeSummary.examTips.length > 0 && (
                    <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
                      <div className="text-[11px] font-black uppercase tracking-wider text-emerald-900 flex items-center gap-1.5 mb-1">
                        <Lightbulb className="w-3.5 h-3.5 text-emerald-600" />
                        Foco nas Bancas Concursais
                      </div>
                      <p className="text-xs text-emerald-900 leading-relaxed">
                        {activeSummary.examTips[0]}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-400">
                Pressione <strong>ESC</strong> ou clique fora para fechar o leitor
              </span>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                {onNavigateToQuestions && (
                  <button
                    onClick={() => {
                      setActiveModalTerm(null);
                      onNavigateToQuestions(activeSummary.subject);
                    }}
                    className="flex-1 sm:flex-none px-4 py-2 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <span>Treinar Questões</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={() => setActiveModalTerm(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Concluir Leitura
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
