
import { auth } from './firebase';

export const parseDistance = (distStr: string | null): number => {
  if (!distStr) return Infinity;
  const match = distStr.match(/([\d.,]+)\s*(km|m|metr|quilômetro)/i);
  if (!match) return Infinity;
  let value = parseFloat(match[1].replace(',', '.'));
  const unit = match[2].toLowerCase();
  if (unit.startsWith('k') || unit.startsWith('q')) {
    value *= 1000;
  }
  return value;
};

export const formatDate = (dateStr?: string) => {
  if (!dateStr) return '';
  try {
    const [year, month, day] = dateStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return date.toLocaleDateString();
  } catch (e) {
    return dateStr;
  }
};

export const formatCurrency = (value: number, lang: string = 'pt') => {
  const currencyMap: Record<string, string> = {
    'pt': 'BRL',
    'en': 'USD',
    'es': 'EUR',
    'fr': 'EUR',
    'de': 'EUR',
    'it': 'EUR',
    'nl': 'EUR',
    'zh': 'CNY',
    'he': 'ILS'
  };
  const currency = currencyMap[lang] || 'USD';
  
  const localeMap: Record<string, string> = {
    'pt': 'pt-BR',
    'en': 'en-US',
    'es': 'es-ES',
    'fr': 'fr-FR',
    'de': 'de-DE',
    'it': 'it-IT',
    'nl': 'nl-NL',
    'zh': 'zh-CN',
    'he': 'he-IL'
  };
  const locale = localeMap[lang] || lang;

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: any;
}

export const handleFirestoreError = (error: unknown, operationType: OperationType, path: string | null) => {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || 'unauthenticated',
      email: auth.currentUser?.email || 'none',
      emailVerified: auth.currentUser?.emailVerified || false,
      isAnonymous: auth.currentUser?.isAnonymous || false,
      tenantId: auth.currentUser?.tenantId || 'none',
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName || '',
        email: provider.email || '',
        photoUrl: provider.photoURL || ''
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
};
