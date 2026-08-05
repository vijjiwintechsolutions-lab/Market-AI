import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, Play, Sparkles, Check, Download, RefreshCw, Sliders, UploadCloud, X, Paperclip, FileText,
  ChevronLeft, ChevronRight, Calculator, Copy, Layers, ZoomIn, ZoomOut, RotateCw
} from 'lucide-react';
import { AITool, ExecutionHistoryItem } from '../types';
import { apiService } from '../services/apiService';

interface FullWidthToolRunnerProps {
  tool: AITool;
  allTools: AITool[];
  onBack: () => void;
  onSelectTool: (tool: AITool) => void;
  onSaveHistory: (item: ExecutionHistoryItem) => void;
  favoriteIds: string[];
  onToggleFavorite: (id: string) => void;
  comparedTools: AITool[];
  onToggleCompare: (tool: AITool) => void;
}

export function resolveToolConfig(tool: AITool) {
  const name = (tool.name || '').toLowerCase();
  const id = (tool.id || '').toLowerCase();
  const cat = (tool.category || '').toLowerCase();

  let showConvertDropdown = false;
  let formatOptions: string[] = [];
  let defaultExt = 'pdf';
  let uploadLabel = 'Upload Source File';
  let showUpload = true;
  let allowMultiple = false;
  let actionButtonText = tool.name;

  if (name.includes('merge') || id.includes('merge')) {
    formatOptions = ['PDF Document (.pdf)']; defaultExt = 'pdf'; uploadLabel = 'Upload PDFs to Merge (Select Multiple)'; allowMultiple = true; actionButtonText = 'Merge PDFs';
  } else if (name.includes('split') || id.includes('split')) {
    formatOptions = ['PDF Document (.pdf)']; defaultExt = 'pdf'; uploadLabel = 'Upload PDF to Split'; actionButtonText = 'Split PDF';
  } else if (name.includes('compress') || name.includes('shrink') || id.includes('compress')) {
    formatOptions = ['PDF Document (.pdf)']; defaultExt = 'pdf'; uploadLabel = 'Upload PDF to Compress'; actionButtonText = 'Compress PDF';
  } else if (name.includes('rotate') || id.includes('rotate')) {
    formatOptions = ['PDF Document (.pdf)']; defaultExt = 'pdf'; uploadLabel = 'Upload PDF to Rotate'; actionButtonText = 'Rotate PDF';
  } else if (name.includes('delete') || id.includes('delete')) {
    formatOptions = ['PDF Document (.pdf)']; defaultExt = 'pdf'; uploadLabel = 'Upload PDF Document'; actionButtonText = 'Delete Pages';
  } else if (name.includes('word') || id.includes('word') || name.includes('docx') || id.includes('docx')) {
    showConvertDropdown = true; formatOptions = ['Word Document (.doc)', 'Word Document (.docx)']; defaultExt = 'doc'; uploadLabel = 'Upload PDF Document'; actionButtonText = 'Convert to Word';
  } else if (name.includes('excel') || name.includes('xls') || name.includes('csv') || id.includes('excel')) {
    showConvertDropdown = true; formatOptions = ['Excel Spreadsheet (.xlsx)', 'CSV File (.csv)']; defaultExt = 'xlsx'; uploadLabel = 'Upload PDF Document'; actionButtonText = 'Convert to Excel';
  } else if (name.includes('jpg') || name.includes('png') || id.includes('jpg') || id.includes('png')) {
    showConvertDropdown = true; formatOptions = ['JPG Image (*.jpg)', 'PNG Image (*.png)', 'WEBP (*.webp)']; defaultExt = 'jpg'; uploadLabel = 'Upload PDF Document'; actionButtonText = 'Convert to Image';
  } else if (cat.includes('pdf') || cat.includes('document')) {
    formatOptions = ['PDF Document (.pdf)']; defaultExt = 'pdf'; uploadLabel = 'Upload PDF Document'; actionButtonText = 'Process PDF';
  } else if (cat.includes('calc') || cat.includes('finance') || name.includes('calculator') || name.includes('emi')) {
    showUpload = false; formatOptions = ['Text Report (.txt)']; defaultExt = 'txt'; actionButtonText = 'Calculate Now';
  } else {
    showUpload = false; formatOptions = ['Plain Text (.txt)']; defaultExt = 'txt'; actionButtonText = 'Execute Tool';
  }

  return { showConvertDropdown, formatOptions, defaultExt, uploadLabel, showUpload, allowMultiple, actionButtonText };
}

function parseInlineBold(str: string) {
  const parts = str.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={i} className="font-extrabold text-white">{part.slice(2, -2)}</strong>;
    return part;
  });
}

function renderCleanFormattedText(text: string) {
  if (!text) return null;
  const lines = text.split('\n');
  return (
    <div className="space-y-2 font-sans text-xs text-slate-200">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (trimmed === '---') return <hr key={idx} className="border-white/10 my-3" />;
        if (trimmed.startsWith('#')) return <div key={idx} className="text-sm font-extrabold text-emerald-400 mt-3 mb-2 flex items-center gap-2 border-b border-white/5 pb-1">{parseInlineBold(trimmed.replace(/^#+\s*/, ''))}</div>;
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) return <div key={idx} className="flex items-start gap-2 pl-2 py-0.5 text-slate-200 hover:bg-white/5 rounded transition-colors"><span className="text-emerald-400 font-bold">•</span><div>{parseInlineBold(trimmed.replace(/^[-*]\s*/, ''))}</div></div>;
        if (!trimmed) return <div key={idx} className="h-1" />;
        return <div key={idx} className="text-slate-300 py-0.5">{parseInlineBold(line)}</div>;
      })}
    </div>
  );
}

export const FullWidthToolRunner: React.FC<FullWidthToolRunnerProps> = ({
  tool, onBack, onSaveHistory, onSelectTool, allTools
}) => {
  const config = resolveToolConfig(tool);
  const isCalc = tool.category?.toLowerCase().includes('calc') || tool.name.toLowerCase().includes('emi');

  const [inputValues, setInputValues] = useState<Record<string, any>>({});
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [outputResult, setOutputResult] = useState<string | null>(null);
  const [fileDownloadUrl, setFileDownloadUrl] = useState<string | null>(null);
  const [mediaResultUrl, setMediaResultUrl] = useState<string | null>(null);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  const [numPages, setNumPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoomScale, setZoomScale] = useState<number>(1.0);
  const [rotationAngle, setRotationAngle] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const initial: Record<string, any> = {};
    tool.inputs.forEach((p) => { initial[p.id] = p.defaultValue || ''; });
    if (config.formatOptions.length > 0) initial['outputFormat'] = config.formatOptions[0];
    setInputValues(initial);
    setOutputResult(null); setFileDownloadUrl(null); setMediaResultUrl(null);
    setUploadedFiles([]); setCurrentPage(1); setNumPages(1); setZoomScale(1.0); setRotationAngle(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (window.history && window.history.pushState) window.history.pushState({}, '', `/tools/${tool.id}`);
  }, [tool.id]);

  const selectedFormat = inputValues['outputFormat'] || config.formatOptions[0] || '';
  let activeExt = config.defaultExt;
  if (selectedFormat.toLowerCase().includes('.png')) activeExt = 'png';
  else if (selectedFormat.toLowerCase().includes('.jpg') || selectedFormat.toLowerCase().includes('.jpeg')) activeExt = 'jpg';
  else if (selectedFormat.toLowerCase().includes('.docx')) activeExt = 'docx';
  else if (selectedFormat.toLowerCase().includes('.doc')) activeExt = 'doc';

  // LIVE PDF PREVIEW ENGINE
  useEffect(() => {
    if (uploadedFiles.length === 0) return;
    const firstFile = uploadedFiles[0];
    if (firstFile.type !== 'application/pdf' && !firstFile.name.toLowerCase().endsWith('.pdf')) return;

    const renderPdfPage = async () => {
      try {
        if (!(window as any).pdfjsLib) {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
          document.head.appendChild(script);
          await new Promise((res) => (script.onload = res));
          (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        }
        const pdf = await (window as any).pdfjsLib.getDocument({ data: new Uint8Array(await firstFile.arrayBuffer()) }).promise;
        setNumPages(pdf.numPages);
        const page = await pdf.getPage(currentPage);
        const canvas = canvasRef.current;
        if (!canvas) return;
        const viewport = page.getViewport({ scale: zoomScale, rotation: rotationAngle });
        canvas.height = viewport.height; canvas.width = viewport.width;
        await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
      } catch (err) { }
    };
    renderPdfPage();
  }, [uploadedFiles, currentPage, zoomScale, rotationAngle, outputResult]);

  const handleInputChange = (id: string, value: any) => setInputValues((prev) => ({ ...prev, [id]: value }));
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) setUploadedFiles(Array.from(e.target.files));
  };

  const handleExecute = async () => {
    if (config.showUpload && uploadedFiles.length === 0) { alert("Please upload a file first!"); return; }
    setIsRunning(true); setOutputResult(null); setFileDownloadUrl(null); setMediaResultUrl(null); setProgressPercent(0);
    const startTime = Date.now();
    const progressInt = setInterval(() => setProgressPercent((p) => (p < 94 ? p + Math.floor(Math.random() * 12) + 5 : p)), 100);

    try {
      // 🚀 PASSING BOTH 'file' (first file) AND 'files' (array of all files for Merge)
      const res = await apiService.executeTool({ tool, inputValues, file: uploadedFiles[0], files: uploadedFiles });
      clearInterval(progressInt); setProgressPercent(100);
      setExecutionTime(res.executionTimeMs || Date.now() - startTime);
      
      setTimeout(() => {
        if (res.success) {
          if (res.fileUrl) setFileDownloadUrl(res.fileUrl);
          if (res.imageUrl) setMediaResultUrl(res.imageUrl);
          setOutputResult(res.textOutput || String(res.output));
          onSaveHistory({ id: `hist-${Date.now()}`, toolId: tool.id, toolName: tool.name, prompt: tool.name, output: String(res.output).substring(0, 300), timestamp: new Date().toLocaleTimeString(), executionTimeMs: res.executionTimeMs, outputType: tool.outputType });
        }
        setIsRunning(false);
      }, 300);
    } catch (err) { clearInterval(progressInt); setIsRunning(false); }
  };

  const handleDirectDownloadFile = async () => {
    const targetUrl = fileDownloadUrl || mediaResultUrl;
    if (!targetUrl) return;
    setIsDownloading(true);

    let baseName = tool.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    if (uploadedFiles.length > 0) {
      const originalName = uploadedFiles[0].name;
      baseName = config.actionButtonText.includes('Merge') ? 'merged-document' : originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
    }
    const filename = `${baseName}.${activeExt}`;

    try {
      const response = await fetch(targetUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a'); link.href = blobUrl; link.download = filename;
      document.body.appendChild(link); link.click(); document.body.removeChild(link); window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      const link = document.createElement('a'); link.href = targetUrl; link.download = filename;
      document.body.appendChild(link); link.click(); document.body.removeChild(link);
    } finally { setIsDownloading(false); }
  };

  const handleCopyCleanText = () => {
    if (!outputResult) return;
    const cleanText = outputResult.replace(/^#+\s*/gm, '').replace(/\*\*/g, '').replace(/^[-*]\s*/gm, '• ').replace(/^---$/gm, '');
    navigator.clipboard.writeText(cleanText); setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const isUploadedPdf = uploadedFiles.length > 0 && (uploadedFiles[0].type === 'application/pdf' || uploadedFiles[0].name.toLowerCase().endsWith('.pdf'));

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E0E0E0] pb-12 font-mono">
      <div className="bg-[#151517] border-b border-white/10 px-4 py-2 flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-1.5 px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold rounded cursor-pointer">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Marketplace
        </button>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 pt-4 space-y-4">
        <div className="bg-[#151517] border border-white/10 rounded-lg px-4 py-2.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-600/30 text-emerald-300 border border-emerald-500/40">PRO ENGINE</span>
            <h1 className="text-base font-extrabold text-white">{tool.name}</h1>
          </div>
          {executionTime && <span className="text-emerald-400 text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">{executionTime}ms</span>}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* LEFT PANEL */}
          <div className="lg:col-span-4 bg-[#151517] border border-white/10 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-xs font-bold uppercase text-emerald-400 flex items-center gap-1.5"><Sliders className="w-3.5 h-3.5" /> Parameters</span>
            </div>

            {config.showConvertDropdown && config.formatOptions.length > 0 && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-200 block">Convert to:</label>
                <select value={inputValues['outputFormat']} onChange={(e) => handleInputChange('outputFormat', e.target.value)} className="w-full px-2.5 py-2 bg-[#0A0A0A] border border-white/20 rounded text-xs text-white focus:border-emerald-500 font-bold">
                  {config.formatOptions.map((fmt) => <option key={fmt} value={fmt}>{fmt}</option>)}
                </select>
              </div>
            )}

            {tool.inputs.map((param) => (
              <div key={param.id} className="space-y-1">
                <label className="text-xs font-bold text-slate-200 block">{param.name}</label>
                {param.type === 'textarea' || param.type === 'text' ? (
                  <input type="text" value={inputValues[param.id] || ''} onChange={(e) => handleInputChange(param.id, e.target.value)} className="w-full px-2.5 py-2 bg-[#0A0A0A] border border-white/10 rounded text-xs text-white focus:border-emerald-500" />
                ) : param.type === 'select' ? (
                  <select value={inputValues[param.id] || param.options?.[0]} onChange={(e) => handleInputChange(param.id, e.target.value)} className="w-full px-2.5 py-2 bg-[#0A0A0A] border border-white/10 rounded text-xs text-white focus:border-emerald-500 font-mono">
                    {param.options?.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                ) : null}
              </div>
            ))}

            {config.showUpload && (
              <div className="pt-2 border-t border-white/10 space-y-1.5">
                <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1"><Paperclip className="w-3.5 h-3.5 text-emerald-400" /> {config.uploadLabel}</span>
                {uploadedFiles.length === 0 ? (
                  <div onClick={() => fileInputRef.current?.click()} className="border border-dashed border-emerald-500/40 hover:border-emerald-500 bg-[#0A0A0A] rounded-lg p-3 text-center cursor-pointer transition-all">
                    <UploadCloud className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
                    <p className="text-xs text-slate-200 font-bold">Select File(s) or Drag Here</p>
                    <input type="file" ref={fileInputRef} multiple={config.allowMultiple} onChange={handleFileChange} className="hidden" />
                  </div>
                ) : (
                  <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                    {uploadedFiles.map((f, i) => (
                      <div key={i} className="p-2 bg-[#0A0A0A] border border-emerald-500/50 rounded flex items-center justify-between text-xs">
                        <span className="truncate text-white font-bold">{f.name}</span>
                        <button onClick={() => { setUploadedFiles(prev => prev.filter((_, idx) => idx !== i)); setFileDownloadUrl(null); setOutputResult(null); }} className="text-rose-400 p-1 hover:bg-rose-500/20 rounded cursor-pointer"><X className="w-3.5 h-3.5" /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <button onClick={handleExecute} disabled={isRunning} className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-extrabold text-xs uppercase rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer mt-2">
              {isRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-slate-950" />}
              <span>{isRunning ? 'Processing...' : config.actionButtonText}</span>
            </button>
          </div>

          {/* RIGHT PANEL */}
          <div className="lg:col-span-8 bg-[#151517] border border-white/10 rounded-lg p-4 min-h-[560px] flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex flex-wrap items-center justify-between pb-2 border-b border-white/10 mb-3 gap-2 bg-[#0A0A0A] p-2 rounded-lg border border-white/5">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Live Interactive Workspace
                </span>
                {isUploadedPdf && (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded border border-white/10 text-xs text-white">
                      <button disabled={currentPage <= 1} onClick={() => setCurrentPage(p => p - 1)} className="p-0.5 hover:bg-white/10 rounded disabled:opacity-30 cursor-pointer"><ChevronLeft className="w-3.5 h-3.5" /></button>
                      <span className="font-bold text-[11px] px-1">Page {currentPage} of {numPages}</span>
                      <button disabled={currentPage >= numPages} onClick={() => setCurrentPage(p => p + 1)} className="p-0.5 hover:bg-white/10 rounded disabled:opacity-30 cursor-pointer"><ChevronRight className="w-3.5 h-3.5" /></button>
                    </div>
                    <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded border border-white/10 text-xs text-white">
                      <button onClick={() => setZoomScale(z => Math.max(0.5, z - 0.2))} className="p-0.5 hover:bg-white/10 rounded cursor-pointer"><ZoomOut className="w-3.5 h-3.5" /></button>
                      <span className="font-bold text-[11px] px-1">{Math.round(zoomScale * 100)}%</span>
                      <button onClick={() => setZoomScale(z => Math.min(2.5, z + 0.2))} className="p-0.5 hover:bg-white/10 rounded cursor-pointer"><ZoomIn className="w-3.5 h-3.5" /></button>
                    </div>
                    <button onClick={() => setRotationAngle(r => (r + 90) % 360)} className="p-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-white cursor-pointer"><RotateCw className="w-3.5 h-3.5" /></button>
                  </div>
                )}
              </div>

              {!isRunning && !outputResult && uploadedFiles.length === 0 && !mediaResultUrl && (
                <div className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl flex flex-col items-center justify-center p-12 text-center min-h-[400px]">
                  {config.actionButtonText.includes('Merge') ? <Layers className="w-12 h-12 text-emerald-500 mx-auto mb-2 animate-bounce" /> :
                   isCalc ? <Calculator className="w-12 h-12 text-emerald-500 mx-auto mb-2 animate-bounce" /> : <FileText className="w-12 h-12 text-emerald-500 mx-auto mb-2 animate-bounce" />}
                  <h3 className="text-white font-bold text-sm">Ready for Processing</h3>
                  <p className="text-slate-400 text-xs mt-1">Configure inputs on the left and click "{config.actionButtonText}".</p>
                </div>
              )}

              {isRunning && (
                <div className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl p-8 flex flex-col items-center justify-center min-h-[400px] space-y-4">
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    <div className="absolute inset-0 border-4 border-emerald-500/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-emerald-600 rounded-full animate-spin border-t-transparent"></div>
                    <span className="text-white font-extrabold text-xs">{progressPercent}%</span>
                  </div>
                  <div className="w-full max-w-xs space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-300"><span>{config.actionButtonText}...</span><span>{progressPercent}%</span></div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-emerald-600 transition-all duration-150" style={{ width: `${progressPercent}%` }}></div></div>
                  </div>
                </div>
              )}

              {mediaResultUrl && !isUploadedPdf && !isRunning && (
                <div className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl p-4 flex flex-col items-center justify-center min-h-[400px] max-h-[460px]">
                  <img src={mediaResultUrl} alt="Output Preview" className="max-h-[380px] w-auto object-contain rounded-lg border border-white/10 shadow-2xl" />
                </div>
              )}

              {isUploadedPdf && !isRunning && (
                <div className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl p-3 flex flex-col items-center justify-center overflow-auto min-h-[400px] max-h-[460px]">
                  <canvas ref={canvasRef} className="max-w-full shadow-2xl rounded border border-white/10 bg-white" />
                </div>
              )}

              {outputResult && !isUploadedPdf && !mediaResultUrl && !isRunning && (
                <div className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl p-5 min-h-[400px] max-h-[440px] overflow-y-auto relative">
                  <button onClick={handleCopyCleanText} className="absolute top-3 right-3 px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-[10px] font-bold text-slate-300 flex items-center gap-1 cursor-pointer"><Copy className="w-3 h-3" /> {copied ? 'Copied!' : 'Copy'}</button>
                  {renderCleanFormattedText(outputResult)}
                </div>
              )}
            </div>

            {!isRunning && (fileDownloadUrl || mediaResultUrl) && (
              <div className="mt-3 pt-3 border-t border-white/10">
                <button onClick={handleDirectDownloadFile} disabled={isDownloading} className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-extrabold text-xs uppercase rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-xl shadow-emerald-600/30 transition-all">
                  {isDownloading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  <span>{isDownloading ? 'Downloading File...' : `Download Output (.${activeExt.toUpperCase()})`}</span>
                </button>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
};
