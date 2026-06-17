import { api } from "@/lib/api";
import { saveToVault } from "@/lib/save-to-vault";
import type { Campaign, Task } from "@/lib/engine";

const slug = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 32) || "item";
const stamp = () => Date.now().toString(36);

export interface NewCampaignInput {
  name: string;
  ecosystemId: string;
  verticalId?: string;
  targetCount: number;
  notes?: string;
}

/** Create a campaign, then one child task per target unit (status backlog). */
export async function createCampaignWithTasks(input: NewCampaignInput): Promise<{ campaign: Campaign; tasks: Task[] }> {
  const id = `cmp_${slug(input.name)}_${stamp()}`;
  const campaign = await api.post<Campaign>("/campaigns", {
    id,
    name: input.name,
    ecosystemId: input.ecosystemId,
    verticalId: input.verticalId,
    targetCount: input.targetCount,
    notes: input.notes,
  });
  const tasks: Task[] = [];
  for (let i = 1; i <= input.targetCount; i++) {
    const t = await api.post<Task>("/tasks", {
      id: `tsk_${id}_${i}`,
      title: `${input.name} — unit ${i}`,
      type: "content",
      ecosystemId: input.ecosystemId,
      verticalId: input.verticalId,
      campaignId: id,
      contentType: "clip",
      priority: "medium",
      source: "intake",
    });
    tasks.push(t);
  }
  return { campaign, tasks };
}

export interface NewBrandInput {
  name: string;
  ecosystemId: string;
  email: string;
}

/**
 * Register a brand/ecosystem.
 * POST /api/setup only supports `{ stepId }` toggles — not brand records.
 * Fallback: persist to vault as a markdown file (same pattern as LaunchPage).
 */
export async function registerBrand(input: NewBrandInput): Promise<void> {
  const id = `brand_${slug(input.name)}_${stamp()}`;
  const content = [
    `# Brand: ${input.name}`,
    ``,
    `- **id:** ${id}`,
    `- **ecosystemId:** ${input.ecosystemId}`,
    `- **email:** ${input.email}`,
    `- **registeredAt:** ${new Date().toISOString()}`,
  ].join("\n");
  await saveToVault(`brands/${id}.md`, content);
}

/** File a self-improvement infra task against the content ecosystem. */
export async function fileInfraTask(title: string, description: string): Promise<Task> {
  return api.post<Task>("/tasks", {
    id: `tsk_infra_${slug(title)}_${stamp()}`,
    title: `[MC] ${title}`,
    description,
    type: "infra",
    ecosystemId: "content",
    priority: "medium",
    source: "intake",
  });
}
