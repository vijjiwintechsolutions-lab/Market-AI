import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, Play, Sparkles, Download, RefreshCw, Sliders, 
  UploadCloud, X, Paperclip, FileText, Image as ImageIcon, Code,
  AlertCircle
} from 'lucide-react';
import { MuteToolConfig } from '../types/mute';
import { apiService } from '../services/apiService';
import { UniversalValidationEngine } from '../services/validationEngine';

interface UniversalToolEngineProps {
  tool: MuteToolConfig;
  onBack: () => void;
}

// Helper to render bold text from markdown (e.g., **text**)
function renderCleanFormattedText(text: string) {
  if (!text) return null;
  return (
    <div className="space-y-2 font-sans text-xs text-slate-200">
      {text.split('\n').map((line, idx) => {
        const trimmed = line.trim();
        if (trimmed === '---') return <hr key={idx} className="border-white/10 my-3" />;
        
        const formatInline = (str: string) => str.split(/(\*\*.*?\*\*)/g).map((part, i) => 
          part.startsWith('**') ? <strong key={i} className="font-extrabold text-white">{part.slice(2, -2)}</strong> : part
        );

        if (trimmed.startsWith('#')) return <div key={idx} className="text-sm font-extrabold text-emerald-400 mt-3 mb-2 flex items-center gap-2 border-b border-white/5 pb-1">{formatInline(trimmed.replace(/^#+\s*/, ''))}</div>;
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) return <div key={idx} className="flex items-start gap-2 pl-2 py-0.5"><span className="text-emerald-400 font-bold">•</span><div>{formatInline(trimmed.replace(/^[-*]\s*/, ''))}</div></div>;
        if (!trimmed) return <div key={idx} className="h-1" />;
        return <div key={idx} className="text-slate-300 py-0.5">{formatInline(line)}</div>;
      })}
    </div>
  );
}

export const UniversalToolEngine: React.FC<UniversalToolEngineProps> = ({ tool, onBack }) => {
  
  const [inputValues, setInputValues] = useState<Record<string, any>>(() => {
    const defaults: Record<string, any> = {};
    tool.options.forEach(opt => { defaults[opt.id] = opt.defaultValue; });
    if (tool.outputs.length > 0) defaults['outputFormat'] = tool.outputs[0];
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

  const requiresUpload = !tool.accepts.includes('prompt') || tool.accepts.length > 1;
  const isImageOutput = tool.outputs.some(out => ['jpg', 'png', 'webp', 'svg'].includes(out));

  // Reset state when tool changes
  useEffect(() => {
    setUploadedFiles([]);
    setTextOutput(null);
    setMediaOutputUrl(null);
    setFileDownloadUrl(null);
    setValidationError(null);
    setExecutionTime(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [tool.id]);

  const handleInputChange = (id: string, value: any) => setInputValues(prev => ({ ...prev, [id]: value }));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadedFiles(Array.from(e.target.files));
      setValidationError(null); // Clear error on new upload
    }
  };

  const handleExecute = async () => {
    setValidationError(null);
    
    // 🛡️ 1. MUTE UNIVERSAL VALIDATION ENGINE
    const validation = UniversalValidationEngine.validate(tool, inputValues, uploadedFiles);
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

    try {
      // 🚀 2. MUTE UNIVERSAL PROCESSING ROUTER
      const res = await apiService.execute({ tool, inputValues, files: uploadedFiles });
      
      clearInterval(progressInt);
      setProgressPercent(100);
      
      setTimeout(() => {
        if (res.success) {
          if (res.textOutput) setTextOutput(res.textOutput);
          if (res.mediaUrl) setMediaOutputUrl(res.mediaUrl);
          if (res.fileUrl) setFileDownloadUrl(res.fileUrl);
        } else {
          setValidationError(res.error || 'Execution failed.');
        }
        setExecutionTime(res.executionTimeMs);
        setIsRunning(false);
      }, 400);

    } catch (err: any) {
      clearInterval(progressInt);
      setIsRunning(false);
      setValidationError(err.message || 'An unexpected runtime error occurred.');
    }
  };

  const handleDownload = () => {
    const targetUrl = fileDownloadUrl || mediaOutputUrl;
    if (!targetUrl) return;
    
    const activeExt = inputValues['outputFormat'] || tool.outputs[0] || 'pdf';
    let baseName = tool.id;
    if (uploadedFiles.length > 0) {
      baseName = uploadedFiles[0].name.substring(0, uploadedFiles[0].name.lastIndexOf('.')) || tool.id;
    }
    
    const link = document.createElement('a'); 
    link.href = targetUrl; 
    link.download = `${baseName}-output.${activeExt}`;
    document.body.appendChild(link); 
    link.click(); 
    document.body.removeChild(link);
  };

  const renderDynamicOptions = () => (
    <div className="space-y-4">
      {tool.outputs.length > 1 && (
        <div className="space-y-1"><label className="text-xs font-bold text-slate-200">Output Format:</label>
          <select value={inputValues['outputFormat']} onChange={e => handleInputChange('outputFormat', e.target.value)} className="w-full px-2.5 py-2 bg-[#0A0A0A] border border-white/20 rounded text-xs text-white focus:border-emerald-500 font-bold uppercase">
            {tool.outputs.map(fmt => <option key={fmt} value={fmt}>{fmt}</option>)}
          </select>
        </div>
      )}
      {tool.options.map(opt => (
        <div key={opt.id} className="space-y-1">
          <label className="text-xs font-bold text-slate-200 flex justify-between">{opt.label} {opt.type === 'slider' && <span className="text-emerald-400">{inputValues[opt.id]}</span>}</label>
          {opt.type === 'text' && <input type="text" value={inputValues[opt.id]} onChange={e => handleInputChange(opt.id, e.target.value)} className="w-full px-2.5 py-2 bg-[#0A0A0A] border border-white/10 rounded text-xs text-white focus:border-emerald-500" />}
          {opt.type === 'textarea' && <textarea rows={4} value={inputValues[opt.id]} onChange={e => handleInputChange(opt.id, e.target.value)} className="w-full px-2.5 py-2 bg-[#0A0A0A] border border-white/10 rounded text-xs text-white focus:border-emerald-500 resize-none" placeholder={`Enter ${opt.label.toLowerCase()}...`} />}
          {opt.type === 'select' && opt.options && <select value={inputValues[opt.id]} onChange={e => handleInputChange(opt.id, e.target.value)} className="w-full px-2.5 py-2 bg-[#0A0A0A] border border-white/10 rounded text-xs text-white focus:border-emerald-500">{opt.options.map(o => <option key={o} value={o}>{o}</option>)}</select>}
          {opt.type === 'slider' && <input type="range" min={opt.min} max={opt.max} step={opt.step} value={inputValues[opt.id]} onChange={e => handleInputChange(opt.id, Number(e.target.value))} className="w-full accent-emerald-500" />}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E0E0E0] pb-12 font-mono">
      <div className="bg-[#151517] border-b border-white/10 px-4 py-2 flex items-center justify-between"><button onClick={onBack} className="flex items-center gap-1.5 px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded transition-colors"><ArrowLeft className="w-3.5 h-3.5"/> Back</button></div>
      <div className="w-full px-4 sm:px-6 lg:px-8 pt-4 space-y-4">
        <div className="bg-[#151517] border border-white/10 rounded-lg px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded border ${tool.engine === 'ai' ? 'bg-purple-600/30 text-purple-300 border-purple-500/40' : 'bg-emerald-600/30 text-emerald-300 border-emerald-500/40'}`}>{tool.engine.toUpperCase()} ENGINE</span>
            <h1 className="text-base font-extrabold text-white">{tool.name}</h1>
          </div>
          {executionTime && <span className="text-emerald-400 text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded font-bold">{executionTime}ms</span>}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <div className="lg:col-span-4 bg-[#151517] border border-white/10 rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10"><span className="text-xs font-bold uppercase text-emerald-400 flex items-center gap-1.5"><Sliders className="w-3.5 h-3.5"/> Configuration</span></div>
            {renderDynamicOptions()}
            {requiresUpload && (
              <div className="pt-3 border-t border-white/10 space-y-2">
                <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1"><Paperclip className="w-3.5 h-3.5 text-emerald-400"/> Source Files ({tool.accepts.join(', ').toUpperCase()})</span>
                {uploadedFiles.length === 0 ? (
                  <div onClick={() => fileInputRef.current?.click()} className="border border-dashed border-emerald-500/40 hover:border-emerald-500 bg-[#0A0A0A] rounded-lg p-4 text-center cursor-pointer transition-colors group">
                    <UploadCloud className="w-5 h-5 text-emerald-500 mx-auto mb-1 group-hover:scale-110 transition-transform"/>
                    <p className="text-xs text-slate-200 font-bold mt-2">Select Files or Drag & Drop</p>
                    <input type="file" ref={fileInputRef} multiple={tool.capabilities.allowMultipleUploads} accept={tool.accepts.map(ext => `.${ext}`).join(',')} onChange={handleFileChange} className="hidden" />
                  </div>
                ) : (
                  <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                    {uploadedFiles.map((f, i) => (
                      <div key={i} className="p-2 bg-[#0A0A0A] border border-emerald-500/50 rounded flex items-center justify-between text-xs">
                        <span className="truncate text-white font-bold">{f.name}</span>
                        <button onClick={() => setUploadedFiles(prev => prev.filter((_, idx) => idx !== i))} className="text-rose-400 hover:bg-rose-500/20 p-1 rounded transition-colors"><X className="w-3.5 h-3.5"/></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {validationError && (
              <div className="bg-rose-500/10 border border-rose-500/40 rounded p-3 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <p className="text-xs text-rose-300 font-medium">{validationError}</p>
              </div>
            )}

            <button onClick={handleExecute} disabled={isRunning} className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-extrabold text-xs uppercase rounded-lg flex items-center justify-center gap-2 mt-4 transition-all transform active:scale-95 shadow-lg shadow-emerald-900/20 disabled:opacity-50 disabled:pointer-events-none">
              {isRunning ? <RefreshCw className="w-4 h-4 animate-spin"/> : <Play className="w-4 h-4 fill-slate-950"/>}
              <span>{isRunning ? 'Processing...' : `Run ${tool.name}`}</span>
            </button>
          </div>

          <div className="lg:col-span-8 bg-[#151517] border border-white/10 rounded-lg p-4 min-h-[560px] flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-3 bg-[#0A0A0A] p-2 rounded-lg border border-white/5"><span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5"/> Universal Workspace</span></div>
              {!isRunning && !textOutput && !mediaOutputUrl && (
                <div className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl flex flex-col items-center justify-center p-12 text-center min-h-[400px]">
                  {isImageOutput ? <ImageIcon className="w-12 h-12 text-emerald-500 mx-auto mb-3 opacity-50"/> : <Code className="w-12 h-12 text-emerald-500 mx-auto mb-3 opacity-50"/>}
                  <h3 className="text-white font-bold text-sm">System Ready</h3><p className="text-slate-400 text-xs mt-1">Configure parameters on the left and execute the engine.</p>
                </div>
              )}
              {isRunning && (
                <div className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl p-8 flex flex-col items-center justify-center min-h-[400px] space-y-5">
                  <div className="relative w-16 h-16 flex items-center justify-center"><div className="absolute inset-0 border-4 border-emerald-500/20 rounded-full"></div><div className="absolute inset-0 border-4 border-emerald-600 rounded-full animate-spin border-t-transparent"></div><span className="text-white font-extrabold text-xs">{progressPercent}%</span></div>
                  <div className="w-full max-w-xs space-y-1.5"><div className="flex justify-between text-xs font-bold text-slate-300 uppercase tracking-wider"><span>Executing Routine</span><span>{progressPercent}%</span></div><div className="w-full h-2 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-emerald-600 transition-all duration-150" style={{ width: `${progressPercent}%` }}></div></div></div>
                </div>
              )}
              {mediaOutputUrl && !isRunning && (
                <div className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl p-4 flex flex-col items-center justify-center min-h-[400px] max-h-[460px]">
                  <img src={mediaOutputUrl} alt="Output Result" className="max-h-[380px] w-auto object-contain rounded-lg border border-white/10 shadow-2xl" />
                </div>
              )}
              {textOutput && !isRunning && (
                <div className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl p-5 min-h-[400px] max-h-[440px] overflow-y-auto">
                  {renderCleanFormattedText(textOutput)}
                </div>
              )}
            </div>
            {!isRunning && tool.capabilities.hasDownload && (textOutput || mediaOutputUrl) && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <button onClick={handleDownload} className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-extrabold text-xs uppercase rounded-xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-emerald-900/30">
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
