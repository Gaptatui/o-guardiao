import { User as FirebaseUser } from 'firebase/auth';

export type Language = 'pt' | 'en' | 'es' | 'fr' | 'de' | 'it' | 'nl' | 'zh' | 'he';

export interface AnalysisResult {
  verdict: 'SEGURO' | 'SUSPEITO' | 'GOLPE CONFIRMADO';
  reason: string;
  action: string;
  originalText: string;
  timestamp: number;
}

export interface Alerta {
  id?: string;
  tipo: string;
  gravidade: string;
  transcricao: string;
  sons_fundo: string;
  analise_ia_audio: string;
  prioridade: string;
  timestamp: number;
  uid: string;
  status: string;
  userEmail?: string;
}

export interface NeighborAlert {
  id?: string;
  titulo: string;
  descricao: string;
  categoria: string;
  timestamp: number;
  uid: string;
  userName: string;
}

export interface HealthProfile {
  tipoSanguineo: string;
  alergias: string;
  historico: string;
  medicacoes: string;
}

export interface Medication {
  id?: string;
  nome: string;
  horario: string;
  dosagem: string;
  uid: string;
  usoContinuo?: boolean;
  dataInicio?: string;
  dataFim?: string;
}

export interface TalentService {
  id?: string;
  titulo: string;
  descricao: string;
  categoria: string;
  preco: string;
  uid: string;
  userName: string;
}

export interface Device {
  id: string;
  name: string;
  type: string;
  status: 'connected' | 'disconnected';
  value: string;
  unit: string;
  lastUpdate: number;
  readingInterval: number; // in seconds
}

export interface UserProfile {
  uid: string;
  email: string;
  name?: string;
  photoURL?: string;
  birthDay?: number;
  birthMonth?: number;
  plan: 'free' | 'pro';
  isAdmin: boolean;
  isVip?: boolean;
  timestamp: number;
  subscriptionStatus?: 'active' | 'inactive' | 'past_due';
  subscriptionPeriod?: 'monthly' | 'yearly';
  nextBillingDate?: number;
  paymentMethod?: string;
}

export interface Transaction {
  id?: string;
  uid: string;
  userEmail: string;
  valor: number;
  moeda: string;
  tipo: 'assinatura_mensal' | 'assinatura_anual';
  status: 'concluido' | 'pendente' | 'falhou';
  timestamp: number;
}

export interface UsageLog {
  id?: string;
  uid: string;
  modulo: 'golpes' | 'emergencia' | 'rota_segura' | 'saude' | 'talentos' | 'financeiro';
  timestamp: number;
}

export interface Income {
  id: string;
  descricao: string;
  valor: number;
  categoria: string;
  data: string;
  uid: string;
  timestamp: number;
}

export interface Expense {
  id?: string;
  descricao: string;
  valor: number;
  tipo: 'fixo' | 'variavel';
  categoria: string;
  data: string;
  uid: string;
  timestamp: number;
}

export interface Debt {
  id?: string;
  credor: string;
  valorTotal: number;
  taxaJuros: number;
  vencimento: string;
  uid: string;
  timestamp: number;
}

export interface FinancialProject {
  id?: string;
  plano: string;
  dicas: string[];
  metas: string[];
  uid: string;
  timestamp: number;
}

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
