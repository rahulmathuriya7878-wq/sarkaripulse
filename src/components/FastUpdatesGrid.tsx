import React from 'react';
import { Sparkles } from 'lucide-react';
import { BlogPost, JobAlert } from '../types';
import { BlogCard } from './BlogCard';
import { AdSection } from './AdSection';

interface FastUpdatesGridProps {
  regularBlogPosts: BlogPost[];
  setSelectedBlog: (post: BlogPost | null) => void;
  setActiveTab: (tab: 'blogs' | 'vacancies' | 'results' | 'eligibility' | 'chat') => void;
  setSelectedJob: (job: JobAlert | null) => void;
}

export const FastUpdatesGrid: React.FC<FastUpdatesGridProps> = ({ regularBlogPosts, setSelectedBlog, setActiveTab, setSelectedJob }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column: Blog Articles Grid */}
      <div className="lg:col-span-2 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {regularBlogPosts.map((post, index) => (
            <React.Fragment key={`blog-card-${post.id}`}>
              <BlogCard post={post} onSelectPost={(p) => setSelectedBlog(p)} />
              {/* Inject ad every 4th post */}
              {(index + 1) % 4 === 0 && (
                <div className="col-span-full">
                  <AdSection adSlot="1234567890" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Right Column: Trending Ticker & AI Assistant Box */}
      <div className="space-y-5">
        {/* AI Eligibility Quick Widget */}
        <div className="bg-gradient-to-br from-emerald-900 to-slate-900 text-white rounded-2xl p-5 shadow-md space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>AI Sarkari Advisor</span>
          </div>
          <h3 className="text-base font-extrabold leading-snug">Check Which Govt Jobs You Qualify For</h3>
          <p className="text-xs text-slate-300 leading-relaxed font-normal">
            Input age, degree, and category to analyze matching UPSC, SSC, RRB & Banking openings.
          </p>
          <button
            onClick={() => {
              setSelectedJob(null);
              setSelectedBlog(null);
              setActiveTab('eligibility');
            }}
            className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl transition-colors shadow-xs cursor-pointer"
          >
            Launch Eligibility Evaluator →
          </button>
        </div>
      </div>
    </div>
  );
};
