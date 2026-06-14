import { VIDEO_CONTENT_TYPE, type RenderedClip } from "./renderTypes.js";
import { VIRAL_ECOSYSTEM_ID } from "./types.js";

export interface RecordVideoOptions { apiBase: string; taskId: string; campaignId: string; }
export interface RecordVideoResult { approvalId: string; }

export async function recordVideoApproval(rendered: RenderedClip, opts: RecordVideoOptions): Promise<RecordVideoResult> {
  const payload = {
    ecosystemId: VIRAL_ECOSYSTEM_ID,
    contentType: VIDEO_CONTENT_TYPE,
    taskId: opts.taskId,
    campaignId: opts.campaignId,
    artifactPath: rendered.videoPath,
    previewUrl: rendered.videoPath,
    contentJson: rendered,
  };
  const res = await fetch(`${opts.apiBase}/approvals`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`recordVideoApproval: POST /approvals failed (${res.status}: ${await res.text()})`);
  const approval = (await res.json()) as { id: string };
  return { approvalId: approval.id };
}
