'use client';

import React from 'react';
import { ShieldCheck, Sparkles, QrCode, GraduationCap, CheckCircle2 } from 'lucide-react';
import { ManagedUser } from '@/lib/types';

interface StudentCardBadgeProps {
  user: ManagedUser | {
    name: string;
    email: string;
    targetExam: string;
    avatarUrl?: string;
    role?: string;
    status?: string;
    registrationDate?: string;
    id?: string;
  };
}

export function StudentCardBadge({ user }: StudentCardBadgeProps) {
  const regId = user.id ? `MAT-${user.id.replace('usr-', '').slice(-6).toUpperCase()}` : 'MAT-2026-OFIC';

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#2563EB] text-white p-5 shadow-xl border border-white/20 select-none">
      {/* Decorative background watermark */}
      <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
        <GraduationCap className="w-48 h-48" />
      </div>

      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3.5 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-blue-300" />
          </div>
          <div>
            <div className="text-[10px] font-black tracking-widest uppercase text-blue-300">
              Aprovação Total • Concursos
            </div>
            <div className="text-xs font-black text-white">
              Carteirinha Digital do Estudante
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-emerald-500/20 border border-emerald-400/30 px-2 py-0.5 rounded-full text-[10px] font-bold text-emerald-300">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span>Matrícula Válida</span>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex items-center gap-4 relative z-10">
        {/* Photo Container */}
        <div className="w-20 h-24 rounded-xl overflow-hidden bg-white/10 border-2 border-white/30 shadow-md shrink-0 flex items-center justify-center">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-white/60">
              <GraduationCap className="w-8 h-8 mb-1" />
              <span className="text-[9px] font-bold uppercase">Foto 3x4</span>
            </div>
          )}
        </div>

        {/* Student Details */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-blue-200">
            Nome do Aluno
          </div>
          <div className="text-sm font-black text-white truncate">
            {user.name || 'Nome do Estudante'}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 text-[10px]">
            <div>
              <span className="text-slate-400 block font-medium">Carreira / Foco</span>
              <span className="text-blue-100 font-bold truncate block">
                {user.targetExam || 'Concurso Geral'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Registro / ID</span>
              <span className="text-amber-300 font-mono font-bold block">
                {regId}
              </span>
            </div>
          </div>
        </div>

        {/* QR Code Simulation */}
        <div className="hidden sm:flex flex-col items-center justify-center bg-white p-1.5 rounded-xl text-slate-900 shrink-0 shadow-sm">
          <QrCode className="w-12 h-12" />
          <span className="text-[8px] font-bold uppercase tracking-tighter mt-0.5">
            QR Acesso
          </span>
        </div>
      </div>

      {/* Card Footer */}
      <div className="flex items-center justify-between border-t border-white/10 pt-2.5 mt-3 text-[10px] text-slate-300 relative z-10">
        <span>Válido em todo território nacional para ambiente de simulados</span>
        <span className="font-mono text-blue-300 font-bold">2026-OFICIAL</span>
      </div>
    </div>
  );
}
