import React, { useState, useEffect } from 'react';
import { 
  X, 
  Activity, 
  Bell, 
  SlidersHorizontal, 
  Zap, 
  Check, 
  AlertTriangle, 
  Volume2, 
  Monitor, 
  RotateCcw,
  Gauge
} from 'lucide-react';
import { 
  LatencySettings, 
  getLatencySettings, 
  saveLatencySettings, 
  requestNotificationPermission,
  showNativeBrowserNotification,
  DEFAULT_LATENCY_SETTINGS 
} from '../utils/latencySettings';

interface LatencySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerTestToast?: (threshold: number) => void;
}

export const LatencySettingsModal: React.FC<LatencySettingsModalProps> = ({
  isOpen,
  onClose,
  onTriggerTestToast,
}) => {
  const [settings, setSettings] = useState<LatencySettings>(getLatencySettings());
  const [notificationPermission, setNotificationPermission] = useState<string>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'unsupported'
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSettings(getLatencySettings());
      if (typeof window !== 'undefined' && 'Notification' in window) {
        setNotificationPermission(Notification.permission);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    saveLatencySettings(settings);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
  };

  const handleReset = () => {
    setSettings({ ...DEFAULT_LATENCY_SETTINGS });
    saveLatencySettings(DEFAULT_LATENCY_SETTINGS);
  };

  const handleRequestPermission = async () => {
    const granted = await requestNotificationPermission();
    setNotificationPermission(granted ? 'granted' : 'denied');
    if (granted) {
      setSettings((prev) => ({ ...prev, browserNotifications: true }));
      showNativeBrowserNotification(
        '⚡ Latency Alert Permission Granted',
        'You will now receive desktop notifications when AI provider latency exceeds your threshold.'
      );
    }
  };

  const PRESET_THRESHOLDS = [
    { label: '500ms', value: 500, tag: 'Ultra-Fast' },
    { label: '1,000ms', value: 1000, tag: 'Fast' },
    { label: '1,500ms', value: 1500, tag: 'Standard' },
    { label: '2,500ms', value: 2500, tag: 'Generous' },
    { label: '5,000ms', value: 5000, tag: 'Heavy Tasks' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn font-sans">
      <div 
        className="w-full max-w-lg bg-[#0F1017] border border-indigo-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-indigo-950/80 via-purple-950/40 to-slate-900 border-b border-indigo-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 rounded-xl border border-indigo-500/40 text-indigo-400">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                Power User Latency Notifications
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold uppercase">
                  Runtime Monitor
                </span>
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Configure runtime provider response latency thresholds & toast alerts
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 font-mono text-xs">
          
          {/* Main Enable / Disable Toggle */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-indigo-500/20 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-bold text-white font-sans">
                <Bell className="w-4 h-4 text-indigo-400" />
                <span>Enable Latency Threshold Alerts</span>
              </div>
              <p className="text-slate-400 font-sans text-xs">
                Trigger toast warnings whenever an AI provider execution time exceeds your maximum target.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSettings({ ...settings, enabled: !settings.enabled })}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                settings.enabled ? 'bg-indigo-600' : 'bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  settings.enabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Threshold Slider & Input Controls */}
          <div className={`space-y-4 transition-opacity ${settings.enabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
            <div className="flex items-center justify-between">
              <label className="text-slate-200 font-bold flex items-center gap-2">
                <Gauge className="w-4 h-4 text-amber-400" />
                Latency Warning Threshold:
              </label>
              <div className="flex items-center gap-1.5 bg-indigo-950/80 px-3 py-1 rounded-lg border border-indigo-500/30 text-indigo-300 font-bold text-sm">
                <span>{settings.thresholdMs}</span>
                <span className="text-xs text-slate-400">ms</span>
              </div>
            </div>

            {/* Slider */}
            <div className="space-y-2">
              <input
                type="range"
                min="200"
                max="10000"
                step="100"
                value={settings.thresholdMs}
                onChange={(e) => setSettings({ ...settings, thresholdMs: Number(e.target.value) })}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>200ms (Strict)</span>
                <span>2,500ms (Balanced)</span>
                <span>10,000ms (Relaxed)</span>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="space-y-1.5">
              <span className="text-[11px] text-slate-400">Quick Threshold Presets:</span>
              <div className="grid grid-cols-5 gap-1.5">
                {PRESET_THRESHOLDS.map((preset) => {
                  const isSelected = settings.thresholdMs === preset.value;
                  return (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() => setSettings({ ...settings, thresholdMs: preset.value })}
                      className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200 font-bold shadow-sm'
                          : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <div className="text-[11px] font-bold">{preset.label}</div>
                      <div className="text-[9px] text-slate-500">{preset.tag}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Browser Desktop & Sound Settings */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10 space-y-3 font-sans">
            <h5 className="font-bold text-xs uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
              Additional Power Alert Channels
            </h5>

            {/* Desktop Notifications */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <Monitor className="w-4 h-4 text-purple-400" />
                <div>
                  <div className="text-xs font-bold text-slate-200">OS Desktop Notifications</div>
                  <div className="text-[11px] text-slate-400">Push OS system popups when tab is in background</div>
                </div>
              </div>

              {notificationPermission === 'granted' ? (
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, browserNotifications: !settings.browserNotifications })}
                  className={`px-2.5 py-1 rounded text-xs font-bold border transition-colors cursor-pointer ${
                    settings.browserNotifications
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {settings.browserNotifications ? 'Enabled' : 'Disabled'}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleRequestPermission}
                  className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-bold transition-colors cursor-pointer"
                >
                  Allow OS Permission
                </button>
              )}
            </div>

            {/* Sound Alert Toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-amber-400" />
                <div>
                  <div className="text-xs font-bold text-slate-200">Audible Beep Alert</div>
                  <div className="text-[11px] text-slate-400">Play subtle warning chime when threshold exceeded</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSettings({ ...settings, soundAlert: !settings.soundAlert })}
                className={`px-2.5 py-1 rounded text-xs font-bold border transition-colors cursor-pointer ${
                  settings.soundAlert
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                {settings.soundAlert ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          </div>

          {/* Test Toast Alert Button */}
          {onTriggerTestToast && (
            <div className="pt-2 flex items-center justify-between bg-indigo-950/30 p-3 rounded-xl border border-indigo-500/20">
              <span className="text-slate-300 text-xs font-sans">Verify notification toast appearance:</span>
              <button
                type="button"
                onClick={() => onTriggerTestToast(settings.thresholdMs)}
                className="px-3 py-1.5 bg-gradient-to-r from-amber-600 to-indigo-600 hover:from-amber-500 hover:to-indigo-500 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Simulate High Latency Alert</span>
              </button>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-950 border-t border-white/10 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-2 text-slate-400 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-lg cursor-pointer"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Notification Settings</span>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
