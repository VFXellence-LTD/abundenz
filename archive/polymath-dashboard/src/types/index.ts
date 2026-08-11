export type EcosystemId = "content" | "products" | "affiliate";

export type EcosystemStatus = "Active" | "Parked" | "Design";

export interface Ecosystem {
  id: EcosystemId;
  name: string;
  status: EcosystemStatus;
  phase: string;
  nextAction: string;
  accentColor: string;
  dotColor: string;
}

export type StepStatus = "pending" | "complete" | "locked";

export interface CopyBlock {
  label: string;
  content: string;
}

export interface ExternalLink {
  label: string;
  url: string;
}

export interface SetupStep {
  id: string;
  ecosystemId: EcosystemId;
  order: number;
  title: string;
  description: string;
  instructions: string;
  copyBlocks?: CopyBlock[];
  externalLinks?: ExternalLink[];
}

export type TransactionType = "income" | "expense";

export type StreamId =
  | "youtube"
  | "affiliate"
  | "sponsorship"
  | "newsletter"
  | "products"
  | "community"
  | "consulting"
  | "subscriptions"
  | "tools"
  | "contractors"
  | "advertising"
  | "hosting"
  | "education"
  | "equipment"
  | "home_office"
  | "other";

export interface Transaction {
  id: string;
  date: string; // ISO date string
  amount: number;
  ecosystemId: EcosystemId;
  stream: StreamId;
  description: string;
  type: TransactionType;
}

export type ToolStatus = "active" | "candidate" | "rejected";

export interface Tool {
  id: string;
  name: string;
  costPerMonth: number;
  ecosystems: EcosystemId[];
  status: ToolStatus;
  url?: string;
  notes?: string;
}

export interface SetupProgress {
  [stepId: string]: boolean;
}
