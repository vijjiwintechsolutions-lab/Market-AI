import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Play, Sparkles, Download, RefreshCw, Sliders, UploadCloud, X, Paperclip, FileText, ChevronLeft, ChevronRight, Calculator, Copy, Layers, ZoomIn, ZoomOut, RotateCw, Image as ImageIcon, Music, Video, Code } from 'lucide-react';
import { AITool, ExecutionHistoryItem } from '../types';
import { apiService } from '../services/apiService';

interface FullWidthToolRunnerProps { tool: AITool; allTools: AITool[]; onBack: () => void; onSelectTool: (tool: AITool) => void; onSaveHistory: (item: ExecutionHistoryItem) => void; }

export function resolveToolConfig(tool: AITool) {
  const id = (tool.id || '').toLowerCase();
  const cat = (tool.category || '').toLowerCase();
  let showConvertDropdown = false, formatOptions: string[] = [], defaultExt = 'txt', uploadLabel = 'Upload Source File', showUpload = true, allowMultiple = false, actionButtonText = tool.name;

  if (id.includes('merge')) { formatOptions = ['PDF Document (.pdf)']; defaultExt = 'pdf'; uploadLabel = 'Upload PDFs to Merge'; allowMultiple = true; actionButtonText = 'Merge PDFs'; }
  else if (id.includes('split')) { formatOptions = ['PDF Document (.pdf)']; defaultExt = 'pdf'; uploadLabel = 'Upload PDF to Split'; actionButtonText = 'Split PDF'; }
  else if (id.includes('compress')) { formatOptions = ['PDF Document (.pdf)']; defaultExt = 'pdf'; uploadLabel = 'Upload PDF to Compress'; actionButtonText = 'Compress PDF'; }
  else if (id.includes('rotate')) { formatOptions = ['PDF Document (.pdf)']; defaultExt = 'pdf'; uploadLabel = 'Upload PDF to Rotate'; actionButtonText = 'Rotate PDF'; }
  else if (id.includes('delete')) { formatOptions = ['PDF Document (.pdf)']; defaultExt = 'pdf'; uploadLabel = 'Upload PDF Document'; actionButtonText = 'Delete Pages'; }
  else if (id.includes('watermark')) { formatOptions = ['PDF Document (.pdf)']; defaultExt = 'pdf'; uploadLabel = 'Upload PDF Document'; actionButtonText = 'Add Watermark'; }
  else if (id.includes('word') || id.includes('docx')) { showConvertDropdown = true; formatOptions = ['Word Document (.doc)', 'Word Document (.docx)']; defaultExt = 'doc'; uploadLabel = 'Upload PDF Document'; actionButtonText = 'Convert to Word'; }
  else if (id.includes('excel')) { showConvertDropdown = true; formatOptions = ['Excel Spreadsheet (.xlsx)', 'CSV File (.csv)']; defaultExt = 'xlsx'; uploadLabel = 'Upload PDF Document'; actionButtonText = 'Convert to Excel'; }
  else if (id.includes('jpg') || id.includes('png')) { showConvertDropdown = true; formatOptions = ['JPG Image (*.jpg)', 'PNG Image (*.png)']; defaultExt = 'jpg'; uploadLabel = 'Upload PDF Document'; actionButtonText = 'Convert to Image'; }
  else if (cat.includes('pdf')) { formatOptions = ['PDF Document (.pdf)']; defaultExt = 'pdf'; uploadLabel = 'Upload PDF Document'; actionButtonText = 'Process PDF'; }
  else if (cat.includes('calc')) { showUpload = false; formatOptions = ['Text Report (.txt)']; defaultExt = 'txt'; actionButtonText = 'Calculate Now'; }
  else { showUpload = false; formatOptions = ['Plain Text (.txt)']; defaultExt = 'txt'; actionButtonText = 'Execute Tool'; }

  return { showConvertDropdown, formatOptions, defaultExt, uploadLabel, showUpload, allowMultiple, actionButtonText };
}

function parseInlineBold(str: string) {
  return str.split(/(\*\*.*?\*\*)/g).map((part, i) => part.startsWith('**') ? <strong key={i} className="font-extrabold text-white">{part.slice(2, -2)}</strong> : part);
}

function renderCleanFormattedText(text: string) {
  if (!text) return null;
  return <div className="space-y-2 font-sans text-xs text-slate-200">{text.split('\n').map((line, idx) => {
    const trimmed = line.trim();
    if (trimmed === '---') return <hr key={idx} className="border-white/10 my-3" />;
    if (trimmed.startsWith('#')) return <div key={idx} className="text-sm font-extrabold text-emerald-400 mt-3 mb-2 flex items-center gap-2 border-b border-white/5 pb-1">{parseInlineBold(trimmed.replace(/^#+\s*/, ''))}</div>;
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) return <div key={idx} className="flex items-start gap-2 pl-2 py-0.5"><span className="text-emerald-400 font-bold">•</span><div>{parseInlineBold(trimmed.replace(/^[-*]\s*/, ''))}</div></div>;
    if (!trimmed) return <div key={idx} className="h-1" />;
    return <div key={idx} className="text-slate-300 py-0.5">{parseInlineBold(line)}</div>;
  })}</div>;
}

export const FullWidthToolRunner: React.FC<FullWidthToolRunnerProps> = ({ tool, onBack, onSaveHistory }) => {
  const config = resolveToolConfig(tool);
  const [inputValues, setInputValues] = useState<Record<string, any>>({});
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [outputResult, setOutputResult] = useState<string | null>(null);
  const [fileDownloadUrl, setFileDownloadUrl] = useState<string | null>(null);
  const [mediaResultUrl, setMediaResultUrl] = useState<string | null>(null);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [copied, setCopied] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const initial: Record<string, any> = {};
    tool.inputs.forEach((p) => { initial[p.id] = p.defaultValue || ''; });
    if (config.formatOptions.length > 0) initial['outputFormat'] = config.formatOptions[0];
    setInputValues(initial); setOutputResult(null); setFileDownloadUrl(null); setMediaResultUrl(null); setUploadedFiles([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [tool.id]);

  const selectedFormat = inputValues['outputFormat'] || '';
  let activeExt = config.defaultExt;
  if (selectedFormat.includes('.png')) activeExt = 'png'; else if (selectedFormat.includes('.jpg')) activeExt = 'jpg';
  else if (selectedFormat.includes('.docx')) activeExt = 'docx'; else if (selectedFormat.includes('.doc')) activeExt = 'doc';

  const handleExecute = async () => {
    if (config.showUpload && uploadedFiles.length === 0 && config.defaultExt === 'pdf') { alert("Please upload a file first!"); return; }
    setIsRunning(true); setOutputResult(null); setFileDownloadUrl(null); setMediaResultUrl(null); setProgressPercent(0);
    const start = Date.now();
    const progressInt = setInterval(() => setProgressPercent(p => (p < 94 ? p + Math.floor(Math.random() * 12) + 5 : p)), 100);

    try {
      const res = await apiService.executeTool({ tool, inputValues, file: uploadedFiles[0], files: uploadedFiles });
      clearInterval(progressInt); setProgressPercent(100);
      setTimeout(() => {
        if (res.success) {
          if (res.fileUrl) setFileDownloadUrl(res.fileUrl);
          if (res.imageUrl) setMediaResultUrl(res.imageUrl);
          setOutputResult(res.textOutput || String(res.output));
        }
        setExecutionTime(Date.now() - start); setIsRunning(false);
      }, 300);
    } catch (err) { clearInterval(progressInt); setIsRunning(false); }
  };

  const handleDownload = async () => {
    const targetUrl = fileDownloadUrl || mediaResultUrl; if (!targetUrl) return;
    let baseName = uploadedFiles.length > 0 ? (config.actionButtonText.includes('Merge') ? 'merged-document' : uploadedFiles[0].name.split('.')[0]) : tool.id;
    const link = document.createElement('a'); link.href = targetUrl; link.download = `${baseName}-output.${activeExt}`;
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E0E0E0] pb-12 font-mono">
      <div className="bg-[#151517] border-b border-white/10 px-4 py-2 flex items-center justify-between"><button onClick={onBack} className="flex items-center gap-1.5 px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded"><ArrowLeft className="w-3.5 h-3.5"/> Back</button></div>
      <div className="w-full px-4 sm:px-6 lg:px-8 pt-4 space-y-4">
        <div className="bg-[#151517] border border-white/10 rounded-lg px-4 py-2.5 flex items-center justify-between"><div className="flex items-center gap-3"><span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-600/30 text-emerald-300">PRO ENGINE</span><h1 className="text-base font-extrabold text-white">{tool.name}</h1></div>{executionTime && <span className="text-emerald-400 text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded font-bold">{executionTime}ms</span>}</div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <div className="lg:col-span-4 bg-[#151517] border border-white/10 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/10"><span className="text-xs font-bold uppercase text-emerald-400 flex items-center gap-1.5"><Sliders className="w-3.5 h-3.5"/> Parameters</span></div>
            {config.showConvertDropdown && (
              <div className="space-y-1"><label className="text-xs font-bold text-slate-200">Convert to:</label>
                <select value={inputValues['outputFormat']} onChange={e => setInputValues(p => ({...p, outputFormat: e.target.value}))} className="w-full px-2.5 py-2 bg-[#0A0A0A] border border-white/20 rounded text-xs text-white focus:border-emerald-500">{config.formatOptions.map(fmt => <option key={fmt} value={fmt}>{fmt}</option>)}</select>
              </div>
            )}
            {tool.inputs.map(p => (
              <div key={p.id} className="space-y-1"><label className="text-xs font-bold text-slate-200">{p.name}</label>
                {p.type === 'textarea' || p.type === 'text' ? <input type="text" value={inputValues[p.id] || ''} onChange={e => setInputValues(pr => ({...pr, [p.id]: e.target.value}))} className="w-full px-2.5 py-2 bg-[#0A0A0A] border border-white/10 rounded text-xs text-white focus:border-emerald-500" />
                : <select value={inputValues[p.id] || p.options?.[0]} onChange={e => setInputValues(pr => ({...pr, [p.id]: e.target.value}))} className="w-full px-2.5 py-2 bg-[#0A0A0A] border border-white/10 rounded text-xs text-white">{p.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}</select>}
              </div>
            ))}
            {config.showUpload && (
              <div className="pt-2 border-t border-white/10 space-y-1.5"><span className="text-[11px] font-bold text-slate-300 flex items-center gap-1"><Paperclip className="w-3.5 h-3.5 text-emerald-400"/> {config.uploadLabel}</span>
                {uploadedFiles.length === 0 ? (
                  <div onClick={() => fileInputRef.current?.click()} className="border border-dashed border-emerald-500/40 hover:border-emerald-500 bg-[#0A0A0A] rounded-lg p-3 text-center cursor-pointer">
                    <UploadCloud className="w-5 h-5 text-emerald-500 mx-auto mb-1"/><p className="text-xs text-slate-200 font-bold">Select File or Drag</p>
                    <input type="file" ref={fileInputRef} multiple={config.allowMultiple} onChange={e => e.target.files && setUploadedFiles(Array.from(e.target.files))} className="hidden" />
                  </div>
                ) : (
                  <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">{uploadedFiles.map((f, i) => <div key={i} className="p-2 bg-[#0A0A0A] border border-emerald-500/50 rounded flex items-center justify-between text-xs"><span className="truncate text-white font-bold">{f.name}</span><button onClick={() => setUploadedFiles(prev => prev.filter((_, idx) => idx !== i))} className="text-rose-400 p-1"><X className="w-3.5 h-3.5"/></button></div>)}</div>
                )}
              </div>
            )}
            <button onClick={handleExecute} disabled={isRunning} className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-extrabold text-xs uppercase rounded-lg flex items-center justify-center gap-2 mt-2">
              {isRunning ? <RefreshCw className="w-4 h-4 animate-spin"/> : <Play className="w-4 h-4 fill-slate-950"/>}<span>{isRunning ? 'Processing...' : config.actionButtonText}</span>
            </button>
          </div>
          <div className="lg:col-span-8 bg-[#151517] border border-white/10 rounded-lg p-4 min-h-[560px] flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex flex-wrap items-center justify-between pb-2 border-b border-white/10 mb-3 gap-2 bg-[#0A0A0A] p-2 rounded-lg border border-white/5"><span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5"/> Workspace</span></div>
              {!isRunning && !outputResult && uploadedFiles.length === 0 && !mediaResultUrl && (
                <div className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl flex flex-col items-center justify-center p-12 text-center min-h-[400px]">
                  {tool.category?.includes('calc') ? <Calculator className="w-12 h-12 text-emerald-500 mx-auto mb-2 animate-bounce"/> : <FileText className="w-12 h-12 text-emerald-500 mx-auto mb-2 animate-bounce"/>}
                  <h3 className="text-white font-bold text-sm">Ready for Processing</h3><p className="text-slate-400 text-xs mt-1">Configure inputs and click "{config.actionButtonText}".</p>
                </div>
              )}
              {isRunning && (
                <div className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl p-8 flex flex-col items-center justify-center min-h-[400px] space-y-4">
                  <div className="relative w-16 h-16 flex items-center justify-center"><div className="absolute inset-0 border-4 border-emerald-500/20 rounded-full"></div><div className="absolute inset-0 border-4 border-emerald-600 rounded-full animate-spin border-t-transparent"></div><span className="text-white font-extrabold text-xs">{progressPercent}%</span></div>
                  <div className="w-full max-w-xs space-y-1"><div className="flex justify-between text-xs font-bold text-slate-300"><span>Processing...</span><span>{progressPercent}%</span></div><div className="w-full h-2 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-emerald-600 transition-all duration-150" style={{ width: `${progressPercent}%` }}></div></div></div>
                </div>
              )}
              {mediaResultUrl && !isRunning && (
                <div className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl p-4 flex flex-col items-center justify-center min-h-[400px] max-h-[460px]"><img src={mediaResultUrl} alt="Output" className="max-h-[380px] w-auto object-contain rounded-lg" /></div>
              )}
              {outputResult && !mediaResultUrl && !isRunning && (
                <div className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl p-5 min-h-[400px] max-h-[440px] overflow-y-auto relative">
                  <button onClick={() => { navigator.clipboard.writeText(outputResult.replace(/^#+\s*/gm, '').replace(/\*\*/g, '').replace(/^[-*]\s*/gm, '• ').replace(/^---$/gm, '')); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="absolute top-3 right-3 px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-[10px] font-bold text-slate-300 flex items-center gap-1"><Copy className="w-3 h-3"/> {copied ? 'Copied!' : 'Copy'}</button>
                  {renderCleanFormattedText(outputResult)}
                </div>
              )}
            </div>
            {!isRunning && (fileDownloadUrl || mediaResultUrl) && (
              <div className="mt-3 pt-3 border-t border-white/10">
                <button onClick={handleDownload} className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-extrabold text-xs uppercase rounded-xl flex items-center justify-center gap-2"><Download className="w-4 h-4"/><span>Download Output (.${activeExt.toUpperCase()})</span></button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
