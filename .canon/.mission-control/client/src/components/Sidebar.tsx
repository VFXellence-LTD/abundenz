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
  KanbanSquare,
  Inbox,
  ShieldCheck,
  Megaphone,
  Terminal,
  TerminalSquare,
  Compass,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ECOSYSTEMS } from "@/data/ecosystems";
import { BugReportButton } from "@/components/BugReportButton";
import { useTour } from "@/tour/TourProvider";

const NAV_GROUPS = [
  {
    section: "Overview",
    items: [{ to: "/", label: "Dashboard", icon: LayoutDashboard, end: true, tourId: "nav-dashboard" }],
  },
  {
    section: "Build",
    items: [
      { to: "/setup/content", label: "Setup", icon: ListChecks, end: false, tourId: "nav-setup" },
      { to: "/launch/viral/tech", label: "Launch", icon: Rocket, end: false, tourId: "nav-launch" },
      { to: "/intake", label: "Intake", icon: Inbox, end: false, tourId: "nav-intake" },
    ],
  },
  {
    section: "Operate",
    items: [
      { to: "/campaigns", label: "Campaigns", icon: Megaphone, end: false, tourId: "nav-campaigns" },
      { to: "/agents", label: "Agents", icon: Terminal, end: false, tourId: "nav-agents" },
      { to: "/sessions", label: "Sessions", icon: TerminalSquare, end: false, tourId: "nav-sessions" },
      { to: "/approvals", label: "Approvals", icon: ShieldCheck, end: false, tourId: "nav-approvals" },
      { to: "/board", label: "Board", icon: KanbanSquare, end: false, tourId: "nav-board" },
    ],
  },
  {
    section: "Money",
    items: [
      { to: "/earnings", label: "Earnings", icon: DollarSign, end: false, tourId: "nav-earnings" },
      { to: "/transactions", label: "Transactions", icon: Receipt, end: false, tourId: "nav-transactions" },
      { to: "/tax", label: "Tax Center", icon: Calculator, end: false, tourId: "nav-tax" },
    ],
  },
  {
    section: "Admin",
    items: [
      { to: "/tools", label: "Tools", icon: Wrench, end: false, tourId: "nav-tools" },
      { to: "/entity", label: "Entity", icon: Building2, end: false, tourId: "nav-entity" },
    ],
  },
];

export function Sidebar() {
  const { start } = useTour();

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
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
        {NAV_GROUPS.map((group) => (
          <div key={group.section} className="space-y-0.5">
            <p className="px-3 pb-1 text-xs font-medium uppercase tracking-wider text-zinc-600">
              {group.section}
            </p>
            {group.items.map(({ to, label, icon: Icon, end, tourId }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                data-tour-id={tourId}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-zinc-800 text-zinc-100"
                      : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900",
                  )
                }
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
              </NavLink>
            ))}
          </div>
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
                  eco.status === "Active" ? eco.dotColor : "bg-zinc-700",
                )}
              />
              <span className="text-xs text-zinc-500">{eco.name}</span>
              <span className="ml-auto text-xs text-zinc-700">{eco.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Walkthrough + bug report */}
      <div className="px-3 pb-3 border-t border-zinc-800 pt-2 space-y-1">
        <button
          onClick={start}
          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs text-zinc-600 hover:text-zinc-400 hover:bg-zinc-900 transition-colors"
        >
          <Compass className="w-3.5 h-3.5 flex-shrink-0" />
          Walkthrough
        </button>
        <BugReportButton />
      </div>
    </aside>
  );
}
