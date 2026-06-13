import { useState } from "react";
import { Pencil, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate, formatCurrency } from "@/lib/utils";
import type { Transaction } from "@/types";
import { ECOSYSTEMS, REVENUE_STREAMS, EXPENSE_STREAMS } from "@/data/ecosystems";

type SortKey = "date" | "amount" | "ecosystemId" | "stream" | "type";
type SortDir = "asc" | "desc";

interface TransactionTableProps {
  transactions: Transaction[];
  onEdit?: (id: string) => void;
  onDelete: (id: string) => void;
  showRunningTotals?: boolean;
}

const ALL_STREAMS = [...REVENUE_STREAMS, ...EXPENSE_STREAMS];

function streamLabel(id: string): string {
  return ALL_STREAMS.find((s) => s.id === id)?.label ?? id;
}

function ecosystemLabel(id: string): string {
  return ECOSYSTEMS.find((e) => e.id === id)?.name ?? id;
}

export function TransactionTable({
  transactions,
  onEdit,
  onDelete,
  showRunningTotals = false,
}: TransactionTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const sorted = [...transactions].sort((a, b) => {
    let cmp = 0;
    switch (sortKey) {
      case "date":
        cmp = a.date.localeCompare(b.date);
        break;
      case "amount":
        cmp = a.amount - b.amount;
        break;
      case "ecosystemId":
        cmp = a.ecosystemId.localeCompare(b.ecosystemId);
        break;
      case "stream":
        cmp = a.stream.localeCompare(b.stream);
        break;
      case "type":
        cmp = a.type.localeCompare(b.type);
        break;
    }
    return sortDir === "asc" ? cmp : -cmp;
  });

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);
  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <ChevronUp className="w-3 h-3 opacity-20" />;
    return sortDir === "asc" ? (
      <ChevronUp className="w-3 h-3 text-zinc-400" />
    ) : (
      <ChevronDown className="w-3 h-3 text-zinc-400" />
    );
  }

  function Th({
    col,
    children,
    className,
  }: {
    col: SortKey;
    children: React.ReactNode;
    className?: string;
  }) {
    return (
      <th
        className={cn(
          "px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider cursor-pointer hover:text-zinc-300 transition-colors select-none",
          className
        )}
        onClick={() => handleSort(col)}
      >
        <div className="flex items-center gap-1">
          {children}
          <SortIcon col={col} />
        </div>
      </th>
    );
  }

  if (sorted.length === 0) {
    return (
      <div className="text-center py-12 text-zinc-600">
        <p className="text-sm">No transactions yet.</p>
        <p className="text-xs mt-1">Add your first transaction using the button above.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800">
              <Th col="date">Date</Th>
              <Th col="ecosystemId">Ecosystem</Th>
              <Th col="stream">Stream</Th>
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Description
              </th>
              <Th col="amount" className="text-right">
                Amount
              </Th>
              <Th col="type">Type</Th>
              <th className="px-4 py-3 w-16" />
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {sorted.map((txn) => (
              <tr key={txn.id} className="hover:bg-zinc-900/50 transition-colors group">
                <td className="px-4 py-3 text-sm text-zinc-400 whitespace-nowrap">
                  {formatDate(txn.date)}
                </td>
                <td className="px-4 py-3 text-sm text-zinc-300 capitalize">
                  {ecosystemLabel(txn.ecosystemId)}
                </td>
                <td className="px-4 py-3 text-sm text-zinc-400">{streamLabel(txn.stream)}</td>
                <td className="px-4 py-3 text-sm text-zinc-300">{txn.description}</td>
                <td
                  className={cn(
                    "px-4 py-3 text-sm font-medium text-right tabular-nums whitespace-nowrap",
                    txn.type === "income" ? "text-emerald-400" : "text-red-400"
                  )}
                >
                  {txn.type === "income" ? "+" : "-"}
                  {formatCurrency(txn.amount)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "text-xs px-2 py-0.5 rounded-full font-medium",
                      txn.type === "income"
                        ? "bg-emerald-500/15 text-emerald-400"
                        : "bg-red-500/15 text-red-400"
                    )}
                  >
                    {txn.type}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(txn.id)}
                        className="p-1.5 rounded text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => onDelete(txn.id)}
                      className="p-1.5 rounded text-zinc-500 hover:text-red-400 hover:bg-zinc-800 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showRunningTotals && (
        <div className="border-t border-zinc-700 px-4 py-3 flex items-center justify-between bg-zinc-900/50">
          <span className="text-xs text-zinc-500">
            {sorted.length} transaction{sorted.length !== 1 ? "s" : ""}
          </span>
          <div className="flex items-center gap-6">
            <span className="text-xs text-zinc-500">
              Income:{" "}
              <span className="text-emerald-400 font-medium">{formatCurrency(totalIncome)}</span>
            </span>
            <span className="text-xs text-zinc-500">
              Expenses:{" "}
              <span className="text-red-400 font-medium">{formatCurrency(totalExpenses)}</span>
            </span>
            <span className="text-xs text-zinc-500">
              Net:{" "}
              <span
                className={cn(
                  "font-medium",
                  totalIncome - totalExpenses >= 0 ? "text-emerald-400" : "text-red-400"
                )}
              >
                {formatCurrency(totalIncome - totalExpenses)}
              </span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
