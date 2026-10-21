import { JobAlert } from '../types';

export interface RssFetchResponse {
  success: boolean;
  count: number;
  vacancies: JobAlert[];
  feedSources: string[];
  message?: string;
  error?: string;
}

export interface CustomScrapeResponse {
  success: boolean;
  vacancy?: JobAlert;
  message?: string;
  error?: string;
}

/**
 * Service to fetch live government job notifications from RSS feeds and Web Scraping API
 */
const validateJobAlert = (job: JobAlert): boolean => {
  return (
    !!job.id &&
    !!job.title &&
    !!job.organization &&
    !!job.category &&
    !!job.applyUrl
  );
};

export const fetchLiveVacanciesFromRSS = async (customFeedUrl?: string): Promise<RssFetchResponse> => {
  try {
    const response = await fetch('/api/vacancies/fetch-rss', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        feedUrl: customFeedUrl || '',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Server returned HTTP ${response.status}`);
    }

    const data: RssFetchResponse = await response.json();
    data.vacancies = data.vacancies.filter(validateJobAlert);
    return data;
  } catch (err: any) {
    console.error('Error in fetchLiveVacanciesFromRSS:', err);
    return {
      success: false,
      count: 0,
      vacancies: [],
      feedSources: [],
      error: err.message || 'Failed to fetch live RSS notifications',
    };
  }
};

/**
 * Service to scrape a specific government recruitment webpage or RSS URL
 */
export const scrapeVacancyFromUrl = async (targetUrl: string): Promise<CustomScrapeResponse> => {
  try {
    const response = await fetch('/api/vacancies/scrape-custom-url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ targetUrl }),
    });

    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}`);
    }

    const data: CustomScrapeResponse = await response.json();
    if (data.vacancy && !validateJobAlert(data.vacancy)) {
      data.vacancy = undefined;
      data.error = 'Invalid vacancy data scraped.';
    }
    return data;
  } catch (err: any) {
    console.error('Error in scrapeVacancyFromUrl:', err);
    return {
      success: false,
      error: err.message || 'Failed to scrape target URL',
    };
  }
};
