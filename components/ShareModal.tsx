'use client';

import React, { useState } from 'react';
import { X, Copy, Check, Share2, MessageCircle, Send } from 'lucide-react';
import { Job } from '@/types/job';

interface ShareModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

export function ShareModal({
  job,
  isOpen,
  onClose,
  isDarkMode,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !job) return null;

  const shareText = `*Lowongan Kerja Lamongan Terbaru*\nPosisi: ${job.title}\nPerusahaan: ${job.company}\nLokasi: ${job.location}\nGaji: ${job.salary || 'Sesuai UMK'}\nSumber: ${job.source}\n\nLamar segera di: ${job.sourceUrl || window.location.href}`;

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(`${job.title} - ${job.company}\n${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleTelegramShare = () => {
    const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(
      `${job.title} - ${job.company} (Lamongan)`
    )}`;
    window.open(tgUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        id="share-job-modal"
        className={`w-full max-w-md rounded-2xl shadow-2xl border p-6 transition-all overflow-hidden ${
          isDarkMode
            ? 'bg-[#282a2d] border-[#3c4043] text-[#e8eaed]'
            : 'bg-white border-gray-200 text-gray-900'
        }`}
      >
        <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-blue-500" />
            <h3 className="font-bold text-lg">Bagikan Lowongan Kerja</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`p-1.5 rounded-full transition-colors ${
              isDarkMode ? 'hover:bg-[#3c4043] text-gray-400' : 'hover:bg-gray-100 text-gray-500'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="my-4 p-3.5 rounded-xl border bg-slate-50 dark:bg-[#303134] dark:border-[#3c4043]">
          <h4 className="font-semibold text-sm line-clamp-1">{job.title}</h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {job.company} • {job.location}
          </p>
        </div>

        {/* Quick Social Share Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            type="button"
            onClick={handleWhatsAppShare}
            className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={handleTelegramShare}
            className="p-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-medium text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <Send className="w-4 h-4" />
            <span>Telegram</span>
          </button>
        </div>

        {/* Copy Link Section */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
            Salin Tautan Lowongan:
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className={`w-full px-3 py-2 rounded-xl border text-xs outline-hidden select-all ${
                isDarkMode
                  ? 'bg-[#303134] border-[#3c4043] text-gray-300'
                  : 'bg-gray-50 border-gray-300 text-gray-700'
              }`}
            />
            <button
              type="button"
              onClick={handleCopy}
              className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white active:scale-95'
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Tersalin' : 'Salin'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
