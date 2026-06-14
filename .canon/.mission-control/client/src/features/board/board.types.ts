import type { TaskStatus } from "@/lib/engine";

export interface BoardColumn { id: TaskStatus; label: string; }

// NO Triage. Blocked is not a column (kept off-board like Halon).
export const BOARD_COLUMNS: BoardColumn[] = [
  { id: "backlog", label: "Backlog" },
  { id: "todo", label: "To Do" },
  { id: "in-progress", label: "In Progress" },
  { id: "in-review", label: "In Review" },
  { id: "done", label: "Done" },
];

// Statuses offered in the per-card status <select>.
export const TRANSITION_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: "backlog", label: "Backlog" },
  { value: "todo", label: "To Do" },
  { value: "in-progress", label: "In Progress" },
  { value: "in-review", label: "In Review" },
  { value: "done", label: "Done" },
];

// Priority left-border tint (schema priorities: critical|high|medium|low; tolerate unknown).
export const PRIORITY_BORDER: Record<string, string> = {
  critical: "border-l-red-500",
  high: "border-l-orange-500",
  medium: "border-l-yellow-500",
  low: "border-l-emerald-500",
};
export const PRIORITY_BG: Record<string, string> = {
  critical: "bg-red-950/30",
  high: "bg-orange-950/20",
  medium: "bg-yellow-950/10",
  low: "bg-emerald-950/10",
};

export const STATUS_ACCENT: Record<TaskStatus, string> = {
  backlog: "#6b7280",
  todo: "#c78052",
  "in-progress": "#299969",
  blocked: "#ef4444",
  "in-review": "#0d84a8",
  done: "#22c55e",
};
