import React, { useState, useEffect } from 'react';
import { JobAlert, NewsItem, AppNotification, NotificationPreferences, JobCategory, AlertType, BlogPost, BlogCategory } from './types';
import { INITIAL_JOB_ALERTS } from './data/jobData';
import { INITIAL_NEWS_ITEMS } from './data/newsData';
import { INITIAL_BLOG_POSTS } from './data/blogData';
import {
  getStoredNotifications,
  saveStoredNotifications,
  getStoredPreferences,
  saveStoredPreferences,
  getStoredBookmarks,
  saveStoredBookmarks,
  playAlertChime,
  requestBrowserPushPermission,
  triggerDesktopNotification,
  generateRandomAlert,
} from './services/notificationService';

import { Header } from './components/Header';
import { JobCard } from './components/JobCard';
import { FloatingShareButton } from './components/FloatingShareButton';
import { CareerPath } from './components/CareerPath';
import { JobDetailView } from './components/JobDetailView';
import { BlogCard } from './components/BlogCard';
import { BlogDetailView } from './components/BlogDetailView';
import { BlogWriteModal } from './components/BlogWriteModal';
import { MobileMenuDrawer } from './components/MobileMenuDrawer';
import { NotificationDrawer } from './components/NotificationDrawer';
import { NotificationSettingsModal } from './components/NotificationSettingsModal';
import { EligibilityChecker } from './components/EligibilityChecker';
import { AIChatDrawer } from './components/AIChatDrawer';
import { PolicyModal } from './components/PolicyModal';
import { SearchModal } from './components/SearchModal';
import { AdminPanel } from './components/AdminPanel';
import { AdminAuthModal } from './components/AdminAuthModal';
import { FastUpdatesGrid } from './components/FastUpdatesGrid';
import { fetchLiveVacanciesFromRSS, scrapeVacancyFromUrl } from './services/jobScraperService';

import {
  Search,
  Filter,
  Sparkles,
  Bookmark,
  Bell,
  CheckCircle2,
  TrendingUp,
  SlidersHorizontal,
  Flame,
  X,
  FileCheck2,
  ShieldCheck,
  Building2,
  Award,
  Newspaper,
  PenSquare,
  BookOpen,
  Scale,
  ShieldAlert,
  Rss,
  RefreshCw,
  Globe,
  Link2,
  PlusCircle,
  Twitter,
  Facebook,
  Instagram,
  Send,
} from 'lucide-react';

const SECTORS: (JobCategory | 'All Sectors')[] = [
  'All Sectors',
  'UPSC',
  'SSC',
  'Banking',
  'Railways',
  'Defense',
  'State PSC',
  'Teaching',
  'PSU',
  'Medical',
];

const BLOG_CATEGORIES: (BlogCategory | 'All Blogs')[] = [
  'All Blogs',
  'Job Notification',
  'Exam Strategy & Prep',
  'Syllabus Breakdown',
  'Salary & DA Analysis',
  'Current Affairs',
  'Result & Cutoff',
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'blogs' | 'results' | 'eligibility' | 'chat'>('blogs');
  const [jobs, setJobs] = useState<JobAlert[]>(INITIAL_JOB_ALERTS);
  const [news, setNews] = useState<NewsItem[]>(INITIAL_NEWS_ITEMS);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(INITIAL_BLOG_POSTS);

  // Active Selections for Full Article Pages
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [selectedJob, setSelectedJob] = useState<JobAlert | null>(null);

  // Modals & Drawers
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);
  const [policyTab, setPolicyTab] = useState<'disclaimer' | 'terms' | 'privacy'>('disclaimer');

  // Search & Filters
  const [blogSearchQuery, setBlogSearchQuery] = useState('');
  const [selectedBlogCategory, setSelectedBlogCategory] = useState<BlogCategory | 'All Blogs'>('All Blogs');

  const [jobSearchQuery, setJobSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState<JobCategory | 'All Sectors'>('All Sectors');
  const [onlyUrgent, setOnlyUrgent] = useState(false);
  const [onlySaved, setOnlySaved] = useState(false);

  // Saved Bookmarks
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  // Notifications State
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreferences>(getStoredPreferences());
  const [isNotifDrawerOpen, setIsNotifDrawerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Active Toast Alert
  const [activeToast, setActiveToast] = useState<AppNotification | null>(null);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);

  // Hidden Admin / AI Blog Studio Auth State
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(() => {
    try {
      return localStorage.getItem('sarkaripulse_admin_auth') === 'true';
    } catch {
      return false;
    }
  });
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState(false);

  const handleLockAdmin = () => {
    try {
      localStorage.removeItem('sarkaripulse_admin_auth');
    } catch {
      // ignore
    }
    setIsAdminUnlocked(false);
    setIsAdminPanelOpen(false);
    setIsWriteModalOpen(false);
  };

  const handleUnlockAdminSuccess = () => {
    setIsAdminUnlocked(true);
    setIsWriteModalOpen(true);
  };

  // Keyboard shortcut (Ctrl+Shift+A or Alt+A) & URL parameter trigger for hidden admin access
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.location.search.includes('admin') || window.location.hash.includes('admin')) {
        setIsAdminAuthModalOpen(true);
      }
      const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) || (e.altKey && (e.key === 'A' || e.key === 'a'))) {
          e.preventDefault();
          setIsAdminAuthModalOpen(true);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, []);

  // Alias vacancies to jobs for dynamic state management
  const vacancies = jobs;
  const setVacancies = setJobs;

  // RSS Feed & Automated Job Scraper State
  const [isRssFetching, setIsRssFetching] = useState(false);
  const [rssLastFetchedTime, setRssLastFetchedTime] = useState<string | null>(null);
  const [isScraperModalOpen, setIsScraperModalOpen] = useState(false);
  const [customScrapeUrl, setCustomScrapeUrl] = useState('');
  const [isCustomScraping, setIsCustomScraping] = useState(false);
  const [scraperStatusMsg, setScraperStatusMsg] = useState<string | null>(null);

  const handleSyncRssVacancies = async (customFeedUrl?: string) => {
    setIsRssFetching(true);
    setScraperStatusMsg('RSS फ़ीड्स से नई वैकेंसियां स्क्रैप व स्कैन की जा रही हैं...');
    try {
      const res = await fetchLiveVacanciesFromRSS(customFeedUrl);
      if (res.success) {
        if (res.vacancies && res.vacancies.length > 0) {
          setVacancies((prevVacancies) => {
            const existingTitles = new Set(prevVacancies.map((v) => v.title.trim().toLowerCase()));
            const newVacancies = res.vacancies.filter((v) => !existingTitles.has(v.title.trim().toLowerCase()));
            if (newVacancies.length > 0) {
              const notif: AppNotification = {
                id: `notif-rss-${Date.now()}`,
                title: 'RSS जॉब ऑटो-स्क्रैपर लाइव अपडेट',
                message: `RSS फीड द्वारा ${newVacancies.length} नई सरकारी भर्तियां ऑटोमैटिक स्क्रैप होकर 'vacancies' में शामिल की गईं!`,
                category: newVacancies[0].category,
                type: 'Vacancy Alert',
                timestamp: 'अभी',
                isRead: false,
                priority: 'High',
              };
              setNotifications((prev) => [notif, ...prev]);
              setActiveToast(notif);
            }
            return [...newVacancies, ...prevVacancies];
          });
          setRssLastFetchedTime(new Date().toLocaleTimeString());
          setScraperStatusMsg(`${res.count} लाइव वैकेंसियां RSS फ़ीड्स से सफलतापूर्वक सिंक की गईं!`);
        } else if (res.message) {
          setScraperStatusMsg(res.message);
        } else {
          setScraperStatusMsg('सभी वैकेंसियां अपडेट हैं। फ़ीड में कोई नई भर्ती नहीं मिली।');
        }
      } else {
        setScraperStatusMsg(`सिंक में त्रुटि: ${res.error || 'अज्ञात समस्या'}`);
      }
    } catch (err: any) {
      console.error('RSS Fetch error:', err);
      const errorMessage = JSON.stringify(err);
      const isQuotaExceeded = errorMessage.includes('429') || errorMessage.includes('quota') || errorMessage.includes('RESOURCE_EXHAUSTED');
      setScraperStatusMsg(isQuotaExceeded 
        ? 'AI सेवा कोटा समाप्त: नई भर्तियां अगले 1-2 घंटों में उपलब्ध होंगी।' 
        : 'RSS फ़ीड सिंक करने में समस्या आई।');
    } finally {
      setIsRssFetching(false);
      setTimeout(() => setScraperStatusMsg(null), 5000);
    }
  };

  const handleCustomScrapeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customScrapeUrl.trim()) return;
    setIsCustomScraping(true);
    setScraperStatusMsg('वेबपेज / यूआरएल से भर्ती विवरण निकाला जा रहा है...');
    try {
      const res = await scrapeVacancyFromUrl(customScrapeUrl.trim());
      if (res.success && res.vacancy && res.vacancy.title) {
        setVacancies((prev) => [res.vacancy!, ...prev]);
        const notif: AppNotification = {
          id: `notif-scrape-${Date.now()}`,
          title: 'वेब स्क्रैपिंग सफलता',
          message: `यूआरएल से नई रिक्ति 'vacancies' ऐरे में जोड़ी गई: ${res.vacancy.title}`,
          category: res.vacancy.category,
          type: 'Vacancy Alert',
          timestamp: 'अभी',
          isRead: false,
          priority: 'Urgent',
        };
        setNotifications((prev) => [notif, ...prev]);
        setActiveToast(notif);
        setCustomScrapeUrl('');
        setIsScraperModalOpen(false);
        setScraperStatusMsg('कस्टम स्क्रैपिंग सफल रही!');
      } else {
        setScraperStatusMsg('वेबपेज से भर्ती विवरण नहीं निकाला जा सका।');
      }
    } catch (err) {
      console.error('Custom Scraping error:', err);
      setScraperStatusMsg('स्क्रैपिंग प्रक्रिया विफल रही।');
    } finally {
      setIsCustomScraping(false);
      setTimeout(() => setScraperStatusMsg(null), 5000);
    }
  };

  // Initialize LocalStorage Data & Trigger Initial RSS Feed Sync
  useEffect(() => {
    setNotifications(getStoredNotifications());
    setPreferences(getStoredPreferences());
    setBookmarks(getStoredBookmarks());
    
    /*
    const lastRssSync = localStorage.getItem('sarkaripulse_last_rss_sync_v1');
    const now = Date.now();
    // Only sync if last sync was > 1 hour ago (3600000 ms)
    if (!lastRssSync || now - parseInt(lastRssSync) > 3600000) {
      handleSyncRssVacancies();
      localStorage.setItem('sarkaripulse_last_rss_sync_v1', now.toString());
    }
    */
  }, []);

  const handleToggleBookmark = (jobId: string) => {
    const updated = bookmarks.includes(jobId)
      ? bookmarks.filter((id) => id !== jobId)
      : [...bookmarks, jobId];
    setBookmarks(updated);
    saveStoredBookmarks(updated);
  };

  // Notification Operations
  const handleMarkRead = (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n));
    setNotifications(updated);
    saveStoredNotifications(updated);
  };

  const handleMarkAllRead = () => {
    const updated = notifications.map((n) => ({ ...n, isRead: true }));
    setNotifications(updated);
    saveStoredNotifications(updated);
  };

  const handleClearNotification = (id: string) => {
    const updated = notifications.filter((n) => n.id !== id);
    setNotifications(updated);
    saveStoredNotifications(updated);
  };

  const handleClearAll = () => {
    setNotifications([]);
    saveStoredNotifications([]);
  };

  const handleSavePreferences = (newPrefs: NotificationPreferences) => {
    setPreferences(newPrefs);
    saveStoredPreferences(newPrefs);
  };

  // Real-time Push Alert Simulation
  const handleSimulateLiveAlert = () => {
    const newAlert = generateRandomAlert();
    const updated = [newAlert, ...notifications];
    setNotifications(updated);
    saveStoredNotifications(updated);

    if (preferences.soundEnabled) {
      playAlertChime();
    }

    if (preferences.inAppToastsEnabled) {
      setActiveToast(newAlert);
      setTimeout(() => setActiveToast(null), 5000);
    }

    triggerDesktopNotification(newAlert.title, newAlert.message);
  };

  const handlePublishNewBlog = (newPost: BlogPost) => {
    setBlogPosts([newPost, ...blogPosts]);
    setSelectedBlog(newPost);
  };

  const [isSarkariResultSyncing, setIsSarkariResultSyncing] = useState(false);
  const [isRajasthanSyncing, setIsRajasthanSyncing] = useState(false);

  const handleSyncFromSarkariResult = async () => {
    setIsSarkariResultSyncing(true);
    try {
      const res = await fetch('/api/blog/sync-from-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUrl: 'https://www.sarkariresult.com/' }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.posts && data.posts.length > 0) {
          const synced = data.posts[0];
          setBlogPosts((prev) => [synced, ...prev]);
          setActiveTab('blogs');
          setSelectedBlog(synced);
          setIsAdminPanelOpen(false);
        }
      }
    } catch (err) {
      console.error('Error syncing from SarkariResult:', err);
    } finally {
      setIsSarkariResultSyncing(false);
    }
  };

  const handleSyncFromRajasthanVacancy = async () => {
    setIsRajasthanSyncing(true);
    try {
      const res = await fetch('/api/blog/sync-from-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUrl: 'https://rajasthanvacancy.com/' }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.posts && data.posts.length > 0) {
          const synced = data.posts[0];
          setBlogPosts((prev) => [synced, ...prev]);
          setActiveTab('blogs');
          setSelectedBlog(synced);
          setIsAdminPanelOpen(false);
        }
      }
    } catch (err) {
      console.error('Error syncing from RajasthanVacancy:', err);
    } finally {
      setIsRajasthanSyncing(false);
    }
  };

  const openPolicyModalTab = (tab: 'disclaimer' | 'terms' | 'privacy') => {
    setPolicyTab(tab);
    setIsPolicyOpen(true);
  };

  // Filter Blog Posts List
  const filteredBlogPosts = blogPosts.filter((post) => {
    if (selectedBlogCategory !== 'All Blogs' && post.category !== selectedBlogCategory) return false;
    if (blogSearchQuery.trim()) {
      const q = blogSearchQuery.toLowerCase();
      const matchesTitle = post.title.toLowerCase().includes(q);
      const matchesSubtitle = post.subtitle.toLowerCase().includes(q);
      const matchesTags = post.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchesTitle && !matchesSubtitle && !matchesTags) return false;
    }
    return true;
  });

  const featuredHeroBlog = blogPosts.find((p) => p.isFeatured) || blogPosts[0];
  const regularBlogPosts = filteredBlogPosts.filter((p) => p.id !== featuredHeroBlog?.id);

  // Filter Jobs List
  const filteredJobs = jobs.filter((job) => {
    if (onlySaved && !bookmarks.includes(job.id)) return false;
    if (onlyUrgent && !job.isUrgent) return false;
    if (selectedSector !== 'All Sectors' && job.category !== selectedSector) return false;

    if (jobSearchQuery.trim()) {
      const q = jobSearchQuery.toLowerCase();
      const matchesTitle = job.title.toLowerCase().includes(q);
      const matchesOrg = job.organization.toLowerCase().includes(q);
      const matchesQual = job.qualification.toLowerCase().includes(q);
      if (!matchesTitle && !matchesOrg && !matchesQual) return false;
    }
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // View Renderer Helper
  const renderMainView = () => {
    if (selectedJob) {
      return (
        <div key={`view-container-job-${selectedJob.id}`}>
          <JobDetailView
            job={selectedJob}
            onBack={() => setSelectedJob(null)}
            isBookmarked={bookmarks.includes(selectedJob.id)}
            onToggleBookmark={handleToggleBookmark}
            onSelectRelatedJob={(j) => setSelectedJob(j)}
            allJobs={jobs}
          />
        </div>
      );
    }

    if (activeTab === 'blogs') {
      if (selectedBlog) {
        return (
          <div key={`view-container-blog-${selectedBlog.id}`}>
            <BlogDetailView
              post={selectedBlog}
              onBack={() => setSelectedBlog(null)}
              onSelectRelatedPost={(p) => setSelectedBlog(p)}
              allPosts={blogPosts}
            />
          </div>
        );
      }

      return (
        <div key="view-container-blog-feed" className="space-y-6">
          {/* Search & Category Filter Controls - Top position */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={blogSearchQuery}
                  onChange={(e) => setBlogSearchQuery(e.target.value)}
                  placeholder="Search news blog articles, cutoff guides, exam strategy..."
                  className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/80"
                />
              </div>
            </div>

            {/* Blog Category Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
              {BLOG_CATEGORIES.map((cat) => (
                <button
                  key={`cat-tab-${cat}`}
                  onClick={() => setSelectedBlogCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    selectedBlogCategory === cat
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Lead Story / Featured Hero Blog Card */}
          {featuredHeroBlog && (
            <BlogCard key={`hero-${featuredHeroBlog.id}`} post={featuredHeroBlog} onSelectPost={(p) => setSelectedBlog(p)} isFeaturedHero />
          )}

          <FastUpdatesGrid 
            regularBlogPosts={regularBlogPosts} 
            setSelectedBlog={setSelectedBlog} 
            setActiveTab={setActiveTab}
            setSelectedJob={setSelectedJob}
          />
        </div>
      );
    }

    if (activeTab === 'results') {
      return (
        <div key="view-container-vacancies-feed" className="space-y-6">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={jobSearchQuery}
                  onChange={(e) => setJobSearchQuery(e.target.value)}
                  placeholder="Search by job title, commission (UPSC, SSC, RRB), qualification..."
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/80"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto">
                <button
                  onClick={() => setOnlyUrgent(!onlyUrgent)}
                  className={`px-3 py-2 text-xs font-bold rounded-xl border transition-colors cursor-pointer whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 ${
                    onlyUrgent
                      ? 'bg-amber-500 text-slate-950 border-amber-500'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5 text-amber-950" />
                  <span>🔥 Urgent Alerts</span>
                </button>

                <button
                  onClick={() => setOnlySaved(!onlySaved)}
                  className={`px-3 py-2 text-xs font-bold rounded-xl border transition-colors cursor-pointer whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 ${
                    onlySaved
                      ? 'bg-amber-100 text-amber-900 border-amber-300'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
                  <span>Saved Jobs ({bookmarks.length})</span>
                </button>
              </div>
            </div>

            {/* Subscribed Sectors Filter Controls */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 shrink-0">
                Sector:
              </span>
              {SECTORS.map((cat) => (
                <button
                  key={`sector-tab-${cat}`}
                  onClick={() => setSelectedSector(cat)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    selectedSector === cat
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredJobs.map((job) => (
              <JobCard
                key={`job-card-${job.id}`}
                job={job}
                isBookmarked={bookmarks.includes(job.id)}
                onToggleBookmark={handleToggleBookmark}
                onSelectJob={(j) => setSelectedJob(j)}
                onOpenAISummary={(j) => setSelectedJob(j)}
              />
            ))}
          </div>
        </div>
      );
    }

    if (activeTab === 'eligibility') {
      return (
        <div key="view-container-eligibility">
          <EligibilityChecker />
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={(t) => {
          if (t === 'chat') {
            setIsChatOpen(true);
          } else {
            setSelectedBlog(null);
            setSelectedJob(null);
            setActiveTab(t);
          }
        }}
        unreadCount={unreadCount}
        onOpenNotifications={() => setIsNotifDrawerOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenSimulateAlert={handleSimulateLiveAlert}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        onOpenWriteBlog={() => {
          if (isAdminUnlocked) {
            setIsWriteModalOpen(true);
          } else {
            setIsAdminAuthModalOpen(true);
          }
        }}
        isAdminUnlocked={isAdminUnlocked}
        onLockAdmin={handleLockAdmin}
        onOpenSearch={() => setIsSearchModalOpen(true)}
        onSelectSectorFilter={(sector) => {
          setSelectedSector(sector);
          setSelectedJob(null);
          setSelectedBlog(null);
          setActiveTab('blogs');
        }}
      />

      {/* Floating Toast Notification */}
      {activeToast && (
        <div key={`toast-${activeToast.id}`} className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-slate-700 max-w-sm animate-in slide-in-from-bottom duration-300 flex items-start gap-3">
          <div className="p-2 bg-amber-500 text-slate-950 rounded-xl shrink-0 font-bold mt-0.5">
            <Bell className="w-4 h-4" />
          </div>
          <div className="flex-1 text-xs">
            <div className="flex items-center justify-between gap-2 text-amber-400 font-extrabold uppercase text-[10px] mb-0.5">
              <span>{activeToast.category} · {activeToast.type}</span>
              <span>JUST NOW</span>
            </div>
            <h4 className="font-extrabold text-white text-xs mb-1">{activeToast.title}</h4>
            <p className="text-slate-300 line-clamp-2">{activeToast.message}</p>
          </div>
          <button
            onClick={() => setActiveToast(null)}
            className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {renderMainView()}
      </main>

      {/* Footer */}
      <footer className="mt-12 bg-slate-900 text-slate-400 border-t border-slate-800 py-8 px-4 sm:px-6 lg:px-8 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
              S
            </div>
            <span className="font-bold text-slate-200 text-sm">SarkariPulse</span>
            <span aria-hidden="true">·</span>
            <span>Government Recruitment News Blog & Vacancy Alerts</span>
          </div>

          <div className="flex items-center gap-3 text-slate-300 flex-wrap">
            <button
              onClick={() => openPolicyModalTab('disclaimer')}
              className="hover:text-emerald-400 transition-colors cursor-pointer font-semibold underline decoration-slate-700 underline-offset-4"
            >
              Disclaimer (अस्वीकरण)
            </button>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <button
              onClick={() => openPolicyModalTab('terms')}
              className="hover:text-emerald-400 transition-colors cursor-pointer font-semibold underline decoration-slate-700 underline-offset-4"
            >
              Niti Niyam (नियम व शर्तें)
            </button>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <button
              onClick={() => openPolicyModalTab('privacy')}
              className="hover:text-emerald-400 transition-colors cursor-pointer font-semibold underline decoration-slate-700 underline-offset-4"
            >
              Privacy Policy (गोपनीयता नीति)
            </button>
          </div>

          {/* Official Social Media Channels Bar */}
          <div className="flex items-center gap-3 pt-3 border-t border-slate-800 flex-wrap justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <span>Follow Official Social Handles:</span>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 bg-slate-800 hover:bg-black text-sky-400 rounded-lg transition-colors cursor-pointer"
                title="Twitter / X (@SarkariPulseGov)"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 bg-slate-800 hover:bg-blue-600 text-blue-400 rounded-lg transition-colors cursor-pointer"
                title="Facebook (SarkariPulseJobs)"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 bg-slate-800 hover:bg-pink-600 text-pink-400 rounded-lg transition-colors cursor-pointer"
                title="Instagram (@sarkaripulse.official)"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://t.me"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 bg-slate-800 hover:bg-sky-600 text-sky-300 rounded-lg transition-colors cursor-pointer"
                title="Telegram Channel"
              >
                <Send className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-400 flex-wrap justify-center md:justify-start">
            <p>© 2026 SarkariPulse News Blog. Official recruitment updates & editorial news coverage.</p>
            {isAdminUnlocked ? (
              <button
                type="button"
                onClick={handleLockAdmin}
                className="text-[10px] text-amber-400 hover:text-amber-300 font-bold ml-2 inline-flex items-center gap-1 cursor-pointer bg-slate-800 px-2 py-0.5 rounded border border-amber-500/30"
                title="व्यवस्थापक टूल्स छिपाएं (Lock / Hide from users)"
              >
                <span>[स्टाफ मोड सक्रिय - छिपाएं]</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsAdminAuthModalOpen(true)}
                className="text-[10px] text-slate-600 hover:text-slate-400 ml-2 inline-flex items-center gap-1 cursor-pointer"
                title="स्टाफ / व्यवस्थापक प्रमाणीकरण"
              >
                <span>[स्टाफ लॉगिन]</span>
              </button>
            )}
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <BlogWriteModal
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
        onPublishPost={handlePublishNewBlog}
      />

      <PolicyModal
        isOpen={isPolicyOpen}
        onClose={() => setIsPolicyOpen(false)}
        initialTab={policyTab}
      />

      <MobileMenuDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        activeTab={activeTab}
        setActiveTab={(t) => {
          setSelectedBlog(null);
          setSelectedJob(null);
          setActiveTab(t);
        }}
        unreadCount={unreadCount}
        bookmarksCount={bookmarks.length}
        onOpenNotifications={() => setIsNotifDrawerOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenWriteBlog={() => {
          if (isAdminUnlocked) {
            setIsWriteModalOpen(true);
          } else {
            setIsAdminAuthModalOpen(true);
          }
        }}
        onOpenChat={() => setIsChatOpen(true)}
        onOpenAdminPanel={() => {
          if (isAdminUnlocked) {
            setIsAdminPanelOpen(true);
          } else {
            setIsAdminAuthModalOpen(true);
          }
        }}
        isAdminUnlocked={isAdminUnlocked}
        onUnlockAdmin={() => setIsAdminAuthModalOpen(true)}
        onLockAdmin={handleLockAdmin}
        onSelectSectorFilter={(s) => {
          setSelectedSector(s);
          setSelectedJob(null);
          setSelectedBlog(null);
          setActiveTab('blogs');
        }}
      />

      <NotificationDrawer
        isOpen={isNotifDrawerOpen}
        onClose={() => setIsNotifDrawerOpen(false)}
        notifications={notifications}
        onMarkRead={handleMarkRead}
        onMarkAllRead={handleMarkAllRead}
        onClearNotification={handleClearNotification}
        onClearAll={handleClearAll}
        onSimulateAlert={handleSimulateLiveAlert}
        onRequestBrowserPermission={async () => {
          const granted = await requestBrowserPushPermission();
          if (granted) {
            handleSavePreferences({ ...preferences, webPushEnabled: true });
          }
        }}
        onOpenSettings={() => {
          setIsNotifDrawerOpen(false);
          setIsSettingsOpen(true);
        }}
        onSelectNotificationJob={(jobId) => {
          setIsNotifDrawerOpen(false);
          if (jobId) {
            const found = jobs.find((j) => j.id === jobId);
            if (found) setSelectedJob(found);
          }
        }}
      />

      <NotificationSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        preferences={preferences}
        onSavePreferences={handleSavePreferences}
      />

      <AIChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />

      {/* Custom RSS & Web Scraper Modal */}
      {isScraperModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-emerald-600" />
                <h3 className="font-extrabold text-slate-900 text-lg">कस्टम वेब व RSS स्क्रैपर</h3>
              </div>
              <button
                onClick={() => setIsScraperModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              किसी भी सरकारी भर्ती आयोग, रोजगार समाचार या RSS फ़ीड का वेब URL दर्ज करें। हमारा AI ऑटो-स्क्रैपर वेबपेज को स्कैन करके स्वतः भर्ती विवरण निकालकर <strong className="text-emerald-800">'vacancies'</strong> एरे में जोड़ देगा!
            </p>

            <form onSubmit={handleCustomScrapeSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  भर्ती वेबपेज या RSS फ़ीड URL
                </label>
                <div className="relative">
                  <Link2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    required
                    value={customScrapeUrl}
                    onChange={(e) => setCustomScrapeUrl(e.target.value)}
                    placeholder="https://upsc.gov.in/recruitment/rss or https://ssc.gov.in/..."
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                  />
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 font-medium space-y-1">
                <span className="font-bold block">💡 समर्थित फ़ीड स्रोत:</span>
                <p>UPSC, SSC, Railway RRB, IBPS, NTA, PIB समाचार फ़ीड तथा प्रमुख आधिकारिक भर्ती बुलेटिन।</p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsScraperModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  disabled={isCustomScraping}
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 rounded-xl transition-colors cursor-pointer shadow-xs inline-flex items-center gap-1.5"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isCustomScraping ? 'animate-spin' : ''}`} />
                  <span>{isCustomScraping ? 'ऑटो-स्क्रैप हो रहा है...' : 'URL से ऑटो-स्क्रैप करें'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Global Search Modal */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        jobs={jobs}
        blogs={blogPosts}
        onSelectJob={(job) => {
          setSelectedJob(job);
          setSelectedBlog(null);
          setActiveTab('results');
        }}
        onSelectBlog={(blog) => {
          setSelectedBlog(blog);
          setSelectedJob(null);
          setActiveTab('blogs');
        }}
      />
      <AdminPanel 
        isOpen={isAdminPanelOpen} 
        onClose={() => setIsAdminPanelOpen(false)}
        onOpenWriteBlog={() => setIsWriteModalOpen(true)}
        totalBlogs={blogPosts.length}
        onSyncFromSarkariResult={handleSyncFromSarkariResult}
        isSyncing={isSarkariResultSyncing}
        onSyncFromRajasthanVacancy={handleSyncFromRajasthanVacancy}
        isRajasthanSyncing={isRajasthanSyncing}
        onLockAdmin={handleLockAdmin}
      />
      <AdminAuthModal
        isOpen={isAdminAuthModalOpen}
        onClose={() => setIsAdminAuthModalOpen(false)}
        onSuccess={handleUnlockAdminSuccess}
      />
      <FloatingShareButton 
        title="SarkariPulse - Job Alerts & Updates" 
        text="Check out the latest government job notifications on SarkariPulse." 
      />
    </div>
  );
}
