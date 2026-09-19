'use client';

import React, { useState } from 'react';
import { Filter, ChevronDown, Check, RotateCcw } from 'lucide-react';
import { JobFilterState } from '@/types/job';

interface FilterChipsProps {
  filters: JobFilterState;
  onFilterChange: (key: keyof JobFilterState, value: string) => void;
  onResetFilters: () => void;
  isDarkMode: boolean;
  totalResultsCount: number;
}

export function FilterChips({
  filters,
  onFilterChange,
  onResetFilters,
  isDarkMode,
  totalResultsCount,
}: FilterChipsProps) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const categories = [
    'Semua Kategori',
    'Penjualan & Pemasaran',
    'Layanan Pelanggan',
    'Operasional Gudang',
    'Ritel & Toko',
    'Restoran & F&B',
    'Manufaktur & Pabrik',
    'Administrasi',
  ];

  const districts = [
    'Semua Wilayah',
    'Lamongan Kota',
    'Babat',
    'Paciran',
    'Deket',
    'Sukodadi',
    'Brondong',
  ];

  const timeFilters = [
    'Kapan saja',
    '24 jam terakhir',
    '3 hari terakhir',
    '1 minggu terakhir',
  ];

  const jobTypes = [
    'Semua Jenis',
    'Pekerjaan tetap',
    'Penuh waktu',
    'Kontrak',
    'Paruh waktu',
  ];

  const sources = [
    'Semua Sumber',
    'Glints',
    'Kalibrr',
    'JobStreet',
    'Jooble',
    'BeBee',
    'Radar Lamongan',
    'Indeed',
  ];

  const toggleDropdown = (name: string) => {
    setActiveDropdown((prev) => (prev === name ? null : name));
  };

  const hasActiveFilters =
    filters.category !== 'Semua Kategori' ||
    filters.locationDistrict !== 'Semua Wilayah' ||
    filters.timeFilter !== 'Kapan saja' ||
    filters.jobType !== 'Semua Jenis' ||
    filters.source !== 'Semua Sumber' ||
    filters.searchQuery !== '';

  return (
    <div
      id="filter-chips-bar"
      className={`border-b transition-colors py-2.5 px-4 ${
        isDarkMode
          ? 'bg-[#202124] border-[#3c4043] text-[#bdc1c6]'
          : 'bg-white border-gray-200 text-gray-700'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 overflow-visible">
        {/* Horizontal scrollable pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          {/* Category Dropdown */}
          <div className="relative shrink-0">
            <button
              type="button"
              id="dropdown-category-btn"
              onClick={() => toggleDropdown('category')}
              className={`px-3 py-1.5 rounded-full border text-xs font-medium flex items-center gap-1.5 transition-all ${
                filters.category !== 'Semua Kategori'
                  ? isDarkMode
                    ? 'bg-[#303134] text-[#8ab4f8] border-[#8ab4f8]'
                    : 'bg-blue-50 text-blue-700 border-blue-400 font-semibold'
                  : isDarkMode
                  ? 'border-[#3c4043] text-gray-300 hover:bg-[#303134]'
                  : 'border-gray-200 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span>{filters.category}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {activeDropdown === 'category' && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setActiveDropdown(null)}
                />
                <div
                  className={`absolute left-0 mt-1.5 w-56 rounded-xl shadow-xl z-50 border py-1.5 text-xs ${
                    isDarkMode
                      ? 'bg-[#303134] border-[#3c4043] text-gray-200'
                      : 'bg-white border-gray-200 text-gray-800'
                  }`}
                >
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        onFilterChange('category', cat);
                        setActiveDropdown(null);
                      }}
                      className={`w-full text-left px-3.5 py-2 flex items-center justify-between transition-colors ${
                        filters.category === cat
                          ? isDarkMode
                            ? 'bg-[#3c4043] text-[#8ab4f8] font-semibold'
                            : 'bg-blue-50 text-blue-700 font-semibold'
                          : isDarkMode
                          ? 'hover:bg-[#3c4043]'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <span>{cat}</span>
                      {filters.category === cat && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* District Location Dropdown */}
          <div className="relative shrink-0">
            <button
              type="button"
              id="dropdown-district-btn"
              onClick={() => toggleDropdown('district')}
              className={`px-3 py-1.5 rounded-full border text-xs font-medium flex items-center gap-1.5 transition-all ${
                filters.locationDistrict !== 'Semua Wilayah'
                  ? isDarkMode
                    ? 'bg-[#303134] text-[#8ab4f8] border-[#8ab4f8]'
                    : 'bg-blue-50 text-blue-700 border-blue-400 font-semibold'
                  : isDarkMode
                  ? 'border-[#3c4043] text-gray-300 hover:bg-[#303134]'
                  : 'border-gray-200 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span>{filters.locationDistrict}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {activeDropdown === 'district' && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setActiveDropdown(null)}
                />
                <div
                  className={`absolute left-0 mt-1.5 w-48 rounded-xl shadow-xl z-50 border py-1.5 text-xs ${
                    isDarkMode
                      ? 'bg-[#303134] border-[#3c4043] text-gray-200'
                      : 'bg-white border-gray-200 text-gray-800'
                  }`}
                >
                  {districts.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => {
                        onFilterChange('locationDistrict', d);
                        setActiveDropdown(null);
                      }}
                      className={`w-full text-left px-3.5 py-2 flex items-center justify-between transition-colors ${
                        filters.locationDistrict === d
                          ? isDarkMode
                            ? 'bg-[#3c4043] text-[#8ab4f8] font-semibold'
                            : 'bg-blue-50 text-blue-700 font-semibold'
                          : isDarkMode
                          ? 'hover:bg-[#3c4043]'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <span>{d}</span>
                      {filters.locationDistrict === d && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Time Filter */}
          <div className="relative shrink-0">
            <button
              type="button"
              id="dropdown-time-btn"
              onClick={() => toggleDropdown('time')}
              className={`px-3 py-1.5 rounded-full border text-xs font-medium flex items-center gap-1.5 transition-all ${
                filters.timeFilter !== 'Kapan saja'
                  ? isDarkMode
                    ? 'bg-[#303134] text-[#8ab4f8] border-[#8ab4f8]'
                    : 'bg-blue-50 text-blue-700 border-blue-400 font-semibold'
                  : isDarkMode
                  ? 'border-[#3c4043] text-gray-300 hover:bg-[#303134]'
                  : 'border-gray-200 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span>{filters.timeFilter}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {activeDropdown === 'time' && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setActiveDropdown(null)}
                />
                <div
                  className={`absolute left-0 mt-1.5 w-48 rounded-xl shadow-xl z-50 border py-1.5 text-xs ${
                    isDarkMode
                      ? 'bg-[#303134] border-[#3c4043] text-gray-200'
                      : 'bg-white border-gray-200 text-gray-800'
                  }`}
                >
                  {timeFilters.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        onFilterChange('timeFilter', t);
                        setActiveDropdown(null);
                      }}
                      className={`w-full text-left px-3.5 py-2 flex items-center justify-between transition-colors ${
                        filters.timeFilter === t
                          ? isDarkMode
                            ? 'bg-[#3c4043] text-[#8ab4f8] font-semibold'
                            : 'bg-blue-50 text-blue-700 font-semibold'
                          : isDarkMode
                          ? 'hover:bg-[#3c4043]'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <span>{t}</span>
                      {filters.timeFilter === t && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Job Type Filter */}
          <div className="relative shrink-0">
            <button
              type="button"
              id="dropdown-jobtype-btn"
              onClick={() => toggleDropdown('jobType')}
              className={`px-3 py-1.5 rounded-full border text-xs font-medium flex items-center gap-1.5 transition-all ${
                filters.jobType !== 'Semua Jenis'
                  ? isDarkMode
                    ? 'bg-[#303134] text-[#8ab4f8] border-[#8ab4f8]'
                    : 'bg-blue-50 text-blue-700 border-blue-400 font-semibold'
                  : isDarkMode
                  ? 'border-[#3c4043] text-gray-300 hover:bg-[#303134]'
                  : 'border-gray-200 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span>{filters.jobType}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {activeDropdown === 'jobType' && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setActiveDropdown(null)}
                />
                <div
                  className={`absolute left-0 mt-1.5 w-48 rounded-xl shadow-xl z-50 border py-1.5 text-xs ${
                    isDarkMode
                      ? 'bg-[#303134] border-[#3c4043] text-gray-200'
                      : 'bg-white border-gray-200 text-gray-800'
                  }`}
                >
                  {jobTypes.map((jt) => (
                    <button
                      key={jt}
                      type="button"
                      onClick={() => {
                        onFilterChange('jobType', jt);
                        setActiveDropdown(null);
                      }}
                      className={`w-full text-left px-3.5 py-2 flex items-center justify-between transition-colors ${
                        filters.jobType === jt
                          ? isDarkMode
                            ? 'bg-[#3c4043] text-[#8ab4f8] font-semibold'
                            : 'bg-blue-50 text-blue-700 font-semibold'
                          : isDarkMode
                          ? 'hover:bg-[#3c4043]'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <span>{jt}</span>
                      {filters.jobType === jt && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Source Filter */}
          <div className="relative shrink-0">
            <button
              type="button"
              id="dropdown-source-btn"
              onClick={() => toggleDropdown('source')}
              className={`px-3 py-1.5 rounded-full border text-xs font-medium flex items-center gap-1.5 transition-all ${
                filters.source !== 'Semua Sumber'
                  ? isDarkMode
                    ? 'bg-[#303134] text-[#8ab4f8] border-[#8ab4f8]'
                    : 'bg-blue-50 text-blue-700 border-blue-400 font-semibold'
                  : isDarkMode
                  ? 'border-[#3c4043] text-gray-300 hover:bg-[#303134]'
                  : 'border-gray-200 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span>{filters.source}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {activeDropdown === 'source' && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setActiveDropdown(null)}
                />
                <div
                  className={`absolute left-0 mt-1.5 w-48 rounded-xl shadow-xl z-50 border py-1.5 text-xs ${
                    isDarkMode
                      ? 'bg-[#303134] border-[#3c4043] text-gray-200'
                      : 'bg-white border-gray-200 text-gray-800'
                  }`}
                >
                  {sources.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        onFilterChange('source', s);
                        setActiveDropdown(null);
                      }}
                      className={`w-full text-left px-3.5 py-2 flex items-center justify-between transition-colors ${
                        filters.source === s
                          ? isDarkMode
                            ? 'bg-[#3c4043] text-[#8ab4f8] font-semibold'
                            : 'bg-blue-50 text-blue-700 font-semibold'
                          : isDarkMode
                          ? 'hover:bg-[#3c4043]'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <span>{s}</span>
                      {filters.source === s && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              type="button"
              id="btn-reset-filters"
              onClick={onResetFilters}
              className={`shrink-0 px-2.5 py-1.5 rounded-full text-xs font-medium flex items-center gap-1 transition-colors ${
                isDarkMode
                  ? 'text-rose-400 hover:bg-rose-950/40'
                  : 'text-rose-600 hover:bg-rose-50'
              }`}
              title="Reset Semua Filter"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Results Counter */}
        <div className="shrink-0 text-xs font-medium whitespace-nowrap text-gray-400">
          <span>{totalResultsCount} lowongan ditemukan</span>
        </div>
      </div>
    </div>
  );
}
