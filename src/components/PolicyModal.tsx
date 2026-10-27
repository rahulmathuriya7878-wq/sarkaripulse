import React, { useState, useEffect } from 'react';
import { X, ShieldAlert, FileText, Lock, CheckCircle2, ExternalLink, Scale } from 'lucide-react';

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'disclaimer' | 'terms' | 'privacy';
}

export const PolicyModal: React.FC<PolicyModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'disclaimer',
}) => {
  const [activeTab, setActiveTab] = useState<'disclaimer' | 'terms' | 'privacy'>(initialTab);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-extrabold text-base text-white">Legal & General Policies (नियम व नीतियाँ)</h3>
              <p className="text-xs text-slate-400">Disclaimer, Terms of Use (नीति नियम) & Privacy Policy</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Header */}
        <div className="flex items-center border-b border-slate-200 bg-slate-50 px-6 gap-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('disclaimer')}
            className={`py-3 px-4 border-b-2 transition-colors cursor-pointer inline-flex items-center gap-1.5 ${
              activeTab === 'disclaimer'
                ? 'border-emerald-600 text-emerald-700 bg-white font-extrabold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-emerald-600" />
            <span>Disclaimer (अस्वीकरण)</span>
          </button>

          <button
            onClick={() => setActiveTab('terms')}
            className={`py-3 px-4 border-b-2 transition-colors cursor-pointer inline-flex items-center gap-1.5 ${
              activeTab === 'terms'
                ? 'border-emerald-600 text-emerald-700 bg-white font-extrabold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4 text-emerald-600" />
            <span>Niti Niyam (नियम व शर्तें)</span>
          </button>

          <button
            onClick={() => setActiveTab('privacy')}
            className={`py-3 px-4 border-b-2 transition-colors cursor-pointer inline-flex items-center gap-1.5 ${
              activeTab === 'privacy'
                ? 'border-emerald-600 text-emerald-700 bg-white font-extrabold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Lock className="w-4 h-4 text-emerald-600" />
            <span>Privacy Policy (गोपनीयता नीति)</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 text-xs sm:text-sm text-slate-700 space-y-4 leading-relaxed font-normal">
          {activeTab === 'disclaimer' && (
            <div className="space-y-4">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-950 font-medium space-y-2">
                <div className="flex items-center gap-2 font-extrabold text-amber-900 text-xs uppercase">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  <span>Non-Governmental Entity Notice / महत्वपूर्ण सूचना</span>
                </div>
                <p className="text-xs">
                  SarkariPulse is an independent news blog and educational portal operated for candidate guidance. <strong>SarkariPulse is NOT affiliated with, authorized by, or associated with any government department, commission, or ministry.</strong>
                </p>
              </div>

              <h4 className="font-extrabold text-slate-900 text-sm">1. Data Source & Verification</h4>
              <p>
                All government job vacancies, admit cards, exam dates, cutoffs, syllabus breakdowns, and news updates published on SarkariPulse are curated directly from public sector official recruitment portals and department bulletins, including:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600 font-medium text-xs">
                <li>Union Public Service Commission (upsc.gov.in)</li>
                <li>Staff Selection Commission (ssc.gov.in)</li>
                <li>Railway Recruitment Boards (indianrailways.gov.in)</li>
                <li>Institute of Banking Personnel Selection (ibps.in)</li>
                <li>Press Information Bureau (pib.gov.in)</li>
              </ul>

              <h4 className="font-extrabold text-slate-900 text-sm">2. Candidate Verification Advisory</h4>
              <p>
                While our editorial team endeavors to ensure 100% accuracy, candidates are strictly advised to cross-verify all details, eligibility terms, and application procedures with the official notification PDF issued by the respective recruitment commission before filling out any application or making payments.
              </p>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-4">
              <h4 className="font-extrabold text-slate-900 text-sm">Niti Niyam & Terms of Use (प्रयोग के नियम व शर्तें)</h4>
              <p>
                By accessing SarkariPulse News Blog and Alert Portal, you agree to abide by the following editorial rules and terms of service:
              </p>

              <div className="space-y-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <h5 className="font-bold text-slate-900 text-xs mb-1">1. Informational & Educational Purpose Only</h5>
                  <p className="text-slate-600 text-xs">
                    Content on this site is provided for general guidance, exam strategy, and career informational purposes. SarkariPulse does not charge any job placement fee or promise employment.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <h5 className="font-bold text-slate-900 text-xs mb-1">2. Reader Comments & Discussion Rules</h5>
                  <p className="text-slate-600 text-xs">
                    Candidates using the comment section agree not to post spam, offensive language, unverified rumors, or commercial links. Moderation reserves the right to remove non-compliant comments.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <h5 className="font-bold text-slate-900 text-xs mb-1">3. Intellectual Property</h5>
                  <p className="text-slate-600 text-xs">
                    All original blog articles, editorial analyses, and AI summary breakdowns are protected by editorial copyright. Logos and trademarks belong to their respective government bodies.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <h4 className="font-extrabold text-slate-900 text-sm">गोपनीयता नीति (Privacy Policy)</h4>
              <p>
                SarkariPulse उम्मीदवार डेटा गोपनीयता का सम्मान करने के लिए प्रतिबद्ध है। यहां बताया गया है कि आपके डेटा को कैसे संभाला जाता है:
              </p>

              <div className="space-y-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <h5 className="font-bold text-slate-900 text-xs mb-1">1. स्थानीय उपकरण भंडारण (Local Device Storage)</h5>
                  <p className="text-slate-600 text-xs">
                    आपके बुकमार्क की गई नौकरियां, नोटिफिकेशन रीड स्टेट्स और सेक्टर प्राथमिकताएं आपके ब्राउज़र डिवाइस पर LocalStorage का उपयोग करके स्थानीय रूप से सहेजी जाती हैं। हम आपकी व्यक्तिगत ब्राउजिंग हिस्ट्री को न तो बेचते हैं और न ही ट्रैक करते हैं।
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <h5 className="font-bold text-slate-900 text-xs mb-1">2. अलर्ट नोटिफिकेशन और सदस्यता (Alerts & Subscriptions)</h5>
                  <p className="text-slate-600 text-xs">
                    यदि आप ब्राउज़र पुश नोटिफिकेशन सक्षम करते हैं या ईमेल या व्हाट्सएप के माध्यम से दैनिक डाइजेस्ट के लिए सब्सक्राइब करते हैं, तो आपके विवरण का उपयोग केवल सत्यापित नौकरी पिंग्स और समाचार डाइजेस्ट भेजने के लिए किया जाता है।
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <h5 className="font-bold text-slate-900 text-xs mb-1">3. सदस्यता समाप्त विकल्प (Unsubscribe Option)</h5>
                  <p className="text-slate-600 text-xs">
                    आप किसी भी समय <strong>नोटिफिकेशन प्राथमिकताएं (Notification Preferences)</strong> पैनल में ब्राउज़र पुश नोटिफिकेशन, साउंड क्यूज़ या दैनिक ईमेल डाइजेस्ट को संशोधित या अक्षम कर सकते हैं।
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            I Understand (समझ लिया)
          </button>
        </div>
      </div>
    </div>
  );
};
