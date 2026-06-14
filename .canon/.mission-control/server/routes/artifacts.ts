import { Router, type Request, type Response } from "express";
import fs from "node:fs";
import type { Db } from "../db.js";
import { resolveArtifact } from "../services/artifacts.service.js";

export function createArtifactsRouter(db: Db, artifactsRoot: string): Router {
  const router = Router();

  router.get("/:id", (req: Request, res: Response) => {
    const result = resolveArtifact(db, artifactsRoot, String(req.params["id"]));
    if (!result.ok) {
      if (result.reason === "outside-root") {
        res.status(400).json({ error: "Artifact path is outside the allowed root" });
        return;
      }
      res.status(404).json({ error: "Artifact not found" });
      return;
    }
    res.setHeader("Content-Type", result.contentType);
    fs.createReadStream(result.filePath).pipe(res);
  });

  return router;
}
