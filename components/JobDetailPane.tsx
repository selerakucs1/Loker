'use client';

import React from 'react';
import {
  ExternalLink,
  Bookmark,
  Share2,
  Clock,
  Briefcase,
  Banknote,
  MapPin,
  Building,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Mail,
  Phone,
  ArrowLeft,
  Globe,
} from 'lucide-react';
import { Job } from '@/types/job';

interface JobDetailPaneProps {
  job: Job | null;
  isSaved: boolean;
  onToggleSave: (job: Job) => void;
  onShare: (job: Job) => void;
  onCloseMobile?: () => void;
  isDarkMode: boolean;
}

export function JobDetailPane({
  job,
  isSaved,
  onToggleSave,
  onShare,
  onCloseMobile,
  isDarkMode,
}: JobDetailPaneProps) {
  if (!job) {
    return (
      <div
        id="empty-job-detail-pane"
        className={`h-full flex flex-col items-center justify-center p-8 text-center select-none ${
          isDarkMode ? 'text-gray-400 bg-[#202124]' : 'text-gray-500 bg-white'
        }`}
      >
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
            isDarkMode ? 'bg-[#303134] text-gray-400' : 'bg-gray-100 text-gray-400'
          }`}
        >
          <Briefcase className="w-8 h-8" />
        </div>
        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
          Pilih lowongan pekerjaan
        </h3>
        <p className="text-sm mt-1 max-w-sm">
          Klik salah satu postingan di daftar lowongan sebelah kiri untuk melihat rincian lengkap, syarat kualifikasi, dan cara melamar.
        </p>
      </div>
    );
  }

  const handleApplyClick = () => {
    if (job.sourceUrl) {
      window.open(job.sourceUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      id={`job-detail-pane-${job.id}`}
      className={`h-full overflow-y-auto flex flex-col transition-colors ${
        isDarkMode ? 'bg-[#202124] text-[#e8eaed]' : 'bg-white text-gray-900'
      }`}
    >
      {/* Mobile Back Button Header */}
      {onCloseMobile && (
        <div
          className={`lg:hidden sticky top-0 z-20 px-4 py-3 flex items-center gap-2 border-b backdrop-blur-md ${
            isDarkMode
              ? 'bg-[#202124]/90 border-[#3c4043]'
              : 'bg-white/90 border-gray-200'
          }`}
        >
          <button
            type="button"
            onClick={onCloseMobile}
            className={`p-2 rounded-full transition-colors ${
              isDarkMode ? 'hover:bg-[#303134] text-gray-300' : 'hover:bg-gray-100 text-gray-700'
            }`}
            title="Kembali ke daftar lowongan"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="font-semibold text-sm truncate">Detail Lowongan</span>
        </div>
      )}

      <div className="p-6 md:p-8 space-y-6">
        {/* Main Job Header */}
        <div>
          <div className="flex items-start gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl shrink-0 shadow-xs"
              style={{
                backgroundColor: job.companyBgColor || '#3b82f6',
                color: job.companyTextColor || '#ffffff',
              }}
            >
              {job.companyInitial}
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="text-xl md:text-2xl font-bold leading-tight">
                {job.title}
              </h1>
              
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="font-semibold text-base text-blue-500">
                  {job.company}
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-emerald-500 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Terverifikasi
                </span>
              </div>

              <div
                className={`flex items-center gap-2 mt-1.5 text-xs md:text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  <span>{job.location}</span>
                </div>
                <span>•</span>
                <span>melalui <strong className="font-medium">{job.source}</strong></span>
              </div>
            </div>
          </div>

          {/* Quick Badges */}
          <div className="mt-4 flex items-center flex-wrap gap-2 text-xs">
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${
                isDarkMode ? 'bg-[#303134] text-gray-300' : 'bg-gray-100 text-gray-700'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              <span>Diposting {job.postedTime}</span>
            </div>

            {job.salary && (
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium ${
                  isDarkMode
                    ? 'bg-[#2b392b] text-[#81c995]'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}
              >
                <Banknote className="w-3.5 h-3.5" />
                <span>{job.salary}</span>
              </div>
            )}

            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${
                isDarkMode ? 'bg-[#303134] text-gray-300' : 'bg-gray-100 text-gray-700'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 text-gray-400" />
              <span>{job.jobType}</span>
            </div>

            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${
                isDarkMode ? 'bg-[#303134] text-gray-300' : 'bg-gray-100 text-gray-700'
              }`}
            >
              <Building className="w-3.5 h-3.5 text-gray-400" />
              <span>{job.workplaceType}</span>
            </div>
          </div>

          {/* Action CTAs: Lamar, Simpan, Bagikan */}
          <div className="mt-6 flex items-center flex-wrap gap-3">
            <button
              type="button"
              id="btn-lamar-sekarang"
              onClick={handleApplyClick}
              className="px-6 py-2.5 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white text-sm font-semibold flex items-center gap-2 shadow-md transition-all active:scale-95"
            >
              <span>Lamar di {job.source}</span>
              <ExternalLink className="w-4 h-4" />
            </button>

            <button
              type="button"
              id="btn-simpan-detail"
              onClick={() => onToggleSave(job)}
              className={`px-4 py-2.5 rounded-full border text-sm font-medium flex items-center gap-2 transition-all ${
                isSaved
                  ? 'border-blue-500 bg-blue-500/10 text-blue-500'
                  : isDarkMode
                  ? 'border-[#3c4043] hover:bg-[#303134] text-gray-300'
                  : 'border-gray-300 hover:bg-gray-50 text-gray-700'
              }`}
            >
              <Bookmark className="w-4 h-4" fill={isSaved ? 'currentColor' : 'none'} />
              <span>{isSaved ? 'Tersimpan' : 'Simpan'}</span>
            </button>

            <button
              type="button"
              id="btn-bagikan-detail"
              onClick={() => onShare(job)}
              className={`px-4 py-2.5 rounded-full border text-sm font-medium flex items-center gap-2 transition-all ${
                isDarkMode
                  ? 'border-[#3c4043] hover:bg-[#303134] text-gray-300'
                  : 'border-gray-300 hover:bg-gray-50 text-gray-700'
              }`}
            >
              <Share2 className="w-4 h-4" />
              <span>Bagikan</span>
            </button>
          </div>
        </div>

        <hr className={isDarkMode ? 'border-[#3c4043]' : 'border-gray-200'} />

        {/* Deskripsi Pekerjaan */}
        <section className="space-y-2">
          <h2 className={`text-base font-bold uppercase tracking-wider text-xs ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Deskripsi Pekerjaan
          </h2>
          <p className="text-sm leading-relaxed whitespace-pre-line text-inherit">
            {job.description}
          </p>
        </section>

        {/* Persyaratan & Kualifikasi */}
        {job.requirements && job.requirements.length > 0 && (
          <section className="space-y-3">
            <h2 className={`text-base font-bold uppercase tracking-wider text-xs ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Persyaratan & Kualifikasi
            </h2>
            <ul className="space-y-2 text-sm">
              {job.requirements.map((req, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{req}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Tanggung Jawab (jika ada) */}
        {job.responsibilities && job.responsibilities.length > 0 && (
          <section className="space-y-3">
            <h2 className={`text-base font-bold uppercase tracking-wider text-xs ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Tanggung Jawab Utama
            </h2>
            <ul className="space-y-2 text-sm">
              {job.responsibilities.map((resp, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0 mt-2" />
                  <span className="leading-relaxed">{resp}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Keuntungan & Benefit */}
        {job.benefits && job.benefits.length > 0 && (
          <section className="space-y-3">
            <h2 className={`text-base font-bold uppercase tracking-wider text-xs ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Benefit & Fasilitas
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              {job.benefits.map((benefit, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border flex items-center gap-2.5 ${
                    isDarkMode
                      ? 'bg-[#282a2d] border-[#3c4043] text-gray-200'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <span className="text-emerald-500 font-bold text-sm">✓</span>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Cara Melamar & Kontak */}
        <section
          className={`p-5 rounded-2xl border ${
            isDarkMode
              ? 'bg-[#282a2d] border-[#3c4043]'
              : 'bg-blue-50/50 border-blue-200'
          }`}
        >
          <h2 className="text-sm font-bold flex items-center gap-2 mb-2">
            <span>Cara Melamar</span>
          </h2>
          <p className="text-sm leading-relaxed mb-4">{job.howToApply}</p>

          <div className="flex flex-wrap gap-3 text-xs">
            {job.applicationEmail && (
              <a
                href={`mailto:${job.applicationEmail}?subject=Lamaran Pekerjaan: ${encodeURIComponent(
                  job.title
                )}`}
                className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-colors ${
                  isDarkMode
                    ? 'border-[#3c4043] hover:bg-[#303134] text-blue-400'
                    : 'border-blue-200 bg-white hover:bg-blue-50 text-blue-700'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Kirim Email: {job.applicationEmail}</span>
              </a>
            )}

            {job.applicationPhone && (
              <a
                href={`https://wa.me/${job.applicationPhone.replace(/\+/g, '')}?text=Halo%20HRD,%20saya%20tertarik%20melamar%20posisi%20${encodeURIComponent(
                  job.title
                )}%20di%20${encodeURIComponent(job.company)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-colors ${
                  isDarkMode
                    ? 'border-[#3c4043] hover:bg-[#303134] text-emerald-400'
                    : 'border-emerald-200 bg-white hover:bg-emerald-50 text-emerald-700'
                }`}
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Hubungi WA HRD: {job.applicationPhone}</span>
              </a>
            )}

            <button
              type="button"
              onClick={handleApplyClick}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 font-medium transition-all"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Buka Portal Asli ({job.source})</span>
            </button>
          </div>
        </section>

        {/* Verifikasi & Rujukan Scraping */}
        {job.groundingSources && job.groundingSources.length > 0 && (
          <section className="space-y-2 pt-2">
            <h3 className={`text-xs font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Sumber Validasi Web & Scraping:
            </h3>
            <div className="flex flex-wrap gap-2 text-xs">
              {job.groundingSources.map((gs, idx) => (
                <a
                  key={idx}
                  href={gs.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md border text-[11px] hover:underline ${
                    isDarkMode
                      ? 'border-[#3c4043] bg-[#282a2d] text-blue-400'
                      : 'border-gray-200 bg-gray-50 text-blue-600'
                  }`}
                >
                  <Globe className="w-3 h-3" />
                  <span className="truncate max-w-[200px]">{gs.title}</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Disclaimer Keamanan Pencari Kerja */}
        <div
          className={`p-3.5 rounded-xl border flex items-start gap-3 text-xs leading-relaxed ${
            isDarkMode
              ? 'bg-amber-950/20 border-amber-900/40 text-amber-300'
              : 'bg-amber-50 border-amber-200 text-amber-800'
          }`}
        >
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
          <div>
            <strong>Waspada Penipuan Lowongan Kerja:</strong> Perusahaan terpercaya tidak pernah memungut biaya tiket pesawat, hotel, atau uang administrasi dalam proses rekrutmen. Laporkan jika menemukan indikasi penipuan.
          </div>
        </div>
      </div>
    </div>
  );
}
