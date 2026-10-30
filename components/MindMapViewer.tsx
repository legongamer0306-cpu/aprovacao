'use client';

import React, { useState } from 'react';
import { 
  Network, 
  ChevronRight, 
  ChevronDown, 
  Sparkles, 
  BookOpen, 
  Maximize2, 
  Minimize2, 
  Search, 
  Layers, 
  FileText, 
  Scale, 
  Zap, 
  Share2, 
  Download, 
  Info,
  CheckCircle2,
  ExternalLink,
  HelpCircle,
  Eye,
  X
} from 'lucide-react';
import { MindMap, MindMapNode } from '@/lib/types';

interface MindMapViewerProps {
  mindMap: MindMap;
  compact?: boolean;
  onOpenFullscreen?: () => void;
  onNavigateToQuestions?: (subject: string) => void;
}

export function MindMapViewer({
  mindMap,
  compact = false,
  onOpenFullscreen,
  onNavigateToQuestions,
}: MindMapViewerProps) {
  const [collapsedNodes, setCollapsedNodes] = useState<Record<string, boolean>>({});
  const [selectedNode, setSelectedNode] = useState<MindMapNode | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFullscreenModal, setIsFullscreenModal] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  const toggleCollapse = (nodeId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCollapsedNodes((prev) => ({
      ...prev,
      [nodeId]: !prev[nodeId],
    }));
  };

  const expandAll = () => {
    setCollapsedNodes({});
  };

  const collapseAll = () => {
    const collapsed: Record<string, boolean> = {};
    const traverse = (node: MindMapNode) => {
      if (node.children && node.children.length > 0) {
        collapsed[node.id] = true;
        node.children.forEach(traverse);
      }
    };
    traverse(mindMap.rootNode);
    setCollapsedNodes(collapsed);
  };

  const getColorClasses = (color?: string) => {
    switch (color) {
      case 'purple':
        return {
          border: 'border-purple-300',
          bg: 'bg-purple-50/70',
          hoverBg: 'hover:bg-purple-100/80',
          badge: 'bg-purple-100 text-purple-800 border-purple-200',
          accent: 'text-purple-700',
          line: 'border-purple-300',
          glow: 'shadow-purple-100',
        };
      case 'emerald':
        return {
          border: 'border-emerald-300',
          bg: 'bg-emerald-50/70',
          hoverBg: 'hover:bg-emerald-100/80',
          badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          accent: 'text-emerald-700',
          line: 'border-emerald-300',
          glow: 'shadow-emerald-100',
        };
      case 'amber':
        return {
          border: 'border-amber-300',
          bg: 'bg-amber-50/70',
          hoverBg: 'hover:bg-amber-100/80',
          badge: 'bg-amber-100 text-amber-800 border-amber-200',
          accent: 'text-amber-700',
          line: 'border-amber-300',
          glow: 'shadow-amber-100',
        };
      case 'rose':
        return {
          border: 'border-rose-300',
          bg: 'bg-rose-50/70',
          hoverBg: 'hover:bg-rose-100/80',
          badge: 'bg-rose-100 text-rose-800 border-rose-200',
          accent: 'text-rose-700',
          line: 'border-rose-300',
          glow: 'shadow-rose-100',
        };
      case 'indigo':
        return {
          border: 'border-indigo-300',
          bg: 'bg-indigo-50/70',
          hoverBg: 'hover:bg-indigo-100/80',
          badge: 'bg-indigo-100 text-indigo-800 border-indigo-200',
          accent: 'text-indigo-700',
          line: 'border-indigo-300',
          glow: 'shadow-indigo-100',
        };
      case 'blue':
      default:
        return {
          border: 'border-blue-300',
          bg: 'bg-blue-50/70',
          hoverBg: 'hover:bg-blue-100/80',
          badge: 'bg-blue-100 text-blue-800 border-blue-200',
          accent: 'text-blue-700',
          line: 'border-blue-300',
          glow: 'shadow-blue-100',
        };
    }
  };

  const renderNode = (node: MindMapNode, level: number = 0, isLast: boolean = false) => {
    const isCollapsed = !!collapsedNodes[node.id];
    const hasChildren = node.children && node.children.length > 0;
    const colors = getColorClasses(node.color);
    const matchesSearch = searchQuery && (
      node.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.legalArticle?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div key={node.id} className="relative flex flex-col my-1.5 transition-all">
        {/* Node Container Card */}
        <div
          onClick={() => setSelectedNode(node)}
          className={`group flex items-start justify-between gap-3 p-3 rounded-xl border transition-all cursor-pointer shadow-xs select-none ${
            matchesSearch
              ? 'ring-2 ring-amber-400 bg-amber-50/90 border-amber-300'
              : `${colors.bg} ${colors.border} ${colors.hoverBg}`
          } ${selectedNode?.id === node.id ? 'ring-2 ring-blue-500 shadow-md' : ''}`}
        >
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 mb-1">
              <span className={`text-xs font-bold leading-snug ${colors.accent}`}>
                {node.label}
              </span>
              {node.badge && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${colors.badge}`}>
                  {node.badge}
                </span>
              )}
            </div>

            {node.description && (
              <p className="text-[11px] text-[#475569] leading-relaxed line-clamp-2">
                {node.description}
              </p>
            )}

            {node.legalArticle && (
              <div className="mt-1.5 flex items-center gap-1 text-[10px] font-mono text-[#0369A1] bg-white/70 px-2 py-0.5 rounded border border-[#BAE6FD] w-fit">
                <Scale className="w-3 h-3 text-[#0284C7] shrink-0" />
                <span className="truncate">{node.legalArticle}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0 pt-0.5">
            {hasChildren && (
              <button
                onClick={(e) => toggleCollapse(node.id, e)}
                className="p-1 rounded-md bg-white border border-[#CBD5E1] text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50 transition-colors shadow-2xs"
                title={isCollapsed ? 'Expandir ramos' : 'Recolher ramos'}
              >
                {isCollapsed ? (
                  <ChevronRight className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedNode(node);
              }}
              className="p-1 rounded-md text-[#94A3B8] group-hover:text-[#0F172A] hover:bg-white transition-colors"
              title="Ver detalhes doutrinários"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Children Branches */}
        {hasChildren && !isCollapsed && (
          <div className="ml-4 sm:ml-6 pl-3 sm:pl-4 border-l-2 border-dashed border-[#CBD5E1] mt-1 space-y-1.5 animate-in fade-in duration-200">
            {node.children!.map((child, idx) =>
              renderNode(child, level + 1, idx === node.children!.length - 1)
            )}
          </div>
        )}
      </div>
    );
  };

  const content = (
    <div className="space-y-4">
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-50 text-purple-700 border border-purple-200">
            <Network className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-[#0F172A] flex items-center gap-1.5">
              <span>{mindMap.title}</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                {mindMap.subject}
              </span>
            </h3>
            <p className="text-[11px] text-[#64748B] line-clamp-1">
              {mindMap.summary}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Quick Search in nodes */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Buscar no mapa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-2.5 py-1 text-xs rounded-lg border border-[#CBD5E1] bg-white text-[#0F172A] placeholder:text-[#94A3B8] w-32 sm:w-44 focus:w-48 transition-all outline-none focus:ring-1 focus:ring-purple-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0F172A]"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <button
            onClick={expandAll}
            className="px-2 py-1 text-[11px] font-bold rounded-md bg-[#F8FAFC] border border-[#CBD5E1] text-[#475569] hover:text-[#0F172A] hover:bg-slate-100 transition-colors"
            title="Expandir todos os ramos"
          >
            Expandir
          </button>
          <button
            onClick={collapseAll}
            className="px-2 py-1 text-[11px] font-bold rounded-md bg-[#F8FAFC] border border-[#CBD5E1] text-[#475569] hover:text-[#0F172A] hover:bg-slate-100 transition-colors"
            title="Recolher ramos"
          >
            Recolher
          </button>

          <button
            onClick={() => setIsFullscreenModal(true)}
            className="p-1.5 rounded-lg border border-[#CBD5E1] bg-white hover:bg-slate-50 text-[#475569] hover:text-[#0F172A] transition-colors"
            title="Abrir em tela cheia"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Mnemonic Banner if available */}
      {mindMap.rootNode.mnemonic && (
        <div className="p-2.5 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="text-[#78350F] font-bold">Gatilho Mnemônico de Prova:</span>
            <span className="font-mono font-bold text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded">
              {mindMap.rootNode.mnemonic}
            </span>
          </div>
          <span className="text-[10px] text-amber-800 font-semibold hidden sm:inline">
            Memorização Rápida
          </span>
        </div>
      )}

      {/* Root Node Display & Tree Visualizer */}
      <div className="bg-[#F8FAFC] p-3 sm:p-5 rounded-xl border border-[#E2E8F0] overflow-x-auto">
        {/* Central Core Concept */}
        <div className="mb-4 p-4 rounded-xl bg-white border-2 border-purple-400 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black shrink-0 shadow-xs">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
                  Conceito Central
                </span>
                {mindMap.rootNode.badge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                    {mindMap.rootNode.badge}
                  </span>
                )}
              </div>
              <h4 className="text-sm sm:text-base font-extrabold text-[#0F172A]">
                {mindMap.rootNode.label}
              </h4>
              {mindMap.rootNode.description && (
                <p className="text-xs text-[#475569] mt-0.5">
                  {mindMap.rootNode.description}
                </p>
              )}
            </div>
          </div>

          {mindMap.rootNode.legalArticle && (
            <div className="shrink-0 text-left sm:text-right">
              <div className="text-[10px] text-[#64748B] font-bold uppercase">Fundamento Legal</div>
              <div className="text-xs font-mono font-bold text-purple-900 bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-lg">
                {mindMap.rootNode.legalArticle}
              </div>
            </div>
          )}
        </div>

        {/* Tree Branches */}
        <div className="space-y-2">
          {mindMap.rootNode.children?.map((child, idx) =>
            renderNode(child, 1, idx === mindMap.rootNode.children!.length - 1)
          )}
        </div>
      </div>

      {/* Tags and Metadata Footer */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-[11px] text-[#64748B]">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-semibold text-[#0F172A]">Palavras-chave:</span>
          {mindMap.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-md bg-white border border-[#CBD5E1] text-[#475569] font-medium"
            >
              #{tag}
            </span>
          ))}
        </div>

        {onNavigateToQuestions && (
          <button
            onClick={() => onNavigateToQuestions(mindMap.subject)}
            className="flex items-center gap-1 font-bold text-[#2563EB] hover:underline"
          >
            <span>Resolver questões deste mapa</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs transition-all">
        {content}
      </div>

      {/* Selected Node Details Drawer/Modal */}
      {selectedNode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-[#CBD5E1] rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-50 text-[#2563EB]">
                  <Scale className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                    Detalhamento Doutrinário & Jurisprudencial
                  </div>
                  <h3 className="text-base font-extrabold text-[#0F172A]">
                    {selectedNode.label}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="p-1.5 rounded-lg hover:bg-[#F1F5F9] text-[#64748B]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {selectedNode.badge && (
              <span className="inline-block px-2.5 py-1 text-xs font-bold rounded-md bg-purple-50 text-purple-700 border border-purple-200">
                {selectedNode.badge}
              </span>
            )}

            {selectedNode.description && (
              <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0] text-xs sm:text-sm text-[#1E293B] leading-relaxed">
                {selectedNode.description}
              </div>
            )}

            {selectedNode.legalArticle && (
              <div className="p-3 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] text-xs text-[#1E3A8A]">
                <strong>Dispositivo / Precedente:</strong>
                <div className="font-mono mt-1 font-semibold">{selectedNode.legalArticle}</div>
              </div>
            )}

            {selectedNode.mnemonic && (
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900">
                <strong>Mnemônico Recomendado:</strong>
                <div className="font-mono mt-1 font-bold">{selectedNode.mnemonic}</div>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedNode(null)}
                className="px-4 py-2 text-xs font-bold rounded-lg bg-[#0F172A] text-white hover:bg-[#1E293B]"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Interactive View Modal */}
      {isFullscreenModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-md flex flex-col p-2 sm:p-6 animate-in fade-in">
          <div className="bg-white rounded-2xl flex-1 flex flex-col overflow-hidden shadow-2xl border border-white/20">
            {/* Modal Header */}
            <div className="p-4 px-6 border-b border-[#E2E8F0] flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-purple-600 text-white">
                  <Network className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-purple-700">
                    Modo Imersivo • Mapa Mental Sintético
                  </div>
                  <h2 className="text-base sm:text-lg font-black text-[#0F172A]">
                    {mindMap.title}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsFullscreenModal(false)}
                  className="p-2 rounded-lg bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0F172A] font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Minimize2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Fechar Tela Cheia</span>
                </button>
              </div>
            </div>

            {/* Scrollable Modal Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#F8FAFC]">
              <div className="max-w-4xl mx-auto space-y-6">
                {content}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
