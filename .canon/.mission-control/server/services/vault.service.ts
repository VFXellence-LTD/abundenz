import fs from "node:fs";
import path from "node:path";

export class VaultService {
  constructor(private launchesDir: string) {}

  /** Write a launch markdown file. Rejects traversal / nested paths. */
  writeLaunch(filename: string, content: string): { ok: true; path: string } {
    if (filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
      throw new Error("Invalid filename");
    }
    fs.mkdirSync(this.launchesDir, { recursive: true });
    const filepath = path.join(this.launchesDir, filename);
    fs.writeFileSync(filepath, content, "utf-8");
    return { ok: true, path: filepath };
  }
}
