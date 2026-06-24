import { execFileSync } from "node:child_process";

export type BugReportArea =
  | "mission-control"
  | "server"
  | "dashboard-client"
  | "polymath-engine"
  | "governance"
  | "automation";

export interface BugReportPayload {
  title: string;
  description?: string;
  area?: BugReportArea;
  severity?: "critical" | "high" | "medium" | "low";
}

export interface BugReportResult {
  url: string;
  dryRun: boolean;
}

const DRY_RUN_URL = "https://github.com/VFXellence-LTD/abundenz/issues/DRY-RUN";

const AREA_LABEL_MAP: Record<BugReportArea, string> = {
  "mission-control": "area/mission-control",
  "server": "area/server",
  "dashboard-client": "area/dashboard-client",
  "polymath-engine": "area/polymath-engine",
  "governance": "area/governance",
  "automation": "area/automation",
};

const DEFAULT_AREA: BugReportArea = "mission-control";

export class BugReportService {
  constructor(private env: Record<string, string | undefined> = process.env as Record<string, string | undefined>) {}

  /** Returns true when the feature is enabled (MC_BUG_REPORT_ENABLED=true|1|yes). Default: off. */
  private isEnabled(): boolean {
    const val = this.env["MC_BUG_REPORT_ENABLED"];
    return val === "true" || val === "1" || val === "yes";
  }

  /** Map an area value to its GitHub label. Unmapped values fall back to area/mission-control. */
  areaToLabel(area: string | undefined): string {
    const key = area as BugReportArea;
    return AREA_LABEL_MAP[key] ?? AREA_LABEL_MAP[DEFAULT_AREA];
  }

  async create(payload: BugReportPayload): Promise<BugReportResult> {
    const { title, description, area, severity } = payload;

    const areaLabel = this.areaToLabel(area);
    const severityLine = severity ? `**Severity:** ${severity}\n` : "";
    const body = `${severityLine}${description ?? ""}`.trim();

    if (!this.isEnabled()) {
      // Dry-run: validate, log, return synthetic URL — never shell gh.
      console.log(
        "[bug-report] WOULD CREATE ISSUE",
        JSON.stringify({ title, body, labels: ["type/bug", areaLabel] }),
      );
      return { url: DRY_RUN_URL, dryRun: true };
    }

    // Live path: shell out to gh.
    const url = execFileSync(
      "gh",
      ["issue", "create", "--repo", "VFXellence-LTD/abundenz", "--title", title, "--body", body || "", "--label", "type/bug", "--label", areaLabel],
      { encoding: "utf-8" },
    ).trim();
    return { url, dryRun: false };
  }
}
