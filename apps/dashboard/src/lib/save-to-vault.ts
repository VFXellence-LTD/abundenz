const VAULT_API = "/__vault";

export async function saveToVault(filename: string, content: string): Promise<void> {
  const res = await fetch(`${VAULT_API}/${filename}`, {
    method: "PUT",
    headers: { "Content-Type": "text/markdown" },
    body: content,
  });
  if (!res.ok) {
    throw new Error(`Failed to save: ${res.status} ${await res.text()}`);
  }
}
