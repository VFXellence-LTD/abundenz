import { CLIP_CONTENT_TYPE, VIRAL_ECOSYSTEM_ID, type ApprovalPayload, type ClipDraft } from "./types.js";

export interface RecordApprovalOptions {
  apiBase: string; // e.g. http://localhost:4500/api
  taskId: string;
  campaignId: string;
  artifactPath: string;
}

export interface RecordApprovalResult {
  approvalId: string;
  taskStatus: string;
}

function buildPayload(draft: ClipDraft, opts: RecordApprovalOptions): ApprovalPayload {
  if (!draft.safeguardReport) {
    throw new Error("recordApproval: safeguardReport is null — never record an unchecked draft.");
  }
  return {
    ecosystemId: VIRAL_ECOSYSTEM_ID,
    contentType: CLIP_CONTENT_TYPE,
    taskId: opts.taskId,
    campaignId: opts.campaignId,
    artifactPath: opts.artifactPath,
    contentJson: {
      hook: draft.hook,
      script: draft.script,
      shotlist: draft.shotlist,
      caption: draft.caption,
      hashtags: draft.hashtags,
      sourceRefs: draft.sourceRefs,
      safeguardReport: draft.safeguardReport,
    },
  };
}

export async function recordApproval(draft: ClipDraft, opts: RecordApprovalOptions): Promise<RecordApprovalResult> {
  const payload = buildPayload(draft, opts);

  const approvalRes = await fetch(`${opts.apiBase}/approvals`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!approvalRes.ok) {
    throw new Error(`recordApproval: POST /approvals failed (${approvalRes.status}: ${await approvalRes.text()})`);
  }
  const approval = (await approvalRes.json()) as { id: string };

  const taskRes = await fetch(`${opts.apiBase}/tasks/${opts.taskId}/status`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ status: "in-review" }),
  });
  if (!taskRes.ok) {
    throw new Error(`recordApproval: PATCH /tasks/${opts.taskId}/status failed (${taskRes.status}: ${await taskRes.text()})`);
  }
  const task = (await taskRes.json()) as { status: string };

  return { approvalId: approval.id, taskStatus: task.status };
}
