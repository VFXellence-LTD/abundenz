export interface CredentialResult {
  profileId: string;
  dryRun: boolean;
}

/**
 * Resolves a Buffer profileId for a platform account.
 * credentialRef: the env var key stored in platform_accounts.credential_ref.
 * If the key is absent from env, or credentialRef is null, returns a synthetic
 * profileId and sets dryRun=true — never throws.
 */
export function resolveAccountCredential(
  credentialRef: string | null,
  env: Record<string, string | undefined>,
): CredentialResult {
  if (credentialRef === null || credentialRef === undefined) {
    console.log(`[DRY-RUN] Would resolve credential for null (no credential_ref configured)`);
    return { profileId: `dry-run-${Date.now()}`, dryRun: true };
  }

  const value = env[credentialRef];
  if (!value) {
    console.log(`[DRY-RUN] Would resolve credential for ${credentialRef}`);
    return { profileId: `dry-run-${credentialRef}`, dryRun: true };
  }

  return { profileId: value, dryRun: false };
}
