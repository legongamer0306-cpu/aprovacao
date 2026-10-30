'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Upload,
  Image as ImageIcon,
  Trash2,
  RefreshCw,
  Eye,
  Check,
  Link as LinkIcon,
  X,
  AlertCircle,
  VideoOff
} from 'lucide-react';
import { PRESET_STUDENT_AVATARS } from '@/lib/mockData';

interface StudentPhotoCaptureProps {
  label?: string;
  sublabel?: string;
  photoUrl: string;
  onChangePhoto: (url: string) => void;
  allowCamera?: boolean;
  aspectRatio?: 'square' | 'document';
  placeholderText?: string;
}

export function StudentPhotoCapture({
  label = 'Foto de Perfil do Aluno',
  sublabel = 'Carregue do seu aparelho, tire uma foto com a câmera ou escolha um avatar.',
  photoUrl,
  onChangePhoto,
  allowCamera = true,
  aspectRatio = 'square',
  placeholderText = 'Sem foto selecionada'
}: StudentPhotoCaptureProps) {
  const [mode, setMode] = useState<'upload' | 'camera' | 'presets' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [previewZoomOpen, setPreviewZoomOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Stop camera helper
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
    setCameraError('');
  };

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Start webcam
  const startCamera = async () => {
    stopCamera();
    setCameraError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 640 }
        },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
      setMode('camera');
    } catch (err: any) {
      console.warn('Webcam not accessible:', err);
      setCameraError('Não foi possível acessar a câmera do dispositivo. Verifique as permissões do navegador ou escolha carregar uma foto salva.');
      setIsCameraActive(false);
    }
  };

  // Capture snapshot from webcam
  const captureSnapshot = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 480;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
    onChangePhoto(dataUrl);
    stopCamera();
  };

  // Process chosen file
  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione um arquivo de imagem válido (JPG, PNG ou WebP).');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      alert('A imagem é muito grande. Escolha uma foto de até 8MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        onChangePhoto(result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  return (
    <div className="space-y-3 p-4 rounded-xl border border-blue-200/80 bg-blue-50/40">
      {/* Title & Badge */}
      <div className="flex items-center justify-between">
        <div>
          <label className="text-xs font-black text-[#0F172A] flex items-center gap-1.5">
            <Camera className="w-4 h-4 text-[#2563EB]" />
            <span>{label}</span>
          </label>
          {sublabel && (
            <p className="text-[11px] text-[#64748B] mt-0.5">{sublabel}</p>
          )}
        </div>
        {photoUrl && (
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
            <Check className="w-3 h-3 text-emerald-600" />
            Foto Anexada
          </span>
        )}
      </div>

      {/* Main Row: Preview + Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Preview Container */}
        <div className="relative group shrink-0">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative rounded-2xl overflow-hidden border-2 transition-all flex items-center justify-center bg-white shadow-xs ${
              aspectRatio === 'square' ? 'w-24 h-24' : 'w-36 h-24'
            } ${
              isDragging
                ? 'border-[#2563EB] bg-blue-50 ring-2 ring-blue-300'
                : photoUrl
                ? 'border-white ring-2 ring-[#CBD5E1]'
                : 'border-dashed border-[#CBD5E1]'
            }`}
          >
            {photoUrl ? (
              <>
                <img
                  src={photoUrl}
                  alt="Prévia da foto"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <button
                  type="button"
                  onClick={() => setPreviewZoomOpen(true)}
                  title="Ampliar foto"
                  className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer text-xs font-bold gap-1"
                >
                  <Eye className="w-4 h-4" />
                  <span>Ampliar</span>
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-2 text-[#94A3B8]">
                <ImageIcon className="w-6 h-6 text-[#CBD5E1] mb-1" />
                <span className="text-[9px] font-bold uppercase tracking-wider">
                  {placeholderText}
                </span>
              </div>
            )}
          </div>

          {/* Quick Remove Button */}
          {photoUrl && (
            <button
              type="button"
              onClick={() => {
                onChangePhoto('');
                stopCamera();
              }}
              title="Remover Foto"
              className="absolute -top-2 -right-2 p-1 bg-rose-600 hover:bg-rose-700 text-white rounded-full shadow-md transition-transform hover:scale-110 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex-1 w-full space-y-2">
          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            accept="image/png, image/jpeg, image/jpg, image/webp"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) processImageFile(file);
            }}
            className="hidden"
          />

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                stopCamera();
                fileInputRef.current?.click();
              }}
              className="px-3 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Carregar do Dispositivo</span>
            </button>

            {allowCamera && (
              <button
                type="button"
                onClick={() => {
                  if (isCameraActive) {
                    stopCamera();
                  } else {
                    startCamera();
                  }
                }}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border ${
                  isCameraActive
                    ? 'bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-[#CBD5E1]'
                }`}
              >
                <Camera className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>{isCameraActive ? 'Desligar Câmera' : 'Tirar Foto com Câmera'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                stopCamera();
                setMode(mode === 'presets' ? 'upload' : 'presets');
              }}
              className="px-2.5 py-2 rounded-xl border border-[#CBD5E1] bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              {mode === 'presets' ? 'Ocultar Avatares' : 'Avatares Prontos'}
            </button>

            <button
              type="button"
              onClick={() => {
                stopCamera();
                setMode(mode === 'url' ? 'upload' : 'url');
              }}
              className="px-2.5 py-2 rounded-xl border border-[#CBD5E1] bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              <LinkIcon className="w-3.5 h-3.5 text-[#64748B]" />
            </button>
          </div>

          <div className="text-[11px] text-[#64748B]">
            Arraste um arquivo ou tire uma foto 3x4 ao vivo com sua webcam. (JPG, PNG ou WebP).
          </div>
        </div>
      </div>

      {/* LIVE WEBCAM VIEWFINDER MODAL/DRAWER */}
      {isCameraActive && (
        <div className="p-3.5 rounded-xl border-2 border-[#2563EB] bg-slate-900 text-white space-y-3 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold flex items-center gap-1.5 text-blue-300">
              <Camera className="w-4 h-4 text-blue-400 animate-pulse" />
              <span>Câmera Ativa - Posicione o rosto no centro</span>
            </span>
            <button
              type="button"
              onClick={stopCamera}
              className="text-xs text-slate-300 hover:text-white p-1 rounded-md hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="relative mx-auto w-full max-w-xs h-56 bg-black rounded-xl overflow-hidden border border-slate-700 flex items-center justify-center">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover scale-x-[-1]"
            />
            {/* Portrait oval alignment guide */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-32 h-44 border-2 border-dashed border-white/60 rounded-full" />
            </div>
            <div className="absolute bottom-2 left-2 text-[10px] bg-black/60 px-2 py-0.5 rounded text-white font-mono">
              Enquadre seu rosto
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-1">
            <button
              type="button"
              onClick={captureSnapshot}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-lg flex items-center gap-2 cursor-pointer transition-transform hover:scale-105"
            >
              <Camera className="w-4 h-4" />
              <span>Capturar Foto Agora</span>
            </button>
            <button
              type="button"
              onClick={stopCamera}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* CAMERA ERROR WARNING */}
      {cameraError && (
        <div className="p-3 rounded-xl border border-amber-300 bg-amber-50 text-amber-900 text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1 leading-relaxed">
            <span>{cameraError}</span>
          </div>
          <button
            type="button"
            onClick={() => setCameraError('')}
            className="text-amber-800 hover:text-amber-950 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* PRESET AVATARS SELECTION */}
      {mode === 'presets' && (
        <div className="pt-2 border-t border-blue-200">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block mb-1.5">
            Selecione uma foto de perfil predefinida:
          </span>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {PRESET_STUDENT_AVATARS.map((av) => (
              <button
                key={av.id}
                type="button"
                onClick={() => {
                  onChangePhoto(av.url);
                  stopCamera();
                }}
                title={av.label}
                className={`relative rounded-xl overflow-hidden border-2 transition-all p-0.5 hover:scale-105 cursor-pointer ${
                  photoUrl === av.url
                    ? 'border-[#2563EB] ring-2 ring-blue-300'
                    : 'border-[#CBD5E1] hover:border-[#2563EB]'
                }`}
              >
                <img
                  src={av.url}
                  alt={av.label}
                  className="w-full h-12 object-cover rounded-lg"
                  referrerPolicy="no-referrer"
                />
                <span className="block text-[9px] font-bold text-center truncate text-slate-700 mt-0.5">
                  {av.label.split(' ')[0]}
                </span>
                {photoUrl === av.url && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#2563EB] text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                    ✓
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* DIRECT URL INPUT */}
      {mode === 'url' && (
        <div className="pt-2 border-t border-blue-200 space-y-2">
          <label className="block text-[11px] font-bold text-[#334155]">
            Link direto da foto do aluno (URL de imagem):
          </label>
          <div className="flex items-center gap-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://exemplo.com/foto-do-aluno.jpg"
              className="flex-1 text-xs px-3 py-2 rounded-lg border border-[#CBD5E1] bg-white outline-none focus:border-[#2563EB]"
            />
            <button
              type="button"
              onClick={() => {
                if (urlInput.trim()) {
                  onChangePhoto(urlInput.trim());
                  setUrlInput('');
                  setMode('upload');
                }
              }}
              className="px-3 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold cursor-pointer"
            >
              Aplicar
            </button>
          </div>
        </div>
      )}

      {/* FULLSCREEN LIGHTBOX PREVIEW */}
      {previewZoomOpen && photoUrl && (
        <div
          onClick={() => setPreviewZoomOpen(false)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-md w-full bg-white rounded-2xl overflow-hidden shadow-2xl p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-sm text-[#0F172A]">
                Foto do Aluno em Alta Resolução
              </span>
              <button
                type="button"
                onClick={() => setPreviewZoomOpen(false)}
                className="p-1 rounded-lg text-slate-500 hover:text-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="rounded-xl overflow-hidden border border-[#CBD5E1] bg-slate-900 max-h-[60vh] flex items-center justify-center">
              <img
                src={photoUrl}
                alt="Foto do Aluno Ampliada"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  onChangePhoto('');
                  setPreviewZoomOpen(false);
                }}
                className="px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold"
              >
                Excluir Foto
              </button>
              <button
                type="button"
                onClick={() => setPreviewZoomOpen(false)}
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
