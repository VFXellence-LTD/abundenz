import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Campaign, CampaignStatus } from "@/lib/engine";

const APPROVER = "Robin Dutta";

export function useCampaigns(ecosystem: string = "all") {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(() => {
    api
      .get<Campaign[]>(`/campaigns?ecosystem=${encodeURIComponent(ecosystem)}`)
      .then((c) => { setCampaigns(c); setError(null); })
      .catch((e: Error) => setError(e.message));
  }, [ecosystem]);

  useEffect(() => { reload(); }, [reload]);

  const approve = useCallback(async (id: string) => {
    const c = await api.post<Campaign>(`/campaigns/${id}/approve`, { approvedBy: APPROVER });
    setCampaigns((prev) => prev.map((x) => (x.id === id ? c : x)));
    return c;
  }, []);

  const setStatus = useCallback(async (id: string, status: CampaignStatus) => {
    try {
      const c = await api.patch<Campaign>(`/campaigns/${id}/status`, { status });
      setCampaigns((prev) => prev.map((x) => (x.id === id ? c : x)));
    } catch (e) {
      setError((e as Error).message);
      reload();
    }
  }, [reload]);

  return { campaigns, error, reload, approve, setStatus };
}
