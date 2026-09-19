'use client';

import React from 'react';
import { RefreshCw, Zap, CheckCircle2, AlertCircle, Database, Clock } from 'lucide-react';

interface AutoUpdateBarProps {
  isAutoUpdateEnabled: boolean;
  onToggleAutoUpdate: () => void;
  updateIntervalSeconds: number;
  onChangeInterval: (sec: number) => void;
  secondsRemaining: number;
  isScraping: boolean;
  onManualScrape: () => void;
  lastScrapedTime: string | null;
  totalJobsCount: number;
  onOpenLogModal: () => void;
  isDarkMode: boolean;
}

export function AutoUpdateBar({
  isAutoUpdateEnabled,
  onToggleAutoUpdate,
  updateIntervalSeconds,
  onChangeInterval,
  secondsRemaining,
  isScraping,
  onManualScrape,
  lastScrapedTime,
  totalJobsCount,
  onOpenLogModal,
  isDarkMode,
}: AutoUpdateBarProps) {
  const sources = [
    { name: 'Glints', color: 'bg-yellow-500' },
    { name: 'Kalibrr', color: 'bg-blue-500' },
    { name: 'JobStreet', color: 'bg-purple-500' },
    { name: 'Jooble', color: 'bg-indigo-500' },
    { name: 'Radar Lamongan', color: 'bg-emerald-500' },
    { name: 'Indeed', color: 'bg-sky-500' },
  ];

  return (
    <div
      id="auto-update-bar"
      className={`border-b transition-colors py-2.5 px-4 ${
        isDarkMode
          ? 'bg-[#18191c] border-[#303134] text-[#bdc1c6]'
          : 'bg-slate-50 border-slate-200 text-slate-700'
      }`}
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left: Scraping status and auto-update switch */}
        <div className="flex items-center flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              {isAutoUpdateEnabled && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              )}
              <span
                className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                  isAutoUpdateEnabled ? 'bg-emerald-500' : 'bg-gray-400'
                }`}
              ></span>
            </span>
            <span className="font-semibold flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              Scraping Engine:
            </span>
            <label className="inline-flex items-center cursor-pointer select-none">
              <input
                id="toggle-auto-update"
                type="checkbox"
                checked={isAutoUpdateEnabled}
                onChange={onToggleAutoUpdate}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
              <span className="ml-2 font-medium">
                {isAutoUpdateEnabled ? 'Oto Update Aktif' : 'Oto Update Nonaktif'}
              </span>
            </label>
          </div>

          {/* Interval selector */}
          {isAutoUpdateEnabled && (
            <div className="flex items-center gap-1.5 pl-2 border-l border-gray-300 dark:border-gray-700">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              <span>Interval:</span>
              <select
                id="select-scrape-interval"
                value={updateIntervalSeconds}
                onChange={(e) => onChangeInterval(Number(e.target.value))}
                className={`py-0.5 px-2 rounded-md border text-xs outline-hidden ${
                  isDarkMode
                    ? 'bg-[#303134] border-[#3c4043] text-gray-200'
                    : 'bg-white border-gray-300 text-gray-700'
                }`}
              >
                <option value={300}>5 Menit (Direkomendasikan)</option>
                <option value={600}>10 Menit (Hemat Kuota)</option>
                <option value={900}>15 Menit</option>
                <option value={60}>1 Menit</option>
              </select>
              <span
                className={`font-mono px-1.5 py-0.5 rounded text-[11px] ${
                  isDarkMode ? 'bg-[#303134] text-emerald-400' : 'bg-emerald-100 text-emerald-700'
                }`}
              >
                {secondsRemaining}s
              </span>
            </div>
          )}

          {/* Last updated */}
          <div className="hidden lg:flex items-center gap-1 text-[11px] text-gray-400">
            <span>• Terakhir diperbarui:</span>
            <span className="font-medium text-gray-300">
              {lastScrapedTime ? lastScrapedTime : 'Baru saja'}
            </span>
          </div>
        </div>

        {/* Right: Manual Scrape CTA & Sources status */}
        <div className="flex items-center gap-2.5">
          <div className="hidden sm:flex items-center gap-1.5 text-[11px]">
            <span className="text-gray-400">Sumber:</span>
            {sources.slice(0, 4).map((s) => (
              <span
                key={s.name}
                className={`px-1.5 py-0.5 rounded-sm text-[10px] font-medium flex items-center gap-1 ${
                  isDarkMode ? 'bg-[#2b2d30] text-gray-300' : 'bg-white border border-gray-200 text-gray-600'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${s.color}`}></span>
                {s.name}
              </span>
            ))}
          </div>

          <button
            type="button"
            id="btn-scrape-logs"
            onClick={onOpenLogModal}
            className={`px-2.5 py-1 rounded-md border text-xs font-medium flex items-center gap-1.5 transition-colors ${
              isDarkMode
                ? 'border-[#3c4043] hover:bg-[#303134] text-gray-300'
                : 'border-gray-200 hover:bg-white text-gray-700'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden xs:inline">Log API</span>
            <span className="bg-blue-600 text-white rounded-full px-1 text-[10px]">
              {totalJobsCount}
            </span>
          </button>

          <button
            type="button"
            id="btn-manual-scrape"
            onClick={onManualScrape}
            disabled={isScraping}
            className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs ${
              isScraping
                ? 'bg-blue-600/50 text-white cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 active:scale-95 text-white'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScraping ? 'animate-spin' : ''}`} />
            <span>{isScraping ? 'Menarik Data...' : 'Perbarui Sekarang'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
