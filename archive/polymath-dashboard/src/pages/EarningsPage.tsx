import { useState } from "react";
import { Plus, Download } from "lucide-react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { StatCard } from "@/components/StatCard";
import { TransactionForm } from "@/components/TransactionForm";
import { useTransactions } from "@/hooks/useTransactions";
import { formatCurrency } from "@/lib/utils";
import { ECOSYSTEMS, REVENUE_STREAMS } from "@/data/ecosystems";

const SPARKLINE_PLACEHOLDER = [
  { v: 0 },
  { v: 0 },
  { v: 0 },
  { v: 0 },
  { v: 0 },
  { v: 0 },
  { v: 0 },
];

function Sparkline({ data }: { data: { v: number }[] }) {
  return (
    <ResponsiveContainer width={80} height={32}>
      <LineChart data={data}>
        <Line
          type="monotone"
          dataKey="v"
          stroke="#52525b"
          strokeWidth={1.5}
          dot={false}
        />
        <Tooltip
          content={() => null}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function EarningsPage() {
  const [showForm, setShowForm] = useState(false);
  const { transactions, addTransaction, exportCSV, totalIncome, totalExpenses, netProfit } =
    useTransactions();

  const revenueByEcosystem = ECOSYSTEMS.map((eco) => {
    const income = transactions
      .filter((t) => t.ecosystemId === eco.id && t.type === "income")
      .reduce((s, t) => s + t.amount, 0);
    const expenses = transactions
      .filter((t) => t.ecosystemId === eco.id && t.type === "expense")
      .reduce((s, t) => s + t.amount, 0);
    return { ...eco, income, expenses, net: income - expenses };
  });

  const revenueByStream = REVENUE_STREAMS.map((stream) => {
    const total = transactions
      .filter((t) => t.stream === stream.id && t.type === "income")
      .reduce((s, t) => s + t.amount, 0);
    return { ...stream, total };
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Earnings</h1>
          <p className="text-sm text-zinc-500 mt-1">Revenue, expenses, and net across all ecosystems</p>
        </div>
        <div className="flex items-center gap-2">
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

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard
          label="Total Revenue"
          value={formatCurrency(totalIncome)}
          accent="green"
          sub="All time"
        />
        <StatCard
          label="Total Expenses"
          value={formatCurrency(totalExpenses)}
          accent="red"
          sub="All time"
        />
        <StatCard
          label="Net Profit"
          value={formatCurrency(netProfit)}
          accent={netProfit >= 0 ? "green" : "red"}
          sub="Revenue − Expenses"
        />
      </div>

      {/* Revenue by ecosystem */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-800">
          <h2 className="text-sm font-semibold text-zinc-300">Revenue by Ecosystem</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Ecosystem
              </th>
              <th className="px-5 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Income
              </th>
              <th className="px-5 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Expenses
              </th>
              <th className="px-5 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Net
              </th>
              <th className="px-5 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider w-28">
                Trend
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {revenueByEcosystem.map((eco) => (
              <tr key={eco.id} className="hover:bg-zinc-900/50">
                <td className="px-5 py-3.5 text-sm font-medium text-zinc-300">{eco.name}</td>
                <td className="px-5 py-3.5 text-sm text-right text-emerald-400 tabular-nums">
                  {formatCurrency(eco.income)}
                </td>
                <td className="px-5 py-3.5 text-sm text-right text-red-400 tabular-nums">
                  {formatCurrency(eco.expenses)}
                </td>
                <td className="px-5 py-3.5 text-sm text-right font-medium tabular-nums text-zinc-300">
                  {formatCurrency(eco.net)}
                </td>
                <td className="px-5 py-3.5 flex justify-end">
                  <Sparkline data={SPARKLINE_PLACEHOLDER} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Revenue by stream */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-800">
          <h2 className="text-sm font-semibold text-zinc-300">Revenue by Stream</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Stream
              </th>
              <th className="px-5 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-5 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider w-28">
                Trend
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {revenueByStream.map((stream) => (
              <tr key={stream.id} className="hover:bg-zinc-900/50">
                <td className="px-5 py-3.5 text-sm text-zinc-300">{stream.label}</td>
                <td className="px-5 py-3.5 text-sm text-right text-zinc-300 tabular-nums">
                  {formatCurrency(stream.total)}
                </td>
                <td className="px-5 py-3.5 flex justify-end">
                  <Sparkline data={SPARKLINE_PLACEHOLDER} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <TransactionForm onSubmit={addTransaction} onClose={() => setShowForm(false)} />
      )}
    </div>
  );
}
