import { logger } from "./logger.service.js";

export interface CredentialResult {
  profileId: string;
  dryRun: boolean;
}

/**
 * Resolves a Buffer profileId for a platform account.
 * credentialRef: the env var key stored in platform_accounts.credential_ref.
 * If the key is absent from env, or credentialRef is null/undefined/empty, returns a synthetic
 * profileId and sets dryRun=true — never throws.
 */
export function resolveAccountCredential(
  credentialRef: string | null,
  env: Record<string, string | undefined>,
): CredentialResult {
  if (!credentialRef) {
    logger.info("credentials", "[DRY-RUN] Would resolve credential — no credential_ref configured");
    return { profileId: "dry-run-null", dryRun: true };
  }

  const value = env[credentialRef];
  if (!value) {
    logger.info("credentials", `[DRY-RUN] Would resolve credential for ${credentialRef}`);
    return { profileId: `dry-run-${credentialRef}`, dryRun: true };
  }

  return { profileId: value, dryRun: false };
}
