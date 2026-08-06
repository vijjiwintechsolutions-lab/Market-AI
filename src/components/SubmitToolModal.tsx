// =====================================================================
// MARKET1 SUBMIT TOOL MODAL (MUTE)
// =====================================================================

'use client';

import React, { useState } from 'react';
import { X, PlusCircle } from 'lucide-react';
import { ToolCategory } from '../types/mute';

interface SubmitToolModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES_LIST: ToolCategory[] = [
  'PDF & Documents',
  'Image & Graphics',
  'AI & Text',
  'Video & Audio',
  'Calculators & Finance',
  'Coding & Web'
];

export const SubmitToolModal: React.FC<SubmitToolModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ToolCategory>('PDF & Documents');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 font-mono">
      <div className="bg-[#151517] border border-white/10 rounded-2xl w-full max-w-lg p-6 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-emerald-400" /> Submit New Tool
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Tool Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Advanced PDF Splitter"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:border-emerald-500 focus:outline-none text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Category</label>
            <select 
              value={category} 
              onChange={e => setCategory(e.target.value as ToolCategory)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:border-emerald-500 focus:outline-none cursor-pointer text-xs uppercase font-bold"
            >
              {CATEGORIES_LIST.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Description</label>
            <textarea 
              rows={3}
              value={description} 
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe what your tool does..."
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:border-emerald-500 focus:outline-none resize-none text-xs"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl text-xs font-bold transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={() => {
              alert('Tool submitted for review successfully!');
              onClose();
            }}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 rounded-xl text-xs font-extrabold transition-colors shadow-lg shadow-emerald-900/20"
          >
            Submit Tool
          </button>
        </div>
      </div>
    </div>
  );
};
