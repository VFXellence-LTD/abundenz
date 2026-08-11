import { useState, useRef, useCallback } from "react";
import { Plus, Download, Upload } from "lucide-react";
import { TransactionTable } from "@/components/TransactionTable";
import { TransactionForm } from "@/components/TransactionForm";
import { FilterBar } from "@/components/FilterBar";
import type { FilterState } from "@/components/FilterBar";
import { useTransactions } from "@/hooks/useTransactions";
import type { NewTransaction } from "@/hooks/useTransactions";
import type { EcosystemId, StreamId, TransactionType } from "@/types";

const DEFAULT_FILTERS: FilterState = {
  dateFrom: "",
  dateTo: "",
  ecosystemId: "all",
  stream: "all",
  type: "all",
};

function parseCSV(text: string): NewTransaction[] {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];
  // Skip header
  const rows = lines.slice(1);
  return rows.flatMap((line) => {
    const cols = line.split(",");
    if (cols.length < 6) return [];
    const [date, ecosystemId, stream, description, amount, type] = cols;
    const parsedAmount = parseFloat(amount);
    if (!date || !ecosystemId || !stream || isNaN(parsedAmount)) return [];
    return [
      {
        date: date.trim(),
        ecosystemId: ecosystemId.trim() as EcosystemId,
        stream: stream.trim() as StreamId,
        description: description.replace(/^"|"$/g, "").replace(/""/g, '"').trim(),
        amount: parsedAmount,
        type: (type?.trim() as TransactionType) ?? "income",
      },
    ];
  });
}

export function TransactionsPage() {
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const fileRef = useRef<HTMLInputElement>(null);

  const { transactions, addTransaction, deleteTransaction, exportCSV, importTransactions } =
    useTransactions();

  const filtered = transactions.filter((t) => {
    if (filters.dateFrom && t.date < filters.dateFrom) return false;
    if (filters.dateTo && t.date > filters.dateTo) return false;
    if (filters.ecosystemId !== "all" && t.ecosystemId !== filters.ecosystemId) return false;
    if (filters.stream !== "all" && t.stream !== filters.stream) return false;
    if (filters.type !== "all" && t.type !== filters.type) return false;
    return true;
  });

  const handleImport = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target?.result as string;
        const parsed = parseCSV(text);
        if (parsed.length > 0) {
          importTransactions(parsed);
        }
      };
      reader.readAsText(file);
      // Reset so same file can be re-imported
      if (fileRef.current) fileRef.current.value = "";
    },
    [importTransactions]
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Transactions</h1>
          <p className="text-sm text-zinc-500 mt-1">
            {transactions.length} transaction{transactions.length !== 1 ? "s" : ""} recorded
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            ref={fileRef}
            type="file"
            accept=".csv"
            onChange={handleImport}
            className="hidden"
          />
          <button
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-zinc-400 bg-zinc-900 border border-zinc-700 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Import CSV
          </button>
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-zinc-400 bg-zinc-900 border border-zinc-700 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-zinc-100 bg-zinc-700 hover:bg-zinc-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Transaction
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <FilterBar filters={filters} onChange={setFilters} />
      </div>

      {/* Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
        <TransactionTable
          transactions={filtered}
          onDelete={deleteTransaction}
          showRunningTotals
        />
      </div>

      {showForm && (
        <TransactionForm onSubmit={addTransaction} onClose={() => setShowForm(false)} />
      )}
    </div>
  );
}
