import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { ClipDraft } from "./types.js";
import { renderClip } from "./renderClip.js";
import { recordVideoApproval } from "./videoApiClient.js";

export interface RunRenderOptions {
  apiBase: string;
  artifactsRoot: string;
  forceDryRun?: boolean;
}

export interface RunRenderResult {
  halted: true;
  approvalId: string;
  videoPath: string;
  dryRun: boolean;
}

interface ApprovalRow {
  id: string;
  contentType: string;
  status: string;
  artifactPath: string;
  taskId: string;
  campaignId: string;
}

export async function runRender(approvalId: string, opts: RunRenderOptions): Promise<RunRenderResult> {
  // 1. Fetch the approval row
  const res = await fetch(`${opts.apiBase}/approvals/${approvalId}`);
  if (!res.ok) throw new Error(`runRender: GET /approvals/${approvalId} failed (${res.status})`);
  const row = (await res.json()) as ApprovalRow;

  // 2. Guard: only run on approved clip rows — never render unapproved or non-clip
  if (row.contentType !== "clip") {
    throw new Error(`runRender: refuses to render a non-clip approval (contentType=${row.contentType})`);
  }
  if (row.status !== "approved") {
    throw new Error(`runRender: refuses — approval is not approved (status=${row.status})`);
  }

  // 3. Read the draft artifact
  const draft = JSON.parse(readFileSync(row.artifactPath, "utf8")) as ClipDraft;

  // 4. Build output directory
  const slug = `${row.campaignId}-${approvalId}`;
  const outDir = join(opts.artifactsRoot, row.campaignId, slug);

  // 5. Render (dry-run by default unless real creds present)
  const forceDryRun = opts.forceDryRun ?? !process.env.ELEVENLABS_API_KEY;
  const rendered = await renderClip(draft, {
    sourceDraftPath: row.artifactPath,
    outDir,
    slug,
    forceDryRun,
  });

  // 6. Record the second pending approval row (content_type='video')
  const { approvalId: videoApprovalId } = await recordVideoApproval(rendered, {
    apiBase: opts.apiBase,
    taskId: row.taskId,
    campaignId: row.campaignId,
  });

  // 7. HALT. No publish. No task->done. Human approves the rendered video before publish.
  return {
    halted: true,
    approvalId: videoApprovalId,
    videoPath: rendered.videoPath,
    dryRun: rendered.renderReport.dryRun,
  };
}
