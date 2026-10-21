import React, { useState } from 'react';
import { BlogPost, BlogCategory, JobCategory } from '../types';
import { X, Sparkles, Send, Edit3, BookOpen, Check } from 'lucide-react';

interface BlogWriteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublishPost: (post: BlogPost) => void;
}

const CATEGORIES: BlogCategory[] = [
  'Job Notification',
  'Breaking News',
  'Exam Strategy & Prep',
  'Syllabus Breakdown',
  'Salary & DA Analysis',
  'Current Affairs',
  'Result & Cutoff',
];

const JOB_CATEGORIES: JobCategory[] = ['UPSC', 'SSC', 'Banking', 'Railways', 'Defense', 'State PSC', 'Teaching', 'PSU', 'Medical'];

export const BlogWriteModal: React.FC<BlogWriteModalProps> = ({ isOpen, onClose, onPublishPost }) => {
  if (!isOpen) return null;

  const [aiPrompt, setAiPrompt] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState<BlogCategory>('Job Notification');
  const [jobCategory, setJobCategory] = useState<JobCategory>('UPSC');
  const [authorName, setAuthorName] = useState('सरकारीपल्स ब्यूरो');
  const [summary, setSummary] = useState('');
  const [contentHtml, setContentHtml] = useState('');
  const [takeawaysText, setTakeawaysText] = useState('');

  const handleGenerateWithAi = async () => {
    if (!aiPrompt.trim() || loadingAi) return;
    setLoadingAi(true);

    try {
      const res = await fetch('/api/gemini/generate-blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: aiPrompt.trim(),
          category: category,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Generation failed');

      if (data.title) setTitle(data.title);
      if (data.subtitle) setSubtitle(data.subtitle);
      if (data.summary) setSummary(data.summary);
      if (data.contentHtml) setContentHtml(data.contentHtml);
      if (data.keyTakeaways) setTakeawaysText(data.keyTakeaways.join('\n'));
    } catch (e: any) {
      alert(e.message || 'Error generating blog post');
    } finally {
      setLoadingAi(false);
    }
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !contentHtml.trim()) return;

    const newPost: BlogPost = {
      id: `blog-user-${Date.now()}`,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: title.trim(),
      subtitle: subtitle.trim() || summary.trim(),
      category: category,
      jobCategory: jobCategory,
      author: {
        name: authorName.trim() || 'Education Editor',
        role: 'Senior Sarkari News Journalist',
        avatar: authorName.slice(0, 2).toUpperCase() || 'ED',
      },
      publishedAt: new Date().toISOString(),
      readTime: `${Math.max(2, Math.ceil(contentHtml.length / 500))} min read`,
      viewsCount: 1,
      likesCount: 0,
      isFeatured: false,
      isTrending: true,
      summary: summary.trim() || subtitle.trim(),
      keyTakeaways: takeawaysText.split('\n').filter((t) => t.trim()),
      contentHtml: contentHtml.trim(),
      faqs: [],
      comments: [],
      tags: [category, jobCategory, 'Sarkari News'],
    };

    onPublishPost(newPost);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-extrabold text-base text-white">SarkariPulse News Blogger Studio</h3>
              <p className="text-xs text-slate-400">Publish news blog posts or generate with AI Journalist</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handlePublish} className="p-6 overflow-y-auto flex-1 text-xs space-y-5">
          {/* AI Generator Box */}
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-3">
            <div className="flex items-center gap-1.5 font-extrabold text-emerald-950 text-xs">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <span>AI News Writer Assistant</span>
            </div>
            <p className="text-slate-700 text-[11px]">
              Enter a topic or headline (e.g., "SSC CGL Tier 1 Result Declared Cutoff Marks") and click generate to auto-write a complete news blog article!
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Topic / Headline for AI Blogger..."
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-emerald-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={handleGenerateWithAi}
                disabled={!aiPrompt.trim() || loadingAi}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl transition-colors cursor-pointer shrink-0 disabled:opacity-50 inline-flex items-center gap-1.5"
              >
                {loadingAi ? (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                <span>Auto-Write</span>
              </button>
            </div>
          </div>

          {/* Form Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Blog Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Target Sector</label>
              <select
                value={jobCategory}
                onChange={(e) => setJobCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
              >
                {JOB_CATEGORIES.map((jc) => (
                  <option key={jc} value={jc}>
                    {jc}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Article Title / Headline</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. UPSC CSE 2026 Strategy & Eligibility Analysis"
              className="w-full px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Author Name / Byline</label>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="e.g. Chief Education Editor"
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Subtitle / Excerpt</label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Brief 1-line overview..."
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Key Takeaways (One per line)</label>
            <textarea
              rows={3}
              value={takeawaysText}
              onChange={(e) => setTakeawaysText(e.target.value)}
              placeholder="Point 1&#10;Point 2&#10;Point 3"
              className="w-full p-3 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Full Article Body Content</label>
            <textarea
              rows={6}
              value={contentHtml}
              onChange={(e) => setContentHtml(e.target.value)}
              placeholder="Write or paste paragraph content here..."
              className="w-full p-3 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-sans"
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-sm inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publish Blog Post</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
