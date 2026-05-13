import { useState, useCallback } from "react";
import type { Transaction, TransactionType, EcosystemId, StreamId } from "@/types";

const STORAGE_KEY = "polymath_transactions";

function loadFromStorage(): Transaction[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveToStorage(transactions: Transaction[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

function generateId(): string {
  return `txn_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export interface NewTransaction {
  date: string;
  amount: number;
  ecosystemId: EcosystemId;
  stream: StreamId;
  description: string;
  type: TransactionType;
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>(loadFromStorage);

  const addTransaction = useCallback((data: NewTransaction) => {
    const newTxn: Transaction = { ...data, id: generateId() };
    setTransactions((prev) => {
      const updated = [newTxn, ...prev];
      saveToStorage(updated);
      return updated;
    });
  }, []);

  const updateTransaction = useCallback(
    (id: string, data: Partial<NewTransaction>) => {
      setTransactions((prev) => {
        const updated = prev.map((t) => (t.id === id ? { ...t, ...data } : t));
        saveToStorage(updated);
        return updated;
      });
    },
    []
  );

  const deleteTransaction = useCallback((id: string) => {
    setTransactions((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      saveToStorage(updated);
      return updated;
    });
  }, []);

  const importTransactions = useCallback((incoming: NewTransaction[]) => {
    const newTxns: Transaction[] = incoming.map((t) => ({
      ...t,
      id: generateId(),
    }));
    setTransactions((prev) => {
      const updated = [...newTxns, ...prev];
      saveToStorage(updated);
      return updated;
    });
  }, []);

  const exportCSV = useCallback(() => {
    const headers = ["date", "ecosystem", "stream", "description", "amount", "type"];
    const rows = transactions.map((t) => [
      t.date,
      t.ecosystemId,
      t.stream,
      `"${t.description.replace(/"/g, '""')}"`,
      t.amount.toFixed(2),
      t.type,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `polymath-transactions-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [transactions]);

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const netProfit = totalIncome - totalExpenses;

  return {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    importTransactions,
    exportCSV,
    totalIncome,
    totalExpenses,
    netProfit,
  };
}
