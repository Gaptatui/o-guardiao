import React from 'react';
import { Zap, AlertTriangle } from 'lucide-react';
import { Language } from '../types';

interface ProGuardProps {
  children: React.ReactNode;
  isPro: boolean;
  t: any;
  setShowCheckout: (v: boolean) => void;
}

export const ProGuard = ({ children, isPro, t, setShowCheckout }: ProGuardProps) => {
  if (isPro) return <>{children}</>;
  
  return (
    <div className="relative group/proguard">
      <div className="blur-sm pointer-events-none select-none opacity-50">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-white/10 dark:bg-slate-900/10 backdrop-blur-[2px] rounded-3xl transition-all group-hover/proguard:backdrop-blur-[4px]">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] shadow-2xl border border-slate-100 dark:border-slate-800 text-center space-y-4 max-w-[280px] transform transition-all group-hover/proguard:scale-105">
          <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto">
            <Zap className="w-8 h-8 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest">{t.proFeatureTitle}</h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold leading-relaxed mt-1">
              {t.proFeatureDescription}
            </p>
          </div>
          <button 
            onClick={() => setShowCheckout(true)}
            className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-amber-200 dark:shadow-none"
          >
            {t.upgradeNow}
          </button>
        </div>
      </div>
    </div>
  );
};

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: any }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      let errorMessage = "Ocorreu um erro inesperado.";
      try {
        const parsed = JSON.parse(this.state.error.message);
        if (parsed.error) {
          errorMessage = `Erro no Banco de Dados: ${parsed.error}`;
        }
      } catch (e) {
        errorMessage = this.state.error.message || errorMessage;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full text-center space-y-6">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">Ops! Algo deu errado</h2>
            <p className="text-slate-600 dark:text-slate-400 font-medium">
              {errorMessage}
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="w-full py-4 bg-slate-900 dark:bg-slate-800 text-white rounded-2xl font-black shadow-lg hover:bg-slate-800 transition-all"
            >
              Recarregar Aplicativo
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
