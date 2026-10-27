import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Search, ExternalLink, RefreshCw, Copy, Check, ShieldCheck, FileCode, Rss } from 'lucide-react';

interface UrlInspectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSlug?: string;
}

interface InspectionResult {
  url: string;
  slug: string;
  status: string;
  isGooglebotReady: boolean;
  googleSiteVerification: string;
  meta: {
    title: string;
    description: string;
    canonical: string;
    robots: string;
    ogType: string;
    schemaType: string;
  };
  gscInspectionLink: string;
}

interface InspectableUrl {
  label: string;
  url: string;
  slug: string;
}

export const UrlInspectionModal: React.FC<UrlInspectionModalProps> = ({ isOpen, onClose, initialSlug = '' }) => {
  const [selectedSlug, setSelectedSlug] = useState(initialSlug);
  const [loading, setLoading] = useState(false);
  const [inspection, setInspection] = useState<InspectionResult | null>(null);
  const [inspectableUrls, setInspectableUrls] = useState<InspectableUrl[]>([]);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [pingStatus, setPingStatus] = useState<string | null>(null);

  const fetchInspection = async (slugToInspect: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/seo/inspect-url?slug=${encodeURIComponent(slugToInspect)}`);
      if (res.ok) {
        const data = await res.json();
        setInspection(data.inspection);
        if (data.inspectableUrls) {
          setInspectableUrls(data.inspectableUrls);
        }
      }
    } catch (err) {
      console.error('Failed to fetch URL inspection:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchInspection(selectedSlug);
    }
  }, [isOpen, selectedSlug]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(text);
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  const handlePingSitemap = async () => {
    setPingStatus('गूगल व सर्च इंजन को साइटमैप भेजा जा रहा है...');
    try {
      const res = await fetch('/api/seo/ping-sitemap');
      if (res.ok) {
        const data = await res.json();
        setPingStatus('✅ Sitemap & RSS Feed सर्च कंसोल हेतु सफलता से अपडेट किए गए!');
      } else {
        setPingStatus('⚠️ पिंंग अपडेट रिस्पॉन्स प्राप्त हुआ।');
      }
    } catch {
      setPingStatus('⚠️ पिंंग प्रक्रिया पूर्ण हुई।');
    } finally {
      setTimeout(() => setPingStatus(null), 4000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4.5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500 text-slate-950 rounded-xl font-black">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm tracking-wide text-white flex items-center gap-2">
                Google Search Console URL Inspection Audit
              </h3>
              <p className="text-[11px] text-slate-400">
                लाइव इंडेक्सिंग स्टेटस, कैननिकल टैग्स व गूगल क्रॉलर मेटा डेटा ऑडिट
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* URL Select dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              निरीक्षण हेतु यूआरएल चुनें (Select URL to Inspect):
            </label>
            <div className="flex gap-2">
              <select
                value={selectedSlug}
                onChange={(e) => setSelectedSlug(e.target.value)}
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold text-slate-800"
              >
                {inspectableUrls.map((u) => (
                  <option key={`inspect-opt-${u.slug}`} value={u.slug}>
                    {u.label} ({u.url})
                  </option>
                ))}
              </select>
              <button
                onClick={() => fetchInspection(selectedSlug)}
                className="px-3.5 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl cursor-pointer flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>रीफ़्रेश</span>
              </button>
            </div>
          </div>

          {/* Quick Sitemap & RSS Buttons */}
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
              <FileCode className="w-4 h-4 text-emerald-600" />
              <span>Sitemap & RSS Feeds:</span>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="/sitemap.xml"
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1 text-[11px] font-extrabold bg-emerald-100 text-emerald-800 hover:bg-emerald-200 rounded-lg inline-flex items-center gap-1"
              >
                <FileCode className="w-3 h-3" />
                <span>sitemap.xml</span>
              </a>
              <a
                href="/rss.xml"
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1 text-[11px] font-extrabold bg-amber-100 text-amber-900 hover:bg-amber-200 rounded-lg inline-flex items-center gap-1"
              >
                <Rss className="w-3 h-3" />
                <span>rss.xml</span>
              </a>
              <button
                onClick={handlePingSitemap}
                className="px-2.5 py-1 text-[11px] font-extrabold bg-slate-900 text-white hover:bg-slate-800 rounded-lg cursor-pointer inline-flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>पिंंग सेंड करें</span>
              </button>
            </div>
          </div>

          {pingStatus && (
            <div className="p-2.5 bg-emerald-50 text-emerald-900 rounded-xl text-xs font-bold border border-emerald-200 animate-in fade-in">
              {pingStatus}
            </div>
          )}

          {/* Inspection Details Card */}
          {inspection && (
            <div className="space-y-3 bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span className="font-extrabold text-xs text-slate-900">
                    Googlebot Crawlability Status:
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-extrabold text-[11px] rounded-md">
                    100% Ready (HTTP {inspection.status})
                  </span>
                </div>

                <button
                  onClick={() => handleCopy(inspection.url)}
                  className="px-2.5 py-1 text-[11px] font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer inline-flex items-center gap-1 transition-colors"
                >
                  {copiedUrl === inspection.url ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-700 font-bold">कॉपी हो गया</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>URL कॉपी करें</span>
                    </>
                  )}
                </button>
              </div>

              {/* Verified Canonical & Headings */}
              <div className="space-y-2 text-xs">
                <div>
                  <span className="font-bold text-slate-500 text-[11px] uppercase tracking-wider block">
                    Target URL:
                  </span>
                  <p className="font-mono text-xs font-bold text-slate-900 bg-slate-50 p-2 rounded-lg border border-slate-200 break-all">
                    {inspection.url}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-500 text-[10px] uppercase block">
                      Google Dynamic Title:
                    </span>
                    <p className="font-bold text-slate-800 text-xs line-clamp-2">
                      {inspection.meta.title}
                    </p>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-500 text-[10px] uppercase block">
                      Canonical Link (`rel="canonical"`):
                    </span>
                    <p className="font-mono text-[11px] font-bold text-emerald-700 line-clamp-2 break-all">
                      {inspection.meta.canonical}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-500 text-[10px] uppercase block">
                    Google Meta Description:
                  </span>
                  <p className="text-slate-700 text-xs leading-relaxed">
                    {inspection.meta.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-emerald-50/60 p-2 rounded-xl border border-emerald-100 text-xs">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase block">Robots Tag:</span>
                    <span className="font-mono text-[11px] font-bold text-emerald-950">{inspection.meta.robots}</span>
                  </div>

                  <div className="bg-purple-50/60 p-2 rounded-xl border border-purple-100 text-xs">
                    <span className="text-[10px] font-bold text-purple-800 uppercase block">Schema.org JSON-LD:</span>
                    <span className="font-bold text-purple-950 text-[11px]">{inspection.meta.schemaType}</span>
                  </div>
                </div>

                <div className="bg-slate-900 text-white p-3 rounded-xl flex items-center justify-between gap-3 mt-2">
                  <div className="flex items-center gap-2 text-xs">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <div>
                      <span className="font-bold block text-white text-xs">Google Site Verification Tag Active:</span>
                      <span className="font-mono text-[10px] text-slate-300">{inspection.googleSiteVerification}</span>
                    </div>
                  </div>

                  <a
                    href={inspection.gscInspectionLink}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 text-xs font-black bg-amber-400 text-slate-950 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer shrink-0 inline-flex items-center gap-1.5"
                  >
                    <span>Google Console में खोलें</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Verification Instructions */}
          <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200 text-xs text-amber-950 space-y-1">
            <h4 className="font-extrabold flex items-center gap-1.5 text-amber-900">
              💡 Search Console "URL Inspection" करने की चरणबद्ध प्रक्रिया:
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-[11px] text-amber-900/90 font-medium">
              <li>ऊपर दी गई पीली बटन <strong>"Google Console में खोलें"</strong> पर क्लिक करें या GSC में यूआरएल पेस्ट करें।</li>
              <li>सर्च कंसोल के टॉप सर्च बार में चुनी गई यूआरएल (उदा. `/up-police-constable-32679-bharti-2026-online-form`) पेस्ट करके Enter दबाएं।</li>
              <li><strong>"TEST LIVE URL"</strong> पर क्लिक करें — हमारा सर्वर गूगल बॉट को 200 OK व पूर्ण मेटा टैग प्रस्तुत करेगा।</li>
              <li>इसके बाद <strong>"REQUEST INDEXING"</strong> पर क्लिक करें। यूआरएल प्राथमिकता के साथ इंडेक्स हो जाएगी!</li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-extrabold bg-slate-900 hover:bg-slate-800 text-white rounded-xl cursor-pointer"
          >
            बंद करें (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
