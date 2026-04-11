import React, { useState } from 'react';
import { motion } from 'motion/react';
import { XCircle, Briefcase, QrCode } from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { Language } from '../types';
import { PLAN_CONFIG } from '../constants';

interface CheckoutModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm: (period: 'monthly' | 'yearly', method: 'card' | 'pix') => void;
  t: any;
  language: Language;
}

export const CheckoutModal = ({ show, onClose, onConfirm, t, language }: CheckoutModalProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'pix'>('card');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePurchase = async () => {
    setIsProcessing(true);
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    onConfirm(selectedPeriod, paymentMethod);
    setIsProcessing(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[40px] p-8 shadow-2xl border border-slate-200 dark:border-slate-800"
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100">{t.checkoutTitle}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t.checkoutSubtitle}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <XCircle className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Plan Options */}
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => setSelectedPeriod('monthly')}
              className={`p-4 rounded-2xl border-2 transition-all text-left ${
                selectedPeriod === 'monthly' 
                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' 
                  : 'border-slate-100 dark:border-slate-800 hover:border-indigo-200'
              }`}
            >
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{t.monthly}</p>
              <p className="text-lg font-black text-slate-900 dark:text-slate-100">{formatCurrency(PLAN_CONFIG.monthly, language)}</p>
            </button>
            <button 
              onClick={() => setSelectedPeriod('yearly')}
              className={`p-4 rounded-2xl border-2 transition-all text-left relative overflow-hidden ${
                selectedPeriod === 'yearly' 
                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' 
                  : 'border-slate-100 dark:border-slate-800 hover:border-indigo-200'
              }`}
            >
              <div className="absolute top-0 right-0 bg-amber-500 text-white text-[7px] font-black px-2 py-1 rounded-bl-lg uppercase">
                {t.saveYearly}
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{t.yearly}</p>
              <p className="text-lg font-black text-slate-900 dark:text-slate-100">{formatCurrency(PLAN_CONFIG.yearly, language)}</p>
            </button>
          </div>

          {/* Payment Method Toggle */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
            <button 
              onClick={() => setPaymentMethod('card')}
              className={`flex-1 py-2 rounded-xl text-[10px] font-black transition-all ${paymentMethod === 'card' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-slate-500'}`}
            >
              {t.creditCard}
            </button>
            <button 
              onClick={() => setPaymentMethod('pix')}
              className={`flex-1 py-2 rounded-xl text-[10px] font-black transition-all ${paymentMethod === 'pix' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-slate-500'}`}
            >
              Pix
            </button>
          </div>

          {paymentMethod === 'card' ? (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.cardNumber}</label>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="0000 0000 0000 0000"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-medium focus:ring-2 focus:ring-indigo-500 transition-all dark:text-slate-100"
                  />
                  <Briefcase className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.expiryDate}</label>
                  <input 
                    type="text" 
                    placeholder="MM/AA"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-medium focus:ring-2 focus:ring-indigo-500 transition-all dark:text-slate-100"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.cvv}</label>
                  <input 
                    type="text" 
                    placeholder="000"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-medium focus:ring-2 focus:ring-indigo-500 transition-all dark:text-slate-100"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700">
              <QrCode className="w-32 h-32 text-slate-900 dark:text-slate-100 mb-4" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                Escaneie o QR Code para pagar via Pix
              </p>
            </div>
          )}

          <button 
            onClick={handlePurchase}
            disabled={isProcessing}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-200 dark:shadow-none transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {t.processing}
              </>
            ) : (
              t.confirmPurchase
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
