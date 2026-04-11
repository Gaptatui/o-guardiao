import React from 'react';
import { motion } from 'motion/react';
import { Plus } from 'lucide-react';

interface ShortcutSuggestionModalProps {
  show: boolean;
  onClose: () => void;
  t: any;
}

export const ShortcutSuggestionModal = ({ show, onClose, t }: ShortcutSuggestionModalProps) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800"
      >
        <div className="p-8 text-center space-y-6">
          <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-3xl flex items-center justify-center mx-auto">
            <Plus className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-black text-slate-900 dark:text-slate-100">{t.addShortcut}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              {t.shortcutSuggestion}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-3">
            <button 
              onClick={onClose}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-lg hover:bg-indigo-700 transition-all"
            >
              {t.addShortcut}
            </button>
            <button 
              onClick={onClose}
              className="w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-black text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
            >
              {t.later}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
