'use client';

import React from 'react';
import { Bell, Bookmark, Briefcase, Plus } from 'lucide-react';

export type TabType = 'postings' | 'saved' | 'following';

interface NavigationTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  savedCount: number;
  followedCount: number;
  onFollowClick: () => void;
  isFollowingActive: boolean;
  isDarkMode: boolean;
}

export function NavigationTabs({
  activeTab,
  onTabChange,
  savedCount,
  followedCount,
  onFollowClick,
  isFollowingActive,
  isDarkMode,
}: NavigationTabsProps) {
  return (
    <div
      id="navigation-tabs-container"
      className={`border-b transition-colors ${
        isDarkMode
          ? 'bg-[#202124] border-[#3c4043] text-[#e8eaed]'
          : 'bg-white border-gray-200 text-gray-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Title Bar with "Ikuti" button */}
        <div className="pt-4 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl md:text-2xl font-normal tracking-normal text-inherit">
              Lowongan pekerjaan
            </h1>
            <span
              className={`hidden sm:inline-block text-xs px-2 py-0.5 rounded-sm ${
                isDarkMode ? 'bg-[#303134] text-gray-300' : 'bg-gray-100 text-gray-700'
              }`}
            >
              Kab. Lamongan
            </span>
          </div>

          <button
            type="button"
            id="btn-ikuti-jobs"
            onClick={onFollowClick}
            className={`px-4 py-1.5 rounded-full text-xs md:text-sm font-medium transition-all flex items-center gap-1.5 shadow-xs ${
              isFollowingActive
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-[#1a73e8] hover:bg-[#1557b0] text-white active:scale-95'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>{isFollowingActive ? 'Mengikuti' : 'Ikuti'}</span>
          </button>
        </div>

        {/* The 3 Tabs matching the user screenshot */}
        <div className="flex items-center gap-6 md:gap-8 overflow-x-auto no-scrollbar text-sm font-medium">
          <button
            type="button"
            id="tab-postingan-lowongan"
            onClick={() => onTabChange('postings')}
            className={`pb-3 border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'postings'
                ? isDarkMode
                  ? 'border-[#8ab4f8] text-[#8ab4f8]'
                  : 'border-[#1a73e8] text-[#1a73e8]'
                : isDarkMode
                ? 'border-transparent text-[#9aa0a6] hover:text-[#e8eaed]'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Postingan lowongan</span>
          </button>

          <button
            type="button"
            id="tab-lowongan-disimpan"
            onClick={() => onTabChange('saved')}
            className={`pb-3 border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'saved'
                ? isDarkMode
                  ? 'border-[#8ab4f8] text-[#8ab4f8]'
                  : 'border-[#1a73e8] text-[#1a73e8]'
                : isDarkMode
                ? 'border-transparent text-[#9aa0a6] hover:text-[#e8eaed]'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Lowongan yang disimpan</span>
            {savedCount > 0 && (
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded-full font-semibold ${
                  activeTab === 'saved'
                    ? 'bg-blue-600 text-white'
                    : isDarkMode
                    ? 'bg-[#3c4043] text-gray-200'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {savedCount}
              </span>
            )}
          </button>

          <button
            type="button"
            id="tab-mengikuti"
            onClick={() => onTabChange('following')}
            className={`pb-3 border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'following'
                ? isDarkMode
                  ? 'border-[#8ab4f8] text-[#8ab4f8]'
                  : 'border-[#1a73e8] text-[#1a73e8]'
                : isDarkMode
                ? 'border-transparent text-[#9aa0a6] hover:text-[#e8eaed]'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Mengikuti</span>
            {followedCount > 0 && (
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded-full font-semibold ${
                  isDarkMode ? 'bg-[#3c4043] text-gray-200' : 'bg-gray-200 text-gray-700'
                }`}
              >
                {followedCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
