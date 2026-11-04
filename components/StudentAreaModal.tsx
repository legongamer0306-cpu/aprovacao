'use client';

import React, { useState } from 'react';
import {
  User,
  UserCheck,
  UserPlus,
  Lock,
  Mail,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  LogOut,
  X,
  Target,
  Flame,
  GraduationCap,
  Sparkles,
  Info,
  Camera,
  Upload,
  Image as ImageIcon,
  Trash2,
  Eye,
  CreditCard,
  Phone,
  FileCheck2,
  Clock,
  Copy,
  RotateCcw,
  Check,
  Inbox,
  ArrowLeft,
  ArrowRight,
  KeyRound,
  RefreshCw
} from 'lucide-react';
import { ManagedUser } from '@/lib/types';
import { verifyAdminPassword, isAdminIdentifier } from '@/lib/authConfig';
import { StudentPhotoCapture } from './StudentPhotoCapture';
import { StudentCardBadge } from './StudentCardBadge';

interface StudentAreaModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStudent: ManagedUser | null;
  users: ManagedUser[];
  onSelectStudent: (user: ManagedUser) => void;
  onLogoutStudent: () => void;
  onRegisterStudent: (newUser: ManagedUser) => void;
  onUpdateStudent?: (updated: ManagedUser) => void;
  streakDays: number;
  onNavigateToAdmin?: () => void;
}

export function StudentAreaModal({
  isOpen,
  onClose,
  currentStudent,
  users,
  onSelectStudent,
  onLogoutStudent,
  onRegisterStudent,
  onUpdateStudent,
  streakDays,
  onNavigateToAdmin,
}: StudentAreaModalProps) {
  // Tabs: 'perfil' (if logged in), 'login', 'cadastro'
  const [activeTab, setActiveTab] = useState<'perfil' | 'login' | 'cadastro'>(
    currentStudent ? 'perfil' : 'login'
  );

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regTarget] = useState('Geral');
  const [regPassword, setRegPassword] = useState('');
  const [regAvatar, setRegAvatar] = useState<string>('https://picsum.photos/seed/student-gabriela/240/240');
  const [regDocumentPhoto, setRegDocumentPhoto] = useState<string>('');
  const [showDocUpload, setShowDocUpload] = useState(false);
  const [regError, setRegError] = useState('');

  // Profile photo edit states
  const [isChangingProfilePhoto, setIsChangingProfilePhoto] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [photoZoomUrl, setPhotoZoomUrl] = useState<string | null>(null);

  // Approval Verification State
  const [isCheckingApprovalModal, setIsCheckingApprovalModal] = useState(false);
  const [approvalModalMessage, setApprovalModalMessage] = useState<{
    type: 'pending' | 'approved' | 'rejected';
    text: string;
    time: string;
  } | null>(null);

  if (!isOpen) return null;

  // Filter students from users list
  const studentList = users.filter((u) => u.role !== 'admin');

  // Handle Login Submit with Admin Recognition
  const handleLoginSubmit = (e: React.FormEvent) => {
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

    const isAdminAccount =
      isAdminIdentifier(emailTrim) ||
      users.some((u) => u.email.toLowerCase() === emailTrim && u.role === 'admin');

    if (isAdminAccount) {
      if (!verifyAdminPassword(passTrim)) {
        setLoginError('Senha de administrador incorreta. Digite a senha master cadastrada.');
        return;
      }
      onClose();
      if (onNavigateToAdmin) {
        onNavigateToAdmin();
      }
      return;
    }

    const found = studentList.find((s) => s.email.toLowerCase() === emailTrim);
    if (found) {
      // Validate password bound to this specific email
      if (found.password && found.password !== passTrim) {
        setLoginError('Senha incorreta para o e-mail informado. Digite a senha cadastrada.');
        return;
      }
      onSelectStudent(found);
      setActiveTab('perfil');
      setLoginEmail('');
      setLoginPassword('');
    } else {
      setLoginError('E-mail não cadastrado. É obrigatório fazer o cadastro de aluno com foto e aguardar aprovação pelo administrador.');
    }
  };

  // Handle Direct Register Submit
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    const cleanEmail = regEmail.trim().toLowerCase();
    const cleanName = regName.trim();
    const trimmedPassword = regPassword.trim();

    if (!cleanName || !cleanEmail) {
      setRegError('Preencha seu nome e e-mail.');
      return;
    }

    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setRegError('Por favor, informe um endereço de e-mail válido.');
      return;
    }

    if (!trimmedPassword || trimmedPassword.length < 6) {
      setRegError('A senha é obrigatória e deve conter no mínimo 6 dígitos/caracteres.');
      return;
    }

    // Check if email already registered
    const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      setRegError('Este e-mail já está cadastrado no sistema. Acesse a aba de login ou utilize outro e-mail.');
      return;
    }

    const newUser: ManagedUser = {
      id: `usr-${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      password: trimmedPassword,
      phone: regPhone.trim() || undefined,
      role: 'aluno_premium',
      targetExam: regTarget,
      questionsAnswered: 0,
      accuracyRate: 0,
      status: 'pendente_aprovacao',
      avatarUrl: regAvatar || undefined,
      documentPhotoUrl: regDocumentPhoto || undefined,
      registrationDate: new Date().toLocaleDateString('pt-BR'),
      lastActive: 'Agora',
    };

    onRegisterStudent(newUser);
    onSelectStudent(newUser);
    setActiveTab('perfil');
    setRegName('');
    setRegEmail('');
    setRegPhone('');
    setRegPassword('');
    setRegAvatar('');
    setRegDocumentPhoto('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#CBD5E1] overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#2563EB] text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shadow-inner">
              <GraduationCap className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-blue-300 flex items-center gap-1.5">
                <span>Portal do Estudante</span>
                <span className="w-1 h-1 rounded-full bg-blue-300" />
                <span className="text-white font-medium">Cadastro & Identificação Oficial</span>
              </div>
              <h2 className="text-xl font-black text-white">
                Área do Aluno com Fotos
              </h2>
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed max-w-lg">
            Cadastre novos alunos com foto de perfil e documento, tire fotos ao vivo com a webcam, gere a carteirinha de estudante e acesse sua conta.
          </p>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/10 text-xs flex-wrap">
            {currentStudent && (
              <button
                type="button"
                onClick={() => setActiveTab('perfil')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'perfil'
                    ? 'bg-white text-[#0F172A] shadow-sm'
                    : 'text-white/80 hover:bg-white/10'
                }`}
              >
                {currentStudent.avatarUrl && (
                  <img
                    src={currentStudent.avatarUrl}
                    alt={currentStudent.name}
                    className="w-4 h-4 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                )}
                <span>Meu Perfil & Fotos</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setActiveTab('cadastro')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'cadastro'
                  ? 'bg-white text-[#0F172A] shadow-sm'
                  : 'text-white/80 hover:bg-white/10'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5 text-blue-500" />
              <span>Cadastrar Aluno (Com Fotos)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('login')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'login'
                  ? 'bg-white text-[#0F172A] shadow-sm'
                  : 'text-white/80 hover:bg-white/10'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>{currentStudent ? 'Alternar Aluno' : 'Entrar com Conta'}</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* TAB 1: MEU PERFIL (Active Student) */}
          {activeTab === 'perfil' && currentStudent && (
            <div className="space-y-5">
              {/* Profile Card with Photo */}
              <div className="p-4 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {/* Photo Container with Change Trigger */}
                  <div className="relative group">
                    <div 
                      onClick={() => currentStudent.avatarUrl && setPhotoZoomUrl(currentStudent.avatarUrl)}
                      className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#0F172A] to-[#2563EB] text-white flex items-center justify-center font-black text-2xl shadow-md overflow-hidden border-2 border-white ring-2 ring-[#CBD5E1] cursor-pointer"
                    >
                      {currentStudent.avatarUrl ? (
                        <img 
                          src={currentStudent.avatarUrl} 
                          alt={currentStudent.name} 
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        currentStudent.name.slice(0, 2).toUpperCase()
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsChangingProfilePhoto(!isChangingProfilePhoto)}
                      title="Alterar Foto de Perfil"
                      className="absolute -bottom-1 -right-1 p-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl shadow-md border-2 border-white transition-transform hover:scale-110 cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-black text-[#0F172A]">
                        {currentStudent.name}
                      </h3>
                      {currentStudent.status === 'ativo' ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Matrícula Aprovada
                        </span>
                      ) : currentStudent.status === 'pendente_aprovacao' ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-600 animate-spin" />
                          Aguardando Aprovação do Administrador
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-rose-600" />
                          {currentStudent.status === 'restrito' ? 'Acesso Restrito' : currentStudent.status === 'rejeitado' ? 'Matrícula Não Aprovada' : 'Suspenso'}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-[#64748B] mt-1 flex items-center gap-2 flex-wrap">
                      <span>{currentStudent.email}</span>
                      {currentStudent.phone && (
                        <>
                          <span>•</span>
                          <span>{currentStudent.phone}</span>
                        </>
                      )}
                      <span>•</span>
                      <span className="font-bold text-[#2563EB]">
                        {currentStudent.role === 'aluno_premium' ? 'Plano Elite VIP' : 'Plano Regular'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => setIsChangingProfilePhoto(!isChangingProfilePhoto)}
                        className="text-xs text-[#2563EB] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>{isChangingProfilePhoto ? 'Ocultar Opções de Foto' : 'Trocar Foto do Aluno'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowCardModal(!showCardModal)}
                        className="text-xs text-indigo-600 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>{showCardModal ? 'Ocultar Carteirinha' : 'Ver Carteirinha Digital com Foto'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                  <button
                    onClick={() => {
                      onLogoutStudent();
                      setActiveTab('login');
                    }}
                    className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sair da Conta</span>
                  </button>
                </div>
              </div>

              {/* DIGITAL STUDENT CARD ACCORDION */}
              {showCardModal && (
                <div className="animate-in fade-in duration-200">
                  <StudentCardBadge user={currentStudent} />
                </div>
              )}

              {/* QUICK CHANGE PHOTO DRAWER */}
              {isChangingProfilePhoto && (
                <div className="animate-in fade-in duration-150">
                  <StudentPhotoCapture
                    label="Alterar Foto de Perfil"
                    sublabel="Carregue uma nova foto, tire uma foto ao vivo com a câmera ou escolha um avatar."
                    photoUrl={currentStudent.avatarUrl || ''}
                    onChangePhoto={(newUrl) => {
                      if (onUpdateStudent) {
                        onUpdateStudent({
                          ...currentStudent,
                          avatarUrl: newUrl,
                        });
                      }
                      setIsChangingProfilePhoto(false);
                    }}
                  />
                </div>
              )}

              {/* DOCUMENT PHOTO PREVIEW IF AVAILABLE */}
              {currentStudent.documentPhotoUrl && (
                <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      onClick={() => setPhotoZoomUrl(currentStudent.documentPhotoUrl || null)}
                      className="w-14 h-10 rounded-lg overflow-hidden border border-emerald-300 shadow-2xs cursor-pointer hover:opacity-90 shrink-0"
                    >
                      <img
                        src={currentStudent.documentPhotoUrl}
                        alt="Documento do Aluno"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-emerald-900 flex items-center gap-1">
                        <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Documento / Carteirinha Anexado</span>
                      </div>
                      <div className="text-[11px] text-emerald-700">
                        Foto do documento comprobatório cadastrado no sistema
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPhotoZoomUrl(currentStudent.documentPhotoUrl || null)}
                    className="text-xs text-emerald-800 hover:underline font-bold"
                  >
                    Ver Imagem →
                  </button>
                </div>
              )}

              {/* PENDING APPROVAL OR RESTRICTION ALERT */}
              {currentStudent.status === 'pendente_aprovacao' ? (
                <div className="p-4 rounded-xl border border-amber-300 bg-amber-50/80 space-y-3">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                        <Clock className="w-4 h-4 text-amber-600 animate-spin shrink-0" />
                        <span>Cadastro em Análise: Aguardando Homologação</span>
                      </div>
                      <p className="text-[11px] text-amber-800 mt-1 leading-snug">
                        Seu protocolo foi enviado à equipe. A liberação ocorre assim que o administrador aprovar seu acesso.
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={isCheckingApprovalModal}
                      onClick={() => {
                        setIsCheckingApprovalModal(true);
                        setApprovalModalMessage(null);

                        setTimeout(() => {
                          let freshUsers: ManagedUser[] = users;
                          try {
                            const stored = localStorage.getItem('aprovacao_total_users');
                            if (stored) {
                              const parsed = JSON.parse(stored);
                              if (Array.isArray(parsed) && parsed.length > 0) {
                                freshUsers = parsed;
                              }
                            }
                          } catch {}

                          const fresh = freshUsers.find(
                            (u) => u.id === currentStudent.id || (currentStudent.email && u.email.toLowerCase() === currentStudent.email.toLowerCase())
                          );
                          const now = new Date().toLocaleTimeString('pt-BR');

                          if (fresh && fresh.status === 'ativo') {
                            setApprovalModalMessage({
                              type: 'approved',
                              text: '🎉 Matrícula APROVADA com sucesso! Acesso irrestrito liberado.',
                              time: now,
                            });
                            onSelectStudent(fresh);
                          } else if (fresh && fresh.status === 'rejeitado') {
                            setApprovalModalMessage({
                              type: 'rejected',
                              text: `❌ Cadastro reprovado pelo administrador (${fresh.restrictionReason || 'Inconsistência'}).`,
                              time: now,
                            });
                            onSelectStudent(fresh);
                          } else {
                            setApprovalModalMessage({
                              type: 'pending',
                              text: `Consulta realizada às ${now}: Seu cadastro continua na fila de homologação.`,
                              time: now,
                            });
                          }
                          setIsCheckingApprovalModal(false);
                        }, 600);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black shadow-sm flex items-center gap-1.5 cursor-pointer shrink-0"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isCheckingApprovalModal ? 'animate-spin' : ''}`} />
                      <span>{isCheckingApprovalModal ? 'Consultando...' : 'Verificar se Fui Aprovado'}</span>
                    </button>
                  </div>

                  {approvalModalMessage && (
                    <div
                      className={`p-3 rounded-lg border text-xs flex items-start gap-2 ${
                        approvalModalMessage.type === 'approved'
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                          : approvalModalMessage.type === 'rejected'
                          ? 'bg-rose-50 border-rose-300 text-rose-900 font-bold'
                          : 'bg-blue-50 border-blue-200 text-blue-900'
                      }`}
                    >
                      {approvalModalMessage.type === 'approved' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div>{approvalModalMessage.text}</div>
                        <span className="text-[10px] opacity-75 font-mono">
                          Hora da consulta: {approvalModalMessage.time}
                        </span>
                      </div>
                    </div>
                  )}

                </div>
              ) : currentStudent.status !== 'ativo' ? (
                <div className="p-4 rounded-xl border border-rose-300 bg-rose-50/80 space-y-2">
                  <div className="flex items-center gap-2 text-rose-800 font-bold text-xs">
                    <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Atenção: Acesso Restrito pelo Administrador</span>
                  </div>
                  <p className="text-xs text-rose-700 leading-relaxed">
                    <strong>Motivo da Moderação:</strong>{' '}
                    {currentStudent.restrictionReason ||
                      'Restrição temporária aplicada no Painel do Administrador para conformidade de uso.'}
                  </p>
                </div>
              ) : null}

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl border border-[#E2E8F0] bg-white text-center">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] mb-1">
                    Questões Feitas
                  </div>
                  <div className="text-lg font-black text-[#0F172A] tabular-nums">
                    {currentStudent.questionsAnswered}
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-[#E2E8F0] bg-white text-center">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] mb-1">
                    Taxa de Acerto
                  </div>
                  <div className="text-lg font-black text-emerald-600 tabular-nums">
                    {currentStudent.accuracyRate}%
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-[#E2E8F0] bg-white text-center">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] mb-1">
                    Fogo Ativo
                  </div>
                  <div className="text-lg font-black text-amber-600 flex items-center justify-center gap-1 tabular-nums">
                    <Flame className="w-4 h-4 fill-amber-500" />
                    {streakDays}d
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-[#E2E8F0] bg-white text-center">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] mb-1">
                    Membro Desde
                  </div>
                  <div className="text-xs font-bold text-[#475569] mt-1.5 truncate">
                    {currentStudent.registrationDate}
                  </div>
                </div>
              </div>

              {/* Current Target Information */}
              <div className="p-3.5 rounded-xl border border-blue-100 bg-blue-50/50 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Target className="w-4 h-4 text-[#2563EB]" />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#2563EB] block">
                      Concurso-Alvo Vinculado
                    </span>
                    <span className="text-xs font-bold text-[#0F172A]">
                      {currentStudent.targetExam}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className="text-xs font-bold text-[#2563EB] hover:underline cursor-pointer"
                >
                  Alternar Aluno →
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: CADASTRO DE NOVO ALUNO COM FOTOS */}
          {activeTab === 'cadastro' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-5">
              {/* SECTION 1: PHOTO CAPTURE COMPONENT (WEBCAM / UPLOAD / AVATARS) */}
              <StudentPhotoCapture
                label="Foto de Rosto do Aluno (3x4)"
                sublabel="Obrigatório para emissão da Carteirinha Digital do Estudante e crachá de simulados."
                photoUrl={regAvatar}
                onChangePhoto={(url) => setRegAvatar(url)}
                allowCamera={true}
                aspectRatio="square"
                placeholderText="Sem foto 3x4"
              />

              {/* SECTION 2: OPTIONAL DOCUMENT PHOTO */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCheck2 className="w-4 h-4 text-[#2563EB]" />
                    <span className="text-xs font-bold text-[#0F172A]">
                      Foto do Documento com Foto / Comprovante (Opcional)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowDocUpload(!showDocUpload)}
                    className="text-xs text-[#2563EB] hover:underline font-bold cursor-pointer"
                  >
                    {showDocUpload ? 'Ocultar' : regDocumentPhoto ? 'Alterar Documento' : '+ Anexar Documento'}
                  </button>
                </div>

                {showDocUpload && (
                  <StudentPhotoCapture
                    label="Foto do Documento (RG, CNH ou Carteirinha)"
                    sublabel="Tire uma foto ou carregue a imagem do documento para validação de matrícula."
                    photoUrl={regDocumentPhoto}
                    onChangePhoto={(url) => setRegDocumentPhoto(url)}
                    allowCamera={true}
                    aspectRatio="document"
                    placeholderText="Sem documento anexado"
                  />
                )}
              </div>

              {/* LIVE STUDENT ID CARD PREVIEW (CRACHÁ DO ESTUDANTE) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-[#475569]">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span>Pré-visualização da Carteirinha Oficial com Sua Foto:</span>
                  </span>
                  <span className="text-[10px] text-blue-600 font-normal">
                    Gerada automaticamente em tempo real
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

              {/* SECTION 3: FORM FIELDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name Input */}
                <div>
                  <label className="block text-xs font-bold text-[#334155] mb-1">
                    Nome Completo do Aluno *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="Ex: Gabriela Castro Martins"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] focus:border-[#2563EB] outline-none pl-9"
                    />
                    <User className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
                  </div>
                </div>

                {/* Email Input */}
                <div>
                  <label className="block text-xs font-bold text-[#334155] mb-1">
                    E-mail do Aluno *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="gabriela.castro@estudante.com"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] focus:border-[#2563EB] outline-none pl-9"
                    />
                    <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
                  </div>
                </div>
              </div>

              {/* Phone / WhatsApp */}
              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1">
                  Telefone / WhatsApp (Opcional)
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="(11) 99876-5432"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] focus:border-[#2563EB] outline-none pl-9"
                  />
                  <Phone className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1">
                  Senha de Acesso do Estudante (Mínimo de 6 dígitos) *
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Crie uma senha de no mínimo 6 dígitos vinculada ao seu e-mail"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] focus:border-[#2563EB] outline-none pl-9"
                  />
                  <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
                </div>
              </div>

              {regError && (
                <div className="p-2.5 rounded-lg bg-red-50 text-red-700 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{regError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-black text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Finalizar Cadastro do Aluno com Fotos & Emitir Carteirinha</span>
              </button>
            </form>
          )}

          {/* TAB 3: LOGIN DO ALUNO & LISTA COM FOTOS */}
          {activeTab === 'login' && (
            <div className="space-y-6">
              {/* Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#334155] mb-1">
                    E-mail do Aluno
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="seu.email@estudante.com"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 outline-none pl-9"
                    />
                    <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-[#334155]">
                      Senha de Acesso (Mínimo de 6 dígitos)
                    </label>
                    <span className="text-[10px] text-blue-600 font-semibold">
                      Senha vinculada ao e-mail
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 outline-none pl-9"
                    />
                    <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
                  </div>
                </div>

                {loginError && (
                  <div className="p-2.5 rounded-lg bg-red-50 text-red-700 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>{loginError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Acessar Área do Aluno</span>
                </button>
              </form>

              {/* Account Security Policy Notice */}
              <div className="pt-4 border-t border-[#E2E8F0]">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-[#475569] space-y-1">
                    <p className="font-bold text-[#0F172A]">Segurança & Sigilo Individual</p>
                    <p className="text-[11px] leading-relaxed">
                      Para alternar ou entrar na conta de um aluno, informe obrigatoriamente o e-mail e a senha cadastrada daquele estudante. A troca rápida ou acesso não autenticado a contas de terceiros está desabilitada para proteção dos dados e histórico de estudos.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#64748B]">
          <div className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-blue-500" />
            <span>Alunos e fotos sincronizam automaticamente com a área administrativa</span>
          </div>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg hover:bg-[#E2E8F0] font-bold text-[#0F172A] transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>

      {/* LIGHTBOX MODAL FOR PROFILE / DOC PHOTO */}
      {photoZoomUrl && (
        <div
          onClick={() => setPhotoZoomUrl(null)}
          className="fixed inset-0 z-60 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-lg w-full bg-white rounded-2xl overflow-hidden shadow-2xl p-4 space-y-3"
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
              <span className="font-extrabold text-sm text-[#0F172A]">
                Visualização da Foto do Estudante
              </span>
              <button
                type="button"
                onClick={() => setPhotoZoomUrl(null)}
                className="p-1 rounded-lg text-slate-500 hover:text-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="rounded-xl overflow-hidden border border-[#CBD5E1] bg-slate-900 max-h-[65vh] flex items-center justify-center">
              <img
                src={photoZoomUrl}
                alt="Foto Ampliada"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={() => setPhotoZoomUrl(null)}
                className="px-4 py-1.5 rounded-lg bg-[#0F172A] text-white text-xs font-bold"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
