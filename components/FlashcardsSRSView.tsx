'use client';

import React, { useState } from 'react';
import { 
  RotateCw, 
  Check, 
  X, 
  Sparkles, 
  BrainCircuit, 
  Layers, 
  Clock, 
  ArrowRight, 
  BookMarked,
  HelpCircle,
  ThumbsUp,
  ThumbsDown,
  Scale,
  Network
} from 'lucide-react';
import { Flashcard, MindMap } from '@/lib/types';
import { MOCK_MIND_MAPS } from '@/lib/mockData';
import { MindMapViewer } from './MindMapViewer';

interface FlashcardsSRSViewProps {
  flashcards: Flashcard[];
  onNavigateToMapas?: () => void;
  onNavigateToQuestions?: (subject: string) => void;
}

export function FlashcardsSRSView({ 
  flashcards, 
  onNavigateToMapas,
  onNavigateToQuestions 
}: FlashcardsSRSViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [selectedDeck, setSelectedDeck] = useState<string>('all');
  const [selectedMindMapId, setSelectedMindMapId] = useState<string | null>(null);

  const decks = ['all', ...Array.from(new Set(flashcards.map(f => f.subject)))];

  const filteredCards = flashcards.filter(f => 
    selectedDeck === 'all' || f.subject === selectedDeck
  );

  const currentCard = filteredCards[currentIndex] || flashcards[0];

  // Find related mind maps for the current card
  const matchingMindMaps = MOCK_MIND_MAPS.filter(
    (mm) => mm.flashcardId === currentCard.id || mm.subject.toLowerCase() === currentCard.subject.toLowerCase()
  );

  const activeMindMap: MindMap = (selectedMindMapId && MOCK_MIND_MAPS.find(m => m.id === selectedMindMapId)) ||
    matchingMindMaps[0] ||
    MOCK_MIND_MAPS[0];

  const handleNextCard = (rating: 'hard' | 'good' | 'easy') => {
    setIsFlipped(false);
    setReviewedCount(prev => prev + 1);
    setSelectedMindMapId(null);
    if (currentIndex < filteredCards.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0); // loop or finish session
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* SRS Session Header */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-md bg-[#EFF6FF] text-[#2563EB]">
              <BrainCircuit className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
              Repetição Espaçada (SRS - Anki Style)
            </span>
          </div>
          <h2 className="text-lg font-extrabold text-[#0F172A]">
            Ciclo Ativo de Retenção de Longo Prazo
          </h2>
          <p className="text-xs text-[#475569]">
            Revisão ativa baseada no algoritmo SM-2 para consolidação de jurisprudência e normas.
          </p>
        </div>

        {/* Filter Decks */}
        <div className="flex items-center gap-3">
          <select
            value={selectedDeck}
            onChange={(e) => {
              setSelectedDeck(e.target.value);
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#CBD5E1] bg-white text-[#0F172A] outline-none cursor-pointer"
          >
            <option value="all">Todos os Baralhos ({flashcards.length})</option>
            {decks.filter(d => d !== 'all').map(deck => (
              <option key={deck} value={deck}>{deck}</option>
            ))}
          </select>

          <div className="px-3 py-1.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-bold tabular-nums text-[#0F172A]">
            {currentIndex + 1} de {filteredCards.length}
          </div>
        </div>
      </div>

      {/* Main Flashcard Interactive Card */}
      <div className="relative min-h-[360px] flex flex-col">
        <div 
          onClick={() => setIsFlipped(!isFlipped)}
          className={`flex-1 rounded-2xl border transition-all duration-300 p-6 md:p-8 flex flex-col justify-between cursor-pointer select-none shadow-md ${
            isFlipped 
              ? 'bg-[#F8FAFC] border-[#CBD5E1]' 
              : 'bg-white border-[#E2E8F0] hover:border-[#94A3B8]'
          }`}
        >
          {/* Top Bar of the Card */}
          <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#EFF6FF] text-[#2563EB]">
                {currentCard.subject}
              </span>
              <span className="text-xs text-[#64748B] font-medium truncate max-w-[200px]">
                {currentCard.deckName}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-[#64748B]">
                Próx: <strong className="text-[#0F172A]">{currentCard.nextReview}</strong>
              </span>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                currentCard.difficulty === 'Fácil' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
              }`}>
                {currentCard.difficulty}
              </span>
            </div>
          </div>

          {/* Core Body Content */}
          <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
            {!isFlipped ? (
              <>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                  Frente • Gatilho Mnemônico
                </span>
                <p className="text-base md:text-xl font-bold text-[#0F172A] max-w-xl leading-relaxed">
                  {currentCard.front}
                </p>
                <div className="pt-4 flex items-center gap-1.5 text-xs text-[#64748B] font-medium">
                  <RotateCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
                  Clique para virar e conferir a fundamentação
                </div>
              </>
            ) : (
              <div className="text-left w-full space-y-4 animate-in fade-in-50 duration-200">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#10B981] flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Verso • Resposta & Dispositivo Legal
                </span>
                <div className="text-sm md:text-base text-[#1E293B] font-medium leading-relaxed whitespace-pre-line bg-white p-4 rounded-xl border border-[#E2E8F0]">
                  {currentCard.back}
                </div>
                {currentCard.legalRef && (
                  <div className="p-3 bg-[#EFF6FF] rounded-lg border border-[#BFDBFE] text-xs font-mono text-[#1E3A8A]">
                    <strong>Referência:</strong> {currentCard.legalRef}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Card Footer */}
          <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#64748B]">
            <span>Taxa de Domínio: <strong className="text-[#0F172A] tabular-nums">{currentCard.masteryPercent}%</strong></span>
            <span>Espaçamento atual: {currentCard.intervalDays} dias</span>
          </div>
        </div>

        {/* SRS Rating Control Bar (Revealed when card is flipped) */}
        {isFlipped ? (
          <div className="mt-4 grid grid-cols-3 gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <button
              onClick={() => handleNextCard('hard')}
              className="p-3 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-800 font-bold text-xs flex flex-col items-center gap-1 transition-all cursor-pointer shadow-2xs"
            >
              <div className="flex items-center gap-1">
                <ThumbsDown className="w-3.5 h-3.5" />
                <span>Difícil / Errei</span>
              </div>
              <span className="text-[10px] font-normal text-red-600">Rever em 1 dia</span>
            </button>

            <button
              onClick={() => handleNextCard('good')}
              className="p-3 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-xs flex flex-col items-center gap-1 transition-all cursor-pointer shadow-2xs"
            >
              <div className="flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>Bom / Acertei</span>
              </div>
              <span className="text-[10px] font-normal text-blue-600">Rever em 4 dias</span>
            </button>

            <button
              onClick={() => handleNextCard('easy')}
              className="p-3 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs flex flex-col items-center gap-1 transition-all cursor-pointer shadow-2xs"
            >
              <div className="flex items-center gap-1">
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>Fácil / Dominado</span>
              </div>
              <span className="text-[10px] font-normal text-emerald-600">Rever em 8 dias</span>
            </button>
          </div>
        ) : (
          <div className="mt-4 text-center">
            <button
              onClick={() => setIsFlipped(true)}
              className="px-6 py-2.5 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold text-xs transition-all shadow-sm cursor-pointer"
            >
              Mostrar Resposta (Espaço)
            </button>
          </div>
        )}
      </div>

      {/* SEÇÃO ABAIXO DO FLASH CARD: MAPAS MENTAIS */}
      <div className="pt-2 space-y-4">
        <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-2xl p-4 sm:p-5 text-white shadow-md flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-purple-300 font-bold border border-white/20 shrink-0">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300">
                  Esquematização Visual • Abaixo do Flashcard
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.2 rounded-full font-bold">
                  Fixação Cognitiva
                </span>
              </div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <span>Mapas Mentais do Tema:</span>
                <span className="text-purple-200 underline decoration-purple-400 font-bold">
                  {currentCard.subject}
                </span>
              </h3>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {matchingMindMaps.map((mm) => (
              <button
                key={mm.id}
                onClick={() => setSelectedMindMapId(mm.id)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeMindMap.id === mm.id
                    ? 'bg-white text-purple-900 shadow-sm'
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
                }`}
              >
                {mm.title}
              </button>
            ))}

            {onNavigateToMapas && (
              <button
                onClick={onNavigateToMapas}
                className="px-3 py-1 text-xs font-bold rounded-lg bg-purple-500 hover:bg-purple-400 text-white transition-all flex items-center gap-1.5 shadow-xs cursor-pointer ml-1"
              >
                <span>Ver Todos os Mapas</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Visual Mind Map Tree Viewer */}
        <MindMapViewer
          mindMap={activeMindMap}
          compact
          onNavigateToQuestions={onNavigateToQuestions}
        />
      </div>
    </div>
  );
}

