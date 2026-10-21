import { AppNotification, NotificationPreferences, JobCategory, AlertType } from '../types';

const NOTIFICATIONS_STORAGE_KEY = 'sarkaripulse_notifications_v1';
const PREFERENCES_STORAGE_KEY = 'sarkaripulse_preferences_v1';
const BOOKMARKS_STORAGE_KEY = 'sarkaripulse_bookmarks_v1';

export const DEFAULT_PREFERENCES: NotificationPreferences = {
  webPushEnabled: false,
  inAppToastsEnabled: true,
  emailAlertsEnabled: true,
  emailAddress: 'candidate@sarkaripulse.gov.in',
  whatsAppAlertsEnabled: true,
  phoneNumber: '+91 98765 43210',
  subscribedCategories: ['UPSC', 'SSC', 'Banking', 'Railways', 'Defense', 'State PSC', 'Teaching', 'PSU', 'Medical'],
  alertTypes: ['Vacancy Alert', 'Admit Card', 'Exam Date', 'Result', 'Answer Key', 'Syllabus Update'],
  digestFrequency: 'Daily Morning (8 AM)',
  soundEnabled: true,
};

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: '🔥 महत्वपूर्ण भर्ती अधिसूचना जारी',
    message: 'UPSC सिविल सेवा CSE 2026 अधिसूचना 1,056 पदों पर जारी। अंतिम तिथि: 15 नवंबर।',
    category: 'UPSC',
    type: 'Vacancy Alert',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    isRead: false,
    priority: 'Urgent',
    targetJobId: 'job-upsc-cse-2026',
  },
  {
    id: 'notif-2',
    title: '⚡ एडमिट कार्ड डाउनलोड लिंक सक्रिय',
    message: 'CBSE CTET दिसंबर 2026 एडमिट कार्ड जारी। तुरंत हॉल टिकट डाउनलोड करें।',
    category: 'Teaching',
    type: 'Admit Card',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    isRead: false,
    priority: 'High',
    targetJobId: 'job-ctet-2026',
  },
  {
    id: 'notif-3',
    title: '💼 केंद्रीय कैबिनेट फैसला',
    message: 'केंद्र सरकार ने कर्मचारियों का महंगाई भत्ता (DA) 4% बढ़ाकर 54% किया।',
    category: 'General News',
    type: 'System',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    isRead: true,
    priority: 'Medium',
  },
];

// Audio chime using Web Audio API
export function playAlertChime() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    // First note
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, ctx.currentTime);
    gain1.gain.setValueAtTime(0.15, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.3);

    // Second higher note
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, ctx.currentTime + 0.15);
    gain2.gain.setValueAtTime(0.15, ctx.currentTime + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.15);
    osc2.stop(ctx.currentTime + 0.5);
  } catch (e) {
    console.warn('Audio playback error:', e);
  }
}

export function getStoredNotifications(): AppNotification[] {
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
      return INITIAL_NOTIFICATIONS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_NOTIFICATIONS;
  }
}

export function saveStoredNotifications(notifs: AppNotification[]): void {
  try {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifs));
  } catch (e) {
    console.error('Error saving notifications', e);
  }
}

export function getStoredPreferences(): NotificationPreferences {
  try {
    const raw = localStorage.getItem(PREFERENCES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(DEFAULT_PREFERENCES));
      return DEFAULT_PREFERENCES;
    }
    return JSON.parse(raw);
  } catch (e) {
    return DEFAULT_PREFERENCES;
  }
}

export function saveStoredPreferences(prefs: NotificationPreferences): void {
  try {
    localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(prefs));
  } catch (e) {
    console.error('Error saving preferences', e);
  }
}

export function getStoredBookmarks(): string[] {
  try {
    const raw = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : ['job-upsc-cse-2026', 'job-sbi-po-2026'];
  } catch (e) {
    return ['job-upsc-cse-2026', 'job-sbi-po-2026'];
  }
}

export function saveStoredBookmarks(bookmarks: string[]): void {
  try {
    localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(bookmarks));
  } catch (e) {
    console.error('Error saving bookmarks', e);
  }
}

export async function requestBrowserPushPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    return false;
  }
  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (e) {
    return false;
  }
}

export function triggerDesktopNotification(title: string, message: string) {
  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body: message,
        icon: '/favicon.ico',
        tag: 'sarkaripulse-alert',
      });
    } catch (e) {
      console.warn('Desktop notification error', e);
    }
  }
}

const ALERT_POOL = [
  {
    title: '🚨 एसबीआई क्लर्क 2026 अधिसूचना जारी',
    message: 'भारतीय स्टेट बैंक ने 8,500 जूनियर एसोसिएट पदों पर आवेदन आमंत्रित किए। फॉर्म कल से शुरू।',
    category: 'Banking' as JobCategory,
    type: 'Vacancy Alert' as AlertType,
    priority: 'Urgent' as const,
    targetJobId: 'job-sbi-po-2026',
  },
  {
    title: '⚡ एसएससी सीजीएल टियर-2 उत्तर कुंजी जारी',
    message: 'कर्मचारी चयन आयोग ने उत्तर कुंजी पोर्टल पर अपलोड की। अपना स्कोरकार्ड चेक करें।',
    category: 'SSC' as JobCategory,
    type: 'Result' as AlertType,
    priority: 'High' as const,
    targetJobId: 'job-ssc-cgl-2026',
  },
  {
    title: '📌 आरआरबी एनटीपीसी परीक्षा तिथि घोषित',
    message: 'रेलवे भर्ती बोर्ड ने सीबीटी-1 परीक्षा तिथियां 12 दिसंबर से 24 दिसंबर तय कीं।',
    category: 'Railways' as JobCategory,
    type: 'Exam Date' as AlertType,
    priority: 'Urgent' as const,
    targetJobId: 'job-rrb-alp-2026',
  },
];

export function generateRandomAlert(): AppNotification {
  const item = ALERT_POOL[Math.floor(Math.random() * ALERT_POOL.length)];
  return {
    id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    title: item.title,
    message: item.message,
    category: item.category,
    type: item.type,
    timestamp: new Date().toISOString(),
    isRead: false,
    priority: item.priority,
    targetJobId: item.targetJobId,
  };
}
