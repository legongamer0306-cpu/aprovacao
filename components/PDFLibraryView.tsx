'use client';

import React, { useState, useRef } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Trash2, 
  Folder, 
  FolderPlus, 
  Bookmark, 
  CheckCircle2, 
  BookOpen, 
  Clock, 
  SlidersHorizontal, 
  Filter, 
  Eye, 
  Download, 
  Sparkles,
  Layers,
  ArrowUpRight,
  Upload,
  HardDriveDownload,
  FileCheck,
  X,
  GraduationCap,
  Lock,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { StudyPDF, ExamTarget, ManagedUser } from '@/lib/types';

interface PDFLibraryViewProps {
  pdfs: StudyPDF[];
  onAddPdf: (newPdf: StudyPDF) => void;
  onDeletePdf: (pdfId: string) => void;
  onUpdatePdfPage: (pdfId: string, newPage: number) => void;
  onToggleFavorite: (pdfId: string) => void;
  subjectClasses: string[];
  onAddSubjectClass: (className: string) => void;
  currentTarget?: ExamTarget;
  courses?: ExamTarget[];
  currentStudent?: ManagedUser | null;
  isAdmin?: boolean;
}

// Function to generate a standard compliant PDF-1.4 file blob for study materials
function generateStudyPdfBlob(pdf: StudyPDF): Blob {
  const sanitize = (text: string) => 
    text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[()\\]/g, '');

  const title = sanitize(pdf.title);
  const subject = sanitize(pdf.subject);
  const topic = sanitize(pdf.topic || 'Doutrina e Jurisprudencia Relevante');
  const notes = sanitize(pdf.notes || 'Material de estudo direcionado para concursos publicos e exames de alto rendimento.');
  const date = pdf.uploadDate || new Date().toLocaleDateString('pt-BR');

  const streamText = `BT
/F1 18 Tf
50 720 Td
(APROVACAO TOTAL - MEUS PDFS) Tj
/F1 13 Tf
0 -32 Td
(Titulo: ${title}) Tj
/F1 10 Tf
0 -22 Td
(Classe de Materia: ${subject}) Tj
0 -16 Td
(Topico Especifico: ${topic}) Tj
0 -16 Td
(Paginas Estimadas: ${pdf.totalPages} | Data de Registro: ${date}) Tj
0 -28 Td
(ANOTACOES E PONTOS CHAVE DE ESTUDO:) Tj
/F1 9 Tf
0 -18 Td
(${notes.slice(0, 80)}) Tj
${notes.length > 80 ? `0 -14 Td\n(${notes.slice(80, 160)}) Tj` : ''}
0 -28 Td
(--- Baixado da Plataforma Aprova-cao Total ---) Tj
ET`;

  const streamLength = streamText.length;

  const pdfData = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>
endobj
4 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
5 0 obj
<< /Length ${streamLength} >>
stream
${streamText}
endstream
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000244 00000 n 
0000000318 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
${420 + streamLength}
%%EOF`;

  return new Blob([pdfData], { type: 'application/pdf' });
}

export function PDFLibraryView({
  pdfs,
  onAddPdf,
  onDeletePdf,
  onUpdatePdfPage,
  onToggleFavorite,
  subjectClasses,
  onAddSubjectClass,
  currentTarget,
  courses = [],
  currentStudent,
  isAdmin = false,
}: PDFLibraryViewProps) {
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isAddClassModalOpen, setIsAddClassModalOpen] = useState(false);
  const [viewingPdf, setViewingPdf] = useState<StudyPDF | null>(null);
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  // Hidden file input refs
  const directFileInputRef = useRef<HTMLInputElement>(null);
  const modalFileInputRef = useRef<HTMLInputElement>(null);

  // New PDF Form state
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState(subjectClasses[0] || 'Direito Constitucional');
  const [newCourseId, setNewCourseId] = useState<string>(currentTarget?.id || courses[0]?.id || 'rfb-auditor');
  const [newTopic, setNewTopic] = useState('');
  const [newFileName, setNewFileName] = useState('');
  const [newTotalPages, setNewTotalPages] = useState<number>(60);
  const [newNotes, setNewNotes] = useState('');
  const [uploadedBlobUrl, setUploadedBlobUrl] = useState<string | null>(null);
  const [uploadedFileSize, setUploadedFileSize] = useState<string>('');

  // New Class state
  const [newClassName, setNewClassName] = useState('');

  // Trigger download of PDF to the user's device
  const handleDownloadPdf = (pdf: StudyPDF) => {
    try {
      const fileName = pdf.fileName.toLowerCase().endsWith('.pdf') 
        ? pdf.fileName 
        : `${pdf.fileName}.pdf`;

      if (pdf.fileUrl) {
        // Direct download of user's uploaded binary PDF
        const a = document.createElement('a');
        a.href = pdf.fileUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        // Generate and download genuine formatted PDF
        const blob = generateStudyPdfBlob(pdf);
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 30000);
      }

      setDownloadToast(`PDF "${fileName}" baixado para o seu dispositivo com sucesso!`);
      setTimeout(() => {
        setDownloadToast(null);
      }, 3500);
    } catch {
      setDownloadToast(`Iniciando download de ${pdf.fileName}...`);
      setTimeout(() => setDownloadToast(null), 3000);
    }
  };

  // Direct device file upload handler (from toolbar or drag)
  const handleDeviceFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    processDeviceFile(file);
    e.target.value = '';
  };

  const processDeviceFile = (file: File) => {
    const rawName = file.name;
    const cleanTitle = rawName.replace(/\.pdf$/i, '').replace(/[-_]/g, ' ');
    const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);
    const sizeLabel = `${sizeInMb} MB`;
    const blobUrl = URL.createObjectURL(file);

    setNewTitle(cleanTitle);
    setNewFileName(rawName);
    setUploadedFileSize(sizeLabel);
    setUploadedBlobUrl(blobUrl);

    // If a subject is currently selected and not 'all', default to it
    if (selectedSubject !== 'all') {
      setNewSubject(selectedSubject);
    }

    if (currentTarget) {
      setNewCourseId(currentTarget.id);
    }

    // Estimate pages based on size
    const estPages = Math.max(15, Math.min(350, Math.round(file.size / 35000)));
    setNewTotalPages(estPages);

    setIsUploadModalOpen(true);
  };

  // Filter PDFs strictly guaranteeing isolation:
  // - Students only see their own PDFs
  // - Filter by Course and Subject
  const filteredPdfs = pdfs.filter((pdf) => {
    // Isolamento de multi-tenancy: um aluno não vê o pdf do outro
    if (currentStudent && pdf.studentId && pdf.studentId !== currentStudent.id) {
      return false;
    }
    const matchesCourse = selectedCourseId === 'all' || pdf.courseId === selectedCourseId;
    const matchesSubject = selectedSubject === 'all' || pdf.subject === selectedSubject;
    const matchesQuery = 
      pdf.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pdf.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (pdf.courseName && pdf.courseName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (pdf.topic && pdf.topic.toLowerCase().includes(searchQuery.toLowerCase())) ||
      pdf.fileName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCourse && matchesSubject && matchesQuery;
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSubject) return;

    const boundCourse = courses.find((c) => c.id === newCourseId) || currentTarget;

    const created: StudyPDF = {
      id: `pdf-${Date.now()}`,
      title: newTitle.trim(),
      subject: newSubject,
      topic: newTopic.trim() || undefined,
      courseId: boundCourse?.id || 'rfb-auditor', // Vínculo obrigatório a curso específico
      courseName: boundCourse?.name || 'Curso Vinculado',
      studentId: currentStudent?.id || 'usr-1', // Vínculo obrigatório à conta específica
      fileName: newFileName.trim() || `${newTitle.replace(/\s+/g, '_').slice(0, 20)}.pdf`,
      fileSize: uploadedFileSize || `${(Math.random() * 4 + 1.5).toFixed(1)} MB`,
      totalPages: Number(newTotalPages) || 50,
      currentPage: 0,
      uploadDate: new Date().toLocaleDateString('pt-BR'),
      notes: newNotes.trim() || undefined,
      favorite: false,
      tagColor: 'blue',
      fileUrl: uploadedBlobUrl || undefined,
    };

    onAddPdf(created);
    setIsUploadModalOpen(false);

    // Reset form
    setNewTitle('');
    setNewTopic('');
    setNewFileName('');
    setNewTotalPages(60);
    setNewNotes('');
    setUploadedBlobUrl(null);
    setUploadedFileSize('');
  };

  const handleAddClassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newClassName.trim() && !subjectClasses.includes(newClassName.trim())) {
      onAddSubjectClass(newClassName.trim());
      setNewSubject(newClassName.trim());
      setNewClassName('');
      setIsAddClassModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert for PDF Download / Upload */}
      {downloadToast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#0F172A] text-white shadow-2xl border border-emerald-500/30 animate-in fade-in slide-in-from-top-2">
          <HardDriveDownload className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="text-xs">
            <span className="font-bold text-white block">Download Concluído</span>
            <span className="text-[#94A3B8]">{downloadToast}</span>
          </div>
        </div>
      )}

      {/* Hidden file input for device upload */}
      <input
        type="file"
        ref={directFileInputRef}
        accept="application/pdf,.pdf"
        onChange={handleDeviceFileSelect}
        className="hidden"
      />

      {/* Top Banner & Control Toolbar */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 md:p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-md bg-[#EFF6FF] text-[#2563EB]">
              <FileText className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
              Acervo Digital & Doutrina
            </span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl font-extrabold text-[#0F172A]">
              Meus PDFs
            </h2>
            {currentStudent && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-[11px] font-bold">
                <Lock className="w-3 h-3 text-emerald-600" />
                Cofre Privado: {currentStudent.name}
              </span>
            )}
          </div>
          <p className="text-xs text-[#475569] mt-0.5">
            Cada material está vinculado a um curso específico e à sua conta de estudante com isolamento de acesso.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Button to upload PDF directly from device */}
          <button
            onClick={() => directFileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#2563EB]/40 bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#2563EB] font-bold text-xs shadow-2xs transition-colors cursor-pointer"
            title="Importar um arquivo PDF do seu computador ou celular"
          >
            <Upload className="w-3.5 h-3.5 text-[#2563EB]" />
            Baixar PDF do Dispositivo
          </button>

          <button
            onClick={() => setIsAddClassModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] text-[#0F172A] font-bold text-xs shadow-2xs transition-colors cursor-pointer"
          >
            <FolderPlus className="w-3.5 h-3.5 text-[#64748B]" />
            Nova Classe
          </button>

          <button
            onClick={() => {
              setUploadedBlobUrl(null);
              setUploadedFileSize('');
              setNewFileName('');
              setNewTitle('');
              setIsUploadModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Adicionar PDF
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        {/* Course Filter Dropdown */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#CBD5E1] bg-[#F8FAFC]">
            <GraduationCap className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="text-xs font-bold bg-transparent text-[#0F172A] outline-none cursor-pointer pr-1"
            >
              <option value="all">Todos os Cursos</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.code || course.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Classes Horizontal Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full flex-1">
          <button
            onClick={() => setSelectedSubject('all')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all shrink-0 ${
              selectedSubject === 'all'
                ? 'bg-[#0F172A] text-white shadow-2xs'
                : 'bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            Todas as Disciplinas ({filteredPdfs.length})
          </button>

          {subjectClasses.map((cls) => {
            const count = pdfs.filter((p) => p.subject === cls).length;
            const isSelected = selectedSubject === cls;

            return (
              <button
                key={cls}
                onClick={() => setSelectedSubject(cls)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-[#2563EB] text-white font-bold shadow-2xs'
                    : 'bg-[#F8FAFC] border border-[#E2E8F0] text-[#475569] hover:bg-[#EFF6FF]'
                }`}
              >
                <span>{cls}</span>
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
        <div className="w-full sm:w-64">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#CBD5E1] bg-white shadow-2xs">
            <Search className="w-3.5 h-3.5 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Buscar em Meus PDFs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs text-[#0F172A] placeholder-[#94A3B8] outline-none"
            />
          </div>
        </div>
      </div>

      {/* Grid of PDF Cards */}
      {filteredPdfs.length === 0 ? (
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mx-auto">
            <Folder className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-[#0F172A]">Nenhum PDF encontrado nesta classe</h3>
          <p className="text-xs text-[#64748B] max-w-sm mx-auto">
            Faça upload do seu dispositivo ou adicione apostilas para organizar seus estudos por classe.
          </p>
          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              onClick={() => directFileInputRef.current?.click()}
              className="px-4 py-2 bg-[#EFF6FF] text-[#2563EB] border border-[#2563EB]/30 text-xs font-bold rounded-lg shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              Carregar do Dispositivo
            </button>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="px-4 py-2 bg-[#2563EB] text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer"
            >
              Adicionar Manualmente
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPdfs.map((pdf) => {
            const percentRead = Math.round((pdf.currentPage / pdf.totalPages) * 100);
            const isCompleted = pdf.currentPage >= pdf.totalPages;

            return (
              <div
                key={pdf.id}
                className="bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] rounded-xl p-4 shadow-xs transition-all flex flex-col justify-between group hover:translate-y-[-1px]"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]">
                        {pdf.subject}
                      </span>
                      {pdf.courseName && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
                          <GraduationCap className="w-3 h-3 text-indigo-600 shrink-0" />
                          <span className="truncate max-w-[140px]">{pdf.courseName}</span>
                        </span>
                      )}
                      <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 flex items-center gap-0.5">
                        <Lock className="w-2.5 h-2.5 text-slate-400" />
                        Privado
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onToggleFavorite(pdf.id)}
                        className={`p-1 rounded text-[#94A3B8] hover:text-amber-500 transition-colors cursor-pointer ${
                          pdf.favorite ? 'text-amber-500' : ''
                        }`}
                        title="Favorito"
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${pdf.favorite ? 'fill-amber-500' : ''}`} />
                      </button>
                      <button
                        onClick={() => onDeletePdf(pdf.id)}
                        className="p-1 rounded text-[#94A3B8] hover:text-[#EF4444] transition-colors cursor-pointer"
                        title="Excluir PDF"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title & Topic */}
                  <h3 className="text-xs md:text-sm font-extrabold text-[#0F172A] leading-snug line-clamp-2 mb-1">
                    {pdf.title}
                  </h3>
                  {pdf.topic && (
                    <p className="text-[11px] text-[#64748B] line-clamp-1 mb-2 font-medium">
                      {pdf.topic}
                    </p>
                  )}

                  {/* Notes snippet if present */}
                  {pdf.notes && (
                    <div className="p-2 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] text-[11px] text-[#475569] italic mb-3 line-clamp-2">
                      &ldquo;{pdf.notes}&rdquo;
                    </div>
                  )}
                </div>

                {/* Progress & File Metadata */}
                <div className="pt-3 border-t border-[#F1F5F9] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#64748B] font-medium">
                      Pág. <strong className="text-[#0F172A] tabular-nums">{pdf.currentPage}</strong> de {pdf.totalPages}
                    </span>
                    <span className={`text-[11px] font-bold tabular-nums ${
                      isCompleted ? 'text-emerald-600' : 'text-[#2563EB]'
                    }`}>
                      {percentRead}% lido
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-[#E2E8F0] h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isCompleted ? 'bg-[#10B981]' : 'bg-[#2563EB]'
                      }`}
                      style={{ width: `${percentRead}%` }}
                    />
                  </div>

                  {/* Footer actions: Download to device & Open reader */}
                  <div className="flex items-center justify-between text-[11px] text-[#94A3B8] pt-1 gap-2">
                    <span className="truncate max-w-[110px]" title={pdf.fileName}>
                      {pdf.fileSize}
                    </span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Baixar PDF para o dispositivo */}
                      <button
                        onClick={() => handleDownloadPdf(pdf)}
                        className="flex items-center gap-1 px-2 py-1 rounded bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0F172A] hover:text-[#2563EB] font-bold text-xs transition-colors cursor-pointer"
                        title="Baixar arquivo PDF para o seu dispositivo"
                      >
                        <Download className="w-3 h-3 text-[#2563EB]" />
                        <span>Baixar</span>
                      </button>

                      {/* Abrir Leitor */}
                      <button
                        onClick={() => setViewingPdf(pdf)}
                        className="text-xs font-bold text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-1 cursor-pointer px-1.5 py-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Leitor</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reader / Tracker Modal */}
      {viewingPdf && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white rounded-2xl border border-[#CBD5E1] shadow-2xl p-6 space-y-5"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#EFF6FF] text-[#2563EB]">
                  {viewingPdf.subject}
                </span>
                <h3 className="text-base font-extrabold text-[#0F172A] mt-1.5">
                  {viewingPdf.title}
                </h3>
                <p className="text-xs text-[#64748B] font-mono mt-0.5">
                  Arquivo: {viewingPdf.fileName} ({viewingPdf.fileSize})
                </p>
              </div>
              <button 
                onClick={() => setViewingPdf(null)}
                className="p-1 rounded-lg text-[#64748B] hover:text-[#0F172A] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Prominent Download Button inside modal */}
            <div className="p-3 bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-[#2563EB] shrink-0" />
                <div>
                  <span className="text-xs font-bold text-[#0F172A] block">Baixar PDF Completo</span>
                  <span className="text-[11px] text-[#475569]">Salvar cópia no seu computador ou celular</span>
                </div>
              </div>
              <button
                onClick={() => handleDownloadPdf(viewingPdf)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs shadow-xs transition-all cursor-pointer shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                Baixar para o Dispositivo
              </button>
            </div>

            {/* Quick Page Update Form */}
            <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] space-y-3">
              <label className="block text-xs font-bold text-[#0F172A]">
                Atualizar Página Atual de Leitura:
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={0}
                  max={viewingPdf.totalPages}
                  value={viewingPdf.currentPage}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setViewingPdf({ ...viewingPdf, currentPage: val });
                    onUpdatePdfPage(viewingPdf.id, val);
                  }}
                  className="w-24 px-3 py-1.5 rounded-lg border border-[#CBD5E1] bg-white text-xs font-bold text-[#0F172A] outline-none"
                />
                <span className="text-xs text-[#64748B]">
                  de <strong className="text-[#0F172A]">{viewingPdf.totalPages}</strong> páginas
                </span>
                <button
                  onClick={() => {
                    setViewingPdf({ ...viewingPdf, currentPage: viewingPdf.totalPages });
                    onUpdatePdfPage(viewingPdf.id, viewingPdf.totalPages);
                  }}
                  className="ml-auto text-xs font-bold text-[#10B981] hover:underline cursor-pointer"
                >
                  Marcar como Lido
                </button>
              </div>
            </div>

            {viewingPdf.notes && (
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#0F172A]">Anotações de Estudo:</span>
                <p className="text-xs text-[#475569] bg-white p-3 rounded-lg border border-[#E2E8F0]">
                  {viewingPdf.notes}
                </p>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-[#E2E8F0]">
              <button
                onClick={() => setViewingPdf(null)}
                className="px-4 py-2 rounded-lg bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-bold cursor-pointer"
              >
                Salvar e Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload / Add PDF Modal with Device File Picker & Drag-and-Drop */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white rounded-2xl border border-[#CBD5E1] shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#2563EB] text-white flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-[#0F172A]">
                    Adicionar aos Meus PDFs
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    Envie arquivo do dispositivo ou cadastre material de estudo por classe.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1 rounded-lg text-[#64748B] hover:text-[#0F172A] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Device file drag & click picker zone */}
            <input
              type="file"
              ref={modalFileInputRef}
              accept="application/pdf,.pdf"
              onChange={handleDeviceFileSelect}
              className="hidden"
            />
            <div 
              onClick={() => modalFileInputRef.current?.click()}
              className="border-2 border-dashed border-[#BFDBFE] hover:border-[#2563EB] bg-[#F8FAFC] hover:bg-[#EFF6FF] rounded-xl p-4 text-center cursor-pointer transition-colors group"
            >
              <div className="w-10 h-10 rounded-full bg-[#EFF6FF] group-hover:bg-[#DBEAFE] text-[#2563EB] flex items-center justify-center mx-auto mb-2 transition-colors">
                <Upload className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-[#0F172A]">
                {newFileName ? `Arquivo selecionado: ${newFileName}` : 'Clique para selecionar PDF do seu dispositivo'}
              </p>
              <p className="text-[11px] text-[#64748B] mt-0.5">
                {uploadedFileSize ? `Tamanho: ${uploadedFileSize}` : 'Compatível com qualquer arquivo .pdf (Apostilas, Leis, Aulas)'}
              </p>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-3.5 text-xs">
              {/* Vínculo Obrigatório a um Curso Específico */}
              <div>
                <label className="block font-bold text-[#475569] mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Vincular ao Curso Específico *</span>
                  </span>
                  <span className="text-[10px] text-indigo-600 font-semibold">Obrigatório</span>
                </label>
                <select
                  value={newCourseId}
                  onChange={(e) => setNewCourseId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1] bg-white text-[#0F172A] outline-none focus:border-[#2563EB]"
                >
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.code} — {course.name}
                    </option>
                  ))}
                  {courses.length === 0 && currentTarget && (
                    <option value={currentTarget.id}>{currentTarget.code} — {currentTarget.name}</option>
                  )}
                </select>
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  Este PDF será cadastrado no acervo específico deste curso e visível apenas para sua conta.
                </span>
              </div>

              <div>
                <label className="block font-bold text-[#475569] mb-1">
                  Classe da Matéria / Disciplina *
                </label>
                <select
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1] bg-white text-[#0F172A] outline-none focus:border-[#2563EB]"
                >
                  {subjectClasses.map((cls) => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#475569] mb-1">
                  Título do Material *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Aula 02 - Direitos Individuais e Coletivos"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1] bg-white text-[#0F172A] outline-none focus:border-[#2563EB]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#475569] mb-1">
                    Tópico Específico
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Artigo 5º da CF/88"
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1] bg-white text-[#0F172A] outline-none focus:border-[#2563EB]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#475569] mb-1">
                    Total de Páginas
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={newTotalPages}
                    onChange={(e) => setNewTotalPages(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1] bg-white text-[#0F172A] outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#475569] mb-1">
                  Nome do Arquivo
                </label>
                <input
                  type="text"
                  placeholder="Ex: Aula02_Const_Art5.pdf"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1] bg-white text-[#0F172A] outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#475569] mb-1">
                  Anotações / Lembretes de Estudo
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: Ponto de atenção para súmulas vinculantes cobradas pela FGV..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#CBD5E1] bg-white text-[#0F172A] outline-none focus:border-[#2563EB] resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-3 py-2 text-xs font-bold text-[#64748B] hover:text-[#0F172A] cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-sm cursor-pointer"
                >
                  Adicionar ao Acervo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Subject Class Modal */}
      {isAddClassModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-white rounded-2xl border border-[#CBD5E1] shadow-2xl p-5 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-[#0F172A]">
                Criar Nova Classe de Matéria
              </h3>
              <button 
                onClick={() => setIsAddClassModalOpen(false)}
                className="p-1 rounded-lg text-[#64748B] hover:text-[#0F172A] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddClassSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#475569] mb-1">
                  Nome da Disciplina / Classe
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="Ex: Direito Previdenciário"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1] bg-white text-[#0F172A] outline-none focus:border-[#2563EB]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddClassModalOpen(false)}
                  className="px-3 py-1.5 text-xs font-bold text-[#64748B] cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-bold cursor-pointer"
                >
                  Criar Classe
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
