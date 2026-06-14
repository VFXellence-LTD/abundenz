export type TaskStatus = "backlog" | "todo" | "in-progress" | "blocked" | "in-review" | "done";
export type TaskPriority = "critical" | "high" | "medium" | "low";
export interface Task {
  id: string; title: string; description?: string; type: string;
  ecosystemId: string; verticalId?: string; source: string; status: TaskStatus;
  priority: string; owner?: string; agentId?: string; parentId?: string;
  linkedIds?: string[]; campaignId?: string; contentType?: string; platform?: string;
  autonomyStage: number; checklist?: unknown; createdAt: string; updatedAt: string;
  claudeSessionId?: string;
}
export type CampaignStatus = "planned" | "running" | "paused" | "review" | "done" | "killed";
export interface Campaign {
  id: string; name: string; ecosystemId: string; verticalId?: string;
  status: CampaignStatus; autonomyStage: number; targetCount: number;
  approvedBy?: string; approvedAt?: string; startedAt?: string; completedAt?: string;
  notes?: string; createdAt: string; updatedAt: string;
}
export type ApprovalStatus = "pending" | "approved" | "rejected" | "changes-requested";
export interface ApprovalContent {
  script?: string; hook?: string; shotlist?: string[] | string; caption?: string;
  hashtags?: string[] | string; safeguardReport?: string | Record<string, unknown>;
  videoPath?: string;
  thumbnailPath?: string;
  durationSec?: number;
  renderReport?: { dryRun: boolean; missing: string[]; steps?: unknown[]; renderedAt: string } | string;
}
export interface Approval {
  id: string; taskId?: string; campaignId?: string; ecosystemId: string;
  contentType?: string; artifactPath?: string; previewUrl?: string;
  contentJson?: ApprovalContent; status: ApprovalStatus;
  reviewedBy?: string; reviewedAt?: string; reviewNotes?: string; createdAt: string;
}
export type AgentRunStatus = "queued" | "running" | "waiting" | "done" | "error" | "killed";
export interface AgentRun {
  id: string; campaignId?: string; taskId?: string; agentName?: string;
  claudeSessionId?: string; ptySessionId?: string; status: AgentRunStatus;
  cwd?: string; command?: string; startedAt?: string; completedAt?: string;
  outputJson?: unknown; error?: string;
}
