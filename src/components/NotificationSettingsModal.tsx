import React, { useState, useEffect } from 'react';
import { NotificationPreferences, JobCategory, AlertType } from '../types';
import { X, Check, Bell, Mail, Smartphone, Volume2, ShieldCheck, Save, Sparkles } from 'lucide-react';

interface NotificationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: NotificationPreferences;
  onSavePreferences: (prefs: NotificationPreferences) => void;
}

const CATEGORIES: JobCategory[] = ['UPSC', 'SSC', 'Banking', 'Railways', 'Defense', 'State PSC', 'Teaching', 'PSU', 'Medical'];
const TYPES: AlertType[] = ['Vacancy Alert', 'Admit Card', 'Exam Date', 'Result', 'Answer Key', 'Syllabus Update'];

export const NotificationSettingsModal: React.FC<NotificationSettingsModalProps> = ({
  isOpen,
  onClose,
  preferences,
  onSavePreferences,
}) => {
  const [form, setForm] = useState<NotificationPreferences>(preferences);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setForm(preferences);
      setSavedSuccess(false);
    }
  }, [isOpen, preferences]);

  if (!isOpen) return null;

  const toggleCategory = (cat: JobCategory) => {
    const exists = form.subscribedCategories.includes(cat);
    const updated = exists
      ? form.subscribedCategories.filter((c) => c !== cat)
      : [...form.subscribedCategories, cat];
    setForm({ ...form, subscribedCategories: updated });
  };

  const toggleType = (t: AlertType) => {
    const exists = form.alertTypes.includes(t);
    const updated = exists
      ? form.alertTypes.filter((x) => x !== t)
      : [...form.alertTypes, t];
    setForm({ ...form, alertTypes: updated });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSavePreferences(form);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div>
            <h3 className="text-lg font-extrabold text-white">Clean Notification Settings</h3>
            <p className="text-xs text-slate-400">Configure alert channels, sector subscriptions, and digest schedule</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 text-sm space-y-6">
          {savedSuccess && (
            <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-700" />
              <span>Notification preferences saved successfully!</span>
            </div>
          )}

          {/* Delivery Channels */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Alert Delivery Channels</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <Bell className="w-4 h-4 text-emerald-600" />
                  <div>
                    <span className="font-bold text-slate-900 text-xs block">In-App Toast Alerts</span>
                    <span className="text-[11px] text-slate-500">Live pop-up alerts in website</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={form.inAppToastsEnabled}
                  onChange={(e) => setForm({ ...form, inAppToastsEnabled: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                />
              </label>

              <label className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <Volume2 className="w-4 h-4 text-emerald-600" />
                  <div>
                    <span className="font-bold text-slate-900 text-xs block">Audio Chime Cue</span>
                    <span className="text-[11px] text-slate-500">Play subtle tone on urgent alerts</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={form.soundEnabled}
                  onChange={(e) => setForm({ ...form, soundEnabled: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                />
              </label>

              <label className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <div>
                    <span className="font-bold text-slate-900 text-xs block">Email Job Alerts</span>
                    <span className="text-[11px] text-slate-500">Daily curated vacancy summary</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={form.emailAlertsEnabled}
                  onChange={(e) => setForm({ ...form, emailAlertsEnabled: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                />
              </label>

              <label className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  <div>
                    <span className="font-bold text-slate-900 text-xs block">WhatsApp Digest</span>
                    <span className="text-[11px] text-slate-500">Instant critical result alerts</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={form.whatsAppAlertsEnabled}
                  onChange={(e) => setForm({ ...form, whatsAppAlertsEnabled: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Contact Details */}
          {(form.emailAlertsEnabled || form.whatsAppAlertsEnabled) && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Contact Channels Config</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {form.emailAlertsEnabled && (
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Email Address</label>
                    <input
                      type="email"
                      value={form.emailAddress}
                      onChange={(e) => setForm({ ...form, emailAddress: e.target.value })}
                      placeholder="you@domain.com"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                      required
                    />
                  </div>
                )}

                {form.whatsAppAlertsEnabled && (
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">WhatsApp Phone Number</label>
                    <input
                      type="tel"
                      value={form.phoneNumber}
                      onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                      required
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Subscribed Sectors */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Subscribed Sectors & Commissions</h4>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => {
                const isSelected = form.subscribedCategories.includes(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleCategory(cat)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Alert Types */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Alert Types to Receive</h4>
            <div className="flex flex-wrap gap-2">
              {TYPES.map((t) => {
                const isSelected = form.alertTypes.includes(t);
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => toggleType(t)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Digest Schedule Frequency */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Digest Summary Schedule</h4>
            <select
              value={form.digestFrequency}
              onChange={(e) => setForm({ ...form, digestFrequency: e.target.value as any })}
              className="w-full px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="Instant">Instant Real-Time Pings (As soon as published)</option>
              <option value="Daily Morning (8 AM)">Daily Morning Digest (8:00 AM)</option>
              <option value="Daily Evening (8 PM)">Daily Evening Digest (8:00 PM)</option>
              <option value="Weekly Digest">Weekly Digest (Every Sunday)</option>
            </select>
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-sm inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Preferences</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
