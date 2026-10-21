import React from 'react';
import { AppNotification } from '../types';
import { X, Bell, Check, Trash2, Sparkles, AlertTriangle, Info, Clock, CheckCheck, SlidersHorizontal } from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onClearNotification: (id: string) => void;
  onClearAll: () => void;
  onSimulateAlert: () => void;
  onRequestBrowserPermission: () => void;
  onOpenSettings: () => void;
  onSelectNotificationJob: (jobId?: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkRead,
  onMarkAllRead,
  onClearNotification,
  onClearAll,
  onSimulateAlert,
  onRequestBrowserPermission,
  onOpenSettings,
  onSelectNotificationJob,
}) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-slate-800 rounded-xl relative">
              <Bell className="w-5 h-5 text-emerald-400" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-slate-950 font-bold text-[10px] rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">Alert Notifications</h3>
              <p className="text-xs text-slate-400">
                {unreadCount === 0 ? 'All alerts read' : `${unreadCount} unread alert updates`}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar Controls */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-slate-600">
          <button
            onClick={onSimulateAlert}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-100 text-amber-900 hover:bg-amber-200 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Test Push Alert</span>
          </button>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllRead}
                className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800 transition-colors cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}

            {notifications.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-slate-500 hover:text-red-600 transition-colors cursor-pointer"
                title="Clear all alerts"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={onOpenSettings}
              className="p-1 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              title="Notification Settings"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notification List */}
        <div className="p-4 flex-1 overflow-y-auto space-y-3">
          {notifications.length === 0 ? (
            <div className="p-12 text-center text-slate-400 space-y-3">
              <Bell className="w-10 h-10 mx-auto text-slate-300" />
              <p className="font-semibold text-sm text-slate-600">No active alerts</p>
              <p className="text-xs">All government job & exam updates will appear here in real time.</p>
              <button
                onClick={onSimulateAlert}
                className="px-4 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors cursor-pointer"
              >
                Trigger Sample Alert
              </button>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => {
                  onMarkRead(notif.id);
                  if (notif.targetJobId) {
                    onSelectNotificationJob(notif.targetJobId);
                  }
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${
                  notif.isRead
                    ? 'bg-white border-slate-200 opacity-80'
                    : 'bg-emerald-50/60 border-emerald-300 shadow-xs font-medium'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 font-semibold">
                    <span className="text-emerald-800">{notif.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{notif.type}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-slate-400">
                      {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onClearNotification(notif.id);
                      }}
                      className="p-1 text-slate-300 hover:text-red-500 transition-colors cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h4 className="text-sm font-extrabold text-slate-900 leading-snug mb-1">{notif.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-2">{notif.message}</p>

                {notif.targetJobId && (
                  <span className="inline-flex items-center text-[11px] font-bold text-emerald-700 hover:underline">
                    View Associated Notification →
                  </span>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer Permission Callout */}
        <div className="p-4 bg-slate-900 text-white text-xs border-t border-slate-800 space-y-2">
          <p className="text-slate-300">
            Want instant pop-up alerts on your device even when this tab is closed?
          </p>
          <button
            onClick={onRequestBrowserPermission}
            className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-center transition-colors cursor-pointer"
          >
            Enable Browser Push Notifications
          </button>
        </div>
      </div>
    </div>
  );
};
