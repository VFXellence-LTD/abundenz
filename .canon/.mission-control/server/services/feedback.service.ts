import { execSync } from "node:child_process";

export interface FeedbackItem {
  text: string;
  area?: string;
  severity?: string;
}

export interface FeedbackItemResult {
  url: string;
  dryRun: boolean;
}

export interface FeedbackBatchResult {
  results: FeedbackItemResult[];
}

const DRY_RUN_URL = "https://github.com/VFXellence-LTD/abundenz/issues/DRY-RUN";
const REPO = "VFXellence-LTD/abundenz";

export class FeedbackService {
  constructor(
    private env: Record<string, string | undefined> = process.env as Record<string, string | undefined>,
  ) {}

  /** Returns true when the feature is enabled (MC_FEEDBACK_ENABLED=true|1|yes). Default: off. */
  private isEnabled(): boolean {
    const val = this.env["MC_FEEDBACK_ENABLED"];
    return val === "true" || val === "1" || val === "yes";
  }

  /** Build a concise issue title from feedback text: first line, truncated to 80 chars. */
  titleFor(text: string): string {
    const firstLine = text.trim().split("\n")[0].trim();
    return firstLine.length > 80 ? firstLine.slice(0, 77) + "..." : firstLine;
  }

  private createOne(item: FeedbackItem): FeedbackItemResult {
    const title = this.titleFor(item.text);
    const severityLine = item.severity ? `**Severity:** ${item.severity}\n` : "";
    const areaLine = item.area ? `**Area:** ${item.area}\n` : "";
    const body = `${severityLine}${areaLine}${item.text.trim()}`.trim();

    if (!this.isEnabled()) {
      console.log(
        "[feedback] WOULD CREATE ISSUE",
        JSON.stringify({ title, body, labels: ["feedback", "enhancement"] }),
      );
      return { url: DRY_RUN_URL, dryRun: true };
    }

    const labelArgs = ["feedback", "enhancement"]
      .map((l) => `--label ${JSON.stringify(l)}`)
      .join(" ");

    const cmd = [
      "gh issue create",
      `--repo ${REPO}`,
      `--title ${JSON.stringify(title)}`,
      `--body ${JSON.stringify(body)}`,
      labelArgs,
    ].join(" ");

    const url = execSync(cmd, { encoding: "utf-8" }).trim();
    return { url, dryRun: false };
  }

  async createBatch(items: FeedbackItem[]): Promise<FeedbackBatchResult> {
    const results = items.map((item) => this.createOne(item));
    return { results };
  }
}
