import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const PLACEHOLDER_DATA = [
  { month: "Nov", content: 0, products: 0, affiliate: 0 },
  { month: "Dec", content: 0, products: 0, affiliate: 0 },
  { month: "Jan", content: 0, products: 0, affiliate: 0 },
  { month: "Feb", content: 0, products: 0, affiliate: 0 },
  { month: "Mar", content: 0, products: 0, affiliate: 0 },
  { month: "Apr", content: 0, products: 0, affiliate: 0 },
  { month: "May", content: 0, products: 0, affiliate: 0 },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-3 shadow-xl">
      <p className="text-xs text-zinc-400 mb-2">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 text-xs">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-zinc-300 capitalize">{entry.name}</span>
          <span className="ml-auto text-zinc-100 font-medium">${entry.value.toFixed(2)}</span>
        </div>
      ))}
    </div>
  );
}

export function RevenueChart() {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
      <h3 className="text-sm font-medium text-zinc-300 mb-4">Revenue — Monthly</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={PLACEHOLDER_DATA} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
          <XAxis
            dataKey="month"
            tick={{ fill: "#71717a", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#71717a", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${v}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: "11px", color: "#71717a" }}
            formatter={(value) => (
              <span style={{ color: "#a1a1aa", textTransform: "capitalize" }}>{value}</span>
            )}
          />
          <Line
            type="monotone"
            dataKey="content"
            stroke="#34d399"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: "#34d399" }}
          />
          <Line
            type="monotone"
            dataKey="products"
            stroke="#60a5fa"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: "#60a5fa" }}
          />
          <Line
            type="monotone"
            dataKey="affiliate"
            stroke="#a78bfa"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: "#a78bfa" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
