export interface GroundingSource {
  title: string;
  url: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  companyInitial: string;
  companyBgColor: string;
  companyTextColor: string;
  companyLogo?: string;
  location: string;
  district?: string;
  source: string;
  sourceUrl: string;
  postedTime: string;
  postedDate: string;
  timestamp: number;
  salary?: string;
  jobType: string;
  workplaceType: string;
  category: string;
  description: string;
  requirements: string[];
  responsibilities?: string[];
  benefits: string[];
  howToApply: string;
  applicationEmail?: string;
  applicationPhone?: string;
  isNew?: boolean;
  groundingSources?: GroundingSource[];
}

export interface JobFilterState {
  searchQuery: string;
  category: string;
  locationDistrict: string;
  timeFilter: string;
  jobType: string;
  source: string;
}

export interface ScrapingStatus {
  isScraping: boolean;
  lastScraped: string | null;
  totalFound: number;
  newJobsCount: number;
  activeSource: string | null;
  error: string | null;
}
