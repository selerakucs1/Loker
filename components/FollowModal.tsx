'use client';

import React, { useState } from 'react';
import { X, Bell, CheckCircle2, Mail, MessageSquare } from 'lucide-react';

interface FollowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFollowKeywords: (keywords: string[]) => void;
  followedKeywords: string[];
  isDarkMode: boolean;
}

export function FollowModal({
  isOpen,
  onClose,
  onFollowKeywords,
  followedKeywords,
  isDarkMode,
}: FollowModalProps) {
  const [selectedTopics, setSelectedTopics] = useState<string[]>(
    followedKeywords.length > 0
      ? followedKeywords
      : ['Lowongan Lamongan Terbaru', 'Operator Gudang & Pabrik', 'Staff Admin & Kasir']
  );
  const [contactType, setContactType] = useState<'email' | 'wa'>('wa');
  const [contactValue, setContactValue] = useState('');
  const [isSavedSuccess, setIsSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const topicsList = [
    'Lowongan Lamongan Terbaru',
    'Operator Gudang & Pabrik',
    'Staff Admin & Kasir',
    'Sales Canvasser & Marketing',
    'Wilayah Babat & Lamongan Barat',
    'Wilayah Paciran & Pantura',
    'Kuliner & F&B Lamongan',
    'Tenaga Kesehatan & Medis',
  ];

  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onFollowKeywords(selectedTopics);
    setIsSavedSuccess(true);
    setTimeout(() => {
      setIsSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        id="follow-alert-modal"
        className={`w-full max-w-lg rounded-2xl shadow-2xl border p-6 transition-all overflow-hidden ${
          isDarkMode
            ? 'bg-[#282a2d] border-[#3c4043] text-[#e8eaed]'
            : 'bg-white border-gray-200 text-gray-900'
        }`}
      >
        <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600/10 text-blue-600">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-snug">
                Ikuti Lowongan Kerja Lamongan
              </h3>
              <p className="text-xs text-gray-400">
                Dapatkan pemberitahuan seketika saat scraping menemukan lowongan baru
              </p>
            </div>
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

        {isSavedSuccess ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 animate-bounce mb-3" />
            <h4 className="text-xl font-bold">Pemberitahuan Aktif!</h4>
            <p className="text-sm text-gray-400 mt-1">
              Anda kini mengikuti pembaruan lowongan kerja otomatis di Lamongan.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                Pilih Kategori Lowongan yang Ingin Diikuti:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {topicsList.map((topic) => {
                  const isChecked = selectedTopics.includes(topic);
                  return (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => toggleTopic(topic)}
                      className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                        isChecked
                          ? isDarkMode
                            ? 'border-blue-500 bg-blue-500/10 text-blue-400 font-medium'
                            : 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
                          : isDarkMode
                          ? 'border-[#3c4043] text-gray-300 hover:bg-[#303134]'
                          : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span>{topic}</span>
                      {isChecked && <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                Kanal Pemberitahuan Otomatis:
              </label>
              <div className="flex gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => setContactType('wa')}
                  className={`flex-1 py-2 px-3 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                    contactType === 'wa'
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : isDarkMode
                      ? 'border-[#3c4043] text-gray-300'
                      : 'border-gray-200 text-gray-700'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp Alert</span>
                </button>
                <button
                  type="button"
                  onClick={() => setContactType('email')}
                  className={`flex-1 py-2 px-3 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                    contactType === 'email'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : isDarkMode
                      ? 'border-[#3c4043] text-gray-300'
                      : 'border-gray-200 text-gray-700'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email Notifikasi</span>
                </button>
              </div>

              <input
                type={contactType === 'email' ? 'email' : 'tel'}
                value={contactValue}
                onChange={(e) => setContactValue(e.target.value)}
                placeholder={
                  contactType === 'email'
                    ? 'Masukkan email Anda (contoh: pelamar@gmail.com)'
                    : 'Masukkan No. WhatsApp (contoh: 08123456789)'
                }
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-hidden ${
                  isDarkMode
                    ? 'bg-[#303134] border-[#3c4043] text-gray-200 focus:border-blue-500'
                    : 'bg-gray-50 border-gray-300 text-gray-800 focus:border-blue-500'
                }`}
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition-colors ${
                  isDarkMode ? 'hover:bg-[#303134] text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md transition-all active:scale-95"
              >
                Simpan & Aktifkan Notifikasi
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
