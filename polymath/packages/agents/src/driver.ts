import { validateDraft } from "./validateDraft.js";
import { runSafeguardCheck } from "./safeguard.js";
import { writeDraft } from "./artifact.js";
import { recordApproval } from "./apiClient.js";
import type { ClipDraft, SafeguardReport } from "./types.js";

export interface GenerateOptions {
  apiBase: string;
  taskId: string;
  campaignId: string;
  slug: string;
  draftsDir: string;
  date?: string;
}

export interface GenerateResult {
  halted: true;
  safeguard: SafeguardReport;
  artifactPath: string;
  markdownPath: string;
  approvalId: string;
  taskStatus: string;
}

/**
 * Closes the MVP loop for ONE script-level Zrodinger clip draft.
 * generate(by LLM, passed in) -> validate -> safeguard -> write -> record -> HALT.
 * NEVER publishes. NEVER touches social accounts. A blocked draft is still
 * written + recorded (pending, pass=false) for human review — never silently dropped.
 */
export async function runGenerate(draft: ClipDraft, opts: GenerateOptions): Promise<GenerateResult> {
  const validation = validateDraft(draft);
  if (!validation.ok) {
    throw new Error(`runGenerate: draft validation failed — ${validation.errors.join("; ")}`);
  }

  const report = runSafeguardCheck(draft);
  draft.safeguardReport = report;

  const written = writeDraft(draft, {
    draftsDir: opts.draftsDir,
    campaignId: opts.campaignId,
    slug: opts.slug,
    date: opts.date,
  });

  const recorded = await recordApproval(draft, {
    apiBase: opts.apiBase,
    taskId: opts.taskId,
    campaignId: opts.campaignId,
    artifactPath: written.artifactPath,
  });

  // HALT. No publish. No account access. Human reviews in the Approval Queue.
  return {
    halted: true,
    safeguard: report,
    artifactPath: written.artifactPath,
    markdownPath: written.markdownPath,
    approvalId: recorded.approvalId,
    taskStatus: recorded.taskStatus,
  };
}
