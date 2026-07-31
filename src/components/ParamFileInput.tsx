import React, { useRef } from 'react';
import { UploadCloud, FileText, X, Image as ImageIcon, Film } from 'lucide-react';
import { ToolInputParam } from '../types';

interface ParamFileInputProps {
  param: ToolInputParam;
  value: string | null | undefined;
  fileName?: string | null;
  onChange: (dataUrl: string | null, fileName?: string) => void;
}

export const ParamFileInput: React.FC<ParamFileInputProps> = ({
  param,
  value,
  fileName,
  onChange,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFile = (file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      onChange(dataUrl, file.name);
    };
    reader.readAsDataURL(file);
  };

  const isVideo = param.id.toLowerCase().includes('video') || param.accept?.includes('video');
  const isImage =
    param.id.toLowerCase().includes('image') ||
    param.id.toLowerCase().includes('photo') ||
    param.id.toLowerCase().includes('avatar') ||
    param.accept?.includes('image');

  return (
    <div className="space-y-1.5 font-mono">
      {!value ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
          }}
          onClick={() => inputRef.current?.click()}
          className="border border-dashed border-indigo-500/30 hover:border-indigo-500/70 bg-[#0A0A0E] hover:bg-indigo-950/20 rounded-lg p-3 text-center cursor-pointer transition-colors group"
        >
          <div className="w-8 h-8 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-1.5 group-hover:scale-110 transition-transform">
            {isVideo ? (
              <Film className="w-4 h-4 text-indigo-400" />
            ) : isImage ? (
              <ImageIcon className="w-4 h-4 text-indigo-400" />
            ) : (
              <UploadCloud className="w-4 h-4 text-indigo-400" />
            )}
          </div>
          <p className="text-xs text-slate-200 font-medium">{param.name}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">
            {param.description ||
              (isVideo
                ? 'Drag & drop sample video / animation clip'
                : isImage
                ? 'Drag & drop user photo / sample image'
                : 'Click or drag file to attach')}
          </p>
        </div>
      ) : (
        <div className="p-2.5 bg-[#0D0D11] border border-indigo-500/40 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            {typeof value === 'string' && value.startsWith('data:image/') ? (
              <img src={value} alt="Uploaded preview" className="w-9 h-9 object-cover rounded border border-white/10 shrink-0" />
            ) : typeof value === 'string' && value.startsWith('data:video/') ? (
              <div className="w-9 h-9 bg-indigo-900/50 rounded flex items-center justify-center text-indigo-300 border border-indigo-500/30 shrink-0">
                <Film className="w-5 h-5" />
              </div>
            ) : (
              <div className="w-9 h-9 bg-slate-800 rounded flex items-center justify-center text-slate-300 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
            )}
            <div className="min-w-0">
              <p className="text-xs text-emerald-400 font-bold truncate">✓ {fileName || param.name}</p>
              <p className="text-[10px] text-slate-400">File attached ready for AI processing</p>
            </div>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange(null);
            }}
            className="p-1 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-colors"
            title="Remove file"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      <input
        type="file"
        ref={inputRef}
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        className="hidden"
        accept={param.accept || (isVideo ? 'video/*,image/*' : isImage ? 'image/*' : '*/*')}
      />
    </div>
  );
};
