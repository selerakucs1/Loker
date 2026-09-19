'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { SearchHeader } from '@/components/SearchHeader';
import { AutoUpdateBar } from '@/components/AutoUpdateBar';
import { NavigationTabs, TabType } from '@/components/NavigationTabs';
import { FilterChips } from '@/components/FilterChips';
import { JobCard } from '@/components/JobCard';
import { JobDetailPane } from '@/components/JobDetailPane';
import { FollowModal } from '@/components/FollowModal';
import { ShareModal } from '@/components/ShareModal';
import { ScrapingLogModal } from '@/components/ScrapingLogModal';
import { Job, JobFilterState } from '@/types/job';
import { INITIAL_LAMONGAN_JOBS } from '@/lib/initial-jobs';
import {
  Briefcase,
  Bookmark,
  Bell,
  Sparkles,
  RefreshCw,
  Search,
  CheckCircle2,
  Trash2,
  AlertCircle,
} from 'lucide-react';

interface ScrapingLogEntry {
  id: string;
  timestamp: string;
  source: string;
  message: string;
  status: 'success' | 'info' | 'warning';
}

export default function HomePage() {
  // Theme state: defaults to dark mode to match user's screenshot
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('lamongan_jobs_theme');
      if (stored) return stored === 'dark';
    }
    return true;
  });

  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState('lowongan kerja lamongan terbaru');
  const [filters, setFilters] = useState<JobFilterState>({
    searchQuery: 'lowongan kerja lamongan terbaru',
    category: 'Semua Kategori',
    locationDistrict: 'Semua Wilayah',
    timeFilter: 'Kapan saja',
    jobType: 'Semua Jenis',
    source: 'Semua Sumber',
  });

  // Navigation tab
  const [activeTab, setActiveTab] = useState<TabType>('postings');

  // Jobs data
  const [jobs, setJobs] = useState<Job[]>(INITIAL_LAMONGAN_JOBS);
  const [selectedJob, setSelectedJob] = useState<Job | null>(INITIAL_LAMONGAN_JOBS[0] || null);
  const [isMobileDetailOpen, setIsMobileDetailOpen] = useState(false);

  // Reference timestamp for time filters (updated deterministically)
  const [referenceTime, setReferenceTime] = useState<number>(() => Date.now());

  // Saved / Bookmarked jobs
  const [savedJobIds, setSavedJobIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedSaved = localStorage.getItem('lamongan_jobs_saved');
        if (storedSaved) return JSON.parse(storedSaved);
      } catch {
        // ignore
      }
    }
    return [];
  });

  // Follow / Alerts
  const [isFollowModalOpen, setIsFollowModalOpen] = useState(false);
  const [followedKeywords, setFollowedKeywords] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedFollowed = localStorage.getItem('lamongan_jobs_followed');
        if (storedFollowed) return JSON.parse(storedFollowed);
      } catch {
        // ignore
      }
    }
    return [
      'Lowongan Lamongan Terbaru',
      'Operator Gudang & Pabrik',
    ];
  });

  // Share modal
  const [shareTargetJob, setShareTargetJob] = useState<Job | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Scraping engine & auto-update state
  const [isAutoUpdateEnabled, setIsAutoUpdateEnabled] = useState(true);
  const [updateIntervalSeconds, setUpdateIntervalSeconds] = useState(300);
  const [secondsRemaining, setSecondsRemaining] = useState(300);
  const [isScraping, setIsScraping] = useState(false);
  const [lastScrapedTime, setLastScrapedTime] = useState<string | null>('Baru saja');
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  // Notification banner
  const [notificationToast, setNotificationToast] = useState<{
    message: string;
    type: 'success' | 'info';
  } | null>(null);

  // Scraping Logs
  const [logs, setLogs] = useState<ScrapingLogEntry[]>([
    {
      id: 'log-1',
      timestamp: '22:40:00',
      source: 'System',
      message: 'Inisialisasi sistem pencarian Google Jobs Lamongan & konektor scraping.',
      status: 'info',
    },
    {
      id: 'log-2',
      timestamp: '22:40:05',
      source: 'Glints / Kalibrr',
      message: 'Sinkronisasi 8 lowongan kerja terverifikasi di Kabupaten Lamongan berhasil.',
      status: 'success',
    },
  ]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('lamongan_jobs_theme', next ? 'dark' : 'light');
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Toast Helper
  const showToast = useCallback((message: string, type: 'success' | 'info' = 'success') => {
    setNotificationToast({ message, type });
    setTimeout(() => {
      setNotificationToast(null);
    }, 4000);
  }, []);

  // Scraping API Call
  const performScrape = useCallback(
    async (silent = false) => {
      if (isScraping) return;
      setIsScraping(true);

      const logTimestamp = new Date().toLocaleTimeString('id-ID');
      setLogs((prev) => [
        {
          id: `log-${Date.now()}`,
          timestamp: logTimestamp,
          source: 'Scraper Engine',
          message: `Memulai penelusuran scraping otomatis: "${filters.searchQuery}"...`,
          status: 'info',
        },
        ...prev.slice(0, 30),
      ]);

      try {
        const res = await fetch('/api/jobs/scrape', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: filters.searchQuery || 'lowongan kerja lamongan terbaru',
            category: filters.category !== 'Semua Kategori' ? filters.category : '',
            district: filters.locationDistrict !== 'Semua Wilayah' ? filters.locationDistrict : '',
          }),
        });

        const data = await res.json();

        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          const newJobsList: Job[] = data.data;

          setJobs((prev) => {
            const existingIds = new Set(prev.map((j) => `${j.title}-${j.company}`.toLowerCase()));
            const incomingFresh = newJobsList.filter(
              (nj) => !existingIds.has(`${nj.title}-${nj.company}`.toLowerCase())
            );

            if (incomingFresh.length > 0) {
              if (!silent) {
                showToast(`🎉 Ditemukan ${incomingFresh.length} lowongan kerja baru di Lamongan!`, 'success');
              }
              return [...incomingFresh, ...prev];
            }
            return prev;
          });

          const timeStr = new Date().toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          });
          setLastScrapedTime(`Pukul ${timeStr}`);
          setReferenceTime(Date.now());

          setLogs((prev) => [
            {
              id: `log-${Date.now()}`,
              timestamp: timeStr,
              source: data.sourceType || 'Grounding Engine',
              message: `Sinkronisasi selesai. Ditemukan ${newJobsList.length} data loker Lamongan aktif.`,
              status: 'success',
            },
            ...prev.slice(0, 30),
          ]);
        }
      } catch (err: unknown) {
        console.error('Scraping error:', err);
        setLogs((prev) => [
          {
            id: `log-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString('id-ID'),
            source: 'Error',
            message: 'Gagal menghubungi scraper API, mempertahankan data lokal.',
            status: 'warning',
          },
          ...prev.slice(0, 30),
        ]);
      } finally {
        setIsScraping(false);
        setSecondsRemaining(updateIntervalSeconds);
      }
    },
    [isScraping, filters.searchQuery, filters.category, filters.locationDistrict, updateIntervalSeconds, showToast]
  );

  // Auto update interval ticker
  useEffect(() => {
    if (!isAutoUpdateEnabled) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          performScrape(true);
          return updateIntervalSeconds;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isAutoUpdateEnabled, updateIntervalSeconds, performScrape]);

  // Toggle Save Job
  const handleToggleSave = (job: Job, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSavedJobIds((prev) => {
      let updated: string[];
      if (prev.includes(job.id)) {
        updated = prev.filter((id) => id !== job.id);
        showToast(`Lowongan "${job.title}" dihapus dari simpanan`, 'info');
      } else {
        updated = [...prev, job.id];
        showToast(`Lowongan "${job.title}" berhasil disimpan!`, 'success');
      }
      try {
        localStorage.setItem('lamongan_jobs_saved', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  // Open Share Modal
  const handleOpenShare = (job: Job, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setShareTargetJob(job);
    setIsShareModalOpen(true);
  };

  // Follow Keywords Update
  const handleFollowKeywords = (topics: string[]) => {
    setFollowedKeywords(topics);
    try {
      localStorage.setItem('lamongan_jobs_followed', JSON.stringify(topics));
    } catch {
      // ignore
    }
    showToast('Preferensi pemberitahuan lowongan Lamongan berhasil diperbarui!', 'success');
  };

  // Filter handlers
  const handleFilterChange = (key: keyof JobFilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      category: 'Semua Kategori',
      locationDistrict: 'Semua Wilayah',
      timeFilter: 'Kapan saja',
      jobType: 'Semua Jenis',
      source: 'Semua Sumber',
    });
    setSearchQuery('');
  };

  // Filtered Jobs List
  const filteredJobs = useMemo(() => {
    let list = jobs;

    // Filter by Tab
    if (activeTab === 'saved') {
      list = list.filter((j) => savedJobIds.includes(j.id));
    } else if (activeTab === 'following') {
      if (followedKeywords.length > 0) {
        list = list.filter((j) => {
          const text = `${j.title} ${j.category} ${j.district || ''} ${j.description}`.toLowerCase();
          return followedKeywords.some((kw) => {
            const cleanKw = kw.toLowerCase().replace(/lowongan|terbaru|loker/g, '').trim();
            return cleanKw ? text.includes(cleanKw) : true;
          });
        });
      }
    }

    // Filter by Search Query
    if (filters.searchQuery && filters.searchQuery !== 'lowongan kerja lamongan terbaru') {
      const q = filters.searchQuery.toLowerCase();
      list = list.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          j.location.toLowerCase().includes(q) ||
          j.category.toLowerCase().includes(q) ||
          j.description.toLowerCase().includes(q) ||
          (j.district && j.district.toLowerCase().includes(q))
      );
    }

    // Filter by Category
    if (filters.category !== 'Semua Kategori') {
      list = list.filter((j) => j.category.toLowerCase().includes(filters.category.toLowerCase()));
    }

    // Filter by District
    if (filters.locationDistrict !== 'Semua Wilayah') {
      const dist = filters.locationDistrict.toLowerCase();
      list = list.filter(
        (j) =>
          (j.district && j.district.toLowerCase().includes(dist)) ||
          j.location.toLowerCase().includes(dist)
      );
    }

    // Filter by Job Type
    if (filters.jobType !== 'Semua Jenis') {
      list = list.filter((j) => j.jobType.toLowerCase() === filters.jobType.toLowerCase());
    }

    // Filter by Source
    if (filters.source !== 'Semua Sumber') {
      list = list.filter((j) => j.source.toLowerCase().includes(filters.source.toLowerCase()));
    }

    // Filter by Time
    if (filters.timeFilter === '24 jam terakhir') {
      const oneDayAgo = referenceTime - 24 * 60 * 60 * 1000;
      list = list.filter((j) => j.timestamp >= oneDayAgo);
    } else if (filters.timeFilter === '3 hari terakhir') {
      const threeDaysAgo = referenceTime - 3 * 24 * 60 * 60 * 1000;
      list = list.filter((j) => j.timestamp >= threeDaysAgo);
    } else if (filters.timeFilter === '1 minggu terakhir') {
      const oneWeekAgo = referenceTime - 7 * 24 * 60 * 60 * 1000;
      list = list.filter((j) => j.timestamp >= oneWeekAgo);
    }

    return list;
  }, [jobs, activeTab, savedJobIds, followedKeywords, filters, referenceTime]);

  // Handle Card Click
  const handleJobSelect = (job: Job) => {
    setSelectedJob(job);
    setIsMobileDetailOpen(true);
  };

  return (
    <div
      id="lamongan-jobs-app"
      className={`min-h-screen flex flex-col font-sans transition-colors ${
        isDarkMode ? 'bg-[#202124] text-[#e8eaed]' : 'bg-[#f8fafd] text-gray-900'
      }`}
    >
      {/* Search Header (Google style) */}
      <SearchHeader
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setFilters((prev) => ({ ...prev, searchQuery: q }));
        }}
        onSearchSubmit={(q) => {
          setFilters((prev) => ({ ...prev, searchQuery: q }));
          performScrape();
        }}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
      />

      {/* Auto Update / Scraping Status Bar */}
      <AutoUpdateBar
        isAutoUpdateEnabled={isAutoUpdateEnabled}
        onToggleAutoUpdate={() => {
          setIsAutoUpdateEnabled((prev) => !prev);
          showToast(
            isAutoUpdateEnabled ? 'Pembaruan otomatis dinonaktifkan' : 'Pembaruan otomatis diaktifkan!',
            'info'
          );
        }}
        updateIntervalSeconds={updateIntervalSeconds}
        onChangeInterval={(sec) => {
          setUpdateIntervalSeconds(sec);
          setSecondsRemaining(sec);
        }}
        secondsRemaining={secondsRemaining}
        isScraping={isScraping}
        onManualScrape={() => performScrape()}
        lastScrapedTime={lastScrapedTime}
        totalJobsCount={jobs.length}
        onOpenLogModal={() => setIsLogModalOpen(true)}
        isDarkMode={isDarkMode}
      />

      {/* Navigation Tabs (Postingan lowongan | Lowongan yang disimpan | Mengikuti) */}
      <NavigationTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        savedCount={savedJobIds.length}
        followedCount={followedKeywords.length}
        onFollowClick={() => setIsFollowModalOpen(true)}
        isFollowingActive={followedKeywords.length > 0}
        isDarkMode={isDarkMode}
      />

      {/* Filter Chips Bar */}
      <FilterChips
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        isDarkMode={isDarkMode}
        totalResultsCount={filteredJobs.length}
      />

      {/* Toast Notification Floating */}
      {notificationToast && (
        <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-top-3 fade-in duration-200">
          <div
            className={`px-4 py-3 rounded-xl shadow-lg border flex items-center gap-2.5 text-xs md:text-sm font-medium ${
              notificationToast.type === 'success'
                ? 'bg-emerald-600 text-white border-emerald-500'
                : 'bg-blue-600 text-white border-blue-500'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{notificationToast.message}</span>
          </div>
        </div>
      )}

      {/* Main Content: Split View on Desktop */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-2 sm:px-4 py-3 flex gap-4 overflow-hidden">
        {/* Left Column: Job Cards List */}
        <section
          id="jobs-list-container"
          className={`w-full lg:w-5/12 xl:w-4/12 flex flex-col rounded-2xl border overflow-hidden shadow-xs ${
            isDarkMode ? 'bg-[#202124] border-[#303134]' : 'bg-white border-gray-200'
          }`}
        >
          {/* Section Header */}
          <div
            className={`px-4 py-3 border-b flex items-center justify-between text-xs ${
              isDarkMode
                ? 'bg-[#282a2d] border-[#303134] text-gray-300'
                : 'bg-slate-50 border-gray-200 text-gray-700'
            }`}
          >
            <div className="flex items-center gap-1.5 font-medium">
              {activeTab === 'postings' && <Briefcase className="w-4 h-4 text-blue-500" />}
              {activeTab === 'saved' && <Bookmark className="w-4 h-4 text-amber-500" />}
              {activeTab === 'following' && <Bell className="w-4 h-4 text-emerald-500" />}
              <span>
                {activeTab === 'postings'
                  ? 'Daftar Lowongan Kerja'
                  : activeTab === 'saved'
                  ? 'Lowongan Tersimpan'
                  : 'Lowongan yang Anda Ikuti'}
              </span>
            </div>

            <span className="font-semibold text-blue-500">
              {filteredJobs.length} posisi
            </span>
          </div>

          {/* Cards Scrollable Container */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-200 dark:divide-[#303134] max-h-[calc(100vh-280px)]">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  isSelected={selectedJob?.id === job.id}
                  isSaved={savedJobIds.includes(job.id)}
                  onSelect={handleJobSelect}
                  onToggleSave={handleToggleSave}
                  onShare={handleOpenShare}
                  isDarkMode={isDarkMode}
                />
              ))
            ) : (
              <div className="p-12 text-center select-none">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h4
                  className={`font-semibold text-base ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-800'
                  }`}
                >
                  Tidak ada lowongan yang cocok
                </h4>
                <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
                  Coba ubah kata kunci pencarian atau reset filter untuk melihat lowongan lainnya di Lamongan.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold shadow-xs hover:bg-blue-700 transition-all"
                >
                  Reset Semua Filter
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Right Column: Job Detail Pane (Desktop) */}
        <section
          id="jobs-detail-container"
          className={`hidden lg:flex flex-1 rounded-2xl border overflow-hidden shadow-xs ${
            isDarkMode ? 'bg-[#202124] border-[#303134]' : 'bg-white border-gray-200'
          }`}
        >
          <JobDetailPane
            job={selectedJob}
            isSaved={selectedJob ? savedJobIds.includes(selectedJob.id) : false}
            onToggleSave={(job) => handleToggleSave(job)}
            onShare={(job) => handleOpenShare(job)}
            isDarkMode={isDarkMode}
          />
        </section>
      </main>

      {/* Mobile Job Detail Modal / Slide-in Drawer */}
      {isMobileDetailOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex flex-col">
          <div className="flex-1 overflow-hidden">
            <JobDetailPane
              job={selectedJob}
              isSaved={selectedJob ? savedJobIds.includes(selectedJob.id) : false}
              onToggleSave={(job) => handleToggleSave(job)}
              onShare={(job) => handleOpenShare(job)}
              onCloseMobile={() => setIsMobileDetailOpen(false)}
              isDarkMode={isDarkMode}
            />
          </div>
        </div>
      )}

      {/* Modals */}
      <FollowModal
        isOpen={isFollowModalOpen}
        onClose={() => setIsFollowModalOpen(false)}
        onFollowKeywords={handleFollowKeywords}
        followedKeywords={followedKeywords}
        isDarkMode={isDarkMode}
      />

      <ShareModal
        job={shareTargetJob}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        isDarkMode={isDarkMode}
      />

      <ScrapingLogModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        logs={logs}
        totalJobs={jobs.length}
        lastScraped={lastScrapedTime}
        onRunScraper={() => performScrape()}
        isScraping={isScraping}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}
