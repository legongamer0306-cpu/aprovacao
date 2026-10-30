'use client';

import React, { useState } from 'react';
import { 
  Network, 
  Search, 
  Sparkles, 
  Layers, 
  BookOpen, 
  Plus, 
  Filter, 
  ArrowRight, 
  ExternalLink, 
  Eye, 
  Zap, 
  Scale, 
  X,
  CheckCircle2
} from 'lucide-react';
import { MindMap, MindMapNode } from '@/lib/types';
import { MOCK_MIND_MAPS } from '@/lib/mockData';
import { MindMapViewer } from './MindMapViewer';

interface MapasMentaisViewProps {
  onNavigateToFlashcards?: () => void;
  onNavigateToQuestions?: (subject: string) => void;
}

export function MapasMentaisView({
  onNavigateToFlashcards,
  onNavigateToQuestions,
}: MapasMentaisViewProps) {
  const [mindMaps, setMindMaps] = useState<MindMap[]>(MOCK_MIND_MAPS);
  const [selectedMindMapId, setSelectedMindMapId] = useState<string>(MOCK_MIND_MAPS[0]?.id || '');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New map form state
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newTopic, setNewTopic] = useState('');
  const [newMnemonic, setNewMnemonic] = useState('');
  const [newBranchesText, setNewBranchesText] = useState('');

  const subjects = ['all', ...Array.from(new Set(mindMaps.map((m) => m.subject)))];

  const filteredMindMaps = mindMaps.filter((m) => {
    if (selectedSubject !== 'all' && m.subject !== selectedSubject) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const inTitle = m.title.toLowerCase().includes(q);
      const inSummary = m.summary.toLowerCase().includes(q);
      const inTags = m.tags.some((t) => t.toLowerCase().includes(q));
      if (!inTitle && !inSummary && !inTags) return false;
    }
    return true;
  });

  const activeMindMap = mindMaps.find((m) => m.id === selectedMindMapId) || filteredMindMaps[0] || mindMaps[0];

  const handleCreateMindMap = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSubject.trim()) return;

    // Parse branch lines
    const branchLines = newBranchesText
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const children: MindMapNode[] = branchLines.map((line, idx) => {
      const parts = line.split(':');
      const label = parts[0]?.trim() || `Tópico ${idx + 1}`;
      const desc = parts[1]?.trim() || '';
      return {
        id: `node-custom-${Date.now()}-${idx}`,
        label,
        description: desc,
        color: idx % 2 === 0 ? 'purple' : 'blue',
      };
    });

    const newMap: MindMap = {
      id: `mm-custom-${Date.now()}`,
      title: newTitle,
      subject: newSubject,
      topic: newTopic || 'Tema Customizado',
      summary: `Mapa mental sintetizado para fixação e retenção de ${newSubject}.`,
      difficulty: 'Média',
      viewsCount: 1,
      lastUpdated: 'Criado pelo usuário',
      tags: [newSubject, 'Personalizado', 'Mnemônico'],
      rootNode: {
        id: `node-root-${Date.now()}`,
        label: newTitle,
        badge: 'Síntese Estruturada',
        description: `Estrutura de memorização de ${newSubject} - ${newTopic || newTitle}.`,
        mnemonic: newMnemonic || undefined,
        color: 'purple',
        children: children.length > 0 ? children : [
          {
            id: `node-def-${Date.now()}`,
            label: 'Conceito e Fundamento Normativo',
            description: 'Regra matriz constitucional e jurisprudencial aplicável.',
            color: 'blue'
          },
          {
            id: `node-ex-${Date.now()}`,
            label: 'Exceções & Pegadinhas de Prova',
            description: 'Casos divergentes que costumam induzir o candidato ao erro.',
            color: 'rose'
          }
        ]
      }
    };

    setMindMaps((prev) => [newMap, ...prev]);
    setSelectedMindMapId(newMap.id);
    setIsCreateModalOpen(false);
    // Reset form
    setNewTitle('');
    setNewSubject('');
    setNewTopic('');
    setNewMnemonic('');
    setNewBranchesText('');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Header Banner */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 sm:p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
              <Network className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
              Mnemônicos & Síntese Conceitual
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-[#0F172A]">
            Mapas Mentais de Alta Performance
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5 max-w-2xl">
            Esquematizações visuais hierárquicas, dispositivos legais e gatilhos de memorização rápida para gabaritar temas recorrentes de concursos.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onNavigateToFlashcards && (
            <button
              onClick={onNavigateToFlashcards}
              className="px-3.5 py-2 text-xs font-bold rounded-xl border border-[#CBD5E1] bg-white text-[#0F172A] hover:bg-slate-50 transition-all flex items-center gap-1.5 shadow-2xs"
            >
              <Layers className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Ver Flashcards SRS</span>
            </button>
          )}

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-700 text-white transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Criar / Gerar Mapa Mental</span>
          </button>
        </div>
      </div>

      {/* Filter and Selection Row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Subject Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {subjects.map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                selectedSubject === sub
                  ? 'bg-[#0F172A] text-white shadow-2xs'
                  : 'bg-white border border-[#CBD5E1] text-[#475569] hover:bg-slate-50'
              }`}
            >
              {sub === 'all' ? `Todas as Matérias (${mindMaps.length})` : sub}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Filtrar mapas mentais..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-3 py-1.5 text-xs rounded-lg border border-[#CBD5E1] bg-white text-[#0F172A] placeholder:text-[#94A3B8] w-48 sm:w-64 outline-none focus:ring-1 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Mind Maps Horizontal Card Selector Carousel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredMindMaps.map((map) => {
          const isSelected = map.id === activeMindMap?.id;
          return (
            <div
              key={map.id}
              onClick={() => setSelectedMindMapId(map.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer select-none flex flex-col justify-between ${
                isSelected
                  ? 'bg-purple-50/90 border-purple-400 ring-2 ring-purple-500 shadow-md'
                  : 'bg-white border-[#E2E8F0] hover:border-[#CBD5E1] hover:bg-slate-50/70 shadow-2xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    {map.subject}
                  </span>
                  <span className="text-[10px] font-bold text-[#64748B]">
                    {map.difficulty}
                  </span>
                </div>
                <h4 className="text-sm font-extrabold text-[#0F172A] leading-snug line-clamp-1">
                  {map.title}
                </h4>
                <p className="text-xs text-[#475569] mt-1 line-clamp-2 leading-relaxed">
                  {map.summary}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-[#E2E8F0] flex items-center justify-between text-[11px]">
                <span className="text-[#64748B] font-medium truncate max-w-[170px]">
                  {map.rootNode.children?.length || 0} ramos conceituais
                </span>
                <span className={`font-bold ${isSelected ? 'text-purple-700' : 'text-[#2563EB]'}`}>
                  {isSelected ? 'Mapa Ativo' : 'Visualizar →'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Mind Map Interactive Visual Tree */}
      {activeMindMap && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] flex items-center gap-1.5">
              <Network className="w-3.5 h-3.5 text-purple-600" />
              Visualização Interativa do Mapa Selecionado
            </span>
            <span className="text-xs text-[#94A3B8] font-medium">
              Clique nos nós para expandir ou ver detalhes doutrinários
            </span>
          </div>

          <MindMapViewer
            mindMap={activeMindMap}
            onNavigateToQuestions={onNavigateToQuestions}
          />
        </div>
      )}

      {/* Modal: Criar / Gerar Mapa Mental */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-[#CBD5E1] rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-purple-50 text-purple-700 border border-purple-200">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#0F172A]">
                    Criar Novo Mapa Mental
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    Estruture tópicos e gatilhos para fixação de matérias
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-[#64748B]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateMindMap} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-[#0F172A] mb-1">
                  Título do Mapa Mental *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Atos Administrativos: Requisitos e Atributos"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1] bg-white text-[#0F172A] outline-none focus:ring-1 focus:ring-purple-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#0F172A] mb-1">
                    Disciplina / Classe *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Direito Administrativo"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1] bg-white text-[#0F172A] outline-none focus:ring-1 focus:ring-purple-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0F172A] mb-1">
                    Tópico Específico
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Teoria Geral dos Atos"
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1] bg-white text-[#0F172A] outline-none focus:ring-1 focus:ring-purple-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#0F172A] mb-1">
                  Mnemônico / Gatilho de Memória
                </label>
                <input
                  type="text"
                  placeholder="Ex: CO-FI-FO-MO-OB (Competência, Finalidade, Forma, Motivo, Objeto)"
                  value={newMnemonic}
                  onChange={(e) => setNewMnemonic(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1] bg-white text-[#0F172A] outline-none focus:ring-1 focus:ring-purple-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-[#0F172A] mb-1">
                  Ramos e Conceitos (um por linha no formato: Ramo: Descrição)
                </label>
                <textarea
                  rows={4}
                  placeholder={`Requisitos (COM-FI-FOR-M-OB): Competência, Finalidade, Forma, Motivo e Objeto.\nAtributos (PATI): Presunção de legitimidade, Autoexecutoriedade, Tipicidade, Imperatividade.\nExtinção dos Atos: Revogação (conveniência/oportunidade) e Anulação (ilegalidade).`}
                  value={newBranchesText}
                  onChange={(e) => setNewBranchesText(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1] bg-white text-[#0F172A] outline-none focus:ring-1 focus:ring-purple-500 font-mono text-[11px]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold rounded-lg border border-[#CBD5E1] hover:bg-slate-50 text-[#475569]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold rounded-lg bg-purple-600 hover:bg-purple-700 text-white shadow-xs flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Salvar Mapa Mental</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
