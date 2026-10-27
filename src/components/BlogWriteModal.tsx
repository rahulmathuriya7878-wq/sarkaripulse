import React, { useState, useEffect } from 'react';
import { BlogPost, BlogCategory, JobCategory } from '../types';
import {
  X,
  Sparkles,
  Send,
  Edit3,
  BookOpen,
  Eye,
  Settings2,
  FileText,
  Plus,
  Trash2,
  HelpCircle,
  CheckCircle2,
  RefreshCw,
  Copy,
  Layers,
  Type,
  Table,
  List,
  ListOrdered,
  AlertTriangle,
  TrendingUp,
  Star,
  Save,
  Check,
  Globe,
  Radio,
  ExternalLink,
  ArrowRight,
  Zap,
} from 'lucide-react';

interface BlogWriteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublishPost: (post: BlogPost) => void;
}

const CATEGORIES: BlogCategory[] = [
  'Job Notification',
  'Exam Strategy & Prep',
  'Syllabus Breakdown',
  'Salary & DA Analysis',
  'Current Affairs',
  'Result & Cutoff',
];

const JOB_CATEGORIES: JobCategory[] = [
  'UPSC',
  'SSC',
  'Banking',
  'Railways',
  'Defense',
  'State PSC',
  'Teaching',
  'PSU',
  'Medical',
];

export interface SuggestedTopicItem {
  label: string;
  topic: string;
  cat: string;
  sector: JobCategory;
  isLive?: boolean;
}

const INITIAL_QUICK_TOPICS: SuggestedTopicItem[] = [
  { label: 'UP Police 32,679 भर्ती', topic: 'UP Police कांस्टेबल भर्ती 2026: 32,679 पदों हेतु 12वीं पास आवेदन, शारीरिक दक्षता व चयन प्रक्रिया', cat: 'Job Notification', sector: 'State PSC', isLive: true },
  { label: 'Rajasthan RSMSSB CET 6850', topic: 'Rajasthan भर्ती 2026: RSMSSB CET व पटवारी के 6,850 पदों हेतु अधिसूचना जारी, 12वीं/स्नातक ऑनलाइन आवेदन व नया सिलेबस', cat: 'Job Notification', sector: 'State PSC', isLive: true },
  { label: 'MP Police SI एडमिट कार्ड', topic: 'MP Police सब-इंस्पेक्टर (SI) व एएसआई स्टेनो एडमिट कार्ड जारी, डाउनलोड लिंक व परीक्षा निर्देश', cat: 'Job Notification', sector: 'State PSC', isLive: true },
  { label: 'RRB NTPC 3 वर्ष आयु छूट', topic: 'रेलवे RRB NTPC व तकनीशियन भर्ती 2026 में 3 साल की अतिरिक्त आयु छूट आधिकारिक अधिसूचना विश्लेषण', cat: 'Salary & DA Analysis', sector: 'Railways', isLive: true },
  { label: '7वां वेतन आयोग DA 54%', topic: 'केंद्रीय कर्मचारियों हेतु 54% महंगाई भत्ता (DA) बढ़ोतरी व 3 माह एरियर भुगतान विश्लेषण', cat: 'Salary & DA Analysis', sector: 'PSU', isLive: true },
  { label: 'SSC CGL टियर-1 कट-ऑफ', topic: 'SSC CGL 2026 टियर-1 परीक्षा परिणाम व श्रेणीवार न्यूनतम कट-ऑफ स्कोरकार्ड विश्लेषण', cat: 'Result & Cutoff', sector: 'SSC', isLive: true },
  { label: 'CTET 2026 परीक्षा केंद्र', topic: 'केंद्रीय शिक्षक पात्रता परीक्षा CTET 2026 एडमिट कार्ड व परीक्षा केंद्र निर्देश', cat: 'Job Notification', sector: 'Teaching', isLive: true },
  { label: 'SBI PO 60 दिवसीय प्लान', topic: 'एसबीआई प्रोबेशनरी ऑफिसर (PO) प्रारंभिक परीक्षा 60 दिवसीय तैयारी रणनीति व बुकलिस्ट', cat: 'Exam Strategy & Prep', sector: 'Banking', isLive: true },
];

const TEMPLATES = [
  {
    id: 'notification',
    name: '📢 नई भर्ती अधिसूचना (Job Notification)',
    title: 'आधिकारिक भर्ती 2026: विभिन्न पदों पर अधिसूचना जारी, पात्रता व आवेदन प्रक्रिया',
    subtitle: 'कुल पदों का विवरण, श्रेणीवार आयु छूट, वेतनमान और ऑनलाइन आवेदन की अंतिम तिथि की संपूर्ण जानकारी।',
    summary: 'आयोग ने नए भर्ती सत्र 2026 हेतु विस्तृत अधिसूचना प्रकाशित कर दी है। योग्य उम्मीदवार अंतिम तिथि से पूर्व आधिकारिक पोर्टल पर आवेदन कर सकते हैं।',
    takeaways: [
      'कुल विज्ञापित पद एवं श्रेणीवार रिक्तियों का वितरण',
      'शैक्षणिक योग्यता व निर्धारित आयु सीमा में सरकारी नियमानुसार छूट',
      'चयन प्रक्रिया: कंप्यूटर आधारित परीक्षा (CBT), दस्तावेज़ सत्यापन व मेडिकल',
      'ऑनलाइन आवेदन की प्रारंभिक व अंतिम तिथि की समय-सारणी',
    ],
    contentHtml: `<h3>1. अधिसूचना परिचय एवं पदों का विवरण</h3>
<p class="lead">भर्ती आयोग ने आधिकारिक पोर्टल पर वर्ष 2026 हेतु विस्तृत भर्ती विज्ञापन प्रकाशित कर दिया है। इसके अंतर्गत विभिन्न प्रशासनिक एवं तकनीकी पदों पर नियुक्तियां की जाएंगी।</p>

<table class="w-full border-collapse border border-slate-300 text-xs my-4">
  <thead>
    <tr class="bg-slate-100 font-extrabold text-slate-900">
      <th class="border border-slate-300 p-2 text-left">विवरण</th>
      <th class="border border-slate-300 p-2 text-left">मानदंड</th>
    </tr>
  </thead>
  <tbody>
    <tr><td class="border border-slate-300 p-2 font-bold">संस्था का नाम</td><td class="border border-slate-300 p-2">आधिकारिक भर्ती बोर्ड</td></tr>
    <tr><td class="border border-slate-300 p-2 font-bold">शैक्षणिक योग्यता</td><td class="border border-slate-300 p-2">मान्यता प्राप्त विश्वविद्यालय से स्नातक / डिप्लोमा</td></tr>
    <tr><td class="border border-slate-300 p-2 font-bold">आयु सीमा</td><td class="border border-slate-300 p-2">18 से 30/33 वर्ष (आरक्षण अनुसार छूट)</td></tr>
    <tr><td class="border border-slate-300 p-2 font-bold">आवेदन शुल्क</td><td class="border border-slate-300 p-2">सामान्य/OBC: ₹100, SC/ST/महिला: निःशुल्क</td></tr>
  </tbody>
</table>

<h3>2. परीक्षा पैटर्न एवं चयन प्रक्रिया</h3>
<p>चयन प्रक्रिया दो चरणों में आयोजित की जाएगी। प्रथम चरण में वस्तुनिष्ठ बहुविकल्पीय परीक्षा (CBT) होगी, जिसमें सामान्य अध्ययन, गणित, तर्कशक्ति और भाषा कौशल से संबंधित प्रश्न पूछे जाएंगे।</p>`,
  },
  {
    id: 'cutoff',
    name: '📊 कट-ऑफ व परिणाम विश्लेषण (Result & Cutoff)',
    title: 'परीक्षा परिणाम 2026 घोषित: श्रेणीवार आधिकारिक कट-ऑफ मार्क्स व स्कोरकार्ड लिंक',
    subtitle: 'सामान्य, ओबीसी, ईडब्ल्यूएस, एससी व एसटी वर्ग के न्यूनतम अर्हक अंक और अगले चरण की तैयारी रणनीति।',
    summary: 'आयोग ने हाल ही में आयोजित परीक्षा का अंतिम परिणाम और श्रेणीवार कट-ऑफ सूची आधिकारिक वेबसाइट पर जारी कर दी है।',
    takeaways: [
      'आधिकारिक कट-ऑफ पिछले वर्ष की तुलना में 3 से 5 अंक अधिक रही',
      'सफल उम्मीदवारों हेतु मुख्य परीक्षा / इंटरव्यू का संभावित शेड्यूल',
      'स्कोरकार्ड व उत्तर कुंजी डाउनलोड करने की चरणबद्ध विधि',
    ],
    contentHtml: `<h3>1. परिणाम व कट-ऑफ का संक्षिप्त विश्लेषण</h3>
<p class="lead">आयोग द्वारा जारी अधिसूचना के अनुसार इस वर्ष परीक्षा में 12 लाख से अधिक अभ्यर्थी सम्मिलित हुए थे। विभिन्न श्रेणियों हेतु न्यूनतम कट-ऑफ स्कोर निम्नानुसार निर्धारित किया गया है:</p>

<table class="w-full border-collapse border border-slate-300 text-xs my-4">
  <thead>
    <tr class="bg-slate-100 font-extrabold text-slate-900">
      <th class="border border-slate-300 p-2 text-left">श्रेणी (Category)</th>
      <th class="border border-slate-300 p-2 text-left">कट-ऑफ अंक (Cut-Off Marks)</th>
    </tr>
  </thead>
  <tbody>
    <tr><td class="border border-slate-300 p-2 font-bold">सामान्य (General/UR)</td><td class="border border-slate-300 p-2 text-emerald-700 font-extrabold">138.50</td></tr>
    <tr><td class="border border-slate-300 p-2 font-bold">अन्य पिछड़ा वर्ग (OBC)</td><td class="border border-slate-300 p-2">132.25</td></tr>
    <tr><td class="border border-slate-300 p-2 font-bold">आर्थिक कमजोर वर्ग (EWS)</td><td class="border border-slate-300 p-2">129.00</td></tr>
    <tr><td class="border border-slate-300 p-2 font-bold">अनुसूचित जाति (SC)</td><td class="border border-slate-300 p-2">118.75</td></tr>
    <tr><td class="border border-slate-300 p-2 font-bold">अनुसूचित जनजाति (ST)</td><td class="border border-slate-300 p-2">112.50</td></tr>
  </tbody>
</table>

<h3>2. अगले चरण हेतु आवश्यक दिशा-निर्देश</h3>
<p>चयनित अभ्यर्थियों को सलाह दी जाती है कि वे अपने सभी मूल शैक्षणिक प्रमाण पत्र, जाति प्रमाण पत्र और पहचान पत्र तैयार रखें ताकि दस्तावेज़ सत्यापन के समय किसी प्रकार की कठिनाई न हो।</p>`,
  },
];

export const BlogWriteModal: React.FC<BlogWriteModalProps> = ({ isOpen, onClose, onPublishPost }) => {
  // Active Tab
  const [activeTab, setActiveTab] = useState<'editor' | 'preview' | 'seo' | 'templates' | 'sync'>('editor');

  // Dynamic Daily News Topics
  const [suggestedTopics, setSuggestedTopics] = useState<SuggestedTopicItem[]>(INITIAL_QUICK_TOPICS);
  const [isRefreshingTopics, setIsRefreshingTopics] = useState(false);
  const [lastRefreshedTime, setLastRefreshedTime] = useState<string>('अभी-अभी (Live)');

  // URL Sync State
  const [syncUrlInput, setSyncUrlInput] = useState('https://www.sarkariresult.com/');
  const [isSyncingFromUrl, setIsSyncingFromUrl] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);

  // AI State
  const [aiPrompt, setAiPrompt] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiTone, setAiTone] = useState<'official' | 'student' | 'breaking'>('official');

  // Core Fields
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState<BlogCategory>('Job Notification');
  const [jobCategory, setJobCategory] = useState<JobCategory>('State PSC');
  const [authorName, setAuthorName] = useState('सरकारीपल्स ब्यूरो');
  const [authorRole, setAuthorRole] = useState('वरिष्ठ शिक्षा पत्रकार व नीति विश्लेषक');
  const [summary, setSummary] = useState('');
  const [contentHtml, setContentHtml] = useState('');
  const [takeaways, setTakeaways] = useState<string[]>([
    'विस्तृत आधिकारिक अधिसूचना व पात्रता मानदंड',
    'आयु सीमा में श्रेणीवार नियमानुसार छूट',
    'चयन प्रक्रिया एवं महत्वपूर्ण तिथियां',
  ]);
  const [newTakeawayInput, setNewTakeawayInput] = useState('');

  // FAQs
  const [faqs, setFaqs] = useState<{ question: string; answer: string }[]>([
    {
      question: 'क्या इस भर्ती में अन्य राज्यों के अभ्यर्थी पात्र हैं?',
      answer: 'हाँ, अन्य राज्यों के अभ्यर्थी सामान्य श्रेणी (General Category) के अंतर्गत आवेदन कर सकते हैं।',
    },
    {
      question: 'ऑनलाइन आवेदन शुल्क कितना है?',
      answer: 'सामान्य व ओबीसी वर्ग हेतु निर्धारित शुल्क तथा आरक्षित श्रेणियों को सरकारी नियमानुसार छूट प्रदान की गई है।',
    },
  ]);
  const [newFaqQ, setNewFaqQ] = useState('');
  const [newFaqA, setNewFaqA] = useState('');

  // Official Website Details
  const [officialWebsiteName, setOfficialWebsiteName] = useState('उत्तर प्रदेश पुलिस भर्ती एवं प्रोन्नति बोर्ड (UPPRPB)');
  const [officialWebsiteUrl, setOfficialWebsiteUrl] = useState('https://uppbpb.gov.in/');
  const [officialWebsiteDesc, setOfficialWebsiteDesc] = useState('आधिकारिक भर्ती एवं परीक्षा पोर्टल');

  // SEO & Flags
  const [customSlug, setCustomSlug] = useState('');
  const [focusKeyword, setFocusKeyword] = useState('Sarkari Naukri 2026');
  const [tagsInput, setTagsInput] = useState('Sarkari Naukri, Recruitment 2026, Govt Jobs');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isTrending, setIsTrending] = useState(true);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  // Fetch daily topics on mount to ensure dynamic fresh topics
  useEffect(() => {
    fetchDailyNewsTopics();
  }, []);

  const fetchDailyNewsTopics = async () => {
    setIsRefreshingTopics(true);
    try {
      const res = await fetch('/api/news/daily-trending-topics');
      if (res.ok) {
        const data = await res.json();
        if (data.topics && Array.isArray(data.topics) && data.topics.length > 0) {
          setSuggestedTopics(data.topics);
          setLastRefreshedTime(new Date().toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' }));
        }
      }
    } catch (e) {
      console.warn('Could not refresh daily news topics, using curated live list:', e);
    } finally {
      setIsRefreshingTopics(false);
    }
  };

  // Sync data from Web / SarkariResult
  const handleSyncFromUrl = async (customUrl?: string) => {
    const targetUrl = customUrl || syncUrlInput || 'https://www.sarkariresult.com/';
    setIsSyncingFromUrl(true);
    setSyncStatusMsg(null);
    try {
      const res = await fetch('/api/blog/sync-from-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUrl }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.posts && data.posts.length > 0) {
          const post = data.posts[0];
          setTitle(post.title || '');
          setSubtitle(post.subtitle || '');
          setSummary(post.summary || '');
          setCategory((post.category as BlogCategory) || 'Job Notification');
          if (post.jobCategory) setJobCategory(post.jobCategory as JobCategory);
          setContentHtml(post.contentHtml || '');
          if (post.keyTakeaways) setTakeaways(post.keyTakeaways);
          if (post.faqs) setFaqs(post.faqs);
          if (post.tags) setTagsInput(post.tags.join(', '));
          if (post.officialWebsite?.name) setOfficialWebsiteName(post.officialWebsite.name);
          if (post.officialWebsite?.url) setOfficialWebsiteUrl(post.officialWebsite.url);
          if (post.officialWebsite?.portalDescription) setOfficialWebsiteDesc(post.officialWebsite.portalDescription);
          else if (post.officialUrl) setOfficialWebsiteUrl(post.officialUrl);
          setSyncStatusMsg(`✅ ${data.source || (targetUrl.includes('rajasthan') ? 'RajasthanVacancy' : 'SarkariResult')} से डेटा सफलतापूर्वक सिंक हुआ!`);
          setActiveTab('editor');
          setTimeout(() => setSyncStatusMsg(null), 5000);
        } else {
          setSyncStatusMsg('सूचना: डेटा प्राप्त हुआ, डिफ़ॉल्ट टेम्पलेट लोड किया गया।');
        }
      } else {
        alert('डेटा सिंक करने में त्रुटि। कृपया पुनः प्रयास करें।');
      }
    } catch (err) {
      console.error('Error syncing from url:', err);
      alert('डेटा सिंक विफल रहा। कृपया इंटरनेट कनेक्शन जांचें।');
    } finally {
      setIsSyncingFromUrl(false);
    }
  };

  // Load draft from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('sarkaripulse_studio_draft_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.title) setTitle(parsed.title);
        if (parsed.subtitle) setSubtitle(parsed.subtitle);
        if (parsed.contentHtml) setContentHtml(parsed.contentHtml);
        if (parsed.summary) setSummary(parsed.summary);
        if (parsed.category) setCategory(parsed.category);
        if (parsed.jobCategory) setJobCategory(parsed.jobCategory);
        if (parsed.takeaways) setTakeaways(parsed.takeaways);
        if (parsed.faqs) setFaqs(parsed.faqs);
        if (parsed.officialWebsiteName) setOfficialWebsiteName(parsed.officialWebsiteName);
        if (parsed.officialWebsiteUrl) setOfficialWebsiteUrl(parsed.officialWebsiteUrl);
        if (parsed.officialWebsiteDesc) setOfficialWebsiteDesc(parsed.officialWebsiteDesc);
      }
    } catch (e) {
      // ignore
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveDraft = () => {
    try {
      const draft = {
        title,
        subtitle,
        contentHtml,
        summary,
        category,
        jobCategory,
        takeaways,
        faqs,
        customSlug,
        focusKeyword,
        tagsInput,
        officialWebsiteName,
        officialWebsiteUrl,
        officialWebsiteDesc,
      };
      localStorage.setItem('sarkaripulse_studio_draft_v1', JSON.stringify(draft));
      setSaveSuccessMsg(true);
      setTimeout(() => setSaveSuccessMsg(false), 3000);
    } catch (e) {
      console.warn('Draft save error:', e);
    }
  };

  const handleClearDraft = () => {
    if (confirm('क्या आप ड्राफ्ट साफ़ करना चाहते हैं?')) {
      localStorage.removeItem('sarkaripulse_studio_draft_v1');
      setTitle('');
      setSubtitle('');
      setContentHtml('');
      setSummary('');
      setTakeaways([]);
      setFaqs([]);
    }
  };

  const applyTemplate = (tpl: typeof TEMPLATES[0]) => {
    setTitle(tpl.title);
    setSubtitle(tpl.subtitle);
    setSummary(tpl.summary);
    setTakeaways(tpl.takeaways);
    setContentHtml(tpl.contentHtml);
    setActiveTab('editor');
  };

  const insertHtmlSnippet = (snippet: string) => {
    setContentHtml((prev) => prev ? `${prev}\n\n${snippet}` : snippet);
  };

  const handleAddTakeaway = () => {
    if (newTakeawayInput.trim()) {
      setTakeaways([...takeaways, newTakeawayInput.trim()]);
      setNewTakeawayInput('');
    }
  };

  const handleRemoveTakeaway = (index: number) => {
    setTakeaways(takeaways.filter((_, i) => i !== index));
  };

  const handleAddFaq = () => {
    if (newFaqQ.trim() && newFaqA.trim()) {
      setFaqs([...faqs, { question: newFaqQ.trim(), answer: newFaqA.trim() }]);
      setNewFaqQ('');
      setNewFaqA('');
    }
  };

  const handleRemoveFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const handleGenerateWithAi = async () => {
    if (!aiPrompt.trim()) return;
    setLoadingAi(true);

    try {
      const res = await fetch('/api/gemini/generate-blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: aiPrompt.trim(),
          category: category,
          targetAudience: `Government Job Aspirants - ${aiTone === 'official' ? 'Official Press Format' : aiTone === 'student' ? 'Student Friendly Guidance' : 'Fast Breaking News'}`,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.title) setTitle(data.title);
        if (data.subtitle) setSubtitle(data.subtitle);
        if (data.summary) setSummary(data.summary);
        if (data.contentHtml) setContentHtml(data.contentHtml);
        if (data.keyTakeaways && Array.isArray(data.keyTakeaways)) {
          setTakeaways(data.keyTakeaways);
        }
        if (data.faqs && Array.isArray(data.faqs)) {
          setFaqs(data.faqs);
        }
        if (data.tags && Array.isArray(data.tags)) {
          setTagsInput(data.tags.join(', '));
        }
      }
    } catch (err) {
      console.error('Error in handleGenerateWithAi:', err);
    } finally {
      setLoadingAi(false);
    }
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !contentHtml.trim()) {
      alert('कृपया शीर्षक (Title) और लेख की मुख्य सामग्री (Content) अवश्य भरें।');
      return;
    }

    const generatedSlug = customSlug.trim()
      ? customSlug.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      : title.toLowerCase().replace(/[^a-z0-9\u0900-\u097F]+/g, '-');

    const wordCount = contentHtml.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
    const estReadTime = `${Math.max(3, Math.ceil(wordCount / 180))} मिनट गहन अध्ययन`;

    const tagsList = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const newPost: BlogPost = {
      id: `blog-studio-${Date.now()}`,
      slug: generatedSlug,
      title: title.trim(),
      subtitle: subtitle.trim() || summary.trim(),
      category: category,
      jobCategory: jobCategory,
      author: {
        name: authorName.trim() || 'सरकारीपल्स ब्यूरो',
        role: authorRole.trim() || 'वरिष्ठ शिक्षा संवाददाता',
        avatar: authorName.trim().slice(0, 2).toUpperCase() || 'एसपी',
      },
      publishedAt: new Date().toISOString(),
      readTime: estReadTime,
      viewsCount: 1,
      likesCount: 0,
      isFeatured: isFeatured,
      isTrending: isTrending,
      summary: summary.trim() || subtitle.trim(),
      keyTakeaways: takeaways.filter((t) => t.trim()),
      contentHtml: contentHtml.trim(),
      faqs: faqs.filter((f) => f.question.trim() && f.answer.trim()),
      comments: [],
      tags: tagsList.length > 0 ? tagsList : [category, jobCategory, 'SarkariPulse'],
      officialWebsite: {
        name: officialWebsiteName.trim() || 'आधिकारिक भर्ती बोर्ड',
        url: officialWebsiteUrl.trim() || 'https://www.sarkariresult.com/',
        portalDescription: officialWebsiteDesc.trim() || 'आधिकारिक परीक्षा व भर्ती पोर्टल',
      },
      officialUrl: officialWebsiteUrl.trim() || 'https://www.sarkariresult.com/',
    };

    onPublishPost(newPost);
    try {
      localStorage.removeItem('sarkaripulse_studio_draft_v1');
    } catch (e) {
      // ignore
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[95vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Studio Top Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white flex items-center justify-between border-b border-slate-700/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <Edit3 className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base sm:text-lg text-white tracking-tight">SarkariPulse News Blogger Studio</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  विस्तृत प्रो संस्करण
                </span>
              </div>
              <p className="text-xs text-slate-300">सरकारी भर्ती समाचार, विश्लेषण व परीक्षा रणनीति प्रकाशन स्टूडियो</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-200 bg-slate-800/80 hover:bg-slate-700 rounded-xl border border-slate-700 transition-colors cursor-pointer"
              title="ड्राफ्ट सुरक्षित करें"
            >
              <Save className="w-3.5 h-3.5 text-emerald-400" />
              <span>{saveSuccessMsg ? 'सुरक्षित!' : 'ड्राफ्ट सेव'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="बंद करें"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sync Success Alert if any */}
        {syncStatusMsg && (
          <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-bold flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{syncStatusMsg}</span>
            </div>
            <button onClick={() => setSyncStatusMsg(null)} className="text-white hover:text-emerald-200">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Studio Navigation Workspace Tabs */}
        <div className="bg-slate-100 border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-1 py-2">
            <button
              type="button"
              onClick={() => setActiveTab('editor')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'editor'
                  ? 'bg-white text-emerald-800 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-emerald-600" />
              <span>✍️ संपादक (Editor)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('sync')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'sync'
                  ? 'bg-white text-emerald-800 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-sky-600" />
              <span>🌐 Sarkari & Rajasthan सिंक</span>
              <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-sky-100 text-sky-800 font-extrabold uppercase">लाइव</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'preview'
                  ? 'bg-white text-emerald-800 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-emerald-600" />
              <span>👁️ लाइव पूर्वावलोकन</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('seo')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'seo'
                  ? 'bg-white text-emerald-800 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Settings2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>🔍 SEO एवं मेटाडाटा</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('templates')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'templates'
                  ? 'bg-white text-emerald-800 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-amber-600" />
              <span>⚡ तैयार प्रारूप</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleClearDraft}
            className="text-[11px] font-bold text-red-600 hover:text-red-700 hover:underline px-2 py-1 transition-colors whitespace-nowrap cursor-pointer shrink-0"
          >
            ड्राफ्ट रीसेट
          </button>
        </div>

        {/* Studio Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50">
          
          {/* TAB 1: SARKARIRESULT & RAJASTHANVACANCY & WEB URL SYNC */}
          {activeTab === 'sync' && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="bg-gradient-to-br from-sky-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 shadow-xl border border-sky-800/80">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-extrabold uppercase border border-sky-400/30">
                      <Radio className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
                      <span>लाइव वेब इनजेशन इंजन (SarkariResult & RajasthanVacancy Sync)</span>
                    </div>
                    <h4 className="text-xl font-black text-white">SarkariResult या RajasthanVacancy.com से सिंक करें</h4>
                    <p className="text-xs text-sky-100/90 leading-relaxed">
                      SarkariResult.com या RajasthanVacancy.com (RPSC, RSMSSB CET, पटवारी, पुलिस) का कोई भी लिंक पेस्ट करें। AI स्वतः आधिकारिक पोर्टल लिंक, पद विवरण, 
                      पात्रता, आयु छूट, परीक्षा पैटर्न, महत्वपूर्ण तिथियां और टेबल फॉर्मेट के साथ सम्पूर्ण लेख तैयार कर देगा।
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  <label className="text-xs font-bold text-sky-200 block">वेबसाइट या अधिसूचना URL दर्ज करें:</label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="url"
                      value={syncUrlInput}
                      onChange={(e) => setSyncUrlInput(e.target.value)}
                      placeholder="उदा. https://www.sarkariresult.com/ या https://RajasthanVacancy.com"
                      className="flex-1 px-4 py-3 rounded-2xl bg-white text-slate-900 font-semibold text-xs border border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    />
                    <button
                      type="button"
                      onClick={() => handleSyncFromUrl()}
                      disabled={isSyncingFromUrl}
                      className="px-6 py-3 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs transition-transform active:scale-95 cursor-pointer disabled:opacity-50 inline-flex items-center justify-center gap-2 shrink-0 shadow-md"
                    >
                      {isSyncingFromUrl ? (
                        <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Zap className="w-4 h-4" />
                      )}
                      <span>{isSyncingFromUrl ? 'डेटा सिंक हो रहा है...' : 'डेटा सिंक करें और पोस्ट बनाएं'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Fast Presets from RajasthanVacancy.com */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-black uppercase tracking-wider text-orange-700 flex items-center gap-1.5">
                    <span>🔥 RajasthanVacancy.com विशेष भर्ती (1-क्लिक सिंक)</span>
                  </h5>
                  <span className="text-[11px] font-bold text-orange-700 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
                    राजस्थान स्टेट जॉब्स
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-orange-500 hover:shadow-md transition-all space-y-3">
                    <div className="flex items-start justify-between">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-orange-50 text-orange-700 border border-orange-200">
                        RSMSSB जयपुर
                      </span>
                      <span className="text-xs font-black text-slate-900">6,850 पद</span>
                    </div>
                    <div>
                      <h6 className="text-sm font-extrabold text-slate-900">Rajasthan RSMSSB CET 2026 व पटवारी भर्ती</h6>
                      <p className="text-xs text-slate-500 mt-0.5">समान पात्रता परीक्षा 12वीं/स्नातक स्तर, SSO पोर्टल ऑनलाइन आवेदन व नया सिलेबस</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSyncFromUrl('https://rajasthanvacancy.com/rsmssb-cet-patwari-2026')}
                      disabled={isSyncingFromUrl}
                      className="w-full py-2 bg-orange-50 hover:bg-orange-100 text-orange-900 font-extrabold text-xs rounded-xl border border-orange-200 transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5 text-orange-600" />
                      <span>RajasthanVacancy से सिंक करें</span>
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-orange-500 hover:shadow-md transition-all space-y-3">
                    <div className="flex items-start justify-between">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
                        राजस्थान पुलिस
                      </span>
                      <span className="text-xs font-black text-slate-900">कांस्टेबल 5,300 पद</span>
                    </div>
                    <div>
                      <h6 className="text-sm font-extrabold text-slate-900">Rajasthan Police कांस्टेबल भर्ती 2026</h6>
                      <p className="text-xs text-slate-500 mt-0.5">CET स्कोरकार्ड योग्यता, शारीरिक दक्षता परीक्षा (PET/PST) एवं ऑनलाइन फॉर्म</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSyncFromUrl('https://rajasthanvacancy.com/rajasthan-police-constable-2026')}
                      disabled={isSyncingFromUrl}
                      className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-900 font-extrabold text-xs rounded-xl border border-blue-200 transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5 text-blue-600" />
                      <span>Rajasthan Police सिंक करें</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Fast Presets from SarkariResult */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-black uppercase tracking-wider text-slate-600">
                    SarkariResult लोकप्रिय भर्ती शॉर्टकट्स (1-क्लिक सिंक)
                  </h5>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    ताज़ा 2026 भर्ती
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-sky-500 hover:shadow-md transition-all space-y-3">
                    <div className="flex items-start justify-between">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
                        उत्तर प्रदेश पुलिस
                      </span>
                      <span className="text-xs font-black text-slate-900">32,679 पद</span>
                    </div>
                    <div>
                      <h6 className="text-sm font-extrabold text-slate-900">UP Police कांस्टेबल 2026 ऑनलाइन फॉर्म</h6>
                      <p className="text-xs text-slate-500 mt-0.5">12वीं पास नागरिक पुलिस भर्ती, 300 अंकों की लिखित परीक्षा व दौड़</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSyncFromUrl('https://www.sarkariresult.com/')}
                      disabled={isSyncingFromUrl}
                      className="w-full py-2 bg-sky-50 hover:bg-sky-100 text-sky-900 font-extrabold text-xs rounded-xl border border-sky-200 transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5 text-sky-700" />
                      <span>इस भर्ती से पोस्ट बनाएं</span>
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-sky-500 hover:shadow-md transition-all space-y-3">
                    <div className="flex items-start justify-between">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        मध्य प्रदेश पुलिस
                      </span>
                      <span className="text-xs font-black text-slate-900">एडमिट कार्ड जारी</span>
                    </div>
                    <div>
                      <h6 className="text-sm font-extrabold text-slate-900">MP Police SI व स्टेनो एडमिट कार्ड 2026</h6>
                      <p className="text-xs text-slate-500 mt-0.5">सब-इंस्पेक्टर परीक्षा तिथि, हॉल टिकट डाउनलोड लिंक व दिशा-निर्देश</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setAiPrompt('MP Police सब-इंस्पेक्टर (SI) व एएसआई स्टेनो एडमिट कार्ड जारी, डाउनलोड लिंक व परीक्षा निर्देश');
                        setCategory('Job Notification');
                        setJobCategory('State PSC');
                        handleGenerateWithAi();
                        setActiveTab('editor');
                      }}
                      className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-extrabold text-xs rounded-xl border border-emerald-200 transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                      <span>एडमिट कार्ड पोस्ट तैयार करें</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EDITOR */}
          {activeTab === 'editor' && (
            <form onSubmit={handlePublish} className="space-y-6">
              
              {/* AI Writer Assistant Box with Dynamic Daily Topics */}
              <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-white rounded-2xl p-4 sm:p-5 border border-emerald-200/90 shadow-xs space-y-3.5">
                
                {/* Header row with Tone & Live Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-xs">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-black text-emerald-950 block">AI ब्लॉग लेखक सहायक (Editorial Assistant)</span>
                      <span className="text-[10px] text-emerald-700 font-semibold">दैनिक समाचार एवं SarkariResult आधारित</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-slate-500">लेखन शैली:</span>
                    <button
                      type="button"
                      onClick={() => setAiTone('official')}
                      className={`px-2 py-0.5 rounded-lg border text-[10px] font-bold cursor-pointer transition-colors ${
                        aiTone === 'official' ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-white text-slate-700 border-slate-300'
                      }`}
                    >
                      आधिकारिक
                    </button>
                    <button
                      type="button"
                      onClick={() => setAiTone('student')}
                      className={`px-2 py-0.5 rounded-lg border text-[10px] font-bold cursor-pointer transition-colors ${
                        aiTone === 'student' ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-white text-slate-700 border-slate-300'
                      }`}
                    >
                      छात्र-सुलभ
                    </button>
                    <button
                      type="button"
                      onClick={() => setAiTone('breaking')}
                      className={`px-2 py-0.5 rounded-lg border text-[10px] font-bold cursor-pointer transition-colors ${
                        aiTone === 'breaking' ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-white text-slate-700 border-slate-300'
                      }`}
                    >
                      त्वरित अपडेट
                    </button>
                  </div>
                </div>

                {/* Prompt input and action button */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="विषय / हेडलाइन दर्ज करें (जैसे: UP Police 32,679 भर्ती या RRB NTPC आयु छूट 2026)..."
                    className="flex-1 px-3.5 py-2.5 text-xs rounded-xl border border-emerald-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                  />
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleGenerateWithAi}
                      disabled={!aiPrompt.trim() || loadingAi}
                      className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl transition-all cursor-pointer shrink-0 disabled:opacity-50 inline-flex items-center justify-center gap-2 shadow-xs text-xs"
                    >
                      {loadingAi ? (
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Sparkles className="w-3.5 h-3.5" />
                      )}
                      <span>{loadingAi ? 'AI लिख रहा है...' : 'AI से स्वतः लिखें'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSyncFromUrl('https://www.sarkariresult.com/')}
                      disabled={isSyncingFromUrl}
                      className="px-3 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl transition-all cursor-pointer shrink-0 disabled:opacity-50 inline-flex items-center justify-center gap-1.5 shadow-xs text-xs"
                      title="SarkariResult से 1-क्लिक में सिंक करें"
                    >
                      <Globe className={`w-3.5 h-3.5 ${isSyncingFromUrl ? 'animate-spin' : ''}`} />
                      <span className="hidden sm:inline">SarkariResult सिंक</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSyncFromUrl('https://rajasthanvacancy.com/')}
                      disabled={isSyncingFromUrl}
                      className="px-3 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl transition-all cursor-pointer shrink-0 disabled:opacity-50 inline-flex items-center justify-center gap-1.5 shadow-xs text-xs"
                      title="RajasthanVacancy.com से 1-क्लिक में सिंक करें"
                    >
                      <Globe className={`w-3.5 h-3.5 ${isSyncingFromUrl ? 'animate-spin' : ''}`} />
                      <span className="hidden sm:inline">Rajasthan सिंक</span>
                    </button>
                  </div>
                </div>

                {/* Dynamic Suggested Topics Area with Daily News Sync */}
                <div className="pt-2 border-t border-emerald-100/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping inline-block" />
                      <span className="text-[11px] font-extrabold text-emerald-950 uppercase tracking-wide">
                        सुझावित विषय (दैनिक समाचार से लाइव अपडेटेड):
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={fetchDailyNewsTopics}
                      disabled={isRefreshingTopics}
                      className="text-[10px] font-bold text-emerald-800 hover:text-emerald-950 inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded-lg border border-emerald-200 cursor-pointer shadow-2xs"
                      title="दैनिक समाचार से ताज़ा विषय पुनः लोड करें"
                    >
                      <RefreshCw className={`w-3 h-3 ${isRefreshingTopics ? 'animate-spin text-emerald-600' : ''}`} />
                      <span>{isRefreshingTopics ? 'रीफ्रेश हो रहा है...' : 'दैनिक समाचार से रीफ्रेश'}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                    {suggestedTopics.map((item, idx) => (
                      <button
                        key={`quick-${idx}`}
                        type="button"
                        onClick={() => {
                          setAiPrompt(item.topic);
                          setCategory(item.cat as BlogCategory);
                          setJobCategory(item.sector);
                        }}
                        className="px-2.5 py-1 text-[11px] font-bold bg-white text-slate-800 hover:bg-emerald-100 hover:text-emerald-950 border border-emerald-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1 shadow-2xs"
                      >
                        {item.isLive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                        )}
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Category & Sector Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1 text-xs">समाचार श्रेणी (Blog Category)</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as BlogCategory)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1 text-xs">विभाग / आयोग (Sector)</label>
                  <select
                    value={jobCategory}
                    onChange={(e) => setJobCategory(e.target.value as JobCategory)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                  >
                    {JOB_CATEGORIES.map((jc) => (
                      <option key={jc} value={jc}>{jc}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1 text-xs">प्रकाशन स्थिति</label>
                  <div className="flex items-center gap-2 pt-1 text-xs font-bold text-slate-700">
                    <label className="inline-flex items-center gap-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isTrending}
                        onChange={(e) => setIsTrending(e.target.checked)}
                        className="rounded text-emerald-600"
                      />
                      <span>ट्रेंडिंग</span>
                    </label>
                    <label className="inline-flex items-center gap-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isFeatured}
                        onChange={(e) => setIsFeatured(e.target.checked)}
                        className="rounded text-emerald-600"
                      />
                      <span>फीचर्ड</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Title & Subtitle */}
              <div className="space-y-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1 text-xs">
                    मुख्य शीर्षक (Article Title / Headline) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="आधिकारिक भर्ती / परीक्षा विश्लेषण शीर्षक दर्ज करें..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1 text-xs">
                    उप-शीर्षक / संपादकीय लीड (Subtitle / Teaser)
                  </label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="संक्षिप्त विवरण जो छात्रों का ध्यान आकर्षित करे..."
                    className="w-full px-4 py-2 text-xs font-semibold rounded-xl border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>
              </div>

              {/* Author Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-100/80 border border-slate-200">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">संपादक / लेखक का नाम</label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold bg-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">पद / विशेषज्ञता</label>
                  <input
                    type="text"
                    value={authorRole}
                    onChange={(e) => setAuthorRole(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold bg-white"
                  />
                </div>
              </div>

              {/* Official Website & Source Portal Section */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white border border-slate-700/80 space-y-3 shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </div>
                    <label className="text-xs font-black text-white flex items-center gap-1.5">
                      <span>आधिकारिक वेबसाइट एवं भर्ती पोर्टल (Official Website & Source Portal)</span>
                      <span className="px-2 py-0.5 rounded-full text-[9px] bg-emerald-500/20 text-emerald-300 font-extrabold uppercase border border-emerald-500/30">
                        प्रत्येक पोस्ट में अनिवार्य
                      </span>
                    </label>
                  </div>
                  <span className="text-[10px] text-slate-300">अभ्यर्थियों हेतु आधिकारिक आवेदन व अधिसूचना लिंक</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">
                      आधिकारिक बोर्ड / आयोग का नाम (Portal Name)
                    </label>
                    <input
                      type="text"
                      value={officialWebsiteName}
                      onChange={(e) => setOfficialWebsiteName(e.target.value)}
                      placeholder="उदा. RSMSSB Jaipur / UPPRPB / SSC / UPSC"
                      className="w-full px-3 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-slate-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">
                      आधिकारिक वेबसाइट URL (Direct Portal Link)
                    </label>
                    <input
                      type="url"
                      value={officialWebsiteUrl}
                      onChange={(e) => setOfficialWebsiteUrl(e.target.value)}
                      placeholder="https://rsmssb.rajasthan.gov.in/ या https://ssc.gov.in"
                      className="w-full px-3 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-xs font-semibold text-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono placeholder-slate-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    पोर्टल विवरण व निर्देश (Portal Description / Note)
                  </label>
                  <input
                    type="text"
                    value={officialWebsiteDesc}
                    onChange={(e) => setOfficialWebsiteDesc(e.target.value)}
                    placeholder="उदा. ऑनलाइन आवेदन पत्र, एडमिट कार्ड व आधिकारिक अधिसूचना डाउनलोड हेतु मुख्य पोर्टल"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-slate-500"
                  />
                </div>
              </div>

              {/* Key Takeaways Builder */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>मुख्य बिंदु (Key Takeaways / Highlights)</span>
                  </label>
                  <span className="text-[10px] text-slate-500 font-semibold">छात्रों हेतु त्वरित 3-5 बिंदु</span>
                </div>

                <div className="space-y-1.5">
                  {takeaways.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="flex-1 font-semibold text-slate-800">{item}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTakeaway(idx)}
                        className="text-slate-400 hover:text-red-600 p-1 cursor-pointer"
                        title="हटाएं"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTakeawayInput}
                    onChange={(e) => setNewTakeawayInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTakeaway();
                      }
                    }}
                    placeholder="नया मुख्य बिंदु जोड़ें और Enter दबाएं..."
                    className="flex-1 px-3 py-1.5 rounded-xl border border-slate-300 text-xs bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddTakeaway}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>जोड़ें</span>
                  </button>
                </div>
              </div>

              {/* Rich Content Editor with Quick Toolbar */}
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    <span>लेख की मुख्य सामग्री (Full Article HTML / Markdown) <span className="text-red-500">*</span></span>
                  </label>

                  {/* Formatting Toolbar */}
                  <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px] font-bold">
                    <button
                      type="button"
                      onClick={() => insertHtmlSnippet('<h3>1. नई हेडिंग दर्ज करें</h3>')}
                      className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-slate-700 cursor-pointer inline-flex items-center gap-1"
                      title="उप-शीर्षक (H3)"
                    >
                      <Type className="w-3 h-3 text-slate-500" />
                      <span>H3</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => insertHtmlSnippet('<p class="lead">यहाँ आधिकारिक अधिसूचना का मुख्य परिचय लिखें।</p>')}
                      className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-slate-700 cursor-pointer inline-flex items-center gap-1"
                      title="लीड पैराग्राफ"
                    >
                      <span>Lead ¶</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => insertHtmlSnippet(`<table class="w-full border-collapse border border-slate-300 text-xs my-4">
  <thead>
    <tr class="bg-slate-100 font-extrabold text-slate-900">
      <th class="border border-slate-300 p-2 text-left">श्रेणी / विवरण</th>
      <th class="border border-slate-300 p-2 text-left">मानदंड / पद संख्या</th>
    </tr>
  </thead>
  <tbody>
    <tr><td class="border border-slate-300 p-2 font-bold">अनारक्षित</td><td class="border border-slate-300 p-2">विवरण भरें</td></tr>
  </tbody>
</table>`)}
                      className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-slate-700 cursor-pointer inline-flex items-center gap-1"
                      title="आधिकारिक तालिका (HTML Table)"
                    >
                      <Table className="w-3 h-3 text-slate-500" />
                      <span>टेबल</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => insertHtmlSnippet(`<ul>
  <li><strong>महत्वपूर्ण बिंदु:</strong> विवरण यहाँ लिखें</li>
  <li><strong>दूसरा बिंदु:</strong> विवरण यहाँ लिखें</li>
</ul>`)}
                      className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-slate-700 cursor-pointer inline-flex items-center gap-1"
                      title="बुलेट सूची"
                    >
                      <List className="w-3 h-3 text-slate-500" />
                      <span>लिस्ट</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => insertHtmlSnippet(`<div class="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs my-4">
  <strong>⚠️ विशेष सूचना:</strong> अभ्यर्थी केवल आधिकारिक पोर्टल पर ही आवेदन शुल्क जमा करें।
</div>`)}
                      className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-slate-700 cursor-pointer inline-flex items-center gap-1"
                      title="चेतावनी बॉक्स"
                    >
                      <AlertTriangle className="w-3 h-3 text-amber-600" />
                      <span>अलर्ट बॉक्स</span>
                    </button>
                  </div>
                </div>

                <textarea
                  required
                  rows={14}
                  value={contentHtml}
                  onChange={(e) => setContentHtml(e.target.value)}
                  placeholder="यहाँ विस्तृत लेख सामग्री लिखें या ऊपर AI सहायक / SarkariResult सिंक द्वारा स्वतः भरें..."
                  className="w-full p-4 rounded-2xl border border-slate-300 font-mono text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white leading-relaxed"
                />
              </div>

              {/* FAQs Builder */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-emerald-600" />
                    <span>अक्सर पूछे जाने वाले प्रश्न (Frequently Asked Questions - FAQs)</span>
                  </label>
                  <span className="text-[10px] text-slate-500 font-semibold">Google Rich Snippets हेतु</span>
                </div>

                <div className="space-y-2">
                  {faqs.map((faq, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
                      <div className="flex items-center justify-between font-bold text-slate-900">
                        <span>प्र. {idx + 1}: {faq.question}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFaq(idx)}
                          className="text-slate-400 hover:text-red-600 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-slate-600 font-medium">उ. {faq.answer}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                  <input
                    type="text"
                    value={newFaqQ}
                    onChange={(e) => setNewFaqQ(e.target.value)}
                    placeholder="प्रश्न (जैसे: अंतिम तिथि क्या है?)..."
                    className="px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newFaqA}
                      onChange={(e) => setNewFaqA(e.target.value)}
                      placeholder="उत्तर लिखें..."
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                    />
                    <button
                      type="button"
                      onClick={handleAddFaq}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl cursor-pointer shrink-0"
                    >
                      जोड़ें
                    </button>
                  </div>
                </div>
              </div>

              {/* Publish Action Bar */}
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5"
                >
                  <Save className="w-4 h-4 text-emerald-600" />
                  <span>{saveSuccessMsg ? 'ड्राफ्ट सहेजा गया!' : 'ड्राफ्ट सहेजें (Save Draft)'}</span>
                </button>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setActiveTab('preview')}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-800 font-bold text-xs transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-4 h-4 text-slate-600" />
                    <span>पूर्वावलोकन देखें</span>
                  </button>

                  <button
                    type="submit"
                    className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition-all shadow-md active:scale-95 cursor-pointer inline-flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>तुरंत लाइव प्रकाशित करें (Publish)</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* TAB 3: PREVIEW */}
          {activeTab === 'preview' && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
                <div className="space-y-3 border-b border-slate-100 pb-5">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold uppercase">
                      {category}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-bold">
                      {jobCategory}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500 font-medium">आज का लाइव पूर्वावलोकन</span>
                  </div>

                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                    {title || 'शीर्षक यहाँ प्रदर्शित होगा...'}
                  </h1>

                  {subtitle && (
                    <p className="text-sm font-semibold text-slate-600 leading-relaxed">
                      {subtitle}
                    </p>
                  )}

                  <div className="flex items-center gap-3 pt-2 text-xs text-slate-500 font-medium">
                    <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-black flex items-center justify-center text-xs">
                      {authorName.slice(0, 2).toUpperCase() || 'एसपी'}
                    </div>
                    <div>
                      <span className="font-extrabold text-slate-800 block">{authorName}</span>
                      <span className="text-[11px] text-slate-400">{authorRole}</span>
                    </div>
                  </div>
                </div>

                {/* Key Takeaways Preview */}
                {takeaways.length > 0 && (
                  <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                    <h4 className="text-xs font-black uppercase text-emerald-950 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      <span>मुख्य बिंदु (Key Highlights):</span>
                    </h4>
                    <ul className="space-y-1.5 text-xs text-emerald-900 font-medium">
                      {takeaways.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-emerald-700 font-bold">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Official Website Preview Card */}
                {officialWebsiteUrl && (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-slate-700 shadow-sm">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">
                          सत्यापित आधिकारिक वेबसाइट (Official Portal)
                        </span>
                      </div>
                      <div className="font-extrabold text-sm text-white">
                        {officialWebsiteName || 'आधिकारिक भर्ती बोर्ड'}
                      </div>
                      <div className="text-xs text-slate-300 line-clamp-1">
                        {officialWebsiteDesc || 'ऑनलाइन आवेदन व आधिकारिक अधिसूचना डाउनलोड पोर्टल'}
                      </div>
                    </div>
                    <a
                      href={officialWebsiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition-colors inline-flex items-center justify-center gap-1.5 shrink-0 shadow-xs"
                    >
                      <span>आधिकारिक वेबसाइट खोलें</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}

                {/* HTML Content Body Preview */}
                <div
                  className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed text-slate-800"
                  dangerouslySetInnerHTML={{ __html: contentHtml || '<p class="text-slate-400 italic">लेख की सामग्री यहाँ प्रदर्शित होगी।</p>' }}
                />

                {/* FAQs Preview */}
                {faqs.length > 0 && (
                  <div className="space-y-3 pt-4 border-t border-slate-100">
                    <h4 className="text-sm font-black text-slate-900">अक्सर पूछे जाने वाले प्रश्न (FAQs):</h4>
                    <div className="space-y-2">
                      {faqs.map((faq, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                          <p className="font-extrabold text-slate-900">प्रश्न: {faq.question}</p>
                          <p className="text-slate-600 font-medium">उत्तर: {faq.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setActiveTab('editor')}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-md"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>संपादक में बदलाव करें</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: SEO & METADATA */}
          {activeTab === 'seo' && (
            <div className="max-w-2xl mx-auto space-y-6">
              
              {/* Google SERP Snippet Preview */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                  Google SERP सर्च रिजल्ट पूर्वावलोकन (Simulation)
                </span>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 truncate">
                    <span className="text-emerald-700 font-bold">sarkaripulse.com</span>
                    <span className="text-slate-400">› blog › {customSlug || 'article-slug'}</span>
                  </div>
                  <h4 className="text-base font-medium text-blue-800 hover:underline cursor-pointer line-clamp-1">
                    {title || 'सरकारी भर्ती एवं परीक्षा विश्लेषण 2026 - SarkariPulse'}
                  </h4>
                  <p className="text-xs text-slate-600 line-clamp-2">
                    {summary || subtitle || 'विस्तृत परीक्षा अधिसूचना, योग्यता, सिलेबस एवं तैयारी गाइड की संपूर्ण जानकारी। आधिकारिक घोषणा के अनुसार देखें...'}
                  </p>
                </div>
              </div>

              {/* SEO Controls */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    कस्टम URL स्लग (URL Slug)
                  </label>
                  <input
                    type="text"
                    value={customSlug}
                    onChange={(e) => setCustomSlug(e.target.value)}
                    placeholder="custom-article-slug-2026"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-mono bg-white"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">खाली छोड़ने पर शीर्षक से स्वतः निर्मित होगा।</span>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    फोकस कीवर्ड (Focus Keyword)
                  </label>
                  <input
                    type="text"
                    value={focusKeyword}
                    onChange={(e) => setFocusKeyword(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    कीवर्ड टैग्स (Comma separated tags)
                  </label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: TEMPLATES */}
          {activeTab === 'templates' && (
            <div className="max-w-3xl mx-auto space-y-4">
              <div className="text-center space-y-1 mb-2">
                <h4 className="text-base font-black text-slate-900">संपादकीय रेडीमेड प्रारूप (Editorial Templates)</h4>
                <p className="text-xs text-slate-500 font-medium">1-क्लिक में मानक सरकारी भर्ती व कट-ऑफ फॉर्मेट लोड करें</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {TEMPLATES.map((tpl) => (
                  <div key={tpl.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <h5 className="font-extrabold text-sm text-slate-900">{tpl.name}</h5>
                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{tpl.summary}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => applyTemplate(tpl)}
                      className="w-full py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-extrabold text-xs transition-colors cursor-pointer border border-emerald-200 inline-flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                      <span>यह प्रारूप लागू करें (Use Template)</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
