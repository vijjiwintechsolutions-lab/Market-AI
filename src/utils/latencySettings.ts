export interface LatencySettings {
  enabled: boolean;
  thresholdMs: number;
  browserNotifications: boolean;
  soundAlert: boolean;
}

export const DEFAULT_LATENCY_SETTINGS: LatencySettings = {
  enabled: true,
  thresholdMs: 1500,
  browserNotifications: false,
  soundAlert: false,
};

const STORAGE_KEY = 'neural_market_latency_settings';

export function getLatencySettings(): LatencySettings {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        enabled: typeof parsed.enabled === 'boolean' ? parsed.enabled : DEFAULT_LATENCY_SETTINGS.enabled,
        thresholdMs: typeof parsed.thresholdMs === 'number' ? parsed.thresholdMs : DEFAULT_LATENCY_SETTINGS.thresholdMs,
        browserNotifications: typeof parsed.browserNotifications === 'boolean' ? parsed.browserNotifications : DEFAULT_LATENCY_SETTINGS.browserNotifications,
        soundAlert: typeof parsed.soundAlert === 'boolean' ? parsed.soundAlert : DEFAULT_LATENCY_SETTINGS.soundAlert,
      };
    }
  } catch (err) {
    console.warn('[LatencySettings] Error loading settings:', err);
  }
  return { ...DEFAULT_LATENCY_SETTINGS };
}

export function saveLatencySettings(settings: LatencySettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    window.dispatchEvent(new CustomEvent('latency-settings-changed', { detail: settings }));
  } catch (err) {
    console.warn('[LatencySettings] Error saving settings:', err);
  }
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    return false;
  }
  if (Notification.permission === 'granted') {
    return true;
  }
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return false;
}

export function showNativeBrowserNotification(title: string, body: string): void {
  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon: '/favicon.ico',
      });
    } catch (e) {
      console.warn('[LatencySettings] Failed to trigger native notification:', e);
    }
  }
}
