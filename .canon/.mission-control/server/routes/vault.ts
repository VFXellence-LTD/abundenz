import { Router, type Request, type Response } from "express";
import express from "express";
import { VaultService } from "../services/vault.service.js";

export function createVaultRouter(vaultService: VaultService): Router {
  const router = Router();

  // Accept text/* and application/octet-stream bodies as raw markdown.
  router.use(express.text({ type: ["text/*", "application/octet-stream"], limit: "2mb" }));

  router.post("/launches/:filename", (req: Request, res: Response) => {
    const filename = decodeURIComponent(String(req.params["filename"]));
    const content = typeof req.body === "string" ? req.body : "";
    try {
      const result = vaultService.writeLaunch(filename, content);
      res.json(result);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      res.status(msg === "Invalid filename" ? 400 : 500).json({ error: msg });
    }
  });

  return router;
}
