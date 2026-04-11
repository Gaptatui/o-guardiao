
import React, { useState, useEffect } from 'react';
import { 
  collection, query, orderBy, limit, onSnapshot, 
  doc, updateDoc, getDocs, deleteDoc, where 
} from 'firebase/firestore';
import { db } from '../firebase';
import { AdminPanel } from './AdminPanel';
import { 
  Language, UserProfile, Transaction, UsageLog, Alerta, OperationType 
} from '../types';

interface AdminModuleProps {
  user: any;
  isAdmin: boolean;
  t: any;
  language: Language;
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
  handleFirestoreError: (error: unknown, operationType: OperationType, path: string | null) => void;
  showUI: boolean;
}

export const AdminModule: React.FC<AdminModuleProps> = ({
  user, isAdmin, t, language, showToast, handleFirestoreError, showUI
}) => {
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [usageLogs, setUsageLogs] = useState<UsageLog[]>([]);
  const [alertasList, setAlertasList] = useState<Alerta[]>([]);
  const [planConfig, setPlanConfig] = useState(() => {
    const saved = localStorage.getItem('guardian-plan-config');
    return saved ? JSON.parse(saved) : { monthly: 9.90, yearly: 99.00 };
  });

  useEffect(() => {
    if (!user || !isAdmin) return;

    const qLogs = query(collection(db, 'logs_uso'), orderBy('timestamp', 'desc'), limit(20));
    const unsubLogs = onSnapshot(qLogs, (snapshot) => {
      setUsageLogs(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as UsageLog)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'logs_uso'));

    const qUsers = query(collection(db, 'users'), limit(30));
    const unsubUsers = onSnapshot(qUsers, (snapshot) => {
      setAllUsers(snapshot.docs.map(d => ({ uid: d.id, ...d.data() } as UserProfile)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'users'));

    const qAlerts = query(collection(db, 'alertas'), orderBy('timestamp', 'desc'), limit(50));
    const unsubAlerts = onSnapshot(qAlerts, (snapshot) => {
      setAlertasList(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Alerta)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'alertas'));

    const qTransactions = query(collection(db, 'transacoes'), orderBy('timestamp', 'desc'), limit(50));
    const unsubTransactions = onSnapshot(qTransactions, (snapshot) => {
      setTransactions(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Transaction)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'transacoes'));

    return () => {
      unsubLogs();
      unsubUsers();
      unsubAlerts();
      unsubTransactions();
    };
  }, [user, isAdmin]);

  const updateUserRole = async (targetUid: string, isAdminStatus: boolean) => {
    try {
      const userRef = doc(db, 'users', targetUid);
      await updateDoc(userRef, { isAdmin: isAdminStatus });
      showToast(t.userUpdated, 'success');
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${targetUid}`);
    }
  };

  const updateUserVip = async (targetUid: string, isVipStatus: boolean) => {
    try {
      const userRef = doc(db, 'users', targetUid);
      const updateData: any = { isVip: isVipStatus };
      if (isVipStatus) updateData.plan = 'pro';
      await updateDoc(userRef, updateData);
      showToast(t.userUpdated, 'success');
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${targetUid}`);
    }
  };

  const updateUserPlanManual = async (targetUid: string, newPlan: 'free' | 'pro') => {
    try {
      const userRef = doc(db, 'users', targetUid);
      await updateDoc(userRef, { plan: newPlan });
      showToast(t.userUpdated, 'success');
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${targetUid}`);
    }
  };

  const updateAlertaStatus = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, 'alertas', id), { status });
      showToast("Status atualizado!", "success");
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `alertas/${id}`);
    }
  };

  const resetDatabase = async () => {
    if (!isAdmin) return;
    if (!window.confirm("TEM CERTEZA? Isso apagará TODOS os dados de teste!")) return;
    
    try {
      const collections = ['users', 'transacoes', 'alertas', 'logs_uso'];
      for (const coll of collections) {
        const snapshot = await getDocs(collection(db, coll));
        for (const d of snapshot.docs) {
          await deleteDoc(doc(db, coll, d.id));
        }
      }
      showToast("Sistema resetado com sucesso!", "success");
      window.location.reload();
    } catch (err) {
      showToast("Erro ao resetar sistema", "error");
    }
  };

  if (!showUI || !isAdmin) return null;

  return (
    <AdminPanel 
      t={t}
      language={language}
      transactions={transactions}
      allUsers={allUsers}
      usageLogs={usageLogs}
      alertasList={alertasList}
      planConfig={planConfig}
      setPlanConfig={setPlanConfig}
      resetDatabase={resetDatabase}
      updateUserPlanManual={updateUserPlanManual}
      updateUserRole={updateUserRole}
      updateUserVip={updateUserVip}
      updateAlertaStatus={updateAlertaStatus}
      showToast={showToast}
    />
  );
};
