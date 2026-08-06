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
  'PDF & Document Tools',
  'Image Tools (AI & Utility)',
  'Video Tools (AI & Utility)',
  'Audio Tools (AI & Utility)',
  'Calculators & Finance',
  'Coding & Web Tools',
  'Text & Marketing Tools',
];

export const SubmitToolModal: React.FC<SubmitToolModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] =
    useState<ToolCategory>('PDF & Document Tools');

  if (!isOpen) return null;

  const handleSubmit = () => {
    alert('Tool submitted for review successfully!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 font-mono">
      <div className="w-full max-w-lg space-y-6 rounded-2xl border border-white/10 bg-[#151517] p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h2 className="flex items-center gap-2 text-lg font-extrabold text-white">
            <PlusCircle className="h-5 w-5 text-emerald-400" />
            Submit New Tool
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-bold text-slate-300">
              Tool Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Advanced PDF Splitter"
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-slate-100 outline-none transition-colors focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-slate-300">
              Category
            </label>

            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value as ToolCategory)
              }
              className="w-full cursor-pointer rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs font-bold uppercase text-slate-100 outline-none transition-colors focus:border-emerald-500"
            >
              {CATEGORIES_LIST.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-slate-300">
              Description
            </label>

            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what your tool does..."
              className="w-full resize-none rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-slate-100 outline-none transition-colors focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-white/10 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-white/5 px-4 py-2 text-xs font-bold text-slate-300 transition-colors hover:bg-white/10"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-extrabold text-slate-950 shadow-lg shadow-emerald-900/20 transition-colors hover:bg-emerald-500"
          >
            Submit Tool
          </button>
        </div>
      </div>
    </div>
  );
};
