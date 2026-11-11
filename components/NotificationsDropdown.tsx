'use client';

import React, { useState } from 'react';
import { 
  Bell, 
  CheckCheck, 
  Trash2, 
  ExternalLink, 
  Sparkles, 
  BookOpen, 
  Flame, 
  Award, 
  FileText,
  AlertCircle,
  X
} from 'lucide-react';
import { AppNotification, NotificationCategory } from '@/lib/types';

interface NotificationsDropdownProps {
  notifications: AppNotification[];
  isOpen: boolean;
  onClose: () => void;
  onMarkAllAsRead: () => void;
  onMarkAsRead: (id: string) => void;
  onClearRead: () => void;
  onNavigateTab?: (tab: string) => void;
}

export function NotificationsDropdown({
  notifications,
  isOpen,
  onClose,
  onMarkAllAsRead,
  onMarkAsRead,
  onClearRead,
  onNavigateTab
}: NotificationsDropdownProps) {
  const [filter, setFilter] = useState<'all' | 'unread' | 'banca' | 'meta'>('all');

  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'banca') return n.category === 'banca' || n.category === 'edital';
    if (filter === 'meta') return n.category === 'meta' || n.category === 'streak';
    return true;
  });

  const getCategoryIcon = (category: NotificationCategory) => {
    switch (category) {
      case 'banca':
      case 'edital':
        return <FileText className="w-4 h-4 text-blue-600" />;
      case 'meta':
        return <BookOpen className="w-4 h-4 text-emerald-600" />;
      case 'streak':
        return <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />;
      case 'simulado':
        return <Award className="w-4 h-4 text-purple-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-slate-600" />;
    }
  };

  const getCategoryBg = (category: NotificationCategory) => {
    switch (category) {
      case 'banca':
      case 'edital':
        return 'bg-blue-50 border-blue-100 text-blue-700';
      case 'meta':
        return 'bg-emerald-50 border-emerald-100 text-emerald-700';
      case 'streak':
        return 'bg-amber-50 border-amber-100 text-amber-700';
      case 'simulado':
        return 'bg-purple-50 border-purple-100 text-purple-700';
      default:
        return 'bg-slate-50 border-slate-100 text-slate-700';
    }
  };

  return (
    <>
      {/* Backdrop for closing */}
      <div 
        className="fixed inset-0 z-40" 
        onClick={onClose} 
      />

      <div className="absolute right-0 top-full mt-2 w-[340px] sm:w-[420px] max-w-[calc(100vw-1.5rem)] bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-white/10 text-white">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm tracking-tight text-white flex items-center gap-2">
                Notificações e Avisos
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white">
                    {unreadCount} nova{unreadCount > 1 ? 's' : ''}
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-slate-300">
                Avisos de banca, editais e progresso diário
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter bar and quick actions */}
        <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-1 overflow-x-auto">
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                filter === 'all' 
                  ? 'bg-slate-900 text-white' 
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              Todas ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                filter === 'unread' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              Não lidas ({unreadCount})
            </button>
            <button
              onClick={() => setFilter('banca')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                filter === 'banca' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              Bancas
            </button>
            <button
              onClick={() => setFilter('meta')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                filter === 'meta' 
                  ? 'bg-emerald-600 text-white' 
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              Metas
            </button>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                title="Marcar todas como lidas"
                className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer text-xs font-medium flex items-center gap-1"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[11px]">Ler todas</span>
              </button>
            )}
            {notifications.some(n => n.read) && (
              <button
                onClick={onClearRead}
                title="Limpar lidas"
                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100">
          {filteredNotifications.length === 0 ? (
            <div className="py-10 px-4 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-2 text-slate-400">
                <Bell className="w-6 h-6" />
              </div>
              <p className="text-xs font-semibold text-slate-700">
                Nenhum aviso encontrado
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Você está em dia com todas as novidades e metas.
              </p>
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => {
                  if (!notif.read) onMarkAsRead(notif.id);
                  if (notif.linkTab && onNavigateTab) {
                    onNavigateTab(notif.linkTab);
                    onClose();
                  }
                }}
                className={`p-3.5 transition-colors cursor-pointer flex gap-3 items-start group ${
                  notif.read ? 'bg-white hover:bg-slate-50' : 'bg-blue-50/40 hover:bg-blue-50/70'
                }`}
              >
                <div className={`p-2 rounded-xl border shrink-0 mt-0.5 ${getCategoryBg(notif.category)}`}>
                  {getCategoryIcon(notif.category)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`text-xs font-bold leading-tight ${
                        notif.read ? 'text-slate-800' : 'text-blue-950 font-extrabold'
                      }`}>
                        {notif.title}
                      </span>
                      {notif.badge && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200">
                          {notif.badge}
                        </span>
                      )}
                    </div>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                    )}
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {notif.message}
                  </p>

                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{notif.timestamp}</span>
                    {notif.linkTab && (
                      <span className="text-blue-600 font-semibold group-hover:underline flex items-center gap-1">
                        Acessar <ExternalLink className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-center">
          <p className="text-[11px] text-slate-500 font-medium">
            Notificações atualizadas em tempo real conforme você resolve questões e simulados
          </p>
        </div>
      </div>
    </>
  );
}
