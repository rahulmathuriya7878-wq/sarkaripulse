import React from 'react';
import { BlogPost } from '../types';
import { Clock, Eye, ThumbsUp, ChevronRight, Sparkles, Flame, Tag, Globe, ExternalLink, ShieldCheck, Trash2 } from 'lucide-react';

interface BlogCardProps {
  post: BlogPost;
  onSelectPost: (post: BlogPost) => void;
  isFeaturedHero?: boolean;
  isAdminUnlocked?: boolean;
  onDeletePost?: (id: string) => void;
}

export const BlogCard: React.FC<BlogCardProps> = ({
  post,
  onSelectPost,
  isFeaturedHero,
  isAdminUnlocked,
  onDeletePost,
}) => {
  const officialUrl = post.officialWebsite?.url || post.officialUrl;
  const officialHost = officialUrl ? officialUrl.replace(/^https?:\/\//, '').replace(/\/$/, '') : '';

  if (isFeaturedHero) {
    return (
      <div
        onClick={() => onSelectPost(post)}
        className="group relative bg-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-md border border-slate-800 overflow-hidden cursor-pointer hover:border-emerald-500/50 transition-all"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-2.5">
          {/* Top Unboxed Metadata & Delete Button */}
          <div className="flex items-center justify-between gap-2 text-[11px] text-slate-300 font-semibold flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-emerald-400 font-bold">{post.category}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>{post.readTime}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
            </div>

            {isAdminUnlocked && onDeletePost && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm(`क्या आप इस पोस्ट को निश्चित रूप से डिलीट करना चाहते हैं?\n"${post.title}"`)) {
                    onDeletePost(post.id);
                  }
                }}
                className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white text-[10px] font-extrabold rounded-lg transition-colors cursor-pointer shrink-0 inline-flex items-center gap-1 shadow-2xs z-20"
                title="स्टाफ मोड: पोस्ट डिलीट करें"
              >
                <Trash2 className="w-3 h-3 text-white" />
                <span>डिलीट पोस्ट</span>
              </button>
            )}
          </div>

          {/* Title & Subtitle */}
          <h2 className="text-base sm:text-lg font-extrabold text-white group-hover:text-amber-300 transition-colors leading-snug line-clamp-2">
            {post.title}
          </h2>
          <p className="text-xs text-slate-300 line-clamp-1 max-w-3xl leading-normal font-normal">
            {post.subtitle}
          </p>

          {/* Official Website Link Badge */}
          {officialUrl && (
            <div className="pt-0.5">
              <a
                href={officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900/90 text-emerald-300 border border-emerald-600/40 text-[11px] font-bold transition-all group/link cursor-pointer shadow-xs"
                title={post.officialWebsite?.name ? `आधिकारिक वेबसाइट: ${post.officialWebsite.name}` : 'आधिकारिक वेबसाइट'}
              >
                <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate max-w-[250px]">
                  आधिकारिक वेबसाइट: <span className="underline decoration-emerald-500/50">{officialHost}</span>
                </span>
                <ExternalLink className="w-3 h-3 text-emerald-400 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform shrink-0" />
              </a>
            </div>
          )}

          {/* Author Byline & Metrics */}
          <div className="pt-2.5 border-t border-slate-800 flex items-center justify-between gap-2 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black flex items-center justify-center text-[10px] shrink-0 shadow-xs">
                {post.author.avatar}
              </div>
              <span className="font-bold text-slate-200 text-xs block">{post.author.name}</span>
            </div>

            <div className="flex items-center gap-3 text-xs font-semibold shrink-0">
              <span className="flex items-center gap-1 text-[11px]">
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                {post.viewsCount.toLocaleString()}
              </span>
              <span className="flex items-center gap-1 text-[11px] text-emerald-400">
                <ThumbsUp className="w-3.5 h-3.5" />
                {post.likesCount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => onSelectPost(post)}
      className="group bg-white rounded-2xl border border-slate-200 p-5 hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between cursor-pointer relative"
    >
      <div>
        {/* Unboxed Metadata Header */}
        <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-2 font-medium">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-emerald-700 font-bold">{post.category}</span>
            {post.jobCategory && (
              <>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="text-slate-800 font-bold">{post.jobCategory}</span>
              </>
            )}
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>{post.readTime}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] text-slate-400">
              {new Date(post.publishedAt).toLocaleDateString()}
            </span>
            {isAdminUnlocked && onDeletePost && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm(`क्या आप इस पोस्ट को निश्चित रूप से डिलीट करना चाहते हैं?\n"${post.title}"`)) {
                    onDeletePost(post.id);
                  }
                }}
                className="px-2 py-0.5 bg-red-600 hover:bg-red-700 text-white text-[10px] font-extrabold rounded transition-colors cursor-pointer shrink-0 inline-flex items-center gap-1 shadow-2xs"
                title="स्टाफ मोड: पोस्ट डिलीट करें"
              >
                <Trash2 className="w-3 h-3 text-white" />
                <span>डिलीट</span>
              </button>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug mb-2">
          {post.title}
        </h3>

        {/* Subtitle / Excerpt */}
        <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed font-normal">
          {post.subtitle || post.summary}
        </p>

        {/* Official Website Link Badge */}
        {officialUrl && (
          <div className="mb-3.5">
            <a
              href={officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50/80 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 text-[11px] font-bold transition-all group/link cursor-pointer max-w-full shadow-2xs"
              title={post.officialWebsite?.name ? `आधिकारिक पोर्टल: ${post.officialWebsite.name}` : 'आधिकारिक वेबसाइट'}
            >
              <Globe className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span className="truncate">
                आधिकारिक वेबसाइट: <span className="underline decoration-emerald-400">{officialHost}</span>
              </span>
              <ExternalLink className="w-3 h-3 text-emerald-700 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform shrink-0" />
            </a>
          </div>
        )}
      </div>

      {/* Author Byline & Actions */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-800 font-bold text-[10px] flex items-center justify-center shrink-0">
            {post.author.avatar}
          </div>
          <span className="font-semibold text-slate-800 text-[11px] truncate max-w-[130px]" title={post.author.name}>
            {post.author.name}
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0 text-[11px]">
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3 text-slate-400" />
            {post.viewsCount}
          </span>
        </div>
      </div>
    </div>
  );
};
