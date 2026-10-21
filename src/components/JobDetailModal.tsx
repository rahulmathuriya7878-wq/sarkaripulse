import React, { useState, useEffect } from 'react';
import { JobAlert } from '../types';
import { X, Calendar, DollarSign, Award, BookOpen, ExternalLink, Sparkles, CheckCircle2, AlertCircle, Bookmark, Link as LinkIcon, Share2, Check } from 'lucide-react';

interface JobDetailModalProps {
  job: JobAlert | null;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (jobId: string) => void;
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({
  job,
  onClose,
  isBookmarked,
  onToggleBookmark,
}) => {
  const [aiSummary, setAiSummary] = useState<string>('');
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);

  const [copied, setCopied] = useState(false);

  const formatImportantDate = (dateStr?: string) => {
    if (
      !dateStr ||
      dateStr.trim() === '' ||
      dateStr.trim() === '-' ||
      dateStr.toLowerCase().includes('tbd') ||
      dateStr.toLowerCase().includes('na') ||
      dateStr.toLowerCase().includes('notification') ||
      dateStr.toLowerCase().includes('अधिसूचना')
    ) {
      return 'अधिसूचना के अनुसार (As per Notification)';
    }
    return dateStr;
  };

  useEffect(() => {
    setAiSummary('');
  }, [job]);

  if (!job) return null;

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${job.title} - ${job.totalPosts} भर्ती ऑन सरकारीपल्स: ${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const fetchAiSummary = async () => {
    if (aiSummary) return;
    setIsLoadingAi(true);
    try {
      const res = await fetch('/api/gemini/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: job.title,
          details: {
            organization: job.organization,
            totalPosts: job.totalPosts,
            qualification: job.qualification,
            ageLimit: job.ageLimit,
            salaryScale: job.salaryScale,
            examPattern: job.examPattern,
            syllabusHighlights: job.syllabusHighlights,
            importantDates: job.importantDates,
          },
          type: 'Government Job Notification',
        }),
      });
      const data = await res.json();
      setAiSummary(data.summary || 'Summary unavailable.');
    } catch (e) {
      setAiSummary('Failed to fetch AI briefing. Please try again.');
    } finally {
      setIsLoadingAi(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-2">
              <span>{job.category}</span>
              <span aria-hidden="true">·</span>
              <span>{job.type}</span>
              <span aria-hidden="true">·</span>
              <span className="text-amber-400">{job.totalPosts}</span>
            </div>
            <h2 className="text-xl font-extrabold text-white leading-tight">{job.title}</h2>
            <p className="text-xs text-slate-300 mt-1">{job.organization}</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onToggleBookmark(job.id)}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                isBookmarked ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-slate-950' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body Content - Continuous Blog View in 18px with 22px Headings */}
        <div className="p-6 overflow-y-auto flex-1 text-slate-800 text-[18px] space-y-6 leading-relaxed">
          {/* Section 1: Detailed Overview */}
          <section className="space-y-2">
            <h3 className="text-[22px] font-extrabold text-slate-900 border-b border-slate-100 pb-1">
              1. भर्ती का विस्तृत विवरण (Notification Overview)
            </h3>
            <p className="text-[18px] leading-relaxed text-slate-800 font-normal">{job.description}</p>
          </section>

          {/* Section 2: Important Schedule Dates */}
          <section className="space-y-2">
            <h3 className="text-[22px] font-extrabold text-slate-900">
              2. महत्वपूर्ण तिथियां (Important Schedule Dates)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs">
                <span className="text-slate-500 block text-[11px] font-bold uppercase">फॉर्म प्रारंभ तिथि</span>
                <span className="font-bold text-slate-900 text-[18px]">
                  {formatImportantDate(job.importantDates.applicationStart)}
                </span>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs">
                <span className="text-slate-500 block text-[11px] font-bold uppercase">अंतिम तिथि (Last Date)</span>
                <span className="font-bold text-amber-600 text-[18px]">
                  {formatImportantDate(job.importantDates.applicationEnd)}
                </span>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs">
                <span className="text-slate-500 block text-[11px] font-bold uppercase">एडमिट कार्ड</span>
                <span className="font-bold text-slate-900 text-[18px]">
                  {formatImportantDate(job.importantDates.admitCardDate)}
                </span>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs">
                <span className="text-slate-500 block text-[11px] font-bold uppercase">परीक्षा तिथि</span>
                <span className="font-bold text-slate-900 text-[18px]">
                  {formatImportantDate(job.importantDates.examDate)}
                </span>
              </div>
            </div>
          </section>

          {/* Section 3: Application Fee & Payment Mode */}
          <section className="space-y-2">
            <h3 className="text-[22px] font-extrabold text-slate-900">
              3. आवेदन शुल्क व भुगतान माध्यम (Application Fee & Payment Mode)
            </h3>
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2">
              <p className="font-extrabold text-slate-900 text-[18px]">{job.applicationFee}</p>
              <div className="pt-2 border-t border-slate-100 text-xs text-slate-700 font-medium flex items-center gap-1.5 flex-wrap">
                <span className="font-bold text-slate-900">भुगतान माध्यम:</span>
                <span className="bg-slate-50 px-2 py-0.5 rounded border border-slate-200">नेट बैंकिंग</span>
                <span className="bg-slate-50 px-2 py-0.5 rounded border border-slate-200">कार्ड</span>
                <span className="bg-slate-50 px-2 py-0.5 rounded border border-slate-200">UPI</span>
              </div>
            </div>
          </section>

          {/* Section 4: Qualification */}
          <section className="space-y-2">
            <h3 className="text-[22px] font-extrabold text-slate-900">
              4. शैक्षणिक योग्यता (Qualification)
            </h3>
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
              <p className="font-extrabold text-slate-900 text-[18px]">{job.qualification}</p>
            </div>
          </section>

          {/* Section 5: Age Limit */}
          <section className="space-y-2">
            <h3 className="text-[22px] font-extrabold text-slate-900">
              5. आयु सीमा व छूट (Age Limit & Relaxation)
            </h3>
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
              <p className="font-extrabold text-slate-900 text-[18px]">{job.ageLimit}</p>
            </div>
          </section>

          {/* Section 6: Pay Scale */}
          <section className="space-y-2">
            <h3 className="text-[22px] font-extrabold text-slate-900">
              6. वेतनमान व भत्ते (Pay Scale & Allowances)
            </h3>
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
              <p className="font-extrabold text-slate-900 text-[18px]">{job.salaryScale}</p>
            </div>
          </section>

          {/* Section 7: Selection Process & Syllabus */}
          <section className="space-y-3">
            <h3 className="text-[22px] font-extrabold text-slate-900">
              7. चयन प्रक्रिया व पाठ्यक्रम (Selection & Syllabus)
            </h3>
            <div className="space-y-2">
              {job.examPattern.map((stage, i) => (
                <div key={i} className="flex items-start gap-3 p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <p className="font-bold text-slate-900 text-[18px]">{stage}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {job.syllabusHighlights.map((topic, i) => (
                <div key={i} className="flex items-center gap-2 p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-[18px] font-bold text-slate-800">{topic}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Section 8: AI Exam Strategy & Insights */}
          <section className="space-y-2 p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <h3 className="text-[22px] font-extrabold text-slate-900">
                8. AI परीक्षा रणनीति व सारांश
              </h3>
            </div>
            {isLoadingAi ? (
              <div className="py-4 text-center space-y-2">
                <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-slate-600 font-bold">AI विश्लेषण जारी है...</p>
              </div>
            ) : aiSummary ? (
              <p className="text-[18px] text-slate-800 whitespace-pre-line leading-relaxed font-normal">{aiSummary}</p>
            ) : (
              <button
                onClick={fetchAiSummary}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI सारांश व रणनीति लोड करें</span>
              </button>
            )}
          </section>

          {/* Important Direct Links & Last Date Section */}
          <section className="p-5 bg-white text-slate-900 rounded-2xl shadow-xs space-y-4 border-2 border-slate-200 mt-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 flex-wrap gap-2">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <LinkIcon className="w-4 h-4 text-emerald-600" />
                  <span>महत्वपूर्ण लिंक्स व अंतिम तिथि (Important Links)</span>
                </h3>
                <p className="text-xs text-slate-600 font-medium mt-0.5">
                  वेब पोर्टल विजिट करें एवं अंतिम तिथि से पूर्व ऑनलाइन फॉर्म जमा करें।
                </p>
              </div>

              <div className="bg-amber-50 border border-amber-300 px-3 py-1 rounded-xl text-amber-950 font-bold text-xs flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-600" />
                <span>अंतिम तिथि: {formatImportantDate(job.importantDates.applicationEnd)}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href={job.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-between gap-2 group transition-all cursor-pointer"
              >
                <div>
                  <span className="text-[10px] font-bold text-slate-500 block uppercase">वेबसाइट लिंक</span>
                  <span className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">
                    मुख्य वेब पोर्टल (Website Link)
                  </span>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-emerald-700 shrink-0" />
              </a>

              <a
                href={job.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-emerald-600 hover:bg-emerald-700 border border-emerald-600 rounded-xl flex items-center justify-between gap-2 group transition-all cursor-pointer"
              >
                <div>
                  <span className="text-[10px] font-bold text-emerald-100 block uppercase">आवेदन लिंक</span>
                  <span className="font-extrabold text-white text-sm">
                    ऑनलाइन फॉर्म भरें (Apply Link)
                  </span>
                </div>
                <ExternalLink className="w-4 h-4 text-white shrink-0" />
              </a>
            </div>
          </section>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <a
              href={job.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              <span>वेब पोर्टल (Web Portal)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={handleShare}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors cursor-pointer border border-slate-200 inline-flex items-center gap-1.5 shadow-xs"
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{copied ? 'कॉपी हो गया!' : 'शेयर करें'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Close
            </button>
            <a
              href={job.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-sm inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>Apply Online Now</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
