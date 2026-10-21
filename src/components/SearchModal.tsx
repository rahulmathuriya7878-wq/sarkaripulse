import React, { useState } from 'react';
import { X, Search, Briefcase, BookOpen, ExternalLink, ArrowRight, Calendar, Sparkles } from 'lucide-react';
import { JobAlert, BlogPost } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobs: JobAlert[];
  blogs: BlogPost[];
  onSelectJob: (job: JobAlert) => void;
  onSelectBlog: (blog: BlogPost) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  jobs,
  blogs,
  onSelectJob,
  onSelectBlog,
}) => {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'jobs' | 'blogs'>('all');

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  const filteredJobs = jobs.filter((job) => {
    if (!q) return true;
    return (
      job.title.toLowerCase().includes(q) ||
      job.organization.toLowerCase().includes(q) ||
      job.category.toLowerCase().includes(q) ||
      job.qualification.toLowerCase().includes(q)
    );
  });

  const filteredBlogs = blogs.filter((blog) => {
    if (!q) return true;
    return (
      blog.title.toLowerCase().includes(q) ||
      blog.subtitle.toLowerCase().includes(q) ||
      blog.category.toLowerCase().includes(q) ||
      blog.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-start justify-center pt-16 sm:pt-24 p-4">
      <div className="bg-white rounded-3xl border border-slate-200 max-w-2xl w-full max-h-[80vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 overflow-hidden">
        {/* Search Header Input */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <Search className="w-5 h-5 text-emerald-700" />
          </div>
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="सरकारी नौकरियां, UPSC, SSC, कटऑफ, परीक्षा तिथियां खोजें..."
            className="w-full bg-transparent text-sm sm:text-base font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-700 text-xs font-bold cursor-pointer"
            >
              साफ करें
            </button>
          )}
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="px-5 py-2.5 bg-white border-b border-slate-100 flex items-center gap-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
              activeTab === 'all'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            सभी परिणाम ({filteredJobs.length + filteredBlogs.length})
          </button>
          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
              activeTab === 'jobs'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            नौकरियां ({filteredJobs.length})
          </button>
          <button
            onClick={() => setActiveTab('blogs')}
            className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
              activeTab === 'blogs'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            समाचार व ब्लॉग ({filteredBlogs.length})
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {filteredJobs.length === 0 && filteredBlogs.length === 0 && (
            <div className="text-center py-12 space-y-3">
              <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-slate-800 text-sm">कोई परिणाम नहीं मिला</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                कृपया अपनी खोजशब्द (Keyword) बदलें या सामान्य शब्दों का उपयोग करें (जैसे: UPSC, SSC, Railway)।
              </p>
              <a
                href={`https://www.google.com/search?q=${encodeURIComponent(q)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Google पर खोजें</span>
              </a>
            </div>
          )}

          {/* Jobs Section */}
          {(activeTab === 'all' || activeTab === 'jobs') && filteredJobs.length > 0 && (
            <div className="space-y-2.5">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5 px-1">
                <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
                <span>सरकारी नौकरियां व वैकेंसियां ({filteredJobs.length})</span>
              </h4>
              <div className="space-y-2">
                {filteredJobs.slice(0, 8).map((job) => (
                  <div
                    key={`search-job-${job.id}`}
                    onClick={() => {
                      onSelectJob(job);
                      onClose();
                    }}
                    className="p-3.5 rounded-2xl bg-slate-50 hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-200 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-black">
                          {job.category}
                        </span>
                        <span className="text-[11px] font-bold text-slate-500">{job.organization}</span>
                      </div>
                      <h5 className="font-extrabold text-xs sm:text-sm text-slate-900 group-hover:text-emerald-900 line-clamp-1">
                        {job.title}
                      </h5>
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-all shrink-0">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Blogs Section */}
          {(activeTab === 'all' || activeTab === 'blogs') && filteredBlogs.length > 0 && (
            <div className="space-y-2.5 pt-2">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5 px-1">
                <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                <span>समाचार व ब्लॉग रिपोर्ट्स ({filteredBlogs.length})</span>
              </h4>
              <div className="space-y-2">
                {filteredBlogs.slice(0, 8).map((blog) => (
                  <div
                    key={`search-blog-${blog.id}`}
                    onClick={() => {
                      onSelectBlog(blog);
                      onClose();
                    }}
                    className="p-3.5 rounded-2xl bg-slate-50 hover:bg-amber-50/60 border border-slate-200 hover:border-amber-200 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-black">
                          {blog.category}
                        </span>
                        <span className="text-[11px] font-bold text-slate-500">{blog.readTime}</span>
                      </div>
                      <h5 className="font-extrabold text-xs sm:text-sm text-slate-900 group-hover:text-amber-900 line-clamp-1">
                        {blog.title}
                      </h5>
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 group-hover:bg-amber-600 group-hover:text-white group-hover:border-amber-600 transition-all shrink-0">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500 font-medium flex items-center justify-between">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>त्वरित खोज (Instant Search)</span>
          </span>
          <a
            href={`https://www.google.com/search?q=${encodeURIComponent(q)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-700 font-bold hover:underline cursor-pointer"
          >
            Google पर खोजें
          </a>
          <span>ESC दबाकर बंद करें</span>
        </div>
      </div>
    </div>
  );
};
