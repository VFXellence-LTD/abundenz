import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ListChecks,
  DollarSign,
  Receipt,
  Calculator,
  Wrench,
  Rocket,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ECOSYSTEMS } from "@/data/ecosystems";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/launch/viral/tech", label: "Launch", icon: Rocket, end: false },
  { to: "/setup/content", label: "Setup", icon: ListChecks, end: false },
  { to: "/earnings", label: "Earnings", icon: DollarSign, end: false },
  { to: "/transactions", label: "Transactions", icon: Receipt, end: false },
  { to: "/tax", label: "Tax Center", icon: Calculator, end: false },
  { to: "/tools", label: "Tools", icon: Wrench, end: false },
  { to: "/entity", label: "Entity", icon: Building2, end: false },
];

export function Sidebar() {
  return (
    <aside className="w-60 flex-shrink-0 bg-zinc-950 border-r border-zinc-800 flex flex-col h-screen sticky top-0">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-zinc-800">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
            <span className="text-white text-xs font-bold">P</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-100">Polymath</p>
            <p className="text-xs text-zinc-600">Command Center</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-zinc-800 text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900"
              )
            }
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Ecosystem status */}
      <div className="px-5 py-4 border-t border-zinc-800">
        <p className="text-xs text-zinc-600 mb-2 uppercase tracking-wider font-medium">
          Ecosystems
        </p>
        <div className="space-y-1.5">
          {ECOSYSTEMS.map((eco) => (
            <div key={eco.id} className="flex items-center gap-2">
              <span
                className={cn(
                  "w-2 h-2 rounded-full flex-shrink-0",
                  eco.status === "Active" ? eco.dotColor : "bg-zinc-700"
                )}
              />
              <span className="text-xs text-zinc-500">{eco.name}</span>
              <span className="ml-auto text-xs text-zinc-700">{eco.status}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
