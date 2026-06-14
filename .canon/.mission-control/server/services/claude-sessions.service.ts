import fs from "node:fs";
import path from "node:path";
import { logger } from "./logger.service.js";

export class ClaudeSessionsService {
  private claudeDir: string;

  /** @param claudeDir override for the `<home>/.claude/projects` root (tests). */
  constructor(claudeDir?: string) {
    if (claudeDir) {
      this.claudeDir = claudeDir;
    } else {
      const home = process.env["USERPROFILE"] || process.env["HOME"] || "";
      this.claudeDir = path.join(home, ".claude", "projects");
    }
  }

  /** Convert a cwd to Claude's project dir name: replace : \ / _ space with -, strip leading -. */
  private projectDirName(cwd: string): string {
    return cwd.replace(/[:\\/_ ]/g, "-").replace(/^-/, "");
  }

  /**
   * Find the most recent Claude session transcript that references the campaignId.
   * Scans the 20 newest *.jsonl files, the first 50 lines of each. Returns the UUID or null.
   */
  async findSessionForCampaign(campaignId: string, cwd: string): Promise<string | null> {
    const projectDir = path.join(this.claudeDir, this.projectDirName(cwd));
    if (!fs.existsSync(projectDir)) {
      logger.debug("claude-sessions", `Project dir not found: ${projectDir}`);
      return null;
    }

    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(projectDir, { withFileTypes: true });
    } catch (err) {
      logger.warn("claude-sessions", `Failed to read project dir: ${projectDir}`, {
        error: err instanceof Error ? err.message : String(err),
      });
      return null;
    }

    const files = entries
      .filter((e) => e.isFile() && e.name.endsWith(".jsonl"))
      .map((e) => {
        const filePath = path.join(projectDir, e.name);
        let mtime = 0;
        try { mtime = fs.statSync(filePath).mtimeMs; } catch { /* leave 0 */ }
        return { name: e.name, filePath, mtime };
      })
      .sort((a, b) => b.mtime - a.mtime)
      .slice(0, 20);

    for (const file of files) {
      const sessionId = file.name.replace(".jsonl", "");
      try {
        const content = fs.readFileSync(file.filePath, "utf-8");
        const lines = content.split("\n").slice(0, 50);
        for (const rawLine of lines) {
          if (!rawLine.trim()) continue;
          try {
            const entry = JSON.parse(rawLine) as Record<string, unknown>;
            const msgStr = JSON.stringify(entry["message"] ?? "");
            if (msgStr.includes(campaignId)) {
              logger.info("claude-sessions", `Found session ${sessionId} for campaign ${campaignId}`);
              return sessionId;
            }
          } catch { continue; }
        }
      } catch (err) {
        logger.debug("claude-sessions", `Skipping unreadable session file: ${file.name}`, {
          error: err instanceof Error ? err.message : String(err),
        });
        continue;
      }
    }

    logger.debug("claude-sessions", `No session found for campaign ${campaignId} in ${projectDir}`);
    return null;
  }
}
