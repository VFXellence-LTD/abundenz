import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { PlatformAccount } from "@/types";

export interface NewPlatformAccount {
  brandId?: string | null;
  platform: string;
  handle?: string;
  email?: string;
  trackingId?: string;
  status?: "active" | "pending" | "not-started";
  notes?: string;
  url?: string;
  maxAccounts?: string;
  active?: boolean;
  rotationOrder?: number;
  lastPostedAt?: string;
  staggerHours?: number;
  credentialRef?: string;
}

export function usePlatformAccounts(brandId?: string) {
  const [accounts, setAccounts] = useState<PlatformAccount[]>([]);

  useEffect(() => {
    const path = brandId
      ? `/platform-accounts?brandId=${encodeURIComponent(brandId)}`
      : "/platform-accounts";
    api.get<PlatformAccount[]>(path).then(setAccounts).catch(console.error);
  }, [brandId]);

  const addAccount = useCallback((data: NewPlatformAccount) => {
    api
      .post<PlatformAccount>("/platform-accounts", data)
      .then((created) => setAccounts((prev) => [...prev, created]))
      .catch(console.error);
  }, []);

  const updateAccount = useCallback((id: number, data: Partial<NewPlatformAccount>) => {
    setAccounts((prev) => prev.map((a) => (a.id === id ? { ...a, ...data } : a)));
    api.put<PlatformAccount>(`/platform-accounts/${id}`, data).catch(console.error);
  }, []);

  const deleteAccount = useCallback((id: number) => {
    setAccounts((prev) => prev.filter((a) => a.id !== id));
    api.del(`/platform-accounts/${id}`).catch(console.error);
  }, []);

  return { accounts, addAccount, updateAccount, deleteAccount };
}
