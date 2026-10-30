'use client';

import React, { useState } from 'react';
import { 
  X, 
  Check, 
  GraduationCap, 
  Calendar, 
  DollarSign, 
  Plus, 
  Trash2, 
  AlertTriangle,
  FileText,
  Sparkles
} from 'lucide-react';
import { ExamTarget, ManagedUser } from '@/lib/types';

interface TargetExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTarget: ExamTarget;
  targets: ExamTarget[];
  onSelectTarget: (target: ExamTarget) => void;
  onAddTarget: (newTarget: ExamTarget) => void;
  onDeleteTarget: (targetId: string) => void;
  onOpenPasteEdital: () => void;
  currentStudent?: ManagedUser | null;
  onEnrollCourse?: (courseId: string) => void;
  onUnenrollCourse?: (courseId: string) => void;
}

export function TargetExamModal({
  isOpen,
  onClose,
  currentTarget,
  targets,
  onSelectTarget,
  onAddTarget,
  onDeleteTarget,
  onOpenPasteEdital,
  currentStudent,
  onEnrollCourse,
  onUnenrollCourse,
}: TargetExamModalProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [targetToDelete, setTargetToDelete] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [enrolledSuccessMsg, setEnrolledSuccessMsg] = useState<string | null>(null);

  // Form state for creating a custom target
  const [newName, setNewName] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newAgency, setNewAgency] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newSalary, setNewSalary] = useState('');
  const [newExamDate, setNewExamDate] = useState('');
  const [newDaysRemaining, setNewDaysRemaining] = useState(60);

  if (!isOpen) return null;

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newRole.trim()) return;

    const newTarget: ExamTarget = {
      id: `target-${Date.now()}`,
      name: newName.trim(),
      code: newCode.trim() || `${newAgency.slice(0, 4).toUpperCase()} 2026`,
      agency: newAgency.trim() || 'Comissão Organizadora',
      role: newRole.trim(),
      totalSeats: 100,
      salary: newSalary.trim() || 'A definir',
      examDate: newExamDate.trim() || 'A definir',
      daysRemaining: Number(newDaysRemaining) || 60,
      progressPercent: 0,
      isCustom: true,
      isOpenForEnrollment: true,
      enrolledStudentIds: currentStudent ? [currentStudent.id] : [],
      enrolledStudentsCount: 1,
    };

    onAddTarget(newTarget);
    setIsCreating(false);
    setNewName('');
    setNewCode('');
    setNewAgency('');
    setNewRole('');
    setNewSalary('');
    setNewExamDate('');
    setNewDaysRemaining(60);
  };

  const confirmDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (targets.length <= 1) {
      alert('Você precisa manter ao menos um foco alvo cadastrado.');
      return;
    }
    setTargetToDelete(id);
  };

  const handleExecuteDelete = () => {
    if (targetToDelete) {
      onDeleteTarget(targetToDelete);
      setTargetToDelete(null);
    }
  };

  // Check if student is enrolled in a course
  const isStudentEnrolled = (exam: ExamTarget) => {
    if (!currentStudent) return false;
    if (exam.enrolledStudentIds && exam.enrolledStudentIds.includes(currentStudent.id)) {
      return true;
    }
    // Also match if user's current targetExam matches this course
    if (currentStudent.targetExam && (
      currentStudent.targetExam.toLowerCase().includes(exam.code.toLowerCase()) ||
      exam.name.toLowerCase().includes(currentStudent.targetExam.toLowerCase())
    )) {
      return true;
    }
    return false;
  };

  const handleEnrollClick = (e: React.MouseEvent, exam: ExamTarget) => {
    e.stopPropagation();
    if (onEnrollCourse) {
      onEnrollCourse(exam.id);
    }
    onSelectTarget(exam);
    setEnrolledSuccessMsg(`Matrícula confirmada no curso: ${exam.name}! O foco de estudos foi atualizado.`);
    setTimeout(() => setEnrolledSuccessMsg(null), 3500);
  };

  const filteredTargets = targets.filter((exam) => {
    const matchesSearch = 
      exam.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      exam.code.toLowerCase().includes(searchFilter.toLowerCase()) ||
      exam.agency.toLowerCase().includes(searchFilter.toLowerCase()) ||
      exam.role.toLowerCase().includes(searchFilter.toLowerCase());

    const matchesCategory = 
      categoryFilter === 'all' || 
      exam.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-white rounded-3xl border border-[#CBD5E1] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between bg-gradient-to-r from-[#0F172A] to-[#1E293B] text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white">
              <GraduationCap className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white">
                  Catálogo de Cursos & Inscrições Oficiais
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/30 text-blue-200 border border-blue-400/30 font-bold">
                  {targets.length} Cursos Disponíveis
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Cursos criados pela coordenação pedagógica. Inscreva-se ou alterne seu foco de estudos.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button 
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Success Banner */}
        {enrolledSuccessMsg && (
          <div className="p-3 bg-emerald-50 border-b border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{enrolledSuccessMsg}</span>
          </div>
        )}

        {/* Filter & Search Bar */}
        <div className="p-4 bg-[#F8FAFC] border-b border-[#E2E8F0] space-y-2.5">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Buscar curso por órgão, cargo, banca ou sigla..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl border border-[#CBD5E1] bg-white text-xs text-[#0F172A] placeholder-[#94A3B8] outline-none focus:border-blue-600"
            />
            {!isCreating && (
              <button
                onClick={() => setIsCreating(true)}
                className="px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-all border border-blue-200 cursor-pointer shrink-0"
              >
                + Foco Personalizado
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {['all', 'Fiscal & Controle', 'Carreira Jurídica', 'Policial', 'Tribunais'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer shrink-0 ${
                  categoryFilter === cat
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white border border-[#CBD5E1] text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                {cat === 'all' ? 'Todos os Cursos' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 space-y-3 flex-1 overflow-y-auto">
          {/* Deletion Warning Prompt */}
          {targetToDelete && (
            <div className="p-4 rounded-xl bg-[#FEF2F2] border border-[#FECACA] flex items-start justify-between gap-3 animate-in fade-in">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-[#DC2626] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-extrabold text-[#991B1B]">
                    Excluir este foco alvo?
                  </h4>
                  <p className="text-xs text-[#7F1D1D] mt-0.5">
                    O progresso e os cadernos vinculados a este exame serão removidos.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setTargetToDelete(null)}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg border border-[#CBD5E1] bg-white text-[#475569] hover:bg-[#F1F5F9]"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleExecuteDelete}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg bg-[#DC2626] hover:bg-[#B91C1C] text-white shadow-2xs"
                >
                  Confirmar Exclusão
                </button>
              </div>
            </div>
          )}

          {/* Form to Add New Custom Target */}
          {isCreating ? (
            <form onSubmit={handleCreateSubmit} className="p-4 rounded-2xl border border-blue-200 bg-blue-50/40 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-blue-200">
                <span className="text-xs font-black text-blue-950 flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5 text-blue-600" /> Cadastrar Foco Personalizado
                </span>
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800"
                >
                  Voltar ao Catálogo
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-[#475569] mb-1">Nome do Órgão / Concurso *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Polícia Federal"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-[#CBD5E1] bg-white text-[#0F172A] outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#475569] mb-1">Sigla / Código</label>
                  <input
                    type="text"
                    placeholder="Ex: PF 2026"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-[#CBD5E1] bg-white text-[#0F172A] outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#475569] mb-1">Cargo *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Agente ou Perito"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-[#CBD5E1] bg-white text-[#0F172A] outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#475569] mb-1">Banca</label>
                  <input
                    type="text"
                    placeholder="Ex: Cebraspe ou FGV"
                    value={newAgency}
                    onChange={(e) => setNewAgency(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-[#CBD5E1] bg-white text-[#0F172A] outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#475569] mb-1">Remuneração</label>
                  <input
                    type="text"
                    placeholder="Ex: R$ 14.711,34"
                    value={newSalary}
                    onChange={(e) => setNewSalary(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-[#CBD5E1] bg-white text-[#0F172A] outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#475569] mb-1">Data da Prova</label>
                  <input
                    type="text"
                    placeholder="Ex: 20 de Dezembro de 2026"
                    value={newExamDate}
                    onChange={(e) => setNewExamDate(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-[#CBD5E1] bg-white text-[#0F172A] outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-blue-200">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Salvar Foco
                </button>
              </div>
            </form>
          ) : (
            /* Target & Course List */
            <div className="space-y-3">
              {filteredTargets.map((exam) => {
                const isSelected = exam.id === currentTarget.id;
                const isEnrolled = isStudentEnrolled(exam);
                const isOpen = exam.isOpenForEnrollment !== false;

                return (
                  <div
                    key={exam.id}
                    onClick={() => {
                      onSelectTarget(exam);
                      onClose();
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2.5 relative group ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/50 ring-2 ring-blue-500/30 shadow-xs'
                        : 'border-[#E2E8F0] hover:border-[#CBD5E1] bg-white hover:bg-[#F8FAFC]'
                    }`}
                  >
                    {/* Top Row: Code, Name, Badges, Status */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap min-w-0">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-lg bg-[#0F172A] text-white">
                          {exam.code}
                        </span>
                        <h4 className="text-sm font-extrabold text-[#0F172A]">
                          {exam.name}
                        </h4>

                        {/* Enrollment Status Badge */}
                        {isOpen ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Inscrições Abertas
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-300">
                            Inscrições Encerradas
                          </span>
                        )}

                        {exam.category && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                            {exam.category}
                          </span>
                        )}
                      </div>

                      {/* Right Action: Matriculado / Inscrever-se / Ativo */}
                      <div className="flex items-center gap-2 shrink-0">
                        {isEnrolled ? (
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-emerald-600 text-white flex items-center gap-1 shadow-xs">
                              <Check className="w-3 h-3 stroke-[3]" /> Matriculado
                            </span>
                            {isSelected ? (
                              <span className="text-xs font-black text-blue-700 flex items-center gap-1">
                                • Foco Ativo
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onSelectTarget(exam);
                                  onClose();
                                }}
                                className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                              >
                                Ativar Estudo
                              </button>
                            )}
                          </div>
                        ) : isOpen ? (
                          <button
                            type="button"
                            onClick={(e) => handleEnrollClick(e, exam)}
                            className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow-xs flex items-center gap-1.5 cursor-pointer transition-all transform hover:scale-102"
                          >
                            <GraduationCap className="w-3.5 h-3.5" />
                            <span>Inscrever-se no Curso</span>
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400 font-bold">
                            Encerrado
                          </span>
                        )}

                        {exam.isCustom && (
                          <button
                            type="button"
                            onClick={(e) => confirmDelete(e, exam.id)}
                            title="Excluir este foco personalizado"
                            className="p-1 rounded-md text-slate-400 hover:text-rose-600 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Course Description */}
                    {exam.description && (
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {exam.description}
                      </p>
                    )}

                    {/* Metadata strip: Cargo, Banca, Instrutor, Vagas, Salário, Data */}
                    <div className="flex flex-wrap items-center justify-between gap-y-2 gap-x-4 text-xs text-[#64748B] pt-2 border-t border-[#E2E8F0]">
                      <div className="flex flex-wrap items-center gap-3">
                        <span>
                          Cargo: <strong className="text-[#0F172A]">{exam.role}</strong>
                        </span>
                        <span>•</span>
                        <span>
                          Banca: <strong className="text-[#0F172A]">{exam.agency}</strong>
                        </span>
                        {exam.workloadHours && (
                          <>
                            <span>•</span>
                            <span>Carga: <strong className="text-[#0F172A]">{exam.workloadHours}h</strong></span>
                          </>
                        )}
                        {exam.instructor && (
                          <>
                            <span>•</span>
                            <span>Coord: <strong className="text-[#0F172A]">{exam.instructor}</strong></span>
                          </>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 font-bold text-emerald-700">
                          <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                          {exam.salary}
                        </span>
                        <span className="flex items-center gap-1 font-bold text-blue-700">
                          <Calendar className="w-3.5 h-3.5 text-blue-600" />
                          {exam.examDate}
                        </span>
                        <span className="font-bold text-amber-600 tabular-nums">
                          {exam.daysRemaining} dias
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredTargets.length === 0 && (
                <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                  Nenhum curso encontrado para os filtros selecionados.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onOpenPasteEdital();
            }}
            className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            Personalizar Edital com Matérias Oficiais
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Fechar Catálogo
          </button>
        </div>
      </div>
    </div>
  );
}
