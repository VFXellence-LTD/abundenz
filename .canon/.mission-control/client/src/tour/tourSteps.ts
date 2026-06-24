import type { TourStep } from "@/tour/tourReducer";

// Each step navigates to `route`, then highlights the sidebar nav item with the
// matching data-tour-id. Order mirrors the sidebar workflow grouping.
export const TOUR_STEPS: TourStep[] = [
  { targetId: "nav-dashboard", route: "/", title: "Dashboard", body: "Your bird's-eye view — ecosystem status, revenue, and what to do today." },
  { targetId: "nav-setup", route: "/setup/content", title: "Setup", body: "Onboard an ecosystem: register domains and stand up accounts. Start here." },
  { targetId: "nav-launch", route: "/launch/viral/tech", title: "Launch", body: "Launch a vertical — checklists, templates, and artifacts for going live." },
  { targetId: "nav-intake", route: "/intake", title: "Intake", body: "Spin up campaigns, register brands, and file improvement requests." },
  { targetId: "nav-campaigns", route: "/campaigns", title: "Campaigns", body: "Control panel for running campaigns and their agent activity." },
  { targetId: "nav-agents", route: "/agents", title: "Agents", body: "Watch active agent runs working your ecosystems." },
  { targetId: "nav-sessions", route: "/sessions", title: "Sessions", body: "Live terminal sessions for agents — full visibility into what's running." },
  { targetId: "nav-approvals", route: "/approvals", title: "Approvals", body: "The human gate. Nothing publishes without your approval here." },
  { targetId: "nav-board", route: "/board", title: "Board", body: "Kanban task board across all ecosystems." },
  { targetId: "nav-earnings", route: "/earnings", title: "Earnings", body: "Revenue stats and trends per ecosystem." },
  { targetId: "nav-transactions", route: "/transactions", title: "Transactions", body: "Every income and expense, filterable by ecosystem." },
  { targetId: "nav-tax", route: "/tax", title: "Tax Center", body: "Tax estimates and compliance info." },
  { targetId: "nav-tools", route: "/tools", title: "Tools & Entity", body: "Utilities and your business entity details. That's the tour — got ideas to improve Mission Control? Add them next." },
];
