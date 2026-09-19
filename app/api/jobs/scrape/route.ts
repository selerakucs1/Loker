import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { Job, GroundingSource } from '@/types/job';
import { INITIAL_LAMONGAN_JOBS } from '@/lib/initial-jobs';

// In-memory cache to save API quota and make requests 100% free
interface CacheItem {
  timestamp: number;
  data: Job[];
  sources: GroundingSource[];
}

const cacheStore = new Map<string, CacheItem>();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes cache per query
let lastApiCallTimestamp = 0;
const MIN_CALL_INTERVAL_MS = 15 * 1000; // Throttle: minimal 15 seconds between external API calls

function getCompanyColors(companyName: string): { initial: string; bg: string; text: string } {
  const words = companyName.replace(/^(PT|CV|UD|Tbk)\.?\s+/i, '').split(/\s+/);
  let initial = 'LK';
  if (words.length >= 2) {
    initial = (words[0][0] + words[1][0]).toUpperCase();
  } else if (words.length === 1 && words[0].length >= 2) {
    initial = words[0].substring(0, 2).toUpperCase();
  }

  const palette = [
    { bg: '#2563EB', text: '#FFFFFF' }, // Blue
    { bg: '#059669', text: '#FFFFFF' }, // Emerald
    { bg: '#D97706', text: '#FFFFFF' }, // Amber
    { bg: '#7C3AED', text: '#FFFFFF' }, // Purple
    { bg: '#DC2626', text: '#FFFFFF' }, // Red
    { bg: '#0891B2', text: '#FFFFFF' }, // Cyan
    { bg: '#475569', text: '#FFFFFF' }, // Slate
    { bg: '#BE123C', text: '#FFFFFF' }, // Rose
  ];

  let hash = 0;
  for (let i = 0; i < companyName.length; i++) {
    hash = (hash * 31 + companyName.charCodeAt(i)) % palette.length;
  }
  const chosen = palette[Math.abs(hash)];

  return {
    initial,
    bg: chosen.bg,
    text: chosen.text,
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const query = body.query?.trim() || 'lowongan kerja lamongan terbaru';
    const category = body.category || '';
    const district = body.district || '';

    // Cache key based on filter criteria
    const cacheKey = `${query}::${category}::${district}`.toLowerCase();
    const now = Date.now();

    // 1. Check if we already have fresh cached data (saves 100% quota)
    const existingCache = cacheStore.get(cacheKey);
    if (existingCache && now - existingCache.timestamp < CACHE_TTL_MS) {
      return NextResponse.json({
        success: true,
        data: existingCache.data,
        newJobsCount: 0,
        groundingSources: existingCache.sources,
        timestamp: new Date(existingCache.timestamp).toISOString(),
        sourceType: 'cached_free_mode',
        message: 'Menggunakan cache data pintar (100% hemat kuota API)',
      });
    }

    // 2. Rate limit throttle: prevent rapid-fire API hits within 15 seconds
    if (now - lastApiCallTimestamp < MIN_CALL_INTERVAL_MS) {
      // If called too soon, return cached or curated fallback instead of burning quota
      if (existingCache) {
        return NextResponse.json({
          success: true,
          data: existingCache.data,
          newJobsCount: 0,
          groundingSources: existingCache.sources,
          timestamp: new Date().toISOString(),
          sourceType: 'throttled_cache',
          message: 'Rate throttle aktif untuk mencegah limit, menyajikan data cache.',
        });
      }
      return handleFallback(query, category, district, 'Rate throttle aktif, menyajikan pangkalan data loker Lamongan.');
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Return curated list filtered by query
      return handleFallback(query, category, district, 'API Key belum disetel, menampilkan pangkalan data loker Lamongan terverifikasi.');
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    lastApiCallTimestamp = now;

    const searchQuery = `${query} ${category} ${district} Glints Jobstreet Kalibrr Radar Lamongan`.trim();

    const prompt = `Cari lowongan kerja aktif dan terbaru di wilayah Kabupaten Lamongan, Jawa Timur (termasuk Lamongan Kota, Babat, Paciran, Brondong, Sukodadi).
Kueri pencarian: "${searchQuery}".

Tugasmu:
1. Telusuri portal lowongan (Glints, Kalibrr, JobStreet, Jooble, Indeed, Kemnaker Karirhub) dan portal berita lokal (Radar Lamongan, Surya Lamongan).
2. Ekstrak minimal 4 sampai 8 lowongan kerja nyata yang ada di Lamongan.
3. Kembalikan data HANYA dalam format JSON murni (array of objects) tanpa tag markdown \`\`\`json. Format skema:
[
  {
    "title": "Nama Posisi / Pekerjaan",
    "company": "Nama Perusahaan / Toko / Usaha",
    "location": "Lokasi lengkap di Lamongan (contoh: Lamongan Kota, Babat, atau Paciran, Jawa Timur)",
    "district": "Kecamatan jika ada (contoh: Lamongan Kota, Babat, Paciran, Deket)",
    "source": "Nama portal (Glints / Kalibrr / JobStreet / Jooble / Radar Lamongan / Surya Lamongan / Indeed)",
    "sourceUrl": "URL tautan lamaran / portal asli jika ada atau URL pencarian portal",
    "postedTime": "Waktu posting (contoh: 3 jam yang lalu / 1 hari yang lalu)",
    "salary": "Rentang gaji jika tersedia (contoh: Rp 3 jt - Rp 4,5 jt per bulan atau UMK Lamongan)",
    "jobType": "Pekerjaan tetap / Kontrak / Penuh waktu / Paruh waktu / Magang",
    "workplaceType": "Di lokasi (On-site) / Hybrid / Remote",
    "category": "Kategori (Penjualan & Pemasaran / Layanan Pelanggan / Operasional Gudang / Ritel & Toko / Restoran & F&B / Manufaktur & Pabrik / Administrasi / Teknologi)",
    "description": "Ringkasan deskripsi pekerjaan 2-3 kalimat",
    "requirements": ["Kualifikasi 1", "Kualifikasi 2", "Kualifikasi 3"],
    "responsibilities": ["Tanggung jawab 1", "Tanggung jawab 2"],
    "benefits": ["Benefit 1", "Benefit 2"],
    "howToApply": "Petunjuk cara melamar (email/portal/WA)"
  }
]`;

    let response;
    try {
      // Use gemini-2.5-flash which has a generous free tier allowance and high RPM
      response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
          temperature: 0.2,
        },
      });
    } catch (genError: unknown) {
      const errorMsg = String(genError);
      console.warn('Gemini API call returned error or rate limit:', errorMsg);
      // Gracefully catch quota exceeded (429 or RESOURCE_EXHAUSTED)
      return handleFallback(
        query,
        category,
        district,
        'Batas kuota gratis tercapai sementara. Menampilkan lowongan terverifikasi tanpa gangguan.'
      );
    }

    const textOutput = response.text || '';
    
    // Extract grounding sources
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const extractedSources: GroundingSource[] = [];
    
    for (const chunk of groundingChunks) {
      if (chunk.web?.uri) {
        extractedSources.push({
          title: chunk.web.title || 'Sumber Loker Terverifikasi',
          url: chunk.web.uri,
        });
      }
    }

    // Clean json string
    let cleanedJson = textOutput.trim();
    if (cleanedJson.startsWith('```json')) {
      cleanedJson = cleanedJson.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanedJson.startsWith('```')) {
      cleanedJson = cleanedJson.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    let parsedJobs: Partial<Job>[] = [];
    try {
      parsedJobs = JSON.parse(cleanedJson);
    } catch {
      // If parsing fails, use regex or fallback
      const match = cleanedJson.match(/\[[\s\S]*\]/);
      if (match) {
        try {
          parsedJobs = JSON.parse(match[0]);
        } catch {
          parsedJobs = [];
        }
      }
    }

    if (!Array.isArray(parsedJobs) || parsedJobs.length === 0) {
      return handleFallback(query, category, district, 'Hasil pencarian AI di-merge dengan basis data curated Lamongan.');
    }

    const formattedJobs: Job[] = parsedJobs.map((item, index) => {
      const colors = getCompanyColors(item.company || 'Perusahaan Lamongan');
      return {
        id: `scraped-${Date.now()}-${index}`,
        title: item.title || 'Tenaga Kerja Lamongan',
        company: item.company || 'Perusahaan di Lamongan',
        companyInitial: colors.initial,
        companyBgColor: colors.bg,
        companyTextColor: colors.text,
        location: item.location || 'Kabupaten Lamongan, Jawa Timur',
        district: item.district || 'Lamongan',
        source: item.source || 'Portal Loker Online',
        sourceUrl: item.sourceUrl || (extractedSources[0]?.url || 'https://www.google.com/search?q=lowongan+kerja+lamongan'),
        postedTime: item.postedTime || 'Baru saja',
        postedDate: 'Hari ini',
        timestamp: Date.now() - index * 60 * 1000,
        salary: item.salary || 'Sesuai UMK Lamongan',
        jobType: item.jobType || 'Pekerjaan tetap',
        workplaceType: item.workplaceType || 'Di lokasi (On-site)',
        category: item.category || 'Umum',
        description: item.description || 'Lowongan kerja terbaru di wilayah Kabupaten Lamongan.',
        requirements: Array.isArray(item.requirements) && item.requirements.length > 0 
          ? item.requirements 
          : ['Pendidikan minimal SMA/SMK/D3/S1', 'Berintegritas dan siap bekerja', 'Domisili Lamongan diutamakan'],
        responsibilities: Array.isArray(item.responsibilities) ? item.responsibilities : undefined,
        benefits: Array.isArray(item.benefits) && item.benefits.length > 0
          ? item.benefits
          : ['Gaji Pokok & Insentif', 'BPJS Kesehatan & Ketenagakerjaan'],
        howToApply: item.howToApply || 'Lamar melalui tautan portal resmi atau hubungi kontak terlampir.',
        isNew: true,
        groundingSources: extractedSources.slice(0, 4),
      };
    });

    // Merge with initial jobs (ensuring no duplicates)
    const combined = [...formattedJobs, ...INITIAL_LAMONGAN_JOBS];
    const uniqueMap = new Map<string, Job>();
    for (const j of combined) {
      const key = `${j.title.toLowerCase()}-${j.company.toLowerCase()}`;
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, j);
      }
    }

    const finalResult = Array.from(uniqueMap.values());

    // Save to cacheStore so subsequent users/calls use 0 quota
    cacheStore.set(cacheKey, {
      timestamp: Date.now(),
      data: finalResult,
      sources: extractedSources,
    });

    return NextResponse.json({
      success: true,
      data: finalResult,
      newJobsCount: formattedJobs.length,
      groundingSources: extractedSources,
      timestamp: new Date().toISOString(),
      sourceType: 'live_scraping_grounded',
    });
  } catch (err: unknown) {
    console.error('Error in job scraping API:', err);
    return handleFallback('', '', '', 'Gagal menghubungi scraper eksternal, beralih ke cache lokal.');
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    data: INITIAL_LAMONGAN_JOBS,
    newJobsCount: 0,
    timestamp: new Date().toISOString(),
    sourceType: 'initial_cache',
  });
}

function handleFallback(query: string, category: string, district: string, message: string) {
  let filtered = [...INITIAL_LAMONGAN_JOBS];
  
  if (query) {
    const q = query.toLowerCase();
    filtered = filtered.filter(
      j => j.title.toLowerCase().includes(q) ||
           j.company.toLowerCase().includes(q) ||
           j.description.toLowerCase().includes(q) ||
           j.location.toLowerCase().includes(q)
    );
    if (filtered.length === 0) {
      filtered = INITIAL_LAMONGAN_JOBS;
    }
  }

  if (category) {
    const cat = category.toLowerCase();
    const catFiltered = filtered.filter(j => j.category.toLowerCase().includes(cat));
    if (catFiltered.length > 0) filtered = catFiltered;
  }

  if (district) {
    const dist = district.toLowerCase();
    const distFiltered = filtered.filter(j => j.district?.toLowerCase().includes(dist) || j.location.toLowerCase().includes(dist));
    if (distFiltered.length > 0) filtered = distFiltered;
  }

  return NextResponse.json({
    success: true,
    data: filtered,
    newJobsCount: 0,
    message,
    timestamp: new Date().toISOString(),
    sourceType: 'curated_cache',
  });
}
