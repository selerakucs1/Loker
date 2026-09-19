'use client';

import React, { useState } from 'react';
import { Search, X, Mic, Camera, Moon, Sun } from 'lucide-react';

interface SearchHeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSearchSubmit: (q: string) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export function SearchHeader({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  isDarkMode,
  onToggleTheme,
}: SearchHeaderProps) {
  const [inputValue, setInputValue] = useState(searchQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit(inputValue);
  };

  const handleClear = () => {
    setInputValue('');
    onSearchChange('');
    onSearchSubmit('');
  };

  const popularSearches = [
    'lowongan kerja lamongan terbaru',
    'loker pabrik paciran',
    'admin babat',
    'gudang lamongan',
    'sales canvasser',
    'kasir minimarket'
  ];

  return (
    <header
      id="search-header"
      className={`sticky top-0 z-30 transition-colors border-b ${
        isDarkMode
          ? 'bg-[#202124] border-[#3c4043] text-[#e8eaed]'
          : 'bg-white border-gray-200 text-gray-900 shadow-xs'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center gap-3 justify-between">
        {/* Google Logo / Brand */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between">
          <div className="flex items-center gap-2 select-none">
            <span className="font-bold text-2xl tracking-tight flex items-center">
              <span className="text-[#4285F4]">G</span>
              <span className="text-[#EA4335]">o</span>
              <span className="text-[#FBBC05]">o</span>
              <span className="text-[#4285F4]">g</span>
              <span className="text-[#34A853]">l</span>
              <span className="text-[#EA4335]">e</span>
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                isDarkMode ? 'bg-[#303134] text-[#8ab4f8]' : 'bg-blue-50 text-blue-700'
              }`}
            >
              Jobs Lamongan
            </span>
          </div>

          {/* Theme toggle for mobile */}
          <button
            id="btn-theme-toggle-mobile"
            onClick={onToggleTheme}
            className={`md:hidden p-2 rounded-full transition-colors ${
              isDarkMode ? 'hover:bg-[#303134] text-gray-300' : 'hover:bg-gray-100 text-gray-600'
            }`}
            title="Ganti Tema"
            aria-label="Ganti Tema"
          >
            {isDarkMode ? <Sun className="w-5 h-5 text-amber-300" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        {/* Search Bar matching Google dark/light theme */}
        <form
          onSubmit={handleSubmit}
          className="w-full md:max-w-2xl relative flex items-center"
        >
          <div
            className={`w-full flex items-center rounded-full px-4 py-2.5 transition-all border ${
              isDarkMode
                ? 'bg-[#303134] border-[#3c4043] hover:bg-[#383a3e] focus-within:bg-[#303134] focus-within:shadow-[0_1px_6px_rgba(0,0,0,0.5)] focus-within:border-transparent'
                : 'bg-white border-gray-200 hover:shadow-md focus-within:shadow-md focus-within:border-transparent'
            }`}
          >
            <Search className={`w-5 h-5 mr-3 shrink-0 ${isDarkMode ? 'text-[#9aa0a6]' : 'text-gray-400'}`} />
            
            <input
              id="input-google-jobs-search"
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                onSearchChange(e.target.value);
              }}
              placeholder="Cari lowongan kerja di Lamongan (contoh: sales, admin, gudang, babat)"
              className={`w-full bg-transparent text-sm md:text-base outline-hidden placeholder:text-gray-400 ${
                isDarkMode ? 'text-[#e8eaed]' : 'text-gray-800'
              }`}
            />

            {inputValue && (
              <button
                type="button"
                id="btn-clear-search"
                onClick={handleClear}
                className={`p-1 mr-1 rounded-full transition-colors ${
                  isDarkMode ? 'hover:bg-[#3c4043] text-[#9aa0a6]' : 'hover:bg-gray-100 text-gray-500'
                }`}
                title="Hapus pencarian"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <div className={`h-5 w-px mx-1 ${isDarkMode ? 'bg-[#5f6368]' : 'bg-gray-300'}`} />

            <button
              type="button"
              id="btn-voice-search"
              onClick={() => {
                setInputValue('lowongan kerja lamongan terbaru');
                onSearchSubmit('lowongan kerja lamongan terbaru');
              }}
              className={`p-1.5 rounded-full transition-colors ${
                isDarkMode ? 'hover:bg-[#3c4043] text-[#4285F4]' : 'hover:bg-gray-100 text-blue-600'
              }`}
              title="Telusuri dengan suara"
            >
              <Mic className="w-4 h-4" />
            </button>

            <button
              type="button"
              id="btn-lens-search"
              onClick={handleSubmit}
              className={`p-1.5 rounded-full transition-colors ${
                isDarkMode ? 'hover:bg-[#3c4043] text-[#FBBC05]' : 'hover:bg-gray-100 text-amber-500'
              }`}
              title="Telusuri visual"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Desktop Theme toggle & Fast Links */}
        <div className="hidden md:flex items-center gap-2">
          <button
            id="btn-theme-toggle-desktop"
            onClick={onToggleTheme}
            className={`p-2.5 rounded-full transition-colors ${
              isDarkMode
                ? 'hover:bg-[#303134] text-gray-300'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
            title="Ganti Tema (Gelap / Terang)"
            aria-label="Ganti Tema"
          >
            {isDarkMode ? <Sun className="w-5 h-5 text-amber-300" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Suggested fast chips */}
      <div className="max-w-7xl mx-auto px-4 pb-2 pt-1 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
        <span className={`shrink-0 font-medium ${isDarkMode ? 'text-[#9aa0a6]' : 'text-gray-500'}`}>
          Pencarian populer:
        </span>
        {popularSearches.map((item) => (
          <button
            key={item}
            type="button"
            id={`chip-popular-${item.replace(/\s+/g, '-')}`}
            onClick={() => {
              setInputValue(item);
              onSearchChange(item);
              onSearchSubmit(item);
            }}
            className={`shrink-0 px-2.5 py-1 rounded-full border transition-all ${
              inputValue.toLowerCase() === item.toLowerCase()
                ? isDarkMode
                  ? 'bg-[#303134] text-[#8ab4f8] border-[#8ab4f8]'
                  : 'bg-blue-50 text-blue-700 border-blue-300'
                : isDarkMode
                ? 'border-[#3c4043] text-[#bdc1c6] hover:bg-[#303134]'
                : 'border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {item}
          </button>
        ))}
      </div>
    </header>
  );
}
