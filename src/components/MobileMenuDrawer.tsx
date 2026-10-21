import React from 'react';
import {
  X,
  Newspaper,
  Briefcase,
  FileCheck2,
  Sparkles,
  Bell,
  SlidersHorizontal,
  PenSquare,
  Bookmark,
  HelpCircle,
  Building2,
  ChevronRight,
  Bot,
  Flame,
  Settings,
} from 'lucide-react';
import { JobCategory } from '../types';

interface MobileMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: 'blogs' | 'results' | 'eligibility' | 'chat';
  setActiveTab: (tab: 'blogs' | 'results' | 'eligibility' | 'chat') => void;
  unreadCount: number;
  bookmarksCount: number;
  onOpenNotifications: () => void;
  onOpenSettings: () => void;
  onOpenQuiz: () => void;
  onOpenWriteBlog: () => void;
  onOpenChat: () => void;
  onOpenAdminPanel: () => void;
  onSelectSectorFilter?: (sector: JobCategory) => void;
}

const SECTORS: { name: JobCategory; icon: string }[] = [
  { name: 'UPSC', icon: '🏛️' },
  { name: 'SSC', icon: '💼' },
  { name: 'Banking', icon: '🏦' },
  { name: 'Railways', icon: '🚆' },
  { name: 'Defense', icon: '🪖' },
  { name: 'State PSC', icon: '📍' },
  { name: 'Teaching', icon: '📚' },
  { name: 'PSU', icon: '⚡' },
  { name: 'Medical', icon: '🏥' },
];

export const MobileMenuDrawer: React.FC<MobileMenuDrawerProps> = ({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  unreadCount,
  bookmarksCount,
  onOpenNotifications,
  onOpenSettings,
  onOpenQuiz,
  onOpenWriteBlog,
  onOpenChat,
  onOpenAdminPanel,
  onSelectSectorFilter,
}) => {
  if (!isOpen) return null;

  const handleNavigate = (tab: 'blogs' | 'vacancies' | 'results' | 'eligibility' | 'chat') => {
    setActiveTab(tab);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-start">
      <div className="bg-white w-full max-w-xs h-full shadow-2xl flex flex-col border-r border-slate-200 animate-in slide-in-from-left duration-200">
        {/* Menu Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-black text-lg flex items-center justify-center">
              S
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-white block">
                सरकारी<span className="text-emerald-400">पल्स</span> मेनू
              </span>
              <span className="text-[10px] text-slate-400 block font-medium">समाचार ब्लॉग व नौकरी पोर्टल</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu Content */}
        <div className="p-4 flex-1 overflow-y-auto space-y-5 text-xs font-bold text-slate-700">
          {/* Main Sections */}
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2 px-2">
              मुख्य अनुभाग (Main Sections)
            </span>
            <div className="space-y-1">
              <button
                onClick={() => handleNavigate('blogs')}
                className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between transition-colors cursor-pointer ${
                  activeTab === 'blogs' ? 'bg-emerald-50 text-emerald-800 font-extrabold' : 'hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Newspaper className="w-4 h-4 text-emerald-600" />
                  <span>समाचार व ब्लॉग (Blog Feed)</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => handleNavigate('results')}
                className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between transition-colors cursor-pointer ${
                  activeTab === 'results' ? 'bg-emerald-50 text-emerald-800 font-extrabold' : 'hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FileCheck2 className="w-4 h-4 text-emerald-600" />
                  <span>सरकारी योजना (Sarkari Yojana)</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => handleNavigate('eligibility')}
                className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between transition-colors cursor-pointer ${
                  activeTab === 'eligibility' ? 'bg-emerald-50 text-emerald-800 font-extrabold' : 'hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>AI योग्यता जांचें (Eligibility)</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>

          {/* AI Tools */}
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2 px-2">
              AI टूल्स व स्टूडियो
            </span>
            <div className="space-y-1">
              <button
                onClick={() => {
                  onClose();
                  onOpenWriteBlog();
                }}
                className="w-full p-2.5 rounded-xl text-left flex items-center justify-between hover:bg-emerald-50 transition-colors cursor-pointer bg-slate-50 text-slate-900 border border-slate-200"
              >
                <div className="flex items-center gap-2.5">
                  <PenSquare className="w-4 h-4 text-emerald-700" />
                  <span className="font-bold">AI ब्लॉग लेखक स्टूडियो</span>
                </div>
                <span className="text-[10px] font-extrabold text-emerald-700 uppercase bg-emerald-100 px-2 py-0.5 rounded">
                  ब्लॉग
                </span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenQuiz();
                }}
                className="w-full p-2.5 rounded-xl text-left flex items-center justify-between hover:bg-amber-50 transition-colors cursor-pointer bg-slate-50 text-slate-900 border border-slate-200"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span className="font-bold">दैनिक AI GK क्विज</span>
                </div>
                <span className="text-[10px] font-extrabold text-amber-900 uppercase bg-amber-100 px-2 py-0.5 rounded">
                  5 प्रश्न
                </span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenChat();
                }}
                className="w-full p-2.5 rounded-xl text-left flex items-center justify-between hover:bg-slate-100 transition-colors cursor-pointer bg-slate-900 text-white"
              >
                <div className="flex items-center gap-2.5">
                  <Bot className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold">सरकारी AI सलाहकार</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenAdminPanel();
                }}
                className="w-full p-2.5 rounded-xl text-left flex items-center justify-between hover:bg-emerald-50 transition-colors cursor-pointer bg-slate-50 text-slate-900 border border-slate-200"
              >
                <div className="flex items-center gap-2.5">
                  <Settings className="w-4 h-4 text-emerald-700" />
                  <span className="font-bold">प्रशासनिक पैनल (Admin Panel)</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

            </div>
          </div>

          {/* Alerts & Preferences */}
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2 px-2">
              अलर्ट व सेटिंग्स
            </span>
            <div className="space-y-1">
              <button
                onClick={() => {
                  onClose();
                  onOpenNotifications();
                }}
                className="w-full p-2.5 rounded-xl text-left flex items-center justify-between hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Bell className="w-4 h-4 text-slate-600" />
                  <span>सूचना केंद्र (Notifications)</span>
                </div>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950">
                    {unreadCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenSettings();
                }}
                className="w-full p-2.5 rounded-xl text-left flex items-center justify-between hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <SlidersHorizontal className="w-4 h-4 text-slate-600" />
                  <span>अलर्ट प्राथमिकताएं</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900 text-slate-300 text-[11px] border-t border-slate-800 text-center font-semibold">
          <p>© 2026 सरकारीपल्स समाचार व जॉब पोर्टल</p>
        </div>
      </div>
    </div>
  );
};
