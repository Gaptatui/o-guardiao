import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck } from 'lucide-react';

interface PermissionGuideModalProps {
  show: boolean;
  onClose: () => void;
  os: string;
  t: any;
}

export const PermissionGuideModal = ({ show, onClose, os, t }: PermissionGuideModalProps) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800"
      >
        <div className="p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-900 dark:text-slate-100">{t.permissionsGuide}</h3>
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
              <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
            {t.permissionsDescription}
          </p>
          
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
              <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Sistema Detectado</p>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {os === 'ios' ? 'Apple iOS' : os === 'android' ? 'Android OS' : 'Desktop / Web Browser'}
              </p>
            </div>
            
            <div className="space-y-3">
              <p className="text-[10px] font-black text-slate-400 uppercase">Passos para ativar:</p>
              <ul className="space-y-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                <li className="flex gap-2"><span>1.</span> {os === 'ios' ? 'Vá em Ajustes > Safari > Configurações do Site' : os === 'android' ? 'Vá em Configurações > Apps > O GUARDIAO' : 'Clique no ícone de cadeado na barra de endereços'}</li>
                <li className="flex gap-2"><span>2.</span> {os === 'ios' ? 'Permita Localização e Microfone' : os === 'android' ? 'Permita Localização, Microfone e Contatos' : 'Permita Localização, Microfone e Notificações'}</li>
              </ul>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-lg hover:bg-indigo-700 transition-all"
          >
            {t.okUnderstood}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
