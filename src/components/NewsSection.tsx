import React, { useState } from 'react';
import { NewsItem, NewsCategory } from '../types';
import { Volume2, VolumeX, Sparkles, BookOpen, Clock, Tag, Share2, Check } from 'lucide-react';

interface NewsSectionProps {
  newsItems: NewsItem[];
  onOpenDailyQuiz: () => void;
}

const CATEGORIES: (NewsCategory | 'All News')[] = [
  'All News',
  'Salary & DA News',
  'Recruitment Policy',
  'Exam Pattern Update',
  'Current Affairs',
  'Syllabus Change',
];

export const NewsSection: React.FC<NewsSectionProps> = ({ newsItems, onOpenDailyQuiz }) => {
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory | 'All News'>('All News');
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredNews =
    selectedCategory === 'All News'
      ? newsItems
      : newsItems.filter((n) => n.category === selectedCategory);

  const handleSpeech = (news: NewsItem) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingId === news.id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(`${news.title}. ${news.summary}`);
    utterance.rate = 0.95;
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(news.id);
    window.speechSynthesis.speak(utterance);
  };

  const handleShare = (news: NewsItem) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${news.title} - Read on SarkariPulse`);
      setCopiedId(news.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner Action Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Daily Current Affairs & Policy Digest</span>
          </div>
          <h2 className="text-xl font-extrabold text-white">Government Job & Salary Policy News</h2>
          <p className="text-xs text-slate-300 mt-1">
            Stay ahead with verified press releases, 7th Pay Commission DA updates, and exam pattern modifications.
          </p>
        </div>

        <button
          onClick={onOpenDailyQuiz}
          className="px-5 py-2.5 text-xs font-extrabold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors shadow-sm inline-flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Sparkles className="w-4 h-4 text-slate-950" />
          <span>Take Daily AI GK Quiz</span>
        </button>
      </div>

      {/* Category Segmented Controls (Functional Filter Buttons) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              selectedCategory === cat
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* News Articles List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredNews.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Unboxed Metadata Header */}
              <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-2">
                <div className="flex items-center gap-2 font-semibold">
                  <span className="text-emerald-700">{item.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{item.readTime}</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleSpeech(item)}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      speakingId === item.id ? 'bg-emerald-100 text-emerald-800' : 'text-slate-400 hover:text-slate-700'
                    }`}
                    title={speakingId === item.id ? 'Stop Speech' : 'Listen to News Brief'}
                  >
                    {speakingId === item.id ? <VolumeX className="w-4 h-4 animate-pulse" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleShare(item)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
                    title="Copy Article Summary"
                  >
                    {copiedId === item.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <h3 className="text-base font-extrabold text-slate-900 mb-2 leading-snug">{item.title}</h3>
              <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">{item.summary}</p>
            </div>

            {/* Source & Tags */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-[11px] text-slate-500">
              <span className="font-medium truncate max-w-[200px]" title={item.source}>
                {item.source}
              </span>
              <span className="font-semibold text-slate-700">
                {new Date(item.publishedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
