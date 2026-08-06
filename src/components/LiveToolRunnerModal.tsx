// =====================================================================
// MARKET1 LIVE TOOL RUNNER MODAL (MUTE)
// Executes tools via modal with MuteToolConfig types.
// =====================================================================

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Play, Download, RefreshCw, Sliders, 
  UploadCloud, Paperclip, AlertCircle, CheckCircle2 
} from 'lucide-react';

import { MuteToolConfig } from '../types/mute';
import { apiService } from '../services/apiService';
import { UniversalValidationEngine } from '../services/validationEngine';
import { UniversalDownloadEngine } from '../services/downloadEngine';
import { UniversalHistoryEngine } from '../services/historyEngine';
import { UniversalAnalyticsEngine } from '../services/analyticsEngine';
import { UniversalWalletEngine } from '../services/walletEngine';
import { UniversalSubscriptionEngine } from '../services/subscriptionEngine';
import { UniversalPreview } from './UniversalPreview';
import { auth } from '../config/firebase';

interface LiveToolRunnerModalProps {
  tool: MuteToolConfig;
  isOpen: boolean;
  onClose: () => void;
}

export const LiveToolRunnerModal: React.FC<LiveToolRunnerModalProps> = ({ tool, isOpen, onClose }) => {
  const [inputValues, setInputValues] = useState<Record<string, any>>(() => {
    const defaults: Record<string, any> = {};
    if (tool && tool.options) {
      tool.options.forEach(opt => { defaults[opt.id] = opt.defaultValue; });
    }
    if (tool && tool.outputs && tool.outputs.length > 0) {
      defaults['outputFormat'] = tool.outputs[0];
    }
    return defaults;
  });

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  
  const [textOutput, setTextOutput] = useState<string | null>(null);
  const [mediaOutputUrl, setMediaOutputUrl] = useState<string | null>(null);
  const [fileDownloadUrl, setFileDownloadUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const requiresUpload = tool && (!tool.accepts.includes('prompt') || tool.accepts.length > 1);

  useEffect(() => {
    if (isOpen) {
      setUploadedFiles([]);
      setTextOutput(null);
      setMediaOutputUrl(null);
      setFileDownloadUrl(null);
      setValidationError(null);
      setExecutionTime(null);
    }
  }, [isOpen, tool?.id]);

  if (!isOpen || !tool) return null;

  const handleInputChange = (id: string, value: any) => setInputValues(prev => ({ ...prev, [id]: value }));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadedFiles(Array.from(e.target.files));
      setValidationError(null);
    }
  };

  const handleExecute = async () => {
    setValidationError(null);
    
    const validation = await UniversalValidationEngine.validate(tool, inputValues, uploadedFiles);
    if (!validation.isValid) {
      setValidationError(validation.errorMessage || 'Validation failed.');
      return;
    }

    setIsRunning(true);
    setTextOutput(null);
    setMediaOutputUrl(null);
    setFileDownloadUrl(null);
    setProgressPercent(0);

    const progressInt = setInterval(() => setProgressPercent(p => (p < 94 ? p + Math.floor(Math.random() * 8) + 2 : p)), 100);
    const start = Date.now();

    try {
      const res = await apiService.executeTool({ 
        tool, 
        inputValues, 
        file: uploadedFiles[0], 
        files: uploadedFiles 
      });
      
      clearInterval(progressInt);
      setProgressPercent(100);
      const execTime = Date.now() - start;
      
      setTimeout(() => {
        if (res.success) {
          if (res.textOutput) setTextOutput(res.textOutput);
          if (res.mediaUrl) setMediaOutputUrl(res.mediaUrl);
          if (res.fileUrl) setFileDownloadUrl(res.fileUrl);

          if (auth.currentUser) {
            if (tool.validation?.requireWalletCredits) {
              UniversalWalletEngine.deductCredits(auth.currentUser.uid, tool.validation.requireWalletCredits);
            }
            UniversalSubscriptionEngine.incrementDailyUsage(auth.currentUser.uid);
          }
          
          UniversalHistoryEngine.logExecution(tool, 'success', execTime, inputValues);
          UniversalAnalyticsEngine.trackUsage(tool, execTime, true);
        } else {
          setValidationError(res.error || 'Execution failed.');
          UniversalHistoryEngine.logExecution(tool, 'error', execTime, inputValues);
          UniversalAnalyticsEngine.trackUsage(tool, execTime, false);
        }
        
        setExecutionTime(res.executionTimeMs || execTime);
        setIsRunning(false);
      }, 400);

    } catch (err: any) {
      clearInterval(progressInt);
      setIsRunning(false);
      setValidationError(err.message || 'An unexpected runtime error occurred.');
      
      const execTime = Date.now() - start;
      UniversalHistoryEngine.logExecution(tool, 'error', execTime, inputValues);
      UniversalAnalyticsEngine.trackUsage(tool, execTime, false);
    }
  };

  const handleDownload = () => {
    const targetUrl = fileDownloadUrl || mediaOutputUrl;
    if (!targetUrl) return;
    
    const activeExt = inputValues['outputFormat'] || tool.outputs[0] || 'out';
    let baseName = tool.id;
    if (uploadedFiles.length > 0) {
      baseName = uploadedFiles[0].name.substring(0, uploadedFiles[0].name.lastIndexOf('.')) || tool.id;
    }
    
    UniversalDownloadEngine.download(targetUrl, baseName, activeExt);
    UniversalAnalyticsEngine.trackDownload(tool.id, activeExt);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 font-mono">
      <div className="bg-[#151517] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        
        {/* Modal Header */}
        <div className="sticky top-0 bg-[#151517] border-b border-white/15 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded border ${
              tool.engine === 'ai' ? 'bg-purple-600/30 text-purple-300 border-purple-500/40' : 'bg-emerald-600/30 text-emerald-300 border-emerald-500/40'
            }`}>
              {tool.engine.toUpperCase()} ENGINE
            </span>
            <h2 className="text-lg font-extrabold text-white">{tool.name}</h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 items-start">
          
          {/* Left Config Panel */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-xs font-bold uppercase text-emerald-400 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5"/> Configuration
              </span>
            </div>

            <div className="space-y-4">
              {tool.outputs && tool.outputs.length > 1 && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-200">Output Format:</label>
                  <select 
                    value={inputValues['outputFormat']} 
                    onChange={e => handleInputChange('outputFormat', e.target.value)} 
                    className="w-full px-3 py-2 bg-[#0A0A0A] border border-white/20 rounded-lg text-xs text-white focus:border-emerald-500 font-bold uppercase"
                  >
                    {tool.outputs.map(fmt => <option key={fmt} value={fmt}>{fmt}</option>)}
                  </select>
                </div>
              )}

              {tool.options && tool.options.map(opt => (
                <div key={opt.id} className="space-y-1">
                  <label className="text-xs font-bold text-slate-200 flex justify-between">
                    {opt.label} {opt.type === 'slider' && <span className="text-emerald-400">{inputValues[opt.id]}</span>}
                  </label>
                  {opt.type === 'text' && (
                    <input 
                      type="text" 
                      value={inputValues[opt.id] ?? ''} 
                      onChange={e => handleInputChange(opt.id, e.target.value)} 
                      className="w-full px-3 py-2 bg-[#0A0A0A] border border-white/10 rounded-lg text-xs text-white focus:border-emerald-500" 
                    />
                  )}
                  {opt.type === 'textarea' && (
                    <textarea 
                      rows={3} 
                      value={inputValues[opt.id] ?? ''} 
                      onChange={e => handleInputChange(opt.id, e.target.value)} 
                      className="w-full px-3 py-2 bg-[#0A0A0A] border border-white/10 rounded-lg text-xs text-white focus:border-emerald-500 resize-none" 
                      placeholder={`Enter ${opt.label.toLowerCase()}...`} 
                    />
                  )}
                  {opt.type === 'select' && opt.options && (
                    <select 
                      value={inputValues[opt.id]} 
                      onChange={e => handleInputChange(opt.id, e.target.value)} 
                      className="w-full px-3 py-2 bg-[#0A0A0A] border border-white/10 rounded-lg text-xs text-white focus:border-emerald-500"
                    >
                      {opt.options.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  )}
                  {opt.type === 'slider' && (
                    <input 
                      type="range" 
                      min={opt.min} 
                      max={opt.max} 
                      step={opt.step} 
                      value={inputValues[opt.id]} 
                      onChange={e => handleInputChange(opt.id, Number(e.target.value))} 
                      className="w-full accent-emerald-500" 
                    />
                  )}
                </div>
              ))}
            </div>

            {requiresUpload && tool.accepts && (
              <div className="pt-3 border-t border-white/10 space-y-2">
                <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                  <Paperclip className="w-3.5 h-3.5 text-emerald-400"/> Source Files ({tool.accepts.join(', ').toUpperCase()})
                </span>
                {uploadedFiles.length === 0 ? (
                  <div 
                    onClick={() => fileInputRef.current?.click()} 
                    className="border border-dashed border-emerald-500/40 hover:border-emerald-500 bg-[#0A0A0A] rounded-xl p-4 text-center cursor-pointer transition-colors group"
                  >
                    <UploadCloud className="w-5 h-5 text-emerald-500 mx-auto mb-1 group-hover:scale-110 transition-transform"/>
                    <p className="text-xs text-slate-200 font-bold mt-1">Select Files or Drag & Drop</p>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      multiple={tool.capabilities?.allowMultipleUploads} 
                      accept={tool.accepts.map(ext => `.${ext}`).join(',')} 
                      onChange={handleFileChange} 
                      className="hidden" 
                    />
                  </div>
                ) : (
                  <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                    {uploadedFiles.map((f, i) => (
                      <div key={i} className="p-2 bg-[#0A0A0A] border border-emerald-500/50 rounded-lg flex items-center justify-between text-xs">
                        <span className="truncate text-white font-bold">{f.name}</span>
                        <button onClick={() => setUploadedFiles(prev => prev.filter((_, idx) => idx !== i))} className="text-rose-400 hover:bg-rose-500/20 p-1 rounded transition-colors">
                          <X className="w-3.5 h-3.5"/>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {validationError && (
              <div className="bg-rose-500/10 border border-rose-500/40 rounded-xl p-3 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <p className="text-xs text-rose-300 font-medium">{validationError}</p>
              </div>
            )}

            <button 
              onClick={handleExecute} 
              disabled={isRunning} 
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-extrabold text-xs uppercase rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-900/20 disabled:opacity-50"
            >
              {isRunning ? <RefreshCw className="w-4 h-4 animate-spin"/> : <Play className="w-4 h-4 fill-slate-950"/>}
              <span>{isRunning ? 'Processing...' : `Run ${tool.name}`}</span>
            </button>
          </div>

          {/* Right Workspace / Preview Panel */}
          <div className="md:col-span-7 bg-[#0A0A0A] border border-white/10 rounded-xl p-4 flex flex-col justify-between min-h-[350px]">
            <UniversalPreview 
              tool={tool} 
              isRunning={isRunning} 
              progressPercent={progressPercent} 
              textOutput={textOutput} 
              mediaOutputUrl={mediaOutputUrl} 
            />

            {!isRunning && tool.capabilities?.hasDownload && (textOutput || mediaOutputUrl) && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <button 
                  onClick={handleDownload} 
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-extrabold text-xs uppercase rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                  <Download className="w-4 h-4"/><span>Download Output</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
