import { resolveBrandCreds } from "./credentials.js";
import { DryRunDistributor } from "./DryRunDistributor.js";
import { BufferDistributor } from "./BufferDistributor.js";
import { PostizDistributor } from "./PostizDistributor.js";
import type { Distributor } from "./types.js";

export function selectDistributor(ecosystemId: string, env: Record<string, string | undefined>): Distributor {
  const creds = resolveBrandCreds(ecosystemId, env);
  if (creds.provider === "postiz") return new PostizDistributor({ postizApiKey: creds.postizApiKey!, postizApiUrl: creds.postizApiUrl! });
  if (creds.provider === "buffer") return new BufferDistributor({ bufferToken: creds.bufferToken! });
  return new DryRunDistributor();
}
