import React from 'react';
import { motion } from 'motion/react';
import { Pill } from 'lucide-react';
import { Medication } from '../types';

interface MedicationAlarmModalProps {
  medication: Medication | null;
  onClose: () => void;
  t: any;
}

export const MedicationAlarmModal = ({ medication, onClose, t }: MedicationAlarmModalProps) => {
  if (!medication) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[3rem] overflow-hidden shadow-2xl border-4 border-indigo-500"
      >
        <div className="p-10 text-center space-y-8">
          <div className="w-24 h-24 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto animate-pulse">
            <Pill className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
          </div>
          
          <div className="space-y-3">
            <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 uppercase tracking-tighter">
              {t.medicationAlarm}
            </h3>
            <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-800">
              <p className="text-xl font-black text-indigo-600 dark:text-indigo-400">{medication.nome}</p>
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-widest">
                {medication.dosagem} • {medication.horario}
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-all uppercase tracking-widest"
          >
            {t.takeNow}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
