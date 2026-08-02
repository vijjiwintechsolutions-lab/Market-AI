import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ArrowLeft, Play, Sparkles, Download, RefreshCw, Sliders, Wand2, Image as ImageIcon, X, FileText, Activity } from 'lucide-react';
import { AITool, ExecutionHistoryItem } from '../types';
import { apiService } from '../services/apiService';
import { AIVideoPlayer } from './AIVideoPlayer';
import { validateUploadedFile, validateToolExecution } from '../utils/toolValidator';

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

export const FullWidthToolRunner: React.FC<FullWidthToolRunnerProps> = ({
  tool, onBack, onSaveHistory
}) => {
  const [inputValues, setInputValues] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    tool.inputs.forEach((p) => initial[p.id] = p.defaultValue || '');
    return initial;
  });

  const [isRunning, setIsRunning] = useState(false);
  const [outputResult, setOutputResult] = useState<string | null>(null);
  const [imageUrlResult, setImageUrlResult] = useState<string | null>(null);
  const [videoUrlResult, setVideoUrlResult] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleInputChange = (id: string, value: any) => setInputValues(prev => ({ ...prev, [id]: value }));

  const handleExecute = async () => {
    setIsRunning(true);
    setErrorMsg(null);
    setImageUrlResult(null);
    setVideoUrlResult(null);
    setOutputResult(null);

    try {
      const res = await apiService.executeTool({ tool, inputValues });
      if (res.success) {
        if (tool.outputType === 'image' || tool.category === 'Image AI') {
          setImageUrlResult(res.imageUrl || res.output);
        } else if (tool.outputType === 'video' || tool.category === 'Video AI') {
          setVideoUrlResult(res.videoUrl || res.output);
        } else {
          setOutputResult(typeof res.output === 'object' ? JSON.stringify(res.output, null, 2) : res.output);
        }
        
        onSaveHistory({
          id: `hist-${Date.now()}`,
          toolId: tool.id,
          toolName: tool.name,
          prompt: String(inputValues.prompt).substring(0, 50),
          output: 'Success',
          timestamp: new Date().toLocaleTimeString(),
          executionTimeMs: res.executionTimeMs,
          outputType: tool.outputType,
        });
      } else {
        setErrorMsg('Execution failed.');
      }
    } catch (err: any) {
      setErrorMsg('Server error occurred.');
    } finally {
      setIsRunning(false);
    }
  };

  // 🔥 DIRECT DOWNLOAD FIX: Forces Blob download instead of opening a new tab 🔥
  const handleDirectDownloadMedia = async (mediaUrl: string | null, defaultFileName: string) => {
    if (!mediaUrl) return;
    setIsDownloading(true);
    try {
      // Use our backend proxy to bypass CORS
      const downloadProxyUrl = `/api/download?url=${encodeURIComponent(mediaUrl)}&filename=${encodeURIComponent(defaultFileName)}`;
      
      const response = await fetch(downloadProxyUrl);
      if (!response.ok) throw new Error('Network response was not ok');
      
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = blobUrl;
      link.download = defaultFileName;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      window.URL.revokeObjectURL(blobUrl);
      document.body.removeChild(link);
    } catch (err) {
      console.error('Download failed:', err);
      // Absolute fallback if blob fails
      const link = document.createElement('a');
      link.href = mediaUrl;
      link.target = '_blank';
      link.download = defaultFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E0E0E0] pb-12 font-sans font-mono">
      <div className="bg-[#151517] border-b border-white/10 px-4 py-3 flex items-center">
        <button onClick={onBack} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold rounded cursor-pointer">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Marketplace
        </button>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        <div className="bg-[#151517] border border-white/10 rounded-lg p-5">
          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-indigo-600/30 text-indigo-300 border border-indigo-500/40">{tool.category}</span>
          <h1 className="text-2xl font-extrabold text-white mt-1">{tool.name}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Inputs */}
          <div className="lg:col-span-5 bg-[#151517] border border-white/10 rounded-lg p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-bold uppercase text-indigo-400 flex items-center gap-1.5"><Sliders className="w-4 h-4" /> Parameters</span>
            </div>

            {tool.inputs.map((param) => (
              <div key={param.id} className="space-y-1.5">
                <label className="text-xs font-bold text-slate-200">{param.name}</label>
                {param.type === 'textarea' || param.type === 'text' ? (
                  <textarea
                    rows={4}
                    value={inputValues[param.id] || ''}
                    onChange={(e) => handleInputChange(param.id, e.target.value)}
                    className="w-full px-3 py-2 bg-[#0A0A0A] border border-white/10 rounded text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                ) : null}
              </div>
            ))}

            <button onClick={handleExecute} disabled={isRunning} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase rounded flex items-center justify-center gap-2 cursor-pointer">
              {isRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
              <span>{isRunning ? 'Processing AI Request...' : 'Execute AI Tool'}</span>
            </button>
            {errorMsg && <p className="text-rose-400 text-xs mt-2">{errorMsg}</p>}
          </div>

          {/* Output */}
          <div className="lg:col-span-7 bg-[#151517] border border-white/10 rounded-lg p-5 min-h-[500px]">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <span className="text-xs font-bold uppercase text-emerald-400 flex items-center gap-1.5"><Sparkles className="w-4 h-4" /> Live Generated Output</span>
            </div>

            {imageUrlResult && !isRunning && (
              <div className="space-y-3">
                <div className="rounded border border-white/10 bg-[#0A0A0A] p-2 flex items-center justify-center min-h-[340px]">
                  <img src={imageUrlResult} alt="Generated AI Artwork" className="w-full h-auto max-h-[440px] object-contain rounded" />
                </div>
                <button 
                  onClick={() => handleDirectDownloadMedia(imageUrlResult, `${tool.id}-masterpiece.png`)} 
                  disabled={isDownloading} 
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase rounded shadow flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isDownloading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  <span>{isDownloading ? 'Downloading File...' : 'Direct Download Ultra-HD Image'}</span>
                </button>
              </div>
            )}

            {videoUrlResult && !isRunning && (
              <div className="space-y-3 text-center p-10 bg-[#0A0A0A] rounded border border-white/10">
                 <p className="text-emerald-400 font-bold mb-4">Video Rendered Successfully</p>
                 <button 
                  onClick={() => handleDirectDownloadMedia(videoUrlResult, `${tool.id}-video.mp4`)} 
                  disabled={isDownloading} 
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase rounded shadow flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isDownloading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  <span>{isDownloading ? 'Downloading Video...' : 'Direct Download MP4 Video'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
