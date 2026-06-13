import { useState, useCallback, useEffect } from "react";
import type { Transaction, TransactionType, EcosystemId, StreamId } from "@/types";
import { api } from "@/lib/api";

export interface NewTransaction {
  date: string;
  amount: number;
  ecosystemId: EcosystemId;
  stream: StreamId;
  description: string;
  type: TransactionType;
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    api.get<Transaction[]>("/transactions").then(setTransactions).catch(console.error);
  }, []);

  const addTransaction = useCallback((data: NewTransaction) => {
    api
      .post<Transaction>("/transactions", data)
      .then((created) => setTransactions((prev) => [created, ...prev]))
      .catch(console.error);
  }, []);

  const updateTransaction = useCallback((id: string, data: Partial<NewTransaction>) => {
    setTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, ...data } : t)));
    api.put<Transaction>(`/transactions/${id}`, data).catch(console.error);
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    api.del(`/transactions/${id}`).catch(console.error);
  }, []);

  const importTransactions = useCallback((incoming: NewTransaction[]) => {
    api
      .post<Transaction[]>("/transactions/import", incoming)
      .then((created) => setTransactions((prev) => [...created, ...prev]))
      .catch(console.error);
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

  const totalIncome = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
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
