import React, { useState } from 'react';
import {
  X,
  Lock,
  Unlock,
  ShieldCheck,
  KeyRound,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
} from 'lucide-react';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const VALID_PASSCODES = ['0508', 'admin', 'sarkari2026', 'sarkaripulse'];

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPass = passcode.trim().toLowerCase();

    if (VALID_PASSCODES.includes(cleanPass)) {
      try {
        localStorage.setItem('sarkaripulse_admin_auth', 'true');
      } catch (err) {
        // ignore
      }
      setErrorMsg(null);
      setPasscode('');
      onSuccess();
      onClose();
    } else {
      setErrorMsg('अमान्य पासकोड! कृपया सही व्यवस्थापक पिन दर्ज करें।');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-xs">
              <KeyRound className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base">
                स्टाफ प्रमाणीकरण (Admin Unlock)
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                AI ब्लॉग लेखक स्टूडियो केवल अधिकृत स्टाफ हेतु
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info Card */}
        <div className="p-3.5 rounded-2xl bg-slate-900 text-white text-xs space-y-1.5 border border-slate-800">
          <div className="flex items-center gap-1.5 text-emerald-400 font-extrabold text-[11px] uppercase tracking-wide">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>गोपनीय व्यवस्थापक सुरक्षा (Hidden Mode)</span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            सामान्य उपयोगकर्ताओं से AI ब्लॉग स्टूडियो व प्रशासनिक नियंत्रण सुरक्षित रूप से छिपाया गया है।
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              व्यवस्थापक पासकोड दर्ज करें (Enter PIN / Passcode):
            </label>
            <div className="relative">
              <input
                type={showPasscode ? 'text' : 'password'}
                required
                autoFocus
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
                placeholder="पासकोड दर्ज करें (Enter Passcode)"
                className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 tracking-wider"
              />
              <button
                type="button"
                onClick={() => setShowPasscode(!showPasscode)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                title={showPasscode ? 'छिपाएं' : 'दिखाएं'}
              >
                {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {errorMsg && (
              <div className="mt-2 text-xs font-bold text-red-600 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}


          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              रद्द करें
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-extrabold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-all shadow-xs cursor-pointer inline-flex items-center gap-1.5 active:scale-95"
            >
              <Unlock className="w-4 h-4" />
              <span>अनलॉक करें (Unlock Studio)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
