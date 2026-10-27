import React, { useState } from 'react';
import { X, Twitter, Facebook, Instagram, Send, Check, Copy, ExternalLink, Globe, Sparkles, Share2 } from 'lucide-react';
import { JobAlert, BlogPost } from '../types';

interface SocialShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: JobAlert | BlogPost | null;
  type: 'job' | 'blog';
}

export const SocialShareModal: React.FC<SocialShareModalProps> = ({
  isOpen,
  onClose,
  item,
  type,
}) => {
  const [copiedText, setCopiedText] = useState(false);
  const [activeTab, setActiveTab] = useState<'social' | 'instagram' | 'govt_portal'>('social');

  if (!isOpen || !item) return null;

  const currentUrl = window.location.href;
  const isJob = type === 'job';
  const job = isJob ? (item as JobAlert) : null;
  const blog = !isJob ? (item as BlogPost) : null;

  const title = isJob ? job!.title : blog!.title;
  const organization = isJob ? job!.organization : 'सरकारीपल्स ब्यूरो';
  const totalPosts = isJob ? job!.totalPosts : '';
  const officialUrl = isJob ? job!.officialUrl : 'https://india.gov.in';
  const applyUrl = isJob ? job!.applyUrl : 'https://india.gov.in';

  // Social Share Constructs
  const shareText = isJob
    ? `🔥 ${title}\n🏛️ आयोग: ${organization}\n👥 कुल पद: ${totalPosts}\n📅 अंतिम तिथि: ${job!.importantDates.applicationEnd}\n\nविस्तृत जानकारी व ऑनलाइन आवेदन लिंक:`
    : `📰 *${title}*\n\n👉 सरकारीपल्स न्यूज़ ब्लॉग पर विस्तृत रिपोर्ट पढ़ें:`;

  const encodedUrl = encodeURIComponent(currentUrl);
  const encodedText = encodeURIComponent(`${shareText}\n${currentUrl}`);

  // Social URLs with post heading (title)
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`📰 ${title}`)}&url=${encodedUrl}&hashtags=SarkariNaukri,GovernmentJobs,SarkariPulse`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodedText}`;
  const telegramShareUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(`📰 ${title}`)}`;

  const instagramCaption = isJob
    ? `🚨 नई सरकारी भर्ती अधिसूचना 2026! 🚨\n\n📌 पद: ${title}\n🏛️ संस्थान: ${organization}\n🔢 कुल पद: ${totalPosts}\n🎓 योग्यता: ${job!.qualification.slice(0, 80)}...\n⏳ अंतिम तिथि: ${job!.importantDates.applicationEnd}\n\n👉 बायो में दिए गए लिंक से तुरंत ऑनलाइन फॉर्म भरें!\n\n#SarkariNaukri #GovernmentJobs #UPSC #SSC #SarkariPulse #JobAlert2026 #ExamPreparation`
    : `📰 सरकारी भर्ती समाचार 2026 📰\n\n${title}\n\n👉 बायो में दिए गए लिंक से संपूर्ण रिपोर्ट पढ़ें!\n\n#SarkariPulse #NewsUpdate #GovtJobs #CurrentAffairs`;

  const handleCopyCaption = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(instagramCaption);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Share2 className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">सोशल मीडिया व सरकारी पोर्टल शेयर</h3>
              <p className="text-xs text-slate-500 font-medium">Twitter, Facebook, Instagram & Govt Portal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-bold">
          <button
            onClick={() => setActiveTab('social')}
            className={`flex-1 py-2 rounded-lg transition-all cursor-pointer text-center ${
              activeTab === 'social'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            सोशल नेटवर्क (Share)
          </button>
          <button
            onClick={() => setActiveTab('instagram')}
            className={`flex-1 py-2 rounded-lg transition-all cursor-pointer text-center flex items-center justify-center gap-1 ${
              activeTab === 'instagram'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Instagram className="w-3.5 h-3.5 text-pink-600" />
            <span>Instagram / Story</span>
          </button>
          {isJob && (
            <button
              onClick={() => setActiveTab('govt_portal')}
              className={`flex-1 py-2 rounded-lg transition-all cursor-pointer text-center flex items-center justify-center gap-1 ${
                activeTab === 'govt_portal'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              <span>सरकारी पोर्टल</span>
            </button>
          )}
        </div>

        {/* Tab 1: Direct Social Networks */}
        {activeTab === 'social' && (
          <div className="space-y-4">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 font-medium line-clamp-3">
              <span className="font-bold text-slate-900 block mb-1">शेयर करने हेतु पोस्ट शीर्षक:</span>
              {title}
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Twitter / X */}
              <a
                href={twitterShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 bg-black hover:bg-slate-800 text-white rounded-2xl flex items-center gap-3 transition-all cursor-pointer shadow-xs group"
              >
                <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center shrink-0">
                  <Twitter className="w-4.5 h-4.5 text-white" />
                </div>
                <div>
                  <span className="text-xs font-bold block">X (Twitter)</span>
                  <span className="text-[10px] text-slate-300 block">ट्वीट करें</span>
                </div>
              </a>

              {/* Facebook */}
              <a
                href={facebookShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl flex items-center gap-3 transition-all cursor-pointer shadow-xs group"
              >
                <div className="w-8 h-8 rounded-xl bg-blue-700 flex items-center justify-center shrink-0">
                  <Facebook className="w-4.5 h-4.5 text-white" />
                </div>
                <div>
                  <span className="text-xs font-bold block">Facebook</span>
                  <span className="text-[10px] text-blue-100 block">फेसबुक पर पोस्ट करें</span>
                </div>
              </a>

              {/* WhatsApp */}
              <a
                href={whatsappShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl flex items-center gap-3 transition-all cursor-pointer shadow-xs group"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-700 flex items-center justify-center shrink-0">
                  <Send className="w-4.5 h-4.5 text-white" />
                </div>
                <div>
                  <span className="text-xs font-bold block">WhatsApp</span>
                  <span className="text-[10px] text-emerald-100 block">ग्रुप्स में भेजें</span>
                </div>
              </a>

              {/* Telegram */}
              <a
                href={telegramShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 bg-sky-500 hover:bg-sky-600 text-white rounded-2xl flex items-center gap-3 transition-all cursor-pointer shadow-xs group"
              >
                <div className="w-8 h-8 rounded-xl bg-sky-600 flex items-center justify-center shrink-0">
                  <Send className="w-4.5 h-4.5 text-white" />
                </div>
                <div>
                  <span className="text-xs font-bold block">Telegram</span>
                  <span className="text-[10px] text-sky-100 block">चैनल पर शेयर करें</span>
                </div>
              </a>
            </div>
          </div>
        )}

        {/* Tab 2: Instagram Post & Story Helper */}
        {activeTab === 'instagram' && (
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 rounded-2xl border border-pink-200 space-y-3">
              <div className="flex items-center gap-2 text-xs font-extrabold text-pink-900">
                <Instagram className="w-4 h-4 text-pink-600" />
                <span>Instagram पोस्ट/स्टोरी कैप्शन (Ready Caption):</span>
              </div>
              <textarea
                rows={6}
                readOnly
                value={instagramCaption}
                className="w-full p-3 text-xs bg-white/80 rounded-xl border border-pink-200 text-slate-800 font-mono focus:outline-none"
              />
              <button
                onClick={handleCopyCaption}
                className="w-full py-2.5 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:opacity-95 text-white text-xs font-bold rounded-xl transition-all cursor-pointer inline-flex items-center justify-center gap-1.5 shadow-sm"
              >
                {copiedText ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>Instagram कैप्शन कॉपी हो गया!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-white" />
                    <span>Instagram कैप्शन कॉपी करें</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-slate-500 text-center font-medium">
              कैप्शन कॉपी करने के बाद इंस्टाग्राम ऐप खोलें और रील्स, स्टोरी अथवा पोस्ट में पेस्ट करें!
            </p>
          </div>
        )}

        {/* Tab 3: Official Government Website Integration */}
        {activeTab === 'govt_portal' && isJob && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-3 border border-slate-700">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase">आधिकारिक सरकारी पोर्टल</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Verified Portal
                </span>
              </div>
              <div>
                <h4 className="font-extrabold text-base text-white">{job?.organization}</h4>
                <p className="text-xs text-slate-300 mt-1">{job?.title}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href={officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-2xl flex items-center justify-between text-slate-900 transition-all cursor-pointer"
              >
                <div>
                  <span className="text-[10px] font-bold text-slate-500 block uppercase">मुख्य पोर्टल</span>
                  <span className="text-xs font-extrabold flex items-center gap-1">
                    <span>आयोग वेब पोर्टल</span>
                  </span>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-600" />
              </a>

              <a
                href={applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl flex items-center justify-between transition-all cursor-pointer shadow-xs"
              >
                <div>
                  <span className="text-[10px] font-bold text-emerald-200 block uppercase">डायरेक्ट फॉर्म लिंक</span>
                  <span className="text-xs font-black">ऑनलाइन फॉर्म भरें</span>
                </div>
                <ExternalLink className="w-4 h-4 text-white" />
              </a>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
          <span className="inline-flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>सरकारीपल्स सोशल मीडिया इंटीग्रेशन नेटवर्क</span>
          </span>
          <button
            onClick={onClose}
            className="font-bold text-slate-700 hover:text-slate-900 cursor-pointer"
          >
            बंद करें
          </button>
        </div>
      </div>
    </div>
  );
};
