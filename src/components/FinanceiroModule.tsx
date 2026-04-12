
import React, { useState, useEffect } from 'react';
import { 
  collection, addDoc, onSnapshot, query, orderBy, where,
  updateDoc, doc, deleteDoc, serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';
import { FinanceView } from './views/FinanceView';
import { 
  Income, Expense, Debt, FinancialProject, UserProfile, Language, OperationType 
} from '../types';
import { GoogleGenAI } from "@google/genai";

interface FinanceiroModuleProps {
  user: any;
  t: any;
  language: Language;
  formatCurrency: (v: number, l: string) => string;
  userProfile: UserProfile | null;
  isAdmin: boolean;
  setShowCheckout: (v: boolean) => void;
  genAI: GoogleGenAI;
  handleFirestoreError: (error: unknown, operationType: OperationType, path: string | null) => void;
  onDataChange?: (data: { expenses: Expense[]; incomes: Income[]; debts: Debt[] }) => void;
  showUI?: boolean;
  setView: (v: any) => void;
}

export const FinanceiroModule: React.FC<FinanceiroModuleProps> = ({
  user, t, language, formatCurrency, userProfile, isAdmin, setShowCheckout, genAI, handleFirestoreError, onDataChange, showUI = true, setView
}) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [financialProject, setFinancialProject] = useState<FinancialProject | null>(null);

  const [newIncome, setNewIncome] = useState({ descricao: '', valor: 0, categoria: 'Variável', data: new Date().toISOString().split('T')[0] });
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);
  
  const [newExpense, setNewExpense] = useState({ 
    descricao: '', 
    valor: 0, 
    categoria: 'Variável', 
    data: new Date().toISOString().split('T')[0],
    tipo: 'variavel'
  });
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  
  const [newDebt, setNewDebt] = useState({ credor: '', valorTotal: 0, taxaJuros: 0, vencimento: new Date().toISOString().split('T')[0] });
  const [editingDebt, setEditingDebt] = useState<Debt | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchingProduct, setIsSearchingProduct] = useState(false);
  const [productSearchResult, setProductSearchResult] = useState<string | null>(null);
  const [isSearchingRates, setIsSearchingRates] = useState(false);
  const [financingOptions, setFinancingOptions] = useState<any[]>([]);
  const [isGeneratingProject, setIsGeneratingProject] = useState(false);

  useEffect(() => {
    if (!user) return;

    const qExpenses = query(collection(db, 'expenses'), where('uid', '==', user.uid), orderBy('timestamp', 'desc'));
    const unsubExpenses = onSnapshot(qExpenses, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Expense));
      setExpenses(data);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'expenses'));

    const qIncomes = query(collection(db, 'incomes'), where('uid', '==', user.uid), orderBy('timestamp', 'desc'));
    const unsubIncomes = onSnapshot(qIncomes, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Income));
      setIncomes(data);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'incomes'));

    const qDebts = query(collection(db, 'debts'), where('uid', '==', user.uid), orderBy('timestamp', 'desc'));
    const unsubDebts = onSnapshot(qDebts, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Debt));
      setDebts(data);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'debts'));

    const qProject = query(collection(db, 'financialProjects'), where('uid', '==', user.uid), orderBy('timestamp', 'desc'));
    const unsubProject = onSnapshot(qProject, (snapshot) => {
      if (!snapshot.empty) {
        setFinancialProject({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as FinancialProject);
      }
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'financialProjects'));

    return () => {
      unsubExpenses();
      unsubIncomes();
      unsubDebts();
      unsubProject();
    };
  }, [user]);

  useEffect(() => {
    if (onDataChange) {
      onDataChange({ expenses, incomes, debts });
    }
  }, [expenses, incomes, debts, onDataChange]);

  const addIncome = async (income: Omit<Income, 'id' | 'uid' | 'timestamp'>) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'incomes'), {
        ...income,
        uid: user.uid,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'incomes');
    }
  };

  const updateIncome = async (id: string, income: Partial<Income>) => {
    try {
      const { id: _, ...data } = income as any;
      await updateDoc(doc(db, 'incomes', id), data);
      setEditingIncome(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'incomes');
    }
  };

  const deleteIncome = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'incomes', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'incomes');
    }
  };

  const addExpense = async (expense: Omit<Expense, 'id' | 'uid' | 'timestamp'>) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'expenses'), {
        ...expense,
        uid: user.uid,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'expenses');
    }
  };

  const updateExpense = async (id: string, expense: Partial<Expense>) => {
    try {
      const { id: _, ...data } = expense as any;
      await updateDoc(doc(db, 'expenses', id), data);
      setEditingExpense(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'expenses');
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'expenses', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'expenses');
    }
  };

  const addDebt = async (debt: Omit<Debt, 'id' | 'uid' | 'timestamp'>) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'debts'), {
        ...debt,
        uid: user.uid,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'debts');
    }
  };

  const updateDebt = async (id: string, debt: Partial<Debt>) => {
    try {
      const { id: _, ...data } = debt as any;
      await updateDoc(doc(db, 'debts', id), data);
      setEditingDebt(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'debts');
    }
  };

  const deleteDebt = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'debts', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'debts');
    }
  };

  const searchProduct = async () => {
    if (!searchQuery?.trim()) return;
    setIsSearchingProduct(true);
    try {
      const prompt = `Como um assistente de compras inteligente, pesquise o melhor preço online e uma opção local em Santos/SP para o produto: "${searchQuery}". Forneça links (se possível) e uma breve comparação de custo-benefício. Responda em Markdown em português.`;
      
      const response = await genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt
      });
      setProductSearchResult(response.text || "Nenhum resultado encontrado.");
    } catch (error) {
      console.error("Erro na busca de produto:", error);
    } finally {
      setIsSearchingProduct(false);
    }
  };

  const generateFinancialProject = async () => {
    if (!user || expenses.length === 0) return;
    setIsGeneratingProject(true);
    try {
      const prompt = `Com base nos seguintes dados financeiros:
      Gastos: ${JSON.stringify(expenses)}
      Incomes: ${JSON.stringify(incomes)}
      Dívidas: ${JSON.stringify(debts)}
      
      Gere um plano de saúde financeira personalizado. Retorne APENAS um JSON no formato:
      {
        "plano": "string com a descrição do plano",
        "dicas": ["string", "string"],
        "metas": ["string", "string"]
      }`;
      
      const response = await genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt
      });
      const text = (response.text || "").replace(/```json|```/g, '').trim();
      const projectData = JSON.parse(text);
      
      await addDoc(collection(db, 'financialProjects'), {
        ...projectData,
        uid: user.uid,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.error("Erro ao gerar projeto financeiro:", error);
    } finally {
      setIsGeneratingProject(false);
    }
  };

  const searchFinancingRates = async () => {
    if (!user || debts.length === 0) return;
    setIsSearchingRates(true);
    try {
      const prompt = `Com base nestas dívidas: ${JSON.stringify(debts)}, pesquise as melhores taxas de financiamento e consolidação de dívidas atualmente no mercado brasileiro. Retorne APENAS um JSON no formato:
      [
        {"bank": "Nome do Banco", "rate": "X% a.m.", "conditions": "Descrição breve"}
      ]`;
      
      const response = await genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt
      });
      const text = (response.text || "").replace(/```json|```/g, '').trim();
      setFinancingOptions(JSON.parse(text));
    } catch (error) {
      console.error("Erro ao buscar taxas:", error);
    } finally {
      setIsSearchingRates(false);
    }
  };

  if (!showUI) return null;

  return (
    <FinanceView 
      t={t}
      language={language}
      setView={setView}
      formatCurrency={formatCurrency}
      expenses={expenses}
      incomes={incomes}
      debts={debts}
      newIncome={newIncome}
      setNewIncome={setNewIncome}
      addIncome={addIncome}
      updateIncome={updateIncome}
      deleteIncome={deleteIncome}
      editingIncome={editingIncome}
      setEditingIncome={setEditingIncome}
      newExpense={newExpense}
      setNewExpense={setNewExpense}
      addExpense={addExpense}
      updateExpense={updateExpense}
      deleteExpense={deleteExpense}
      editingExpense={editingExpense}
      setEditingExpense={setEditingExpense}
      newDebt={newDebt}
      setNewDebt={setNewDebt}
      addDebt={addDebt}
      updateDebt={updateDebt}
      deleteDebt={deleteDebt}
      editingDebt={editingDebt}
      setEditingDebt={setEditingDebt}
      userProfile={userProfile}
      isAdmin={isAdmin}
      setShowCheckout={setShowCheckout}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      searchProduct={searchProduct}
      isSearchingProduct={isSearchingProduct}
      productSearchResult={productSearchResult}
      setProductSearchResult={setProductSearchResult}
      financingOptions={financingOptions}
      searchFinancingRates={searchFinancingRates}
      isSearchingRates={isSearchingRates}
      isGeneratingProject={isGeneratingProject}
      generateFinancialProject={generateFinancialProject}
      financialProject={financialProject}
    />
  );
};
