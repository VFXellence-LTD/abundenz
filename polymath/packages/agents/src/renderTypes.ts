/** Post-render artifact types. SEPARATE from ClipDraft — these keys are exactly
 *  the ones validateDraft forbids, because this is the rendered output, not the script. */

export interface RenderStep {
  adapter: "voice" | "visual" | "assembly";
  mode: "real" | "dry-run";
  note: string;
}

export interface RenderReport {
  /** true if ANY adapter ran in dry-run (stub) mode. */
  dryRun: boolean;
  /** Capabilities/keys/tools that were absent, forcing dry-run (e.g. "ELEVENLABS_API_KEY"). */
  missing: string[];
  steps: RenderStep[];
  renderedAt: string;
}

export interface RenderedClip {
  /** The approved Plan-4 clip artifact .json this render derives from. */
  sourceDraftPath: string;
  voiceoverPath: string;
  visualPaths: string[];
  videoPath: string;
  thumbnailPath: string;
  durationSec: number;
  renderedAt: string;
  renderReport: RenderReport;
}

export const VIDEO_CONTENT_TYPE = "video" as const;

export function makeEmptyRenderReport(): RenderReport {
  return { dryRun: false, missing: [], steps: [], renderedAt: new Date().toISOString() };
}

export function isRenderedClip(v: unknown): v is RenderedClip {
  if (!v || typeof v !== "object") return false;
  const o = v as Record<string, unknown>;
  return (
    typeof o.sourceDraftPath === "string" &&
    typeof o.voiceoverPath === "string" &&
    Array.isArray(o.visualPaths) &&
    typeof o.videoPath === "string" &&
    typeof o.thumbnailPath === "string" &&
    typeof o.durationSec === "number" &&
    typeof o.renderedAt === "string" &&
    !!o.renderReport && typeof o.renderReport === "object"
  );
}
