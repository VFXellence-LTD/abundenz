import type { BrandCreds } from "./types.js";

const UP = (s: string) => s.toUpperCase();

export function resolveBrandCreds(ecosystemId: string, env: Record<string, string | undefined>): BrandCreds {
  const suffix = `__${UP(ecosystemId)}`;
  const bufferToken = env[`BUFFER_TOKEN${suffix}`];
  const postizApiKey = env[`POSTIZ_API_KEY${suffix}`];
  const postizApiUrl = env[`POSTIZ_API_URL${suffix}`];

  if (postizApiKey && postizApiUrl) return { provider: "postiz", postizApiKey, postizApiUrl };
  if (bufferToken) return { provider: "buffer", bufferToken };
  return { provider: null };
}
