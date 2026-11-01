'use client';

import React, { useState } from 'react';
import {
  GraduationCap,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  UserCheck,
  UserPlus,
  Mail,
  Lock,
  Camera,
  Upload,
  ArrowRight,
  ShieldAlert,
  LogOut,
  Sparkles,
  Search,
  KeyRound,
  FileCheck2,
  RefreshCw,
  Phone,
  Check,
  Eye,
  AlertTriangle
} from 'lucide-react';
import { ManagedUser } from '@/lib/types';
import { verifyAdminPassword, isAdminIdentifier } from '@/lib/authConfig';
import { StudentPhotoCapture } from './StudentPhotoCapture';
import { StudentCardBadge } from './StudentCardBadge';

interface StudentAccessGateProps {
  currentStudent: ManagedUser | null;
  users: ManagedUser[];
  onSelectStudent: (student: ManagedUser) => void;
  onRegisterStudent: (newStudent: ManagedUser) => void;
  onLogoutStudent: () => void;
  onLoginAdmin?: (email: string, name: string, role: 'super_admin' | 'gestor_conteudo') => void;
  onNavigateToAdmin?: () => void;
  onDirectAdminLogin?: () => void;
}

export function StudentAccessGate({
  currentStudent,
  users,
  onSelectStudent,
  onRegisterStudent,
  onLogoutStudent,
  onLoginAdmin,
  onNavigateToAdmin,
  onDirectAdminLogin,
}: StudentAccessGateProps) {
  // Mode: 'cadastro' | 'login'
  const [gateTab, setGateTab] = useState<'cadastro' | 'login'>('cadastro');

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regTarget, setRegTarget] = useState('OAB 43º Exame Unificado');
  const [regPassword, setRegPassword] = useState('');
  const [regAvatar, setRegAvatar] = useState('https://picsum.photos/seed/student-larissa/240/240');
  const [regDocPhoto, setRegDocPhoto] = useState('');
  const [showDocUpload, setShowDocUpload] = useState(false);
  const [regError, setRegError] = useState('');

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [studentSearch, setStudentSearch] = useState('');

  const studentList = users.filter((u) => u.role !== 'admin');

  // Handle Register
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (!regName.trim() || !regEmail.trim()) {
      setRegError('Por favor, informe seu nome completo e e-mail.');
      return;
    }

    const trimmedPassword = regPassword.trim();
    if (!trimmedPassword || trimmedPassword.length < 6) {
      setRegError('A senha é obrigatória e deve conter no mínimo 6 dígitos/caracteres.');
      return;
    }

    const newUser: ManagedUser = {
      id: `usr-${Date.now()}`,
      name: regName.trim(),
      email: regEmail.trim().toLowerCase(),
      password: trimmedPassword, // Senha vinculada ao e-mail específico (mínimo de 6 dígitos)
      phone: regPhone.trim() || undefined,
      role: 'aluno_premium',
      targetExam: regTarget,
      questionsAnswered: 0,
      accuracyRate: 0,
      status: 'pendente_aprovacao', // AWAITING APPROVAL
      avatarUrl: regAvatar || undefined,
      documentPhotoUrl: regDocPhoto || undefined,
      registrationDate: new Date().toLocaleDateString('pt-BR'),
      lastActive: 'Agora',
    };

    onRegisterStudent(newUser);
  };

  // Handle Unified Login: Everyone (students and administrators) logs in here with ZERO admin hints
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const emailTrim = loginEmail.trim().toLowerCase();
    const passTrim = loginPassword.trim();

    if (!emailTrim || !passTrim) {
      setLoginError('Por favor, informe seu e-mail e a senha cadastrada.');
      return;
    }

    if (passTrim.length < 6) {
      setLoginError('A senha deve conter no mínimo 6 dígitos.');
      return;
    }

    // Check if administrator credentials (completely discrete, transparent to outside users)
    const isAdminAccount =
      isAdminIdentifier(emailTrim) ||
      users.some((u) => u.email.toLowerCase() === emailTrim && u.role === 'admin');

    if (isAdminAccount) {
      // VALIDAÇÃO RIGOROSA DA SENHA MASTER DO ADMINISTRADOR (admin03061983)
      if (!verifyAdminPassword(passTrim)) {
        setLoginError('Senha de administrador incorreta. Acesso restrito e negado.');
        return;
      }

      const isPedagogico = emailTrim.includes('pedagogico');
      const name = isPedagogico ? 'Gestor Pedagógico' : 'Super Administrador Geral';
      const role = isPedagogico ? 'gestor_conteudo' : 'super_admin';

      if (onLoginAdmin) {
        onLoginAdmin(emailTrim, name, role);
      } else if (onDirectAdminLogin) {
        onDirectAdminLogin();
      } else if (onNavigateToAdmin) {
        onNavigateToAdmin();
      }
      return;
    }

    // Student authentication strictly bound to email and password
    const found = studentList.find((s) => s.email.toLowerCase() === emailTrim);
    if (found) {
      // Validate password bound to this specific email
      if (found.password && found.password !== passTrim) {
        setLoginError('Senha incorreta para o e-mail informado. Verifique os dígitos da sua senha.');
        return;
      }
      onSelectStudent(found);
    } else {
      setLoginError('E-mail não cadastrado. Verifique suas credenciais ou realize o cadastro na aba ao lado.');
    }
  };

  // ------------------------------------------------------------------
  // CASE 1: Student is Logged in but PENDING APPROVAL (pendente_aprovacao)
  // ------------------------------------------------------------------
  if (currentStudent && currentStudent.status === 'pendente_aprovacao') {
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-amber-200 overflow-hidden">
          {/* Top Banner */}
          <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white p-6 sm:p-8 relative">
            <div className="flex items-center gap-2 bg-amber-500/40 border border-amber-300/40 px-3 py-1 rounded-full text-xs font-bold text-amber-100 w-fit mb-3">
              <Clock className="w-3.5 h-3.5 animate-spin" />
              <span>Etapa Obrigatória: Aguardando Homologação</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Cadastro Realizado com Sucesso!
            </h2>
            <p className="text-sm text-amber-100 mt-2 leading-relaxed max-w-xl">
              Sua matrícula e fotos foram recebidas. Conforme as regras da plataforma, o acesso aos cadernos de questões e simulados só é liberado <strong>após a aprovação pelo Administrador</strong>.
            </p>
          </div>

          {/* Body */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Student Preview Card */}
            <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50/50 flex flex-col sm:flex-row items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-slate-900 border-2 border-white ring-2 ring-amber-300 overflow-hidden shadow-md shrink-0 flex items-center justify-center text-white font-black text-xl">
                  {currentStudent.avatarUrl ? (
                    <img
                      src={currentStudent.avatarUrl}
                      alt={currentStudent.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    currentStudent.name.slice(0, 2).toUpperCase()
                  )}
                </div>
                <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-500 text-white border border-white shadow-xs">
                  Pendente
                </span>
              </div>

              <div className="flex-1 text-center sm:text-left space-y-1">
                <div className="text-base font-black text-[#0F172A]">
                  {currentStudent.name}
                </div>
                <div className="text-xs text-[#64748B]">
                  {currentStudent.email} • {currentStudent.phone || 'Sem telefone'}
                </div>
                <div className="text-xs font-bold text-blue-700">
                  Carreira Alvo: {currentStudent.targetExam}
                </div>
                <div className="text-[11px] text-amber-800 font-medium">
                  Protocolo de Matrícula: <strong className="font-mono">PROT-{currentStudent.id.slice(-6).toUpperCase()}</strong> ({currentStudent.registrationDate})
                </div>
              </div>

              {currentStudent.documentPhotoUrl && (
                <div className="shrink-0 text-center">
                  <div className="w-16 h-12 rounded-lg overflow-hidden border border-amber-300 shadow-2xs mx-auto">
                    <img
                      src={currentStudent.documentPhotoUrl}
                      alt="Doc Anexado"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <span className="text-[10px] text-amber-900 font-bold block mt-1">Doc Enviado</span>
                </div>
              )}
            </div>

            {/* Approval Pipeline Steps */}
            <div className="space-y-3">
              <div className="text-xs font-black uppercase tracking-wider text-[#64748B]">
                Status do Processo de Aprovação:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-900">
                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>1. Cadastro & Fotos</span>
                  </div>
                  <p className="text-[11px] text-emerald-700 mt-1 leading-snug">
                    Foto de perfil e dados registrados com sucesso.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border-2 border-amber-400 bg-amber-50 text-amber-900 shadow-xs">
                  <div className="flex items-center gap-1.5 font-black text-xs text-amber-800">
                    <Clock className="w-4 h-4 text-amber-600 animate-spin" />
                    <span>2. Validação Admin</span>
                  </div>
                  <p className="text-[11px] text-amber-800 mt-1 leading-snug font-medium">
                    Na fila de aprovação pedagógica e cadastral.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 opacity-70">
                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    <Lock className="w-4 h-4 text-slate-400" />
                    <span>3. Acesso Liberado</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                    Liberado imediatamente após clique de aprovação.
                  </p>
                </div>
              </div>
            </div>

            {/* Carteirinha Digital Preview */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#475569] block flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Carteirinha Provisória Gerada com Sucesso:</span>
              </span>
              <StudentCardBadge user={currentStudent} />
            </div>

            {/* Student Waiting Status & Live Status Check */}
            <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50/70 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-[#1E293B]">
                <strong className="block text-amber-950 font-bold">Aguardando Avaliação Pedagógica</strong>
                <span className="text-amber-800">Seu protocolo foi enviado à equipe. A liberação ocorre assim que o administrador homologar seu cadastro.</span>
              </div>

              <button
                type="button"
                onClick={() => {
                  const refreshed = users.find((u) => u.id === currentStudent.id);
                  if (refreshed) {
                    onSelectStudent(refreshed);
                  }
                }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Verificar se Fui Aprovado</span>
              </button>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#E2E8F0]">
              <button
                type="button"
                onClick={onLogoutStudent}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Trocar de Conta / Sair</span>
              </button>

              <span className="text-[11px] text-[#94A3B8]">
                Aprovação Total • Segurança & Controle de Acesso
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------------
  // CASE 2: Student is REJECTED (rejeitado)
  // ------------------------------------------------------------------
  if (currentStudent && currentStudent.status === 'rejeitado') {
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-rose-300 p-6 sm:p-8 space-y-5 text-center">
          <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-[#0F172A]">
              Cadastro Não Aprovado
            </h2>
            <p className="text-xs text-[#64748B] mt-1.5">
              O administrador analisou sua solicitação de matrícula e o acesso não foi liberado.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-800 text-xs text-left">
            <strong>Motivo informado pela administração:</strong>
            <p className="mt-1">
              {currentStudent.rejectionReason || 'Documentação incompleta ou foto ilegível. Por favor, envie uma nova foto 3x4 nítida.'}
            </p>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <button
              type="button"
              onClick={onLogoutStudent}
              className="w-full py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold cursor-pointer"
            >
              Fazer Novo Cadastro com Outra Foto
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------------
  // CASE 3: NO STUDENT LOGGED IN -> GATE (Cadastro com Foto ou Login)
  // ------------------------------------------------------------------
  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-[#CBD5E1] overflow-hidden flex flex-col">
        {/* Banner Header */}
        <div className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#2563EB] text-white p-6 sm:p-8 relative">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shadow-inner">
                <GraduationCap className="w-6 h-6 text-blue-300" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-300 block">
                  Aprovação Total • Plataforma Oficial
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-white">
                  Portal de Matrícula & Acesso de Alunos
                </h1>
              </div>
            </div>

            <div className="bg-amber-400/20 border border-amber-300/30 px-3 py-1.5 rounded-full text-xs font-bold text-amber-200 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-300" />
              <span>Acesso Restrito: Cadastro & Homologação</span>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
            Para acessar o banco com milhares de questões comentadas, simulados oficiais e cronogramas, realize o seu <strong>cadastro com foto</strong> ou acesse sua conta na aba <strong>Já Sou Cadastrado</strong>.
          </p>

          {/* Toggle Tabs */}
          <div className="flex items-center gap-2 mt-5 pt-4 border-t border-white/10 text-xs">
            <button
              type="button"
              onClick={() => setGateTab('cadastro')}
              className={`px-4 py-2 rounded-xl font-black transition-all cursor-pointer flex items-center gap-2 ${
                gateTab === 'cadastro'
                  ? 'bg-white text-[#0F172A] shadow-md'
                  : 'text-white/80 hover:bg-white/10'
              }`}
            >
              <UserPlus className="w-4 h-4 text-blue-600" />
              <span>1. Fazer Cadastro de Aluno com Fotos</span>
            </button>

            <button
              type="button"
              onClick={() => setGateTab('login')}
              className={`px-4 py-2 rounded-xl font-black transition-all cursor-pointer flex items-center gap-2 ${
                gateTab === 'login'
                  ? 'bg-white text-[#0F172A] shadow-md'
                  : 'text-white/80 hover:bg-white/10'
              }`}
            >
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>2. Já Sou Cadastrado (Entrar)</span>
            </button>
          </div>
        </div>

        {/* Gate Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* TAB: CADASTRO COM FOTOS */}
          {gateTab === 'cadastro' && (
            <form onSubmit={handleRegister} className="space-y-5">
              {/* Mandatory Notice */}
              <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/60 flex items-start gap-2.5 text-xs text-blue-900">
                <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong>Fluxo de Aprovação:</strong> Após preencher seus dados e enviar sua foto, seu cadastro irá diretamente para a fila de homologação. Um administrador fará a aprovação para liberar o acesso ao sistema.
                </div>
              </div>

              {/* Photo Capture Section (Webcam, Upload, Avatars) */}
              <StudentPhotoCapture
                label="Foto de Rosto do Aluno (3x4 Obrigatória)"
                sublabel="Tire uma foto ao vivo com a câmera, faça upload ou selecione um avatar para sua identificação."
                photoUrl={regAvatar}
                onChangePhoto={(url) => setRegAvatar(url)}
                allowCamera={true}
                aspectRatio="square"
                placeholderText="Sem foto 3x4"
              />

              {/* Document Photo (Optional) */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCheck2 className="w-4 h-4 text-[#2563EB]" />
                    <span className="text-xs font-bold text-[#0F172A]">
                      Foto do Documento (RG, CNH ou Carteirinha) - Opcional
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowDocUpload(!showDocUpload)}
                    className="text-xs text-[#2563EB] hover:underline font-bold cursor-pointer"
                  >
                    {showDocUpload ? 'Ocultar' : regDocPhoto ? 'Alterar' : '+ Anexar Documento'}
                  </button>
                </div>

                {showDocUpload && (
                  <StudentPhotoCapture
                    label="Foto do Documento"
                    sublabel="Anexe comprovante para agilizar a aprovação pelo administrador."
                    photoUrl={regDocPhoto}
                    onChangePhoto={(url) => setRegDocPhoto(url)}
                    allowCamera={true}
                    aspectRatio="document"
                    placeholderText="Sem documento"
                  />
                )}
              </div>

              {/* Live Student Card Preview */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-[#475569]">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span>Prévia da Carteirinha Digital com Sua Foto:</span>
                  </span>
                  <span className="text-[10px] text-blue-600 font-normal">
                    Gerada automaticamente
                  </span>
                </div>
                <StudentCardBadge
                  user={{
                    name: regName || 'Nome do Estudante',
                    email: regEmail || 'email@estudante.com',
                    targetExam: regTarget,
                    avatarUrl: regAvatar,
                  }}
                />
              </div>

              {/* Form Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#334155] mb-1">
                    Nome Completo do Aluno *
                  </label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Ex: Carlos Eduardo Fontes"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] focus:border-[#2563EB] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#334155] mb-1">
                    E-mail do Aluno *
                  </label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="carlos.fontes@concursos.com"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] focus:border-[#2563EB] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#334155] mb-1">
                    Concurso ou Exame Alvo *
                  </label>
                  <select
                    value={regTarget}
                    onChange={(e) => setRegTarget(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] bg-white focus:border-[#2563EB] outline-none"
                  >
                    <option value="OAB 43º Exame Unificado">OAB 43º Exame Unificado</option>
                    <option value="RFB 2026 (Auditor-Fiscal)">RFB 2026 (Auditor-Fiscal)</option>
                    <option value="Magistratura Estadual">Magistratura Estadual</option>
                    <option value="Ministério Público Federal">Ministério Público Federal</option>
                    <option value="TCU 2026 (Auditor Federal)">TCU 2026 (Auditor Federal)</option>
                    <option value="Polícia Federal (Agente)">Polícia Federal (Agente)</option>
                    <option value="Diplomacia CACD">Diplomacia CACD</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#334155] mb-1">
                    Telefone / WhatsApp (Opcional)
                  </label>
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="(11) 98452-1102"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] focus:border-[#2563EB] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1">
                  Senha de Acesso (Mínimo de 6 dígitos) *
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Crie uma senha com no mínimo 6 dígitos (ex: 123456)"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] focus:border-[#2563EB] outline-none"
                />
              </div>

              {regError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{regError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-black text-sm shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Enviar Cadastro com Foto para Aprovação do Administrador</span>
              </button>
            </form>
          )}

          {/* TAB: LOGIN DO ALUNO CADASTRADO */}
          {gateTab === 'login' && (
            <div className="space-y-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#334155] mb-1">
                    E-mail ou Matrícula
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="seu.email@dominio.com ou identificador"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] focus:border-[#2563EB] outline-none pl-9"
                    />
                    <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#334155] mb-1">
                    Senha de Acesso
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] focus:border-[#2563EB] outline-none pl-9"
                    />
                    <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
                  </div>
                </div>

                {loginError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Entrar na Plataforma</span>
                </button>
              </form>

              {/* Select Existing Student with Status Badges */}
              <div className="pt-4 border-t border-[#E2E8F0] space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-[#0F172A]">
                    Ou Selecione um Aluno para Teste:
                  </span>
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-2.5 top-2" />
                    <input
                      type="text"
                      placeholder="Buscar por nome..."
                      value={studentSearch}
                      onChange={(e) => setStudentSearch(e.target.value)}
                      className="text-xs pl-7 pr-2.5 py-1 rounded-lg border border-[#CBD5E1] outline-none w-44"
                    />
                  </div>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {studentList
                    .filter((st) => {
                      if (!studentSearch) return true;
                      return (
                        st.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
                        st.email.toLowerCase().includes(studentSearch.toLowerCase()) ||
                        st.targetExam.toLowerCase().includes(studentSearch.toLowerCase())
                      );
                    })
                    .map((st) => (
                      <div
                        key={st.id}
                        onClick={() => onSelectStudent(st)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                          st.status === 'ativo'
                            ? 'border-emerald-200 bg-emerald-50/30 hover:border-emerald-400'
                            : st.status === 'pendente_aprovacao'
                            ? 'border-amber-200 bg-amber-50/40 hover:border-amber-400'
                            : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden border border-[#CBD5E1]">
                            {st.avatarUrl ? (
                              <img
                                src={st.avatarUrl}
                                alt={st.name}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              st.name.slice(0, 2).toUpperCase()
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-bold text-[#0F172A] truncate">
                                {st.name}
                              </span>
                              {st.status === 'ativo' && (
                                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-0.5">
                                  <Check className="w-2.5 h-2.5 text-emerald-600" />
                                  Aprovado
                                </span>
                              )}
                              {st.status === 'pendente_aprovacao' && (
                                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-0.5">
                                  <Clock className="w-2.5 h-2.5 text-amber-600" />
                                  Aguardando Aprovação
                                </span>
                              )}
                              {st.status === 'restrito' && (
                                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 border border-rose-300">
                                  Restrito
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-[#64748B] truncate">
                              {st.targetExam} • {st.email}
                            </div>
                          </div>
                        </div>

                        <div className="shrink-0 text-right">
                          <span className={`text-xs font-bold block ${
                            st.status === 'ativo' ? 'text-emerald-700' : 'text-amber-700'
                          }`}>
                            {st.status === 'ativo' ? 'Acessar →' : 'Ver Status →'}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Gate Footer - Neutral & Secure */}
        <div className="p-4 bg-[#F8FAFC] border-t border-[#CBD5E1] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#64748B]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Sistema protegido: o acesso aos cadernos de estudos requer homologação prévia da matrícula.</span>
          </div>

          <div className="text-[11px] text-[#94A3B8]">
            Aprovação Total • Segurança & Controle de Acesso
          </div>
        </div>
      </div>
    </div>
  );
}
