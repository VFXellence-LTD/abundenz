import fs from "node:fs";
import path from "node:path";

export interface BuildSurgePromptOpts {
  campaignId: string;
  /** .canon root; defaults to config.canonPath at the call site. */
  canonPath: string;
}

function readOrMissing(filePath: string): string {
  try {
    return fs.readFileSync(filePath, "utf-8");
  } catch {
    return `(not found)\n<!-- path: ${filePath} -->`;
  }
}

/**
 * Assemble the Surge engine seed prompt from .canon viral doctrine.
 * Sources: surge-formula playbook, the Surge ecosystem README (Zrodinger clip spec),
 * and the viral-surge safeguards policy. Missing files degrade to a labeled section.
 */
export function buildSurgePrompt(opts: BuildSurgePromptOpts): string {
  const { campaignId, canonPath } = opts;
  const formulaPath = path.join(
    canonPath, "2_architect", "polymath-business", "ecosystems", "viral",
    "shared", "playbooks", "surge-formula.md",
  );
  const specPath = path.join(
    canonPath, "2_architect", "polymath-business", "ecosystems", "viral", "README.md",
  );
  const safeguardsPath = path.join(
    canonPath, "1_controller", "standards", "polymath-business", "safeguards", "viral-surge.md",
  );

  const formula = readOrMissing(formulaPath);
  const spec = readOrMissing(specPath);
  const safeguards = readOrMissing(safeguardsPath);

  return `/surge-generate ${campaignId}

Context pre-loaded for this Surge session (read-only doctrine):

## Surge Formula (playbook)
${formula}

## Surge / Zrodinger Clip Spec
${spec}

## Surge Safeguards POLICY (mandatory)
${safeguards}

## Instructions
Produce ONE Zrodinger clip DRAFT artifact for campaign ${campaignId}:
1. Read the doctrine above plus the campaign context.
2. Generate a SCRIPT-LEVEL draft only — hook, script, shotlist, caption, hashtags.
3. Run the safeguard check against the POLICY; attach the safeguard report.
4. Write the draft to disk (artifactPath) and POST an approval_queue row via
   POST /api/approvals { ecosystemId: 'viral', contentType: 'clip', artifactPath, contentJson }
   (server forces status:'pending'; do NOT send status in the body).
5. Set the linked task to 'in-review' and HALT. No publish, no social accounts, no render.
`;
}
