import React, { useState } from 'react';
import {
  Bell,
  Menu as MenuIcon,
  ChevronDown,
  PenSquare,
  Globe,
  Twitter,
  Share2,
  Search,
} from 'lucide-react';
import { JobCategory } from '../types';

interface HeaderProps {
  activeTab: 'blogs' | 'results' | 'eligibility' | 'chat';
  setActiveTab: (tab: 'blogs' | 'results' | 'eligibility' | 'chat') => void;
  unreadCount: number;
  onOpenNotifications: () => void;
  onOpenSettings: () => void;
  onOpenSimulateAlert: () => void;
  onOpenMobileMenu: () => void;
  onOpenWriteBlog: () => void;
  onSelectSectorFilter?: (sector: JobCategory) => void;
  onOpenSearch?: () => void;
}

const SECTORS: { name: JobCategory; icon: string; hindiName: string }[] = [
  { name: 'UPSC', icon: '🏛️', hindiName: 'संघ लोक सेवा आयोग' },
  { name: 'SSC', icon: '💼', hindiName: 'कर्मचारी चयन आयोग' },
  { name: 'Banking', icon: '🏦', hindiName: 'बैंकिंग व आईबीपीएस' },
  { name: 'Railways', icon: '🚆', hindiName: 'भारतीय रेलवे (RRB)' },
  { name: 'Defense', icon: '🪖', hindiName: 'रक्षा व सेना' },
  { name: 'State PSC', icon: '📍', hindiName: 'राज्य लोक सेवा आयोग' },
  { name: 'Teaching', icon: '📚', hindiName: 'शिक्षक भर्ती (CTET/KVS)' },
  { name: 'PSU', icon: '⚡', hindiName: 'सरकारी उपक्रम (ISRO/GATE)' },
  { name: 'Medical', icon: '🏥', hindiName: 'चिकित्सा व AIIMS' },
];

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  unreadCount,
  onOpenNotifications,
  onOpenSettings,
  onOpenSimulateAlert,
  onOpenMobileMenu,
  onOpenWriteBlog,
  onSelectSectorFilter,
  onOpenSearch,
}) => {
  const [isSectorDropdownOpen, setIsSectorDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Menu Toggle & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200"
            aria-label="नेविगेशन मेनू खोलें"
            title="मुख्य मेनू"
          >
            <MenuIcon className="w-5 h-5" />
          </button>

          <button
            onClick={() => setActiveTab('blogs')}
            className="flex items-center gap-2 text-left cursor-pointer group shrink-0"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-black text-lg shadow-xs group-hover:bg-emerald-700 transition-colors">
              S
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900 whitespace-nowrap">
              सरकारी<span className="text-emerald-600">पल्स</span>
            </span>
          </button>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 text-xs sm:text-sm font-bold text-slate-700">
          <button
            onClick={() => setActiveTab('blogs')}
            className={`px-3 py-2 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'blogs' ? 'text-emerald-700 bg-emerald-50 font-extrabold' : 'hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            समाचार व ब्लॉग
          </button>

          <button
            onClick={() => setActiveTab('results')}
            className={`px-3 py-2 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'results' ? 'text-emerald-700 bg-emerald-50 font-extrabold' : 'hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            सरकारी योजना
          </button>

          <button
            onClick={() => setActiveTab('eligibility')}
            className={`px-3 py-2 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'eligibility' ? 'text-emerald-700 bg-emerald-50 font-extrabold' : 'hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            AI योग्यता जांचें
          </button>

          {/* Mega Menu Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsSectorDropdownOpen(!isSectorDropdownOpen)}
              onMouseEnter={() => setIsSectorDropdownOpen(true)}
              className="px-3 py-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer inline-flex items-center gap-1 font-bold"
            >
              <span>सरकारी विभाग</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {isSectorDropdownOpen && (
              <div
                onMouseLeave={() => setIsSectorDropdownOpen(false)}
                className="absolute top-full left-0 mt-1 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 grid grid-cols-3 gap-2 animate-in fade-in duration-150"
              >
                {SECTORS.map((s) => (
                  <button
                    key={s.name}
                    onClick={() => {
                      setIsSectorDropdownOpen(false);
                      if (onSelectSectorFilter) onSelectSectorFilter(s.name);
                      setActiveTab('vacancies');
                    }}
                    className="p-2 rounded-xl hover:bg-emerald-50 border border-slate-100 text-center transition-colors cursor-pointer space-y-1"
                  >
                    <span className="text-base block">{s.icon}</span>
                    <span className="text-[11px] font-extrabold text-slate-800 block truncate">{s.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Right: Studio & Notification Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenWriteBlog}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-extrabold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors cursor-pointer border border-emerald-200"
          >
            <PenSquare className="w-3.5 h-3.5 text-emerald-600" />
            <span>AI ब्लॉग स्टूडियो</span>
          </button>

          {onOpenSearch && (
            <button
              onClick={onOpenSearch}
              className="p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200"
              aria-label="खोजें"
              title="खोजें (Search)"
            >
              <Search className="w-5 h-5 text-slate-700" />
            </button>
          )}

          <button
            onClick={onOpenNotifications}
            className="relative p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200"
            aria-label="सूचनाएं"
            title="अलर्ट नोटिफिकेशन"
          >
            <Bell className="w-5 h-5 text-slate-700" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-slate-950 font-bold text-[11px] rounded-full flex items-center justify-center animate-bounce shadow-xs">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>


        </div>
      </div>
    </header>
  );
};
