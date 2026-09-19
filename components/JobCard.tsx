'use client';

import React from 'react';
import { Bookmark, Share2, Clock, Briefcase, Banknote, Sparkles } from 'lucide-react';
import { Job } from '@/types/job';

interface JobCardProps {
  job: Job;
  isSelected: boolean;
  isSaved: boolean;
  onSelect: (job: Job) => void;
  onToggleSave: (job: Job, e: React.MouseEvent) => void;
  onShare: (job: Job, e: React.MouseEvent) => void;
  isDarkMode: boolean;
}

export function JobCard({
  job,
  isSelected,
  isSaved,
  onSelect,
  onToggleSave,
  onShare,
  isDarkMode,
}: JobCardProps) {
  return (
    <article
      id={`job-card-${job.id}`}
      onClick={() => onSelect(job)}
      className={`relative cursor-pointer transition-all border-b p-4 md:p-5 select-none ${
        isDarkMode
          ? isSelected
            ? 'bg-[#282a2d] border-[#3c4043]'
            : 'bg-[#202124] hover:bg-[#28292c] border-[#303134]'
          : isSelected
          ? 'bg-blue-50/60 border-blue-200'
          : 'bg-white hover:bg-slate-50/80 border-gray-200'
      }`}
    >
      {/* Active Left Indicator Bar */}
      {isSelected && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#1a73e8]" />
      )}

      <div className="flex items-start gap-3.5">
        {/* Company Avatar / Logo */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-base shrink-0 overflow-hidden shadow-xs transition-transform duration-200 group-hover:scale-105"
          style={{
            backgroundColor: job.companyBgColor || '#3b82f6',
            color: job.companyTextColor || '#ffffff',
          }}
        >
          {job.companyInitial}
        </div>

        {/* Job Info Center */}
        <div className="flex-1 min-w-0">
          {/* Top Line: Title and Action Buttons */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <h2
                className={`font-semibold text-base md:text-lg leading-snug line-clamp-1 hover:underline ${
                  isDarkMode ? 'text-[#e8eaed]' : 'text-gray-900'
                }`}
              >
                {job.title}
              </h2>
              <p
                className={`text-sm font-medium mt-0.5 ${
                  isDarkMode ? 'text-[#bdc1c6]' : 'text-gray-700'
                }`}
              >
                {job.company}
              </p>
            </div>

            {/* Quick Actions (Bookmark & Share) */}
            <div className="flex items-center gap-1 shrink-0 -mt-1 -mr-1">
              <button
                type="button"
                id={`btn-save-job-${job.id}`}
                onClick={(e) => onToggleSave(job, e)}
                className={`p-2 rounded-full transition-colors ${
                  isSaved
                    ? 'text-blue-500 hover:bg-blue-500/10'
                    : isDarkMode
                    ? 'text-[#9aa0a6] hover:bg-[#303134] hover:text-[#e8eaed]'
                    : 'text-gray-400 hover:bg-gray-100 hover:text-gray-700'
                }`}
                title={isSaved ? 'Hapus dari simpanan' : 'Simpan lowongan'}
                aria-label={isSaved ? 'Hapus dari simpanan' : 'Simpan lowongan'}
              >
                <Bookmark
                  className="w-4 h-4"
                  fill={isSaved ? 'currentColor' : 'none'}
                />
              </button>

              <button
                type="button"
                id={`btn-share-job-${job.id}`}
                onClick={(e) => onShare(job, e)}
                className={`p-2 rounded-full transition-colors ${
                  isDarkMode
                    ? 'text-[#9aa0a6] hover:bg-[#303134] hover:text-[#e8eaed]'
                    : 'text-gray-400 hover:bg-gray-100 hover:text-gray-700'
                }`}
                title="Bagikan lowongan"
                aria-label="Bagikan lowongan"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Location & Source (Exact style in screenshot: Lamongan, Jawa Timur • melalui Glints) */}
          <div
            className={`text-xs md:text-sm mt-1 flex items-center flex-wrap gap-1 ${
              isDarkMode ? 'text-[#9aa0a6]' : 'text-gray-500'
            }`}
          >
            <span>{job.location}</span>
            <span>•</span>
            <span className="font-medium text-inherit">melalui {job.source}</span>
          </div>

          {/* Metadata Badges: Posted Time, Salary, Job Type */}
          <div className="mt-3 flex items-center flex-wrap gap-2 text-xs">
            {/* Posted Time */}
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${
                isDarkMode
                  ? 'bg-[#303134] text-[#9aa0a6]'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span>{job.postedTime}</span>
            </div>

            {/* Salary if available */}
            {job.salary && (
              <div
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium ${
                  isDarkMode
                    ? 'bg-[#2b392b] text-[#81c995]'
                    : 'bg-emerald-50 text-emerald-700'
                }`}
              >
                <Banknote className="w-3.5 h-3.5 shrink-0" />
                <span>{job.salary}</span>
              </div>
            )}

            {/* Job Type */}
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${
                isDarkMode
                  ? 'bg-[#303134] text-[#9aa0a6]'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 shrink-0" />
              <span>{job.jobType}</span>
            </div>

            {/* Scraped New Badge */}
            {job.isNew && (
              <div
                className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                  isDarkMode
                    ? 'bg-blue-900/40 text-blue-300 border border-blue-700/50'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Terbaru</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
