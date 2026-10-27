import React, { useState, useEffect } from 'react';
import { BlogPost, BlogComment } from '../types';
import { SocialShareModal } from './SocialShareModal';
import {
  X,
  Share2,
  MessageSquare,
  Sparkles,
  Send,
  Eye,
  ChevronLeft,
  Bot,
  User,
  HelpCircle,
  Globe,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Trash2,
} from 'lucide-react';

interface BlogDetailViewProps {
  post: BlogPost;
  onBack: () => void;
  onSelectRelatedPost: (post: BlogPost) => void;
  allPosts: BlogPost[];
  isAdminUnlocked?: boolean;
  onDeletePost?: (id: string) => void;
}

export const BlogDetailView: React.FC<BlogDetailViewProps> = ({
  post,
  onBack,
  onSelectRelatedPost,
  allPosts,
  isAdminUnlocked,
  onDeletePost,
}) => {
  const [copied, setCopied] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Official Website Details
  const officialUrl = post.officialWebsite?.url || post.officialUrl;
  const officialName = post.officialWebsite?.name || (post.jobCategory ? `${post.jobCategory} आधिकारिक भर्ती बोर्ड` : 'आधिकारिक सरकारी भर्ती बोर्ड');
  const officialDesc = post.officialWebsite?.portalDescription || 'भर्ती परीक्षा, परिणाम, उत्तर कुंजी व आधिकारिक अधिसूचना संबंधी सत्यापन हेतु अधिकृत सरकारी पोर्टल';
  const officialHost = officialUrl ? officialUrl.replace(/^https?:\/\//, '').replace(/\/$/, '') : '';

  // Comments State
  const [comments, setComments] = useState<BlogComment[]>(post.comments || []);
  const [commentName, setCommentName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [isGeneratingAiReply, setIsGeneratingAiReply] = useState<string | null>(null);

  // Track Reading Scroll Progress
  useEffect(() => {
    window.scrollTo(0, 0);

    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      } else {
        setScrollProgress(0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [post.id]);

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const handleShare = (platform: 'whatsapp' | 'twitter' | 'telegram' | 'copy') => {
    const currentUrl = window.location.href;
    const postTitle = post.title;

    if (platform === 'whatsapp') {
      const waText = `📰 *${postTitle}*\n\n👉 सरकारीपल्स पर विस्तृत रिपोर्ट पढ़ें:\n${currentUrl}`;
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(waText)}`, '_blank');
    } else if (platform === 'telegram') {
      const tgText = `📰 *${postTitle}*`;
      window.open(`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(tgText)}`, '_blank');
    } else if (platform === 'twitter') {
      const twText = `📰 ${postTitle}`;
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(twText)}&url=${encodeURIComponent(currentUrl)}&hashtags=SarkariPulse,GovtJobs,News`, '_blank');
    } else if (platform === 'copy') {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(`📰 ${postTitle}\n${currentUrl}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment: BlogComment = {
      id: `c-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      authorName: commentName.trim() || 'अभ्यर्थी',
      text: commentText.trim(),
      timestamp: 'अभी',
    };

    setComments((prev) => [newComment, ...prev]);
    setCommentText('');

    // Trigger AI Editor Answer
    setIsGeneratingAiReply(newComment.id);
    try {
      const res = await fetch('/api/gemini/blog-comment-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blogTitle: post.title,
          commentText: newComment.text,
        }),
      });
      const data = await res.json();
      if (data.reply) {
        setComments((prev) =>
          prev.map((c) => (c.id === newComment.id ? { ...c, editorReply: data.reply } : c))
        );
      }
    } catch (e) {
      console.error('Comment reply error', e);
    } finally {
      setIsGeneratingAiReply(null);
    }
  };

  // Select related posts ensuring 1 post from 'सरकारी योजना व भर्ती ट्रेंड्स' is included
  const otherPosts = allPosts.filter((p) => p.id !== post.id);
  const trendSchemePost = otherPosts.find(
    (p) =>
      p.category === 'Salary & DA Analysis' ||
      p.category === 'Current Affairs' ||
      p.title.includes('योजना') ||
      p.title.includes('ट्रेंड') ||
      p.subtitle.includes('योजना')
  ) || otherPosts[0];

  const sameCategoryPost = otherPosts.find(
    (p) => p.id !== trendSchemePost?.id && p.category === post.category
  ) || otherPosts.find((p) => p.id !== trendSchemePost?.id);

  const fillPost = otherPosts.find(
    (p) => p.id !== trendSchemePost?.id && p.id !== sameCategoryPost?.id
  );

  const relatedPosts = [sameCategoryPost, trendSchemePost, fillPost].filter(Boolean) as BlogPost[];

  return (
    <div className="space-y-6 max-w-5xl mx-auto relative" key={`blog-detail-${post.id}`}>
      {/* Fixed Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1.5 bg-slate-200 z-50">
        <div
          className="h-full bg-emerald-600 transition-all duration-75 ease-out shadow-xs"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Back Button & Active Staff Delete Button */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-emerald-700 transition-colors cursor-pointer bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs whitespace-nowrap shrink-0"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>वापस जाएं</span>
        </button>

        {isAdminUnlocked && onDeletePost && (
          <button
            type="button"
            onClick={() => {
              if (window.confirm(`क्या आप इस पोस्ट को निश्चित रूप से डिलीट करना चाहते हैं?\n"${post.title}"`)) {
                onDeletePost(post.id);
                onBack();
              }
            }}
            className="inline-flex items-center gap-1.5 text-xs font-extrabold text-white bg-red-600 hover:bg-red-700 transition-colors cursor-pointer px-3.5 py-2 rounded-xl shadow-xs shrink-0"
            title="स्टाफ मोड: पोस्ट डिलीट करें"
          >
            <Trash2 className="w-4 h-4 text-white" />
            <span>पोस्ट डिलीट करें</span>
          </button>
        )}
      </div>

      {/* Main Blog Article Container */}
      <article className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
        {/* Unboxed Editorial Category & Meta */}
        <div className="flex items-center justify-between gap-3 text-xs text-slate-500 font-semibold border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 text-emerald-900 uppercase">
              {post.category}
            </span>
            {post.jobCategory && (
              <>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="text-slate-800 font-bold">{post.jobCategory}</span>
              </>
            )}
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>प्रकाशित तिथि: {new Date(post.publishedAt).toLocaleDateString()}</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>{post.readTime}</span>
          </div>
        </div>

        {/* Editorial Headline & Subtitle */}
        <div className="space-y-3">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 leading-tight tracking-tight">
            {post.title}
          </h1>
          <p className="text-[18px] text-slate-600 font-normal leading-relaxed">
            {post.subtitle}
          </p>
        </div>

        {/* Key Takeaways Callout Box */}
        {post.keyTakeaways && post.keyTakeaways.length > 0 && (
          <div className="p-5 bg-amber-50/80 rounded-2xl border border-amber-200/80 space-y-2">
            <div className="flex items-center gap-2 text-xs font-extrabold text-amber-900 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>मुख्य बिंदु (Key Editorial Takeaways)</span>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[18px] font-medium text-amber-950">
              {post.keyTakeaways.map((point, i) => (
                <li key={`takeaway-${i}`} className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Article Body Content */}
        <div
          key={`html-content-${post.id}`}
          className="prose prose-slate max-w-none text-[18px] leading-[1.8] space-y-4 text-slate-800 font-normal border-b border-slate-100 pb-8"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />

        {/* Official Website Section - Placed right above WhatsApp, Telegram, X/Twitter Share links */}
        {officialUrl && (
          <div className="p-4 bg-emerald-50/90 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-xs shrink-0 mt-0.5 sm:mt-0">
                <Globe className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-black text-emerald-900 tracking-wide uppercase">सत्यापित आधिकारिक पोर्टल (Official Source)</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-200 text-emerald-900">
                    <ShieldCheck className="w-3 h-3 text-emerald-700" /> 100% प्रामाणिक
                  </span>
                </div>
                <div className="font-extrabold text-slate-900 text-sm">{officialName}</div>
                <div className="text-xs text-slate-600">{officialDesc}</div>
              </div>
            </div>
            <a
              href={officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              <span>वेबसाइट पर जाएं</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        )}

        {/* Social Share Bar */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="font-bold text-slate-700">इस समाचार को शेयर करें:</span>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => handleShare('whatsapp')}
              className="px-3 py-1.5 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer"
            >
              व्हाट्सएप (WhatsApp)
            </button>
            <button
              onClick={() => handleShare('telegram')}
              className="px-3 py-1.5 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
            >
              टेलीग्राम (Telegram)
            </button>
            <button
              onClick={() => handleShare('twitter')}
              className="px-3 py-1.5 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              X / Twitter
            </button>
            <button
              onClick={() => handleShare('copy')}
              className="px-3 py-1.5 bg-white border border-slate-300 text-slate-800 font-bold rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              {copied ? 'कॉपी हुआ!' : 'लिंक कॉपी करें'}
            </button>
          </div>
        </div>

        {/* Candidate FAQs Section */}
        {post.faqs && post.faqs.length > 0 && (
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-400">
              <HelpCircle className="w-4 h-4 text-emerald-600" />
              <span>अभ्यर्थियों के मुख्य प्रश्न व उत्तर (FAQs)</span>
            </div>

            <div className="space-y-3">
              {post.faqs.map((faq, i) => (
                <div key={`faq-${i}`} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <h4 className="font-extrabold text-slate-900 text-sm">प्रश्न: {faq.question}</h4>
                  <p className="text-[18px] text-slate-700 leading-relaxed">उत्तर: {faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reader Comments & Q&A Section */}
        <div className="pt-8 border-t border-slate-200 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-extrabold text-slate-900">अभ्यर्थी कमेंट्स व प्रश्नोत्तर</h3>
            </div>
            <span className="text-xs font-bold text-slate-500">{comments.length} टिप्पणियां</span>
          </div>

          {/* Comment Form */}
          <form onSubmit={handlePostComment} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={commentName}
                onChange={(e) => setCommentName(e.target.value)}
                placeholder="आपका नाम (Aspirant Name)"
                className="px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <textarea
              rows={2}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="योग्यता, पाठ्यक्रम या तिथि से संबंधित सवाल पूछें..."
              className="w-full p-3 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
            <div className="flex items-center justify-end">
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors cursor-pointer shadow-xs inline-flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>कमेंट पोस्ट करें</span>
              </button>
            </div>
          </form>

          {/* Comments Feed */}
          <div className="space-y-4">
            {comments.map((c) => (
              <div key={c.id} className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    {c.authorName}
                  </span>
                  <span className="text-[11px]">{c.timestamp}</span>
                </div>
                <p className="text-slate-700 leading-relaxed font-normal">{c.text}</p>

                {/* Editor Reply / AI Editor Answer */}
                {c.editorReply ? (
                  <div className="mt-3 p-3 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1">
                    <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-emerald-900">
                      <Bot className="w-3.5 h-3.5 text-emerald-700" />
                      <span>सरकारीपल्स संपादक का उत्तर:</span>
                    </div>
                    <p className="text-xs text-slate-800 leading-relaxed">{c.editorReply}</p>
                  </div>
                ) : isGeneratingAiReply === c.id ? (
                  <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
                    <Bot className="w-4 h-4 text-emerald-600 animate-spin" />
                    <span>संपादक टीम उत्तर तैयार कर रही है...</span>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </article>

      {/* Related Blog Posts */}
      {relatedPosts.length > 0 && (
        <div className="space-y-4 pt-4">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">इसी श्रेणी के अन्य समाचार ब्लॉग</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedPosts.map((rp) => (
              <div
                key={rp.id}
                onClick={() => onSelectRelatedPost(rp)}
                className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 transition-all cursor-pointer space-y-2"
              >
                <span className="text-[10px] font-bold text-emerald-700 uppercase">{rp.category}</span>
                <h4 className="font-extrabold text-slate-900 text-xs line-clamp-2 leading-snug">{rp.title}</h4>
                <p className="text-[11px] text-slate-500 line-clamp-2 font-normal">{rp.summary}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <SocialShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        item={post}
        type="blog"
      />
    </div>
  );
};
