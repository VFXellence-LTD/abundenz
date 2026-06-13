import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface TaxEstimatorProps {
  ytdIncome: number;
}

const QUARTERLY_DEADLINES = [
  { quarter: "Q1", due: "April 15" },
  { quarter: "Q2", due: "June 15" },
  { quarter: "Q3", due: "September 15" },
  { quarter: "Q4", due: "January 15" },
];

function getNextDeadline(): { quarter: string; due: string } {
  const now = new Date();
  const month = now.getMonth() + 1; // 1-12
  if (month <= 4) return QUARTERLY_DEADLINES[0];
  if (month <= 6) return QUARTERLY_DEADLINES[1];
  if (month <= 9) return QUARTERLY_DEADLINES[2];
  return QUARTERLY_DEADLINES[3];
}

export function TaxEstimator({ ytdIncome }: TaxEstimatorProps) {
  const [taxRate, setTaxRate] = useState(30);
  const estimated = ytdIncome * (taxRate / 100);
  const quarterlyPayment = estimated / 4;
  const nextDeadline = getNextDeadline();

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-zinc-200">Estimated Tax Liability</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500">Rate</span>
          <input
            type="number"
            min={1}
            max={60}
            value={taxRate}
            onChange={(e) => setTaxRate(Number(e.target.value))}
            className="w-16 bg-zinc-950 border border-zinc-700 rounded px-2 py-1 text-sm text-zinc-200 text-center focus:outline-none focus:border-zinc-500"
          />
          <span className="text-xs text-zinc-500">%</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-zinc-950 rounded-lg p-3">
          <p className="text-xs text-zinc-500 mb-1">YTD Income</p>
          <p className="text-lg font-semibold text-zinc-100 tabular-nums">
            {formatCurrency(ytdIncome)}
          </p>
        </div>
        <div className="bg-zinc-950 rounded-lg p-3">
          <p className="text-xs text-zinc-500 mb-1">Annual Tax Est.</p>
          <p className="text-lg font-semibold text-amber-400 tabular-nums">
            {formatCurrency(estimated)}
          </p>
        </div>
        <div className="bg-zinc-950 rounded-lg p-3">
          <p className="text-xs text-zinc-500 mb-1">Quarterly Payment</p>
          <p className="text-lg font-semibold text-amber-300 tabular-nums">
            {formatCurrency(quarterlyPayment)}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between bg-zinc-950 rounded-lg px-4 py-3">
        <div>
          <p className="text-xs text-zinc-500">Next Quarterly Deadline</p>
          <p className="text-sm font-medium text-zinc-200 mt-0.5">
            {nextDeadline.quarter} — {nextDeadline.due}
          </p>
        </div>
        <div
          className={cn(
            "text-xs font-medium px-3 py-1 rounded-full",
            ytdIncome > 0
              ? "bg-amber-500/15 text-amber-400"
              : "bg-zinc-700/40 text-zinc-500"
          )}
        >
          {ytdIncome > 0 ? formatCurrency(quarterlyPayment) + " due" : "No liability yet"}
        </div>
      </div>

      <p className="text-xs text-zinc-600">
        Estimate only. Consult a tax professional. Self-employment tax (15.3%) applies on top of
        income tax in the US.
      </p>
    </div>
  );
}
