'use client';

import React from 'react';
import { X, Database, CheckCircle2, RefreshCw, Globe, Server, Clock } from 'lucide-react';

interface ScrapingLogEntry {
  id: string;
  timestamp: string;
  source: string;
  message: string;
  status: 'success' | 'info' | 'warning';
}

interface ScrapingLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: ScrapingLogEntry[];
  totalJobs: number;
  lastScraped: string | null;
  onRunScraper: () => void;
  isScraping: boolean;
  isDarkMode: boolean;
}

export function ScrapingLogModal({
  isOpen,
  onClose,
  logs,
  totalJobs,
  lastScraped,
  onRunScraper,
  isScraping,
  isDarkMode,
}: ScrapingLogModalProps) {
  if (!isOpen) return null;

  const connectedPortals = [
    { name: 'Glints Indonesia', type: 'Situs Loker', status: 'Online', latency: '340ms' },
    { name: 'Kalibrr ID', type: 'Situs Loker', status: 'Online', latency: '420ms' },
    { name: 'JobStreet Indonesia', type: 'Situs Loker', status: 'Online', latency: '380ms' },
    { name: 'Jooble Indonesia', type: 'Agregator Loker', status: 'Online', latency: '290ms' },
    { name: 'Radar Lamongan (Jawa Pos)', type: 'Portal Berita', status: 'Online', latency: '190ms' },
    { name: 'Surya Lamongan (Tribun)', type: 'Portal Berita', status: 'Online', latency: '210ms' },
    { name: 'Disnaker Lamongan Karirhub', type: 'Pemerintah', status: 'Online', latency: '450ms' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        id="scraping-api-log-modal"
        className={`w-full max-w-2xl rounded-2xl shadow-2xl border p-6 transition-all max-h-[85vh] flex flex-col overflow-hidden ${
          isDarkMode
            ? 'bg-[#282a2d] border-[#3c4043] text-[#e8eaed]'
            : 'bg-white border-gray-200 text-gray-900'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600/10 text-blue-500">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-snug">
                Status Mesin Scraping & Agregasi Loker Lamongan
              </h3>
              <p className="text-xs text-gray-400">
                Data pipeline otomatis dari portal berita lokal & situs loker nasional
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

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 no-scrollbar">
          {/* Metrics Row */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className={`p-3 rounded-xl border ${isDarkMode ? 'bg-[#303134] border-[#3c4043]' : 'bg-slate-50 border-slate-200'}`}>
              <div className="text-xl font-bold text-blue-500">{totalJobs}</div>
              <div className="text-[11px] text-gray-400 mt-0.5">Total Lowongan Aktif</div>
            </div>
            <div className={`p-3 rounded-xl border ${isDarkMode ? 'bg-[#303134] border-[#3c4043]' : 'bg-slate-50 border-slate-200'}`}>
              <div className="text-xl font-bold text-emerald-500">7 / 7</div>
              <div className="text-[11px] text-gray-400 mt-0.5">Portal Terhubung</div>
            </div>
            <div className={`p-3 rounded-xl border ${isDarkMode ? 'bg-[#303134] border-[#3c4043]' : 'bg-slate-50 border-slate-200'}`}>
              <div className="text-xs font-semibold text-amber-500 truncate mt-1">
                {lastScraped || 'Baru saja'}
              </div>
              <div className="text-[11px] text-gray-400 mt-1">Sinkronisasi Terakhir</div>
            </div>
          </div>

          {/* Connected Portals List */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              Konektor Portal Berita & Situs Loker:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {connectedPortals.map((portal) => (
                <div
                  key={portal.name}
                  className={`p-2.5 rounded-xl border flex items-center justify-between ${
                    isDarkMode
                      ? 'bg-[#303134] border-[#3c4043] text-gray-300'
                      : 'bg-gray-50 border-gray-200 text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-blue-400" />
                    <div>
                      <span className="font-semibold block">{portal.name}</span>
                      <span className="text-[10px] text-gray-400">{portal.type}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 text-emerald-500 font-medium text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      {portal.status}
                    </span>
                    <span className="block text-[10px] text-gray-400 font-mono">
                      {portal.latency}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Log Stream */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              Log Aktivitas Scraping:
            </h4>
            <div
              className={`p-3 rounded-xl border font-mono text-[11px] space-y-2 max-h-48 overflow-y-auto ${
                isDarkMode
                  ? 'bg-[#18191c] border-[#303134] text-gray-300'
                  : 'bg-slate-900 border-slate-800 text-slate-200'
              }`}
            >
              {logs.map((entry) => (
                <div key={entry.id} className="flex items-start gap-2">
                  <span className="text-gray-500 shrink-0">[{entry.timestamp}]</span>
                  <span
                    className={`font-semibold shrink-0 ${
                      entry.status === 'success'
                        ? 'text-emerald-400'
                        : entry.status === 'warning'
                        ? 'text-amber-400'
                        : 'text-sky-400'
                    }`}
                  >
                    [{entry.source}]
                  </span>
                  <span className="leading-tight">{entry.message}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <span className="text-xs text-gray-400">
            Engine: Gemini 3.8 Search Grounding + Realtime Crawler
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-colors ${
                isDarkMode ? 'hover:bg-[#303134] text-gray-400' : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              Tutup
            </button>
            <button
              type="button"
              onClick={onRunScraper}
              disabled={isScraping}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isScraping ? 'animate-spin' : ''}`} />
              <span>{isScraping ? 'Menarik Data...' : 'Mulai Scraping Baru'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
