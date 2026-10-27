import React from 'react';
import {
  X,
  PenSquare,
  Sparkles,
  BookOpen,
  FileText,
  CheckCircle,
  ExternalLink,
  Layers,
  TrendingUp,
  Cpu,
  ShieldCheck,
  Zap,
  Lock,
} from 'lucide-react';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenWriteBlog: () => void;
  totalBlogs?: number;
  onSyncFromSarkariResult?: () => void;
  isSyncing?: boolean;
  onSyncFromRajasthanVacancy?: () => void;
  isRajasthanSyncing?: boolean;
  onLockAdmin?: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  onOpenWriteBlog,
  totalBlogs = 10,
  onSyncFromSarkariResult,
  isSyncing = false,
  onSyncFromRajasthanVacancy,
  isRajasthanSyncing = false,
  onLockAdmin,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl border border-slate-200 space-y-6 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shadow-md">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                प्रशासनिक कंट्रोल पैनल (Admin Portal)
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                सरकारीपल्स संपादकीय, AI टूल्स व सामग्री प्रबंधन
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onLockAdmin && (
              <button
                type="button"
                onClick={() => {
                  onLockAdmin();
                  onClose();
                }}
                className="px-3 py-1.5 rounded-xl border border-red-200 text-red-700 hover:bg-red-50 text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1.5"
                title="व्यवस्थापक टूल्स सामान्य उपयोगकर्ताओं से छिपाएं (Hide from Users)"
              >
                <Lock className="w-3.5 h-3.5 text-red-600" />
                <span>स्टूडियो छिपाएं (Hide)</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              aria-label="Close Admin Panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Featured Section: AI Blog Writer Studio */}
        <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-emerald-900 via-teal-900 to-slate-900 text-white p-5 sm:p-6 shadow-lg border border-emerald-800/60">
          <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-2 max-w-md">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-extrabold uppercase tracking-wide border border-emerald-500/30">
                <Sparkles className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
                <span>Next-Gen Editorial Suite</span>
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold tracking-tight text-white">
                AI ब्लॉग लेखक स्टूडियो (News Blogger Studio)
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-normal">
                1-क्लिक में आधिकारिक हिंदी भाषा शैली में जॉब अधिसूचना, परीक्षा रणनीति, कट-ऑफ विश्लेषण, 
                FAQs, Key Takeaways और Google SERP SEO पूर्वावलोकन तैयार करें।
              </p>
            </div>

            <button
              onClick={() => {
                onClose();
                onOpenWriteBlog();
              }}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm shadow-md transition-transform active:scale-95 cursor-pointer shrink-0"
            >
              <PenSquare className="w-4 h-4 text-slate-950" />
              <span>स्टूडियो खोलें (Launch Studio)</span>
            </button>
          </div>

          {/* Feature Badges */}
          <div className="mt-5 pt-4 border-t border-emerald-800/80 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-emerald-200 font-semibold">
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>3 AI टोन विकल्प</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
              <span>रेडीमेड टेम्पलेट्स</span>
            </div>
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-sky-300 shrink-0" />
              <span>SEO मेटा व SERP</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>ऑटो-ड्राफ्ट सेव</span>
            </div>
          </div>
        </div>

        {/* Quick Stats & System Status */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
              प्रकाशित ब्लॉग पोस्ट
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-slate-900">{totalBlogs}</span>
              <span className="text-[11px] font-bold text-emerald-600">लाइव</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
              Google AdSense ID
            </span>
            <div className="flex items-center gap-1.5 mt-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-xs font-mono font-bold text-slate-800 truncate" title="ca-pub-3176571184961509">
                ca-pub-31765...
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
              सत्यापन (Verification)
            </span>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs font-bold text-emerald-700">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Google Verified</span>
            </div>
          </div>
        </div>

        {/* Web Ingestion Section: SarkariResult & RajasthanVacancy */}
        <div className="space-y-3">
          {/* SarkariResult Live Ingestion */}
          <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-sky-600 animate-ping inline-block" />
                <h4 className="text-xs font-black text-sky-950 uppercase tracking-wide">
                  SarkariResult.com लाइव डेटा सिंक
                </h4>
              </div>
              <p className="text-[11px] text-sky-800 font-medium">
                SarkariResult की नवीनतम भर्तियों से 1-क्लिक में नए लेख सिंक करें और आधिकारिक वेबसाइट लिंक के साथ जोड़ें।
              </p>
            </div>
            {onSyncFromSarkariResult && (
              <button
                onClick={onSyncFromSarkariResult}
                disabled={isSyncing}
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs transition-all shadow-xs cursor-pointer inline-flex items-center gap-1.5 shrink-0 disabled:opacity-50"
              >
                <Zap className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'सिंक हो रहा है...' : 'SarkariResult सिंक करें'}</span>
              </button>
            )}
          </div>

          {/* RajasthanVacancy Live Ingestion */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-600 animate-ping inline-block" />
                <h4 className="text-xs font-black text-amber-950 uppercase tracking-wide">
                  RajasthanVacancy.com लाइव डेटा सिंक
                </h4>
              </div>
              <p className="text-[11px] text-amber-900 font-medium">
                राजस्थान की समस्त सरकारी भर्तियों (RPSC, RSMSSB CET, राजस्थान पुलिस, पटवारी व शिक्षक भर्ती) से 1-क्लिक सिंक।
              </p>
            </div>
            {onSyncFromRajasthanVacancy && (
              <button
                onClick={onSyncFromRajasthanVacancy}
                disabled={isRajasthanSyncing}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs transition-all shadow-xs cursor-pointer inline-flex items-center gap-1.5 shrink-0 disabled:opacity-50"
              >
                <Zap className={`w-3.5 h-3.5 ${isRajasthanSyncing ? 'animate-spin' : ''}`} />
                <span>{isRajasthanSyncing ? 'राजस्थान डेटा सिंक हो रहा है...' : 'RajasthanVacancy सिंक करें'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Content Creation Shortcuts */}
        <div className="space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
            त्वरित संपादकीय शॉर्टकट (Quick Shortcuts)
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              onClick={() => {
                onClose();
                onOpenWriteBlog();
              }}
              className="p-3 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all text-left flex items-start gap-3 cursor-pointer group"
            >
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-slate-900 group-hover:text-emerald-900">
                  नई भर्ती अधिसूचना लिखें
                </h4>
                <p className="text-[11px] text-slate-500 font-medium">
                  पूर्व-निर्मित तालिका और पात्रता फॉर्मेट के साथ
                </p>
              </div>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenWriteBlog();
              }}
              className="p-3 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all text-left flex items-start gap-3 cursor-pointer group"
            >
              <div className="p-2 rounded-xl bg-amber-100 text-amber-800 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-slate-900 group-hover:text-emerald-900">
                  कट-ऑफ व परिणाम विश्लेषण
                </h4>
                <p className="text-[11px] text-slate-500 font-medium">
                  श्रेणीवार कट-ऑफ व स्कोरकार्ड गाइड
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="font-medium">सरकारीपल्स CMS v2.6 • AI Powered</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold transition-colors cursor-pointer"
          >
            बंद करें
          </button>
        </div>
      </div>
    </div>
  );
};
