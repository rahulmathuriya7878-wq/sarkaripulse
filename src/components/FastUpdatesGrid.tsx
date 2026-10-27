import React from 'react';
import { Sparkles } from 'lucide-react';
import { BlogPost, JobAlert } from '../types';
import { BlogCard } from './BlogCard';
import { AdSection } from './AdSection';

interface FastUpdatesGridProps {
  regularBlogPosts: BlogPost[];
  setSelectedBlog: (post: BlogPost | null) => void;
  setActiveTab: (tab: 'blogs' | 'results' | 'eligibility' | 'chat') => void;
  setSelectedJob: (job: JobAlert | null) => void;
  isAdminUnlocked?: boolean;
  onDeleteBlog?: (id: string) => void;
}

export const FastUpdatesGrid: React.FC<FastUpdatesGridProps> = ({
  regularBlogPosts,
  setSelectedBlog,
  setActiveTab,
  setSelectedJob,
  isAdminUnlocked,
  onDeleteBlog,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column: Blog Articles Grid */}
      <div className="lg:col-span-2 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {regularBlogPosts.map((post, index) => (
            <React.Fragment key={`blog-card-${post.id}`}>
              <BlogCard
                post={post}
                onSelectPost={(p) => setSelectedBlog(p)}
                isAdminUnlocked={isAdminUnlocked}
                onDeletePost={onDeleteBlog}
              />
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

      {/* Right Column: Trending Ticker */}
      <div className="space-y-5">
        
      </div>
    </div>
  );
};
