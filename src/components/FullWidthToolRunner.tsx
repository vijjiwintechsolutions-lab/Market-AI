import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, Play, Sparkles, Check, Download, RefreshCw, Sliders, UploadCloud, X, Paperclip, FileText,
  ZoomIn, ZoomOut, RotateCw, ChevronLeft, ChevronRight, Code, Calculator, Music, Video, Image as ImageIcon, Copy, FileSpreadsheet
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

// UNIVERSAL SMART PATTERN RESOLVER FOR ALL 800+ TOOLS
export function resolveToolConfig(tool: AITool) {
  const name = (tool.name || '').toLowerCase();
  const id = (tool.id || '').toLowerCase();
  const cat = (tool.category || '').toLowerCase();
  const outType = (tool.outputType || '').toLowerCase();

  let showConvertDropdown = true;
  let formatOptions: string[] = [];
  let defaultExt = 'pdf';
  let uploadLabel = 'Upload Source File';
  let showUpload = true;
  let actionButtonText = tool.name;

  // 1. PDF TO WORD / DOC
  if (name.includes('word') || name.includes('doc') || id.includes('word') || id.includes('doc')) {
    showConvertDropdown = true;
    formatOptions = ['Word Document (.doc)', 'Word Document (.docx)'];
    defaultExt = 'doc';
    uploadLabel = 'Upload PDF Document';
    actionButtonText = 'Convert to Word';
  }
  // 2. PDF TO EXCEL / CSV
  else if (name.includes('excel') || name.includes('xls') || name.includes('csv') || id.includes('excel')) {
    showConvertDropdown = true;
    formatOptions = ['Excel Spreadsheet (.xlsx)', 'CSV File (.csv)'];
    defaultExt = 'xlsx';
    uploadLabel = 'Upload PDF Document';
    actionButtonText = 'Convert to Excel';
  }
  // 3. PDF TO PPT
  else if (name.includes('ppt') || name.includes('powerpoint') || id.includes('ppt')) {
    showConvertDropdown = true;
    formatOptions = ['PowerPoint Presentation (.pptx)'];
    defaultExt = 'pptx';
    uploadLabel = 'Upload PDF Document';
    actionButtonText = 'Convert to PPT';
  }
  // 4. PDF TO JPG / IMAGE
  else if (name.includes('jpg') || name.includes('png') || name.includes('image') || id.includes('jpg')) {
    showConvertDropdown = true;
    formatOptions = ['JPG Image (*.jpg)', 'PNG Image (*.png)', 'WEBP (*.webp)'];
    defaultExt = 'jpg';
    uploadLabel = 'Upload PDF Document';
    actionButtonText = 'Convert to JPG';
  }
  // 5. CONVERT TO PDF
  else if (name.includes('to pdf') || id.includes('to-pdf')) {
    showConvertDropdown = false;
    formatOptions = ['PDF Document (.pdf)'];
    defaultExt = 'pdf';
    uploadLabel = 'Upload Document to Convert';
    actionButtonText = 'Convert to PDF';
  }
  // 6. COMPRESS PDF
  else if (name.includes('compress') || name.includes('shrink') || id.includes('compress')) {
    showConvertDropdown = false;
    formatOptions = ['PDF Document (.pdf)'];
    defaultExt = 'pdf';
    uploadLabel = 'Upload PDF to Compress';
    actionButtonText = 'Compress PDF';
  }
  // 7. OTHER PDF OPERATIONS
  else if (cat.includes('pdf') || cat.includes('document')) {
    showConvertDropdown = false;
    formatOptions = ['PDF Document (.pdf)'];
    defaultExt = 'pdf';
    uploadLabel = 'Upload PDF Document';
    if (name.includes('rotate')) actionButtonText = 'Rotate PDF';
    else if (name.includes('delete')) actionButtonText = 'Delete Pages';
    else if (name.includes('merge')) actionButtonText = 'Merge PDFs';
    else if (name.includes('split')) actionButtonText = 'Split PDF';
    else actionButtonText = 'Process PDF';
  }
  // 8. IMAGE UTILITIES & AI ART
  else if (outType === 'image' || cat.includes('image')) {
    showConvertDropdown = true;
    formatOptions = ['JPG Photo (.jpg)', 'PNG Image (.png)', 'WEBP (.webp)'];
    defaultExt = 'jpg';
    uploadLabel = 'Upload Image (Optional)';
    actionButtonText = name.includes('generator') ? 'Generate AI Image' : 'Process Image';
  }
  // 9. VIDEO TOOLS
  else if (outType === 'video' || cat.includes('video')) {
    showConvertDropdown = true;
    formatOptions = ['MP4 Video (.mp4)', 'WEBM Video (.webm)', 'GIF Animation (.gif)'];
    defaultExt = 'mp4';
    uploadLabel = 'Upload Video File';
    actionButtonText = 'Process Video';
  }
  // 10. AUDIO & VOICE
  else if (outType === 'audio' || cat.includes('audio') || cat.includes('voice')) {
    showConvertDropdown = true;
    formatOptions = ['MP3 Audio (.mp3)', 'WAV Audio (.wav)'];
    defaultExt = 'mp3';
    uploadLabel = 'Upload Audio File';
    actionButtonText = name.includes('speech') || name.includes('tts') ? 'Generate Voiceover' : 'Process Audio';
  }
  // 11. CALCULATORS & FINANCE
  else if (cat.includes('calc') || cat.includes('finance')) {
    showConvertDropdown = false;
    showUpload = false;
    formatOptions = ['Text Report (.txt)', 'CSV Data (.csv)'];
    defaultExt = 'txt';
    actionButtonText = 'Calculate Now';
  }
  // 12. CODING & WEB
  else if (cat.includes('code') || cat.includes('web')) {
    showConvertDropdown = false;
    showUpload = false;
    formatOptions = ['Formatted Code (.json/.js)', 'Plain Text (.txt)'];
    defaultExt = name.includes('json') ? 'json' : 'js';
    actionButtonText = 'Format & Validate Code';
  }
  // 13. TEXT & MARKETING
  else {
    showConvertDropdown = false;
    showUpload = false;
    formatOptions = ['Plain Text (.txt)', 'Markdown (.md)'];
    defaultExt = 'txt';
    actionButtonText = name.includes('tag') || name.includes('seo') ? 'Generate SEO Tags' : 'Generate Content';
  }

  return {
    showConvertDropdown,
    formatOptions,
    defaultExt,
    uploadLabel,
    showUpload,
    actionButtonText
  };
}

export const FullWidthToolRunner: React.FC<FullWidthToolRunnerProps> = ({
  tool, onBack, onSaveHistory, onSelectTool, allTools
}) => {
  const config = resolveToolConfig(tool);

  const cat = (tool.category || '').toLowerCase();
  const isPDF = cat.includes('pdf') || cat.includes('document');

  const [inputValues, setInputValues] = useState<Record<string, any>>({});
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedPreviewUrl, setUploadedPreviewUrl] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [outputResult, setOutputResult] = useState<string | null>(null);
  const [fileDownloadUrl, setFileDownloadUrl] = useState<string | null>(null);
  const [mediaResultUrl, setMediaResultUrl] = useState<string | null>(null);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  // PDF Page Viewer States
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
    setUploadedFile(null); setUploadedPreviewUrl(null);
    setCurrentPage(1); setNumPages(1); setZoomScale(1.0); setRotationAngle(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (window.history && window.history.pushState) {
      window.history.pushState({}, '', `/tools/${tool.id}`);
    }
  }, [tool.id]);

  useEffect(() => {
    if (uploadedFile) {
      const url = URL.createObjectURL(uploadedFile);
      setUploadedPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setUploadedPreviewUrl(null);
    }
  }, [uploadedFile]);

  // PDF Canvas Viewer Engine
  useEffect(() => {
    if (!uploadedFile) return;

    const isActualPdf = uploadedFile.type === 'application/pdf' || uploadedFile.name.toLowerCase().endsWith('.pdf');
    if (!isActualPdf) return;

    const renderPdfPage = async () => {
      try {
        if (!(window as any).pdfjsLib) {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
          document.head.appendChild(script);
          await new Promise((res) => (script.onload = res));
          (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc =
            'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        }

        const pdfjsLib = (window as any).pdfjsLib;
        const arrayBuffer = await uploadedFile.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
        
        setNumPages(pdf.numPages);
        const page = await pdf.getPage(currentPage);

        const canvas = canvasRef.current;
        if (!canvas) return;

        const viewport = page.getViewport({ scale: zoomScale, rotation: rotationAngle });
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport }).promise;
      } catch (err) {
        console.error("PDF Render Error:", err);
      }
    };

    renderPdfPage();
  }, [uploadedFile, currentPage, zoomScale, rotationAngle, outputResult]);

  const handleInputChange = (id: string, value: any) => setInputValues((prev) => ({ ...prev, [id]: value }));

  // DYNAMICALLY DETECT SELECTED EXTENSION BASED ON DROPDOWN SELECTION
  const selectedFormat = inputValues['outputFormat'] || (config.formatOptions.length > 0 ? config.formatOptions[0] : '');
  let activeExt = config.defaultExt;
  if (selectedFormat.includes('.doc') && !selectedFormat.includes('.docx')) activeExt = 'doc';
  else if (selectedFormat.includes('.docx')) activeExt = 'docx';
  else if (selectedFormat.includes('.xlsx')) activeExt = 'xlsx';
  else if (selectedFormat.includes('.csv')) activeExt = 'csv';
  else if (selectedFormat.includes('.png')) activeExt = 'png';
  else if (selectedFormat.includes('.jpg') || selectedFormat.includes('.jpeg')) activeExt = 'jpg';
  else if (selectedFormat.includes('.mp4')) activeExt = 'mp4';
  else if (selectedFormat.includes('.mp3')) activeExt = 'mp3';

  const handleExecute = async () => {
    if (config.showUpload && !uploadedFile && isPDF) {
      alert("Please upload a source PDF file first!");
      return;
    }

    setIsRunning(true);
    setOutputResult(null); setFileDownloadUrl(null); setMediaResultUrl(null);
    setProgressPercent(0);
    const startTime = Date.now();

    const progressInt = setInterval(() => {
      setProgressPercent((p) => (p < 94 ? p + Math.floor(Math.random() * 12) + 5 : p));
    }, 110);

    try {
      const res = await apiService.executeTool({ tool, inputValues, file: uploadedFile });
      clearInterval(progressInt);
      setProgressPercent(100);
      
      const elapsed = Date.now() - startTime;
      setExecutionTime(res.executionTimeMs || elapsed);
      
      setTimeout(() => {
        if (res.success) {
          if (res.fileUrl) setFileDownloadUrl(res.fileUrl);
          if (res.imageUrl || res.videoUrl || res.audioUrl) {
            setMediaResultUrl(res.imageUrl || res.videoUrl || res.audioUrl || null);
          }
          setOutputResult(res.textOutput || String(res.output || "Completed Successfully"));

          onSaveHistory({
            id: `hist-${Date.now()}`, toolId: tool.id, toolName: tool.name,
            prompt: apiService.extractPrompt(inputValues, tool.name),
            output: String(res.output).substring(0, 300), timestamp: new Date().toLocaleTimeString(),
            executionTimeMs: res.executionTimeMs || elapsed, outputType: tool.outputType,
          });
        }
        setIsRunning(false);
      }, 350);

    } catch (err) {
      clearInterval(progressInt);
      setIsRunning(false);
    }
  };

  // DIRECT BLOB DOWNLOADER ENGINE WITH REAL-TIME ACTIVE EXTENSION
  const handleDirectDownloadFile = async () => {
    const targetUrl = fileDownloadUrl || mediaResultUrl;
    if (!targetUrl) return;
    setIsDownloading(true);

    const filename = `${tool.id}-converted.${activeExt}`;

    try {
      const response = await fetch(targetUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      const link = document.createElement('a');
      link.href = targetUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setIsDownloading(false);
    }
  };

  const relatedTools = allTools.filter(t => t.id !== tool.id && t.category === tool.category).slice(0, 4);
  const isUploadedPdf = uploadedFile && (uploadedFile.type === 'application/pdf' || uploadedFile.name.toLowerCase().endsWith('.pdf'));

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E0E0E0] pb-12 font-mono">
      <div className="bg-[#151517] border-b border-white/10 px-4 py-2 flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-1.5 px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold rounded cursor-pointer">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Marketplace
        </button>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 pt-4 space-y-4">
        
        {/* COMPACT SLIM HEADER BAR */}
        <div className="bg-[#151517] border border-white/10 rounded-lg px-4 py-2.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-red-600/30 text-red-300 border border-red-500/40">PRO ENGINE</span>
            <h1 className="text-base font-extrabold text-white">{tool.name}</h1>
            <p className="text-xs text-slate-400 hidden sm:block border-l border-white/10 pl-3">{tool.description}</p>
          </div>
          {executionTime && <span className="text-emerald-400 text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">{executionTime}ms</span>}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* LEFT OPTIONS */}
          <div className="lg:col-span-4 bg-[#151517] border border-white/10 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-xs font-bold uppercase text-red-400 flex items-center gap-1.5"><Sliders className="w-3.5 h-3.5" /> Conversion Options</span>
            </div>

            {/* Conditionally Render Output Format Dropdown */}
            {config.showConvertDropdown && config.formatOptions.length > 0 && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-200 block">Convert to:</label>
                <select value={inputValues['outputFormat']} onChange={(e) => handleInputChange('outputFormat', e.target.value)} className="w-full px-2.5 py-2 bg-[#0A0A0A] border border-white/20 rounded text-xs text-white focus:border-red-500 font-bold">
                  {config.formatOptions.map((fmt) => <option key={fmt} value={fmt}>{fmt}</option>)}
                </select>
              </div>
            )}

            {tool.inputs.map((param) => (
              <div key={param.id} className="space-y-1">
                <label className="text-xs font-bold text-slate-200 block">{param.name}</label>
                {param.type === 'textarea' || param.type === 'text' ? (
                  <textarea rows={param.type === 'textarea' ? 3 : 1} value={inputValues[param.id] || ''} onChange={(e) => handleInputChange(param.id, e.target.value)} className="w-full px-2.5 py-1.5 bg-[#0A0A0A] border border-white/10 rounded text-xs text-white focus:border-red-500" />
                ) : param.type === 'select' ? (
                  <select value={inputValues[param.id] || param.options?.[0]} onChange={(e) => handleInputChange(param.id, e.target.value)} className="w-full px-2.5 py-1.5 bg-[#0A0A0A] border border-white/10 rounded text-xs text-white focus:border-red-500 font-mono">
                    {param.options?.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                ) : null}
              </div>
            ))}

            {config.showUpload && (
              <div className="pt-2 border-t border-white/10 space-y-1.5">
                <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1"><Paperclip className="w-3.5 h-3.5 text-red-400" /> {config.uploadLabel}</span>
                {!uploadedFile ? (
                  <div onClick={() => fileInputRef.current?.click()} className="border border-dashed border-red-500/40 hover:border-red-500 bg-[#0A0A0A] rounded-lg p-3 text-center cursor-pointer transition-all">
                    <UploadCloud className="w-5 h-5 text-red-500 mx-auto mb-1" />
                    <p className="text-xs text-slate-200 font-bold">Select File or Drag Here</p>
                    <input type="file" ref={fileInputRef} onChange={(e) => e.target.files?.[0] && setUploadedFile(e.target.files[0])} className="hidden" />
                  </div>
                ) : (
                  <div className="p-2 bg-[#0A0A0A] border border-red-500/50 rounded flex items-center justify-between text-xs">
                    <span className="truncate text-white font-bold">{uploadedFile.name}</span>
                    <button onClick={() => { setUploadedFile(null); setFileDownloadUrl(null); setOutputResult(null); }} className="text-rose-400 p-1 hover:bg-rose-500/20 rounded cursor-pointer"><X className="w-3.5 h-3.5" /></button>
                  </div>
                )}
              </div>
            )}

            <button onClick={handleExecute} disabled={isRunning} className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs uppercase rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 transition-all cursor-pointer">
              {isRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
              <span>{isRunning ? 'Processing...' : config.actionButtonText}</span>
            </button>
          </div>

          {/* RIGHT WORKSPACE */}
          <div className="lg:col-span-8 bg-[#151517] border border-white/10 rounded-lg p-4 min-h-[560px] flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex flex-wrap items-center justify-between pb-2 border-b border-white/10 mb-3 gap-2 bg-[#0A0A0A] p-2 rounded-lg border border-white/5">
                <span className="text-xs font-bold text-red-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Live Interactive Viewer
                </span>

                {isUploadedPdf && (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded border border-white/10 text-xs text-white">
                      <button disabled={currentPage <= 1} onClick={() => setCurrentPage(p => p - 1)} className="p-0.5 hover:bg-white/10 rounded disabled:opacity-30 cursor-pointer"><ChevronLeft className="w-3.5 h-3.5" /></button>
                      <span className="font-bold text-[11px] px-1">Page {currentPage} of {numPages}</span>
                      <button disabled={currentPage >= numPages} onClick={() => setCurrentPage(p => p + 1)} className="p-0.5 hover:bg-white/10 rounded disabled:opacity-30 cursor-pointer"><ChevronRight className="w-3.5 h-3.5" /></button>
                    </div>

                    <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded border border-white/10 text-xs text-white">
                      <button onClick={() => setZoomScale(z => Math.max(0.5, z - 0.2))} className="p-0.5 hover:bg-white/10 rounded cursor-pointer" title="Zoom Out"><ZoomOut className="w-3.5 h-3.5" /></button>
                      <span className="font-bold text-[11px] px-1">{Math.round(zoomScale * 100)}%</span>
                      <button onClick={() => setZoomScale(z => Math.min(2.5, z + 0.2))} className="p-0.5 hover:bg-white/10 rounded cursor-pointer" title="Zoom In"><ZoomIn className="w-3.5 h-3.5" /></button>
                    </div>

                    <button onClick={() => setRotationAngle(r => (r + 90) % 360)} className="p-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-white cursor-pointer" title="Rotate 90°">
                      <RotateCw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {!isRunning && !outputResult && !uploadedFile && (
                <div className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl flex flex-col items-center justify-center p-12 text-center min-h-[400px]">
                  {config.defaultExt === 'docx' || config.defaultExt === 'doc' ? <FileText className="w-12 h-12 text-red-500 mx-auto mb-2 animate-bounce" /> :
                   config.defaultExt === 'xlsx' ? <FileSpreadsheet className="w-12 h-12 text-red-500 mx-auto mb-2 animate-bounce" /> :
                   <FileText className="w-12 h-12 text-red-500 mx-auto mb-2 animate-bounce" />}
                  <h3 className="text-white font-bold text-sm">Ready for Processing</h3>
                  <p className="text-slate-400 text-xs mt-1">Upload a file or configure options on the left and click "{config.actionButtonText}".</p>
                </div>
              )}

              {/* PROGRESS BAR */}
              {isRunning && (
                <div className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl p-8 flex flex-col items-center justify-center min-h-[400px] space-y-4">
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    <div className="absolute inset-0 border-4 border-red-500/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-red-600 rounded-full animate-spin border-t-transparent"></div>
                    <span className="text-white font-extrabold text-xs">{progressPercent}%</span>
                  </div>
                  <div className="w-full max-w-xs space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-300">
                      <span>Converting Document...</span>
                      <span>{progressPercent}%</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-red-600 transition-all duration-150" style={{ width: `${progressPercent}%` }}></div>
                    </div>
                  </div>
                </div>
              )}

              {/* PDF CANVAS VIEWER */}
              {isUploadedPdf && !isRunning && (
                <div className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl p-3 flex flex-col items-center justify-center overflow-auto min-h-[400px] max-h-[460px]">
                  <canvas ref={canvasRef} className="max-w-full shadow-2xl rounded border border-white/10 bg-white" />
                  <p className="text-[10px] text-emerald-400 font-bold mt-2">✨ Displaying Page {currentPage} of {numPages} ({Math.round(zoomScale * 100)}% Zoom)</p>
                </div>
              )}

              {/* TEXT / OUTPUT VIEWER */}
              {outputResult && !isUploadedPdf && !isRunning && (
                <div className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl p-4 min-h-[400px] max-h-[440px] overflow-y-auto text-xs font-mono text-slate-200 leading-relaxed whitespace-pre-wrap relative">
                  <button onClick={() => { navigator.clipboard.writeText(outputResult); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="absolute top-3 right-3 px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-[10px] font-bold text-slate-300 flex items-center gap-1 cursor-pointer">
                    <Copy className="w-3 h-3" /> {copied ? 'Copied!' : 'Copy'}
                  </button>
                  {outputResult}
                </div>
              )}
            </div>

            {/* 🚀 DOWNLOAD BUTTON ENABLES ONLY AFTER CONVERSION IS FINISHED! */}
            {!isRunning && (fileDownloadUrl || mediaResultUrl) && (
              <div className="mt-3 pt-3 border-t border-white/10">
                <button onClick={handleDirectDownloadFile} disabled={isDownloading} className="w-full py-3.5 px-4 bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs uppercase rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-xl shadow-red-600/30 transition-all">
                  {isDownloading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  <span>{isDownloading ? 'Downloading File...' : `Download Converted .${activeExt.toUpperCase()} File`}</span>
                </button>
              </div>
            )}

            {/* RELATED TOOLS */}
            <div className="mt-4 pt-3 border-t border-white/10">
              <h4 className="text-[10px] font-extrabold uppercase text-slate-400 mb-2 tracking-wider">Give other tools a try. It's free.</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {relatedTools.map((t) => (
                  <button key={t.id} onClick={() => onSelectTool(t)} className="p-2 bg-white/5 hover:bg-red-600/10 border border-white/10 hover:border-red-500/40 rounded-lg text-left transition-all group cursor-pointer flex flex-col justify-between">
                    <span className="text-[11px] font-bold text-white group-hover:text-red-400 truncate">{t.name}</span>
                    <span className="text-[9px] text-slate-400 mt-1 block">Try Now &rarr;</span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
