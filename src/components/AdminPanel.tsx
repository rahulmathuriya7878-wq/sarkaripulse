import React from 'react';
import { Settings, PenSquare } from 'lucide-react';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenWriteBlog: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose, onOpenWriteBlog }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <Settings className="w-6 h-6 text-emerald-700" />
            <h2 className="text-xl font-black text-slate-900">प्रशासनिक पैनल (Admin Panel)</h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900">
            X
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <button
            onClick={() => {
              onOpenWriteBlog();
              onClose();
            }}
            className="flex items-center gap-3 p-4 bg-emerald-50 hover:bg-emerald-100 rounded-2xl border border-emerald-200 text-emerald-950 transition-colors font-bold"
          >
            <PenSquare className="w-5 h-5" />
            AI ब्लॉग लेखक स्टूडियो (Launch)
          </button>
        </div>
      </div>
    </div>
  );
};
