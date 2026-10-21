import React, { useState, useEffect } from 'react';
import { JobAlert } from '../types';
import { SocialShareModal } from './SocialShareModal';
import {
  ChevronLeft,
  Calendar,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Bookmark,
  Building2,
  DollarSign,
  Award,
  BookOpen,
  Share2,
  Check,
  Volume2,
  VolumeX,
  User,
  Send,
  Bot,
  HelpCircle,
  MessageSquare,
  Link as LinkIcon,
} from 'lucide-react';

interface JobDetailViewProps {
  job: JobAlert;
  onBack: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (jobId: string) => void;
  onSelectRelatedJob?: (job: JobAlert) => void;
  allJobs?: JobAlert[];
}

export const JobDetailView: React.FC<JobDetailViewProps> = ({
  job,
  onBack,
  isBookmarked,
  onToggleBookmark,
  onSelectRelatedJob,
  allJobs = [],
}) => {
  const [aiSummary, setAiSummary] = useState<string>('');
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);
  const [copied, setCopied] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

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

  // Comments State for Sarkari Naukri Blog Post
  const [comments, setComments] = useState<Array<{ id: string; authorName: string; text: string; timestamp: string; editorReply?: string }>>([
    {
      id: 'job-c1',
      authorName: 'रोहित कुमार मीणा',
      text: 'सर, मेरी स्नातक डिग्री का परिणाम अगले महीने आ रहा है, क्या मैं ऑनलाइन आवेदन कर सकता हूँ?',
      timestamp: '2 घंटे पहले',
      editorReply: 'नमस्ते रोहित! फॉर्म भरने की अंतिम तिथि से पहले आपकी डिग्री या अनंतिम अंकतालिका जारी होना आवश्यक है। यदि अंतिम तिथि तक रिजल्ट घोषित हो जाता है तो आप पूर्णतः पात्र होंगे!',
    },
    {
      id: 'job-c2',
      authorName: 'अंजली कुशवाहा',
      text: 'क्या अन्य राज्यों के अभ्यर्थी भी इस भर्ती में सामान्य श्रेणी के तहत फॉर्म भर सकते हैं?',
      timestamp: '4 घंटे पहले',
      editorReply: 'हाँ अंजली! अखिल भारतीय एवं अन्य राज्यों के अभ्यर्थी अनारक्षित (General/Unreserved) श्रेणी में आवेदन करने हेतु पूरी तरह पात्र हैं।',
    },
  ]);
  const [commentName, setCommentName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [isGeneratingAiReply, setIsGeneratingAiReply] = useState<string | null>(null);

  useEffect(() => {
    setAiSummary('');
    setSpeaking(false);
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
  }, [job.id]);

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
          type: 'सरकारी नौकरी अधिसूचना',
        }),
      });
      const data = await res.json();
      setAiSummary(data.summary || 'सारांश उपलब्ध नहीं है।');
    } catch (e) {
      setAiSummary('AI संक्षिप्त विवरण लाने में त्रुटि हुई।');
    } finally {
      setIsLoadingAi(false);
    }
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment = {
      id: `job-c-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      authorName: commentName.trim() || 'अभ्यर्थी',
      text: commentText.trim(),
      timestamp: 'अभी',
    };

    setComments((prev) => [newComment, ...prev]);
    setCommentText('');

    setIsGeneratingAiReply(newComment.id);
    try {
      const res = await fetch('/api/gemini/blog-comment-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blogTitle: job.title,
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
      console.error('Job comment reply error', e);
    } finally {
      setIsGeneratingAiReply(null);
    }
  };

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const handleShare = () => {
    setIsShareModalOpen(true);
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${job.title} - ${job.totalPosts} भर्ती ऑन सरकारीपल्स: ${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSpeech = () => {
    if (!('speechSynthesis' in window)) return;

    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const speechText = `${job.title}. आयोग: ${job.organization}. कुल पद: ${job.totalPosts}. योग्यता: ${job.qualification}. अंतिम तिथि: ${job.importantDates.applicationEnd}. विवरण: ${job.description}`;
    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.rate = 0.95;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const relatedJobs = allJobs.filter((j) => j.id !== job.id && j.category === job.category).slice(0, 3);

  return (
    <div className="space-y-6 max-w-5xl mx-auto relative" key={`full-job-view-${job.id}`}>
      {/* Fixed Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1.5 bg-slate-200 z-50">
        <div
          className="h-full bg-emerald-600 transition-all duration-75 ease-out shadow-xs"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Top Back Navigation Bar */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-emerald-700 transition-colors cursor-pointer bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs whitespace-nowrap shrink-0"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>वापस जाएं</span>
        </button>
      </div>

      {/* Main Full Page Container */}
      <article className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
        {/* Unboxed Metadata Header */}
        <div className="flex items-center justify-between gap-3 text-xs font-semibold text-slate-500 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 text-emerald-900 uppercase">
              {job.category}
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-slate-800 font-bold">{job.type}</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-amber-600 font-extrabold">{job.totalPosts}</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>स्थान: {job.location}</span>
          </div>

          <span className="text-[11px] text-slate-400">
            जारी तिथि: {new Date(job.publishedAt).toLocaleDateString()}
          </span>
        </div>

        {/* Title & Organization Header */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
            {job.title}
          </h1>
          <p className="text-sm font-bold text-emerald-800">
            आयोग / संस्थान: <span className="text-slate-800">{job.organization}</span>
          </p>
        </div>

        {/* Author Byline & Editorial Tag */}
        <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
          <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-extrabold flex items-center justify-center text-xs shadow-xs shrink-0">
            एसपी
          </div>
          <div>
            <span className="font-extrabold text-slate-900 text-sm block">सरकारीपल्स ब्यूरो</span>
            <span className="text-xs text-slate-500 block">वरिष्ठ सरकारी भर्ती विश्लेषक व समाचार ब्यूरो</span>
          </div>
        </div>



        {/* Main Straight Blog Article Body - 18px Font Size with 22px Headings */}
        <div className="space-y-8 text-[18px] text-slate-800 leading-relaxed pt-2">
          {/* Section 1: Detailed Overview */}
          <section className="space-y-3">
            <h2 className="text-[22px] font-extrabold text-slate-900 border-b border-slate-100 pb-2">
              1. भर्ती का विस्तृत विवरण (Notification Overview)
            </h2>
            <p className="text-[18px] leading-relaxed text-slate-800 font-normal">
              {job.description}
            </p>
          </section>

          {/* Section 2: Important Schedule Dates */}
          <section className="space-y-3">
            <h2 className="text-[22px] font-extrabold text-slate-900">
              2. महत्वपूर्ण तिथियां (Important Dates Schedule)
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-4 bg-white border border-slate-200 shadow-xs rounded-2xl">
                <span className="text-slate-500 block text-[11px] font-bold uppercase">फॉर्म प्रारंभ तिथि</span>
                <span className="font-extrabold text-slate-900 text-[18px]">
                  {formatImportantDate(job.importantDates.applicationStart)}
                </span>
              </div>
              <div className="p-4 bg-white border border-slate-200 shadow-xs rounded-2xl">
                <span className="text-slate-500 block text-[11px] font-bold uppercase">अंतिम तिथि (Last Date)</span>
                <span className="font-extrabold text-amber-600 text-[18px]">
                  {formatImportantDate(job.importantDates.applicationEnd)}
                </span>
              </div>
              <div className="p-4 bg-white border border-slate-200 shadow-xs rounded-2xl">
                <span className="text-slate-500 block text-[11px] font-bold uppercase">एडमिट कार्ड तिथि</span>
                <span className="font-extrabold text-slate-900 text-[18px]">
                  {formatImportantDate(job.importantDates.admitCardDate)}
                </span>
              </div>
              <div className="p-4 bg-white border border-slate-200 shadow-xs rounded-2xl">
                <span className="text-slate-500 block text-[11px] font-bold uppercase">परीक्षा तिथि (Exam)</span>
                <span className="font-extrabold text-slate-900 text-[18px]">
                  {formatImportantDate(job.importantDates.examDate)}
                </span>
              </div>
            </div>
          </section>

          {/* Section 3: Application Fee & Payment Mode */}
          <section className="space-y-3">
            <h2 className="text-[22px] font-extrabold text-slate-900">
              3. आवेदन शुल्क व भुगतान माध्यम (Application Fee & Payment Mode)
            </h2>
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div>
                <span className="text-slate-500 font-bold uppercase block text-[11px] tracking-wider">वर्गवार आवेदन शुल्क (Category-wise Fee)</span>
                <p className="font-extrabold text-slate-900 text-[18px] leading-relaxed mt-1">
                  {job.applicationFee}
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 text-xs text-slate-700 font-medium flex items-center gap-2 flex-wrap">
                <span className="font-bold text-slate-900">ऑनलाइन भुगतान माध्यम:</span>
                <span className="bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 text-slate-800 font-semibold">नेट बैंकिंग</span>
                <span className="bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 text-slate-800 font-semibold">डेबिट / क्रेडिट कार्ड</span>
                <span className="bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 text-slate-800 font-semibold">UPI (GPay / PhonePe)</span>
                <span className="bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 text-slate-800 font-semibold">ई-चालान</span>
              </div>
            </div>
          </section>

          {/* Section 4: Separate Qualification & Eligibility Section */}
          <section className="space-y-3">
            <h2 className="text-[22px] font-extrabold text-slate-900">
              4. शैक्षणिक योग्यता व पात्रता विवरण (Educational Qualification)
            </h2>
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <span className="text-slate-500 font-bold uppercase block text-[11px]">आवश्यक शैक्षणिक अर्हता</span>
              <p className="font-extrabold text-slate-900 text-[18px] leading-relaxed">
                {job.qualification}
              </p>
            </div>
          </section>

          {/* Section 5: Separate Age Limit Section */}
          <section className="space-y-3">
            <h2 className="text-[22px] font-extrabold text-slate-900">
              5. आयु सीमा व वर्गवार छूट (Age Limit & Relaxation Rules)
            </h2>
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <span className="text-slate-500 font-bold uppercase block text-[11px]">न्यूनतम व अधिकतम आयु सीमा</span>
              <p className="font-extrabold text-slate-900 text-[18px] leading-relaxed">
                {job.ageLimit}
              </p>
            </div>
          </section>

          {/* Section 6: Separate Pay Scale & Salary Section */}
          <section className="space-y-3">
            <h2 className="text-[22px] font-extrabold text-slate-900">
              6. वेतनमान, ग्रेड पे व भत्ते (Pay Scale & Allowances)
            </h2>
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <span className="text-emerald-800 font-bold uppercase block text-[11px]">मासिक वेतन व भत्ते</span>
              <p className="font-extrabold text-slate-900 text-[18px] leading-relaxed">
                {job.salaryScale}
              </p>
            </div>
          </section>

          {/* Section 7: Selection Process & Syllabus */}
          <section className="space-y-4">
            <h2 className="text-[22px] font-extrabold text-slate-900">
              7. चयन प्रक्रिया व परीक्षा पाठ्यक्रम (Selection Process & Syllabus)
            </h2>
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">परीक्षा के मुख्य चरण (Selection Stages)</span>
              {job.examPattern.map((stage, i) => (
                <div key={`stage-${i}`} className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <p className="font-bold text-slate-900 text-[18px]">{stage}</p>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">मुख्य पाठ्यक्रम विषय (Key Topics)</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[18px] font-semibold">
                {job.syllabusHighlights.map((topic, i) => (
                  <div key={`topic-${i}`} className="flex items-center gap-2 p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs text-slate-800">
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
                    <span>{topic}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Section 8: Step-by-Step Online Application Guide */}
          <section className="space-y-3 p-6 bg-white rounded-3xl border border-slate-200 shadow-xs">
            <h2 className="text-[22px] font-extrabold text-slate-900">
              8. ऑनलाइन आवेदन कैसे करें? (How to Apply Online Step-by-Step)
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-[18px] text-slate-800 font-normal leading-relaxed">
              <li>सबसे पहले संबंधित विभाग अथवा आयोग के मुख्य पोर्टल <strong className="text-emerald-800">{job.organization}</strong> पर जाएं।</li>
              <li>होमपेज पर उपलब्ध <strong>'Recruitment / Career'</strong> अथवा <strong>'Apply Online 2026'</strong> लिंक पर क्लिक करें।</li>
              <li>यदि आप नए उपयोगकर्ता हैं तो अपना वैध मोबाइल नंबर व ईमेल आईडी दर्ज कर <strong>वन टाइम रजिस्ट्रेशन (OTR)</strong> पूर्ण करें।</li>
              <li>पंजीकरण के पश्चात अपनी व्यक्तिगत जानकारी, शैक्षणिक योग्यता एवं वर्गवार विवरण ध्यानपूर्वक भरें।</li>
              <li>अपने हालिया पासपोर्ट साइज़ फोटो, हस्ताक्षर तथा आवश्यक प्रमाण पत्रों को निर्धारित साइज़ व फॉर्मेट में अपलोड करें।</li>
              <li>निर्धारित आवेदन शुल्क का भुगतान नेट बैंकिंग, यूपीआई अथवा क्रेडिट/डेबिट कार्ड के माध्यम से करें।</li>
              <li>आवेदन पत्र सबमिट करने से पूर्व भरे गए विवरण का <strong>'Preview'</strong> अवश्य जांच लें और अंत में भरे हुए फॉर्म की पीडीएफ डाउनलोड कर प्रिंट आउट सुरक्षित रखें।</li>
            </ol>
          </section>

          {/* Section 9: AI Exam Strategy & Analysis */}
          <section className="space-y-3 p-6 bg-white rounded-3xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <h2 className="text-[22px] font-extrabold text-slate-900">
                9. AI परीक्षा रणनीति व विश्लेषण (Gemini Smart Insights)
              </h2>
            </div>
            {isLoadingAi ? (
              <div className="py-6 text-center space-y-2">
                <div className="w-6 h-6 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs font-bold text-slate-700">AI द्वारा कट-ऑफ व रणनीति का विश्लेषण जारी है...</p>
              </div>
            ) : aiSummary ? (
              <div className="text-[18px] text-slate-800 whitespace-pre-line leading-relaxed font-normal">
                {aiSummary}
              </div>
            ) : (
              <button
                onClick={fetchAiSummary}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI परीक्षा रणनीति व कट-ऑफ विश्लेषण देखें</span>
              </button>
            )}
          </section>
        </div>

        {/* Important Direct Links & Last Date Section */}
        <section className="p-6 bg-white text-slate-900 rounded-3xl shadow-sm space-y-6 border-2 border-slate-200 mt-8 mb-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4 flex-wrap gap-3">
            <div>
              <h2 className="text-[22px] font-extrabold text-slate-900 flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-emerald-600" />
                <span>10. महत्वपूर्ण लिंक्स व अंतिम तिथि (Important Links & Action)</span>
              </h2>
              <p className="text-xs text-slate-600 font-medium mt-1">
                नीचे दिए गए लिंक्स के माध्यम से वेब पोर्टल विजिट करें एवं अंतिम तिथि से पूर्व ऑनलाइन फॉर्म जमा करें।
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-300 px-4 py-2 rounded-2xl text-amber-950 font-extrabold text-sm flex items-center gap-2">
              <Calendar className="w-4.5 h-4.5 text-amber-600" />
              <span>अंतिम तिथि (Last Date): {formatImportantDate(job.importantDates.applicationEnd)}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Link 1: Official Website Link */}
            <a
              href={job.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-between gap-3 group transition-all cursor-pointer shadow-xs"
            >
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-500 block uppercase">वेबसाइट लिंक</span>
                <span className="font-extrabold text-slate-900 text-base group-hover:text-emerald-700 transition-colors flex items-center gap-1.5">
                  <span>मुख्य वेब पोर्टल लिंक (Website Link)</span>
                </span>
              </div>
              <div className="p-2.5 bg-white group-hover:bg-emerald-600 rounded-xl text-slate-600 group-hover:text-white border border-slate-200 transition-all shrink-0">
                <ExternalLink className="w-5 h-5" />
              </div>
            </a>

            {/* Link 2: Apply Link */}
            <a
              href={job.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-emerald-600 hover:bg-emerald-700 border border-emerald-600 rounded-2xl flex items-center justify-between gap-3 group transition-all cursor-pointer shadow-md"
            >
              <div className="space-y-1">
                <span className="text-xs font-bold text-emerald-100 block uppercase">ऑनलाइन आवेदन लिंक</span>
                <span className="font-black text-white text-base flex items-center gap-1.5">
                  <span>ऑनलाइन फॉर्म भरें (Apply Online Link)</span>
                </span>
              </div>
              <div className="p-2.5 bg-emerald-700 group-hover:bg-white group-hover:text-emerald-700 rounded-xl text-white transition-all shrink-0">
                <ExternalLink className="w-5 h-5" />
              </div>
            </a>
          </div>

          <div className="pt-3 text-xs text-slate-500 flex items-center justify-between flex-wrap gap-2 border-t border-slate-200">
            <span>* फॉर्म जमा करने से पूर्व संपूर्ण सूचना ध्यानपूर्वक पढ़ें।</span>
            <button
              onClick={handleShare}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors cursor-pointer border border-slate-200 inline-flex items-center gap-1.5 shadow-xs"
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{copied ? 'लिंक कॉपी हो गया!' : 'शेयर करें (Share)'}</span>
            </button>
          </div>
        </section>
      </article>

      {/* Related Job Openings */}
      {relatedJobs.length > 0 && (
        <div className="space-y-4 pt-2">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">इसी विभाग की अन्य वैकेंसियां (Related Jobs)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedJobs.map((rj) => (
              <div
                key={`rel-job-${rj.id}`}
                onClick={() => onSelectRelatedJob && onSelectRelatedJob(rj)}
                className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 transition-all cursor-pointer space-y-2 text-xs"
              >
                <span className="text-[10px] font-bold text-emerald-700 uppercase">{rj.category} · {rj.totalPosts}</span>
                <h4 className="font-extrabold text-slate-900 line-clamp-2 leading-snug">{rj.title}</h4>
                <span className="text-[11px] text-slate-500 block">अंतिम तिथि: {rj.importantDates.applicationEnd}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reader Comments & Candidate Discussion Section - Placed at the Very Bottom */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 mt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-400">
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span>अभ्यर्थियों के प्रश्न व चर्चा (Candidate Discussion & Q&A)</span>
          </div>
          <span className="text-xs font-bold text-slate-500">{comments.length} प्रश्न उपलब्ध</span>
        </div>

        {/* Comment Form */}
        <form onSubmit={handlePostComment} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              value={commentName}
              onChange={(e) => setCommentName(e.target.value)}
              placeholder="आपका नाम (Your Name)"
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            />
          </div>
          <textarea
            rows={2}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="इस भर्ती/योग्यताओं से जुड़ा अपना सवाल पूछें..."
            className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          />
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-[11px] text-slate-500 font-medium inline-flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>AI संपादक टीम द्वारा त्वरित उत्तर समर्थित</span>
            </span>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors cursor-pointer shadow-xs inline-flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>प्रश्न पोस्ट करें</span>
            </button>
          </div>
        </form>

        {/* Comments Feed */}
        <div className="space-y-4">
          {comments.map((c) => (
            <div key={c.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-500">
                <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  {c.authorName}
                </span>
                <span className="text-[11px]">{c.timestamp}</span>
              </div>
              <p className="text-slate-800 leading-relaxed font-normal text-[18px]">{c.text}</p>

              {/* Editor Reply / AI Answer */}
              {c.editorReply ? (
                <div className="mt-3 p-3 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-emerald-900">
                    <Bot className="w-3.5 h-3.5 text-emerald-700" />
                    <span>सरकारीपल्स ब्यूरो का उत्तर:</span>
                  </div>
                  <p className="text-xs text-slate-800 leading-relaxed font-normal text-[18px]">{c.editorReply}</p>
                </div>
              ) : isGeneratingAiReply === c.id ? (
                <div className="mt-3 p-3 bg-slate-100 rounded-xl border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
                  <Bot className="w-4 h-4 text-emerald-600 animate-spin" />
                  <span>संपादक टीम उत्तर तैयार कर रही है...</span>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <SocialShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        item={job}
        type="job"
      />
    </div>
  );
};
