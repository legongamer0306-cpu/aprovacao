'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  BookOpen, 
  Bookmark, 
  ExternalLink, 
  Scale, 
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Plus,
  Trash2,
  Copy,
  Check,
  Gavel,
  Filter,
  X,
  Share2,
  AlertCircle
} from 'lucide-react';
import { LegalItem, LegalCategory } from '@/lib/types';

interface JurisprudenceViewProps {
  onNavigateToQuestions?: (subject?: string) => void;
  items?: LegalItem[];
  onDeleteItem?: (itemId: string) => void;
  onAddItem?: (item: LegalItem) => void;
}

const DEFAULT_LEGAL_ITEMS: LegalItem[] = [
  // 1. Súmula Vinculante
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

  // 2. Súmulas
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

  // 3. Repercussão Geral
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

  // 4. Lei Seca
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

  // 5. Resoluções do CNJ
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

export function JurisprudenceView({ 
  onNavigateToQuestions,
  items: externalItems,
  onDeleteItem: externalOnDeleteItem,
  onAddItem: externalOnAddItem,
}: JurisprudenceViewProps) {
  const [internalItems, setInternalItems] = useState<LegalItem[]>(DEFAULT_LEGAL_ITEMS);
  const items = externalItems || internalItems;
  const setItems = (newItems: LegalItem[] | ((prev: LegalItem[]) => LegalItem[])) => {
    if (typeof newItems === 'function') {
      setInternalItems((prev) => {
        const computed = newItems(externalItems || prev);
        return computed;
      });
    } else {
      setInternalItems(newItems);
    }
  };
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedItemId, setSelectedItemId] = useState<string>(DEFAULT_LEGAL_ITEMS[0].id);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states for inserting new legal item
  const [newCategory, setNewCategory] = useState<LegalCategory>('Súmula Vinculante');
  const [newTitle, setNewTitle] = useState('');
  const [newSource, setNewSource] = useState('Supremo Tribunal Federal');
  const [newSubject, setNewSubject] = useState('Direito Constitucional');
  const [newArticleNumber, setNewArticleNumber] = useState('');
  const [newStatement, setNewStatement] = useState('');
  const [newPracticalContext, setNewPracticalContext] = useState('');
  const [newRelevance, setNewRelevance] = useState<'Alta Incidência' | 'Tema Quente' | 'Essencial' | 'Inédito'>('Alta Incidência');

  // Find currently selected item
  const selectedItem = items.find((i) => i.id === selectedItemId) || items[0] || DEFAULT_LEGAL_ITEMS[0];

  // Filter items
  const filtered = items.filter((item) => {
    const matchesSearch = 
      item.title.toLowerCase().includes(search.toLowerCase()) || 
      item.statement.toLowerCase().includes(search.toLowerCase()) ||
      item.practicalContext.toLowerCase().includes(search.toLowerCase()) ||
      item.source.toLowerCase().includes(search.toLowerCase()) ||
      (item.subject && item.subject.toLowerCase().includes(search.toLowerCase())) ||
      (item.articleNumber && item.articleNumber.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Category counts
  const categoryCounts = {
    all: items.length,
    'Súmula Vinculante': items.filter((i) => i.category === 'Súmula Vinculante').length,
    'Súmula': items.filter((i) => i.category === 'Súmula').length,
    'Repercussão Geral': items.filter((i) => i.category === 'Repercussão Geral').length,
    'Lei Seca': items.filter((i) => i.category === 'Lei Seca').length,
    'Resoluções do CNJ': items.filter((i) => i.category === 'Resoluções do CNJ').length,
  };

  // Helper for source placeholder suggestion
  const handleCategoryChange = (category: LegalCategory) => {
    setNewCategory(category);
    if (category === 'Súmula Vinculante') {
      setNewSource('Supremo Tribunal Federal');
    } else if (category === 'Súmula') {
      setNewSource('Superior Tribunal de Justiça');
    } else if (category === 'Repercussão Geral') {
      setNewSource('STF Pleno');
    } else if (category === 'Lei Seca') {
      setNewSource('Constituição Federal / Congresso Nacional');
    } else if (category === 'Resoluções do CNJ') {
      setNewSource('Conselho Nacional de Justiça');
      setNewSubject('Poder Judiciário & Legislação do CNJ');
    }
  };

  const handleCopyStatement = (statement: string, id: string) => {
    navigator.clipboard.writeText(statement);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleAddNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newStatement.trim()) return;

    const newItem: LegalItem = {
      id: `custom-leg-${Date.now()}`,
      category: newCategory,
      title: newTitle.trim(),
      source: newSource.trim() || (newCategory === 'Resoluções do CNJ' ? 'Conselho Nacional de Justiça' : 'Tribunal Superior'),
      subject: newSubject.trim() || 'Direito Geral',
      articleNumber: newArticleNumber.trim() || undefined,
      statement: newStatement.trim(),
      practicalContext: newPracticalContext.trim() || 'Dispositivo inserido pelo candidato para revisão ativa e fixação de literalidade.',
      relevance: newRelevance,
      isCustom: true,
      createdAt: new Date().toLocaleDateString('pt-BR')
    };

    if (externalOnAddItem) {
      externalOnAddItem(newItem);
    } else {
      setItems([newItem, ...items]);
    }
    setSelectedItemId(newItem.id);
    setActiveCategory(newCategory); // Focus on the category just inserted
    setIsAddModalOpen(false);

    // Reset form
    setNewTitle('');
    setNewArticleNumber('');
    setNewStatement('');
    setNewPracticalContext('');

    setToastMessage(`Item "${newItem.title}" inserido com sucesso em ${newItem.category}!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleDeleteItem = (itemId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (externalOnDeleteItem) {
      externalOnDeleteItem(itemId);
    } else {
      const updated = items.filter((i) => i.id !== itemId);
      setItems(updated);
      if (selectedItemId === itemId && updated.length > 0) {
        setSelectedItemId(updated[0].id);
      }
    }
    setToastMessage('Item excluído da biblioteca.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Feedback Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#0F172A] text-white shadow-2xl border border-emerald-500/30 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="text-xs">
            <span className="font-bold text-white block">Biblioteca Atualizada</span>
            <span className="text-[#94A3B8]">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Top Banner & Control Toolbar */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 md:p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-md bg-[#EFF6FF] text-[#2563EB]">
              <Scale className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
              Biblioteca Jurídica & Dispositivos de Prova
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-[#0F172A]">
            Súmulas, Repercussão Geral, Lei Seca & Resoluções do CNJ
          </h2>
          <p className="text-xs text-[#475569]">
            Dispositivos e precedentes sintetizados com literalidade para consultas rápidas, revisões e inserção de novas súmulas e resoluções.
          </p>
        </div>

        {/* Action Button: Inserir Novo Dispositivo */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Inserir Novo Dispositivo
          </button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        {/* Category Horizontal Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all shrink-0 cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-[#0F172A] text-white shadow-2xs'
                : 'bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            Todos ({categoryCounts.all})
          </button>

          {(['Súmula Vinculante', 'Súmula', 'Repercussão Geral', 'Lei Seca', 'Resoluções do CNJ'] as LegalCategory[]).map((cat) => {
            const isSelected = activeCategory === cat;
            const count = categoryCounts[cat] || 0;

            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-[#2563EB] text-white font-bold shadow-2xs'
                    : 'bg-[#F8FAFC] border border-[#E2E8F0] text-[#475569] hover:bg-[#EFF6FF]'
                }`}
              >
                <span>{cat}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold tabular-nums ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-[#E2E8F0] text-[#64748B]'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="w-full sm:w-72">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#CBD5E1] bg-white shadow-2xs">
            <Search className="w-3.5 h-3.5 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Pesquisar súmula, artigo ou resolução..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs text-[#0F172A] placeholder-[#94A3B8] outline-none"
            />
          </div>
        </div>
      </div>

      {/* Main Grid: List on Left, Detail Card on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left: List of items */}
        <div className="lg:col-span-6 space-y-3">
          {filtered.length === 0 ? (
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-8 text-center space-y-2">
              <Scale className="w-8 h-8 text-[#94A3B8] mx-auto" />
              <p className="text-xs font-bold text-[#0F172A]">Nenhum dispositivo encontrado</p>
              <p className="text-[11px] text-[#64748B]">Tente ajustar a busca ou cadastre um novo dispositivo.</p>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="mt-2 px-3 py-1.5 bg-[#2563EB] text-white text-xs font-bold rounded-lg cursor-pointer"
              >
                Cadastrar agora
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {filtered.map((item) => {
                const isSelected = selectedItem?.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItemId(item.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer relative group ${
                      isSelected
                        ? 'bg-blue-50/60 border-[#2563EB] shadow-xs ring-1 ring-[#2563EB]/20'
                        : 'bg-white border-[#E2E8F0] hover:border-[#CBD5E1] hover:shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          item.category === 'Resoluções do CNJ'
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : item.category === 'Súmula Vinculante'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : item.category === 'Repercussão Geral'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : item.category === 'Lei Seca'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]'
                        }`}>
                          {item.category}
                        </span>

                        {item.isCustom && (
                          <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-700">
                            Inserido por Você
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/50">
                          {item.relevance}
                        </span>

                        {item.isCustom && (
                          <button
                            onClick={(e) => handleDeleteItem(item.id, e)}
                            className="p-1 rounded text-[#94A3B8] hover:text-rose-600 transition-colors cursor-pointer"
                            title="Excluir este dispositivo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <h4 className="text-xs md:text-sm font-bold text-[#0F172A] mb-1 leading-snug">
                      {item.title}
                    </h4>

                    {item.subject && (
                      <p className="text-[11px] font-semibold text-[#64748B] mb-1.5">
                        Disciplina: <span className="text-[#0F172A]">{item.subject}</span>
                      </p>
                    )}

                    <p className="text-xs text-[#475569] line-clamp-2 leading-relaxed">
                      {item.statement}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Detailed Inspection Card */}
        {selectedItem && (
          <div className="lg:col-span-6 bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs space-y-5 sticky top-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#2563EB] bg-[#EFF6FF] px-2.5 py-1 rounded border border-[#BFDBFE]">
                  {selectedItem.source}
                </span>
                {selectedItem.subject && (
                  <span className="text-xs font-semibold text-[#64748B] bg-[#F1F5F9] px-2 py-0.5 rounded">
                    {selectedItem.subject}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleCopyStatement(selectedItem.statement, selectedItem.id)}
                  className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded bg-[#F8FAFC] border border-[#CBD5E1] text-[#475569] hover:text-[#0F172A] transition-colors cursor-pointer"
                  title="Copiar texto oficial"
                >
                  {copiedId === selectedItem.id ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-600">Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>

                {selectedItem.isCustom && (
                  <button
                    onClick={() => handleDeleteItem(selectedItem.id)}
                    className="p-1 rounded text-[#94A3B8] hover:text-rose-600 transition-colors cursor-pointer"
                    title="Excluir dispositivo personalizado"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#2563EB]">
                  {selectedItem.category}
                </span>
                {selectedItem.articleNumber && (
                  <span className="text-xs font-mono text-[#64748B]">
                    • Ref: {selectedItem.articleNumber}
                  </span>
                )}
              </div>
              <h3 className="text-base md:text-lg font-extrabold text-[#0F172A] leading-snug">
                {selectedItem.title}
              </h3>
            </div>

            {/* Texto Oficial / Enunciado */}
            <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] flex items-center gap-1.5">
                <BookOpen className="w-3 h-3 text-[#2563EB]" />
                Texto Oficial / Dispositivo Legal (Literalidade)
              </span>
              <p className="text-xs md:text-sm text-[#0F172A] font-serif leading-relaxed italic border-l-2 border-[#2563EB] pl-3 py-1">
                &ldquo;{selectedItem.statement}&rdquo;
              </p>
            </div>

            {/* Aplicação Prática / Dica de Ouro */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0F172A] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Aplicação Prática em Questões de Concurso & Dica de Prova:
              </span>
              <p className="text-xs text-[#334155] leading-relaxed bg-[#EFF6FF]/50 p-3.5 rounded-lg border border-[#BFDBFE]/60">
                {selectedItem.practicalContext}
              </p>
            </div>

            <div className="pt-2 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs text-[#10B981] font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Sincronizado com o Edital Vigente
              </span>

              {onNavigateToQuestions && (
                <button 
                  onClick={() => onNavigateToQuestions(selectedItem.subject || undefined)}
                  className="text-xs font-bold text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-1 cursor-pointer hover:underline"
                >
                  Ver questões deste tema <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal: Inserir Novo Dispositivo (Súmula, Súmula Vinculante, Repercussão Geral, Lei Seca, Resoluções do CNJ) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl bg-white rounded-2xl border border-[#CBD5E1] shadow-2xl p-6 space-y-4 max-h-[92vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#2563EB] text-white flex items-center justify-center">
                  <Scale className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-[#0F172A]">
                    Inserir Novo Dispositivo Jurídico
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    Adicione Súmulas Vinculantes, Súmulas, Repercussão Geral, Lei Seca ou Resoluções do CNJ.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-[#64748B] hover:text-[#0F172A] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddNewItem} className="space-y-4 text-xs">
              {/* Categoria Selector */}
              <div>
                <label className="block font-bold text-[#475569] mb-1">
                  Tipo / Categoria do Dispositivo *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(['Súmula Vinculante', 'Súmula', 'Repercussão Geral', 'Lei Seca', 'Resoluções do CNJ'] as LegalCategory[]).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleCategoryChange(cat)}
                      className={`p-2 rounded-lg border text-left font-bold text-xs transition-all cursor-pointer ${
                        newCategory === cat
                          ? 'border-[#2563EB] bg-[#EFF6FF] text-[#2563EB] ring-1 ring-[#2563EB]'
                          : 'border-[#CBD5E1] bg-white text-[#475569] hover:bg-[#F8FAFC]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Título & Fonte */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#475569] mb-1">
                    Título / Número do Dispositivo *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={
                      newCategory === 'Resoluções do CNJ'
                        ? 'Ex: Resolução CNJ nº 350/2020'
                        : newCategory === 'Súmula Vinculante'
                        ? 'Ex: Súmula Vinculante nº 60 (STF)'
                        : newCategory === 'Repercussão Geral'
                        ? 'Ex: Tema 1.250 / STF (RE 1.340.553)'
                        : newCategory === 'Lei Seca'
                        ? 'Ex: Lei nº 14.133/2021 - Art. 75'
                        : 'Ex: Súmula nº 650 (STJ)'
                    }
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1] bg-white text-[#0F172A] outline-none focus:border-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#475569] mb-1">
                    Tribunal / Órgão Emissor / Fonte *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Supremo Tribunal Federal, CNJ, etc."
                    value={newSource}
                    onChange={(e) => setNewSource(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1] bg-white text-[#0F172A] outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>

              {/* Disciplina & Relevância */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <label className="block font-bold text-[#475569] mb-1">
                    Disciplina / Matéria
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Direito Administrativo"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1] bg-white text-[#0F172A] outline-none focus:border-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#475569] mb-1">
                    Artigo / Referência
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Art. 37, §6º ou Res. 350"
                    value={newArticleNumber}
                    onChange={(e) => setNewArticleNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1] bg-white text-[#0F172A] outline-none focus:border-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#475569] mb-1">
                    Nível de Incidência
                  </label>
                  <select
                    value={newRelevance}
                    onChange={(e) => setNewRelevance(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1] bg-white text-[#0F172A] outline-none focus:border-[#2563EB]"
                  >
                    <option value="Alta Incidência">Alta Incidência</option>
                    <option value="Tema Quente">Tema Quente</option>
                    <option value="Essencial">Essencial</option>
                    <option value="Inédito">Inédito / Novidade</option>
                  </select>
                </div>
              </div>

              {/* Enunciado / Texto Oficial */}
              <div>
                <label className="block font-bold text-[#475569] mb-1">
                  Texto Oficial / Enunciado Legal (Literalidade) *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Cole aqui o texto literal do dispositivo, enunciado da súmula ou tese fixada..."
                  value={newStatement}
                  onChange={(e) => setNewStatement(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#CBD5E1] bg-white text-[#0F172A] outline-none focus:border-[#2563EB] resize-none"
                />
              </div>

              {/* Contexto Prático / Dica de Prova */}
              <div>
                <label className="block font-bold text-[#475569] mb-1">
                  Aplicação Prática em Questões & Dica de Prova
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: Ponto de atenção para pegadinhas da banca, exceções jurisprudenciais ou quando este artigo costuma ser cobrado..."
                  value={newPracticalContext}
                  onChange={(e) => setNewPracticalContext(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#CBD5E1] bg-white text-[#0F172A] outline-none focus:border-[#2563EB] resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-2 text-xs font-bold text-[#64748B] hover:text-[#0F172A] cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-sm cursor-pointer"
                >
                  Salvar Dispositivo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
