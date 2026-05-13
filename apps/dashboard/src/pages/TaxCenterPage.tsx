import { StatCard } from "@/components/StatCard";
import { TaxEstimator } from "@/components/TaxEstimator";
import { useTransactions } from "@/hooks/useTransactions";
import { formatCurrency } from "@/lib/utils";
import { ECOSYSTEMS, EXPENSE_STREAMS } from "@/data/ecosystems";
import { cn } from "@/lib/utils";

const FORM_1099_PLATFORMS = [
  { platform: "YouTube / Google", stream: "youtube", threshold: 600 },
  { platform: "Gumroad", stream: "products", threshold: 600 },
  { platform: "Lemon Squeezy", stream: "products", threshold: 600 },
  { platform: "Stripe", stream: "consulting", threshold: 600 },
  { platform: "Amazon Associates", stream: "affiliate", threshold: 600 },
  { platform: "beehiiv (sponsorships)", stream: "sponsorship", threshold: 600 },
];

export function TaxCenterPage() {
  const { transactions } = useTransactions();

  const currentYear = new Date().getFullYear();
  const ytd = transactions.filter((t) => t.date.startsWith(String(currentYear)));

  const ytdByEcosystem = ECOSYSTEMS.map((eco) => ({
    ...eco,
    income: ytd
      .filter((t) => t.ecosystemId === eco.id && t.type === "income")
      .reduce((s, t) => s + t.amount, 0),
  }));

  const ytdTotalIncome = ytdByEcosystem.reduce((s, e) => s + e.income, 0);

  const ytdExpensesByCategory = EXPENSE_STREAMS.map((stream) => ({
    ...stream,
    total: ytd
      .filter((t) => t.stream === stream.id && t.type === "expense")
      .reduce((s, t) => s + t.amount, 0),
  })).filter((s) => s.total > 0);

  const platform1099 = FORM_1099_PLATFORMS.map((p) => {
    const total = ytd
      .filter((t) => t.stream === p.stream && t.type === "income")
      .reduce((s, t) => s + t.amount, 0);
    const willReceive = total >= p.threshold;
    return { ...p, total, willReceive };
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Tax Center</h1>
        <p className="text-sm text-zinc-500 mt-1">
          YTD {currentYear} tax overview — self-employment estimates
        </p>
      </div>

      {/* YTD income by ecosystem */}
      <div className="grid grid-cols-3 gap-4">
        {ytdByEcosystem.map((eco) => (
          <StatCard
            key={eco.id}
            label={`${eco.name} YTD Income`}
            value={formatCurrency(eco.income)}
            accent={eco.income > 0 ? "green" : "default"}
          />
        ))}
      </div>

      {/* Tax estimator */}
      <TaxEstimator ytdIncome={ytdTotalIncome} />

      {/* Expenses by category */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-800">
          <h2 className="text-sm font-semibold text-zinc-300">YTD Expenses by Category</h2>
        </div>
        {ytdExpensesByCategory.length === 0 ? (
          <div className="px-5 py-8 text-center text-zinc-600 text-sm">
            No expenses recorded for {currentYear} yet.
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-5 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {ytdExpensesByCategory.map((cat) => (
                <tr key={cat.id} className="hover:bg-zinc-900/50">
                  <td className="px-5 py-3.5 text-sm text-zinc-300">{cat.label}</td>
                  <td className="px-5 py-3.5 text-sm text-right text-red-400 tabular-nums font-medium">
                    {formatCurrency(cat.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 1099 tracker */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-800">
          <h2 className="text-sm font-semibold text-zinc-300">1099 Tracker</h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Platforms issue 1099 when lifetime payments exceed $600
          </p>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Platform
              </th>
              <th className="px-5 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Threshold
              </th>
              <th className="px-5 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Current YTD
              </th>
              <th className="px-5 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">
                1099 Expected
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {platform1099.map((p) => (
              <tr key={p.platform} className="hover:bg-zinc-900/50">
                <td className="px-5 py-3.5 text-sm text-zinc-300">{p.platform}</td>
                <td className="px-5 py-3.5 text-sm text-right text-zinc-500 tabular-nums">
                  {formatCurrency(p.threshold)}
                </td>
                <td className="px-5 py-3.5 text-sm text-right text-zinc-300 tabular-nums font-medium">
                  {formatCurrency(p.total)}
                </td>
                <td className="px-5 py-3.5 text-right">
                  <span
                    className={cn(
                      "inline-flex text-xs px-2 py-0.5 rounded-full font-medium",
                      p.willReceive
                        ? "bg-amber-500/15 text-amber-400"
                        : "bg-zinc-800 text-zinc-500"
                    )}
                  >
                    {p.willReceive ? "Yes" : "No"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
