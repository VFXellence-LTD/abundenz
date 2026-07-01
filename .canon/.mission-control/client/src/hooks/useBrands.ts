import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Brand, EcosystemId } from "@/types";

export type BrandRecord = Omit<Brand, "accounts">;

export interface NewBrand {
  id?: string;
  name: string;
  ecosystemId: EcosystemId;
  email?: string;
}

export function useBrands() {
  const [brands, setBrands] = useState<BrandRecord[]>([]);

  useEffect(() => {
    api.get<BrandRecord[]>("/brands").then(setBrands).catch(console.error);
  }, []);

  const addBrand = useCallback((data: NewBrand): Promise<BrandRecord> => {
    return api
      .post<BrandRecord>("/brands", data)
      .then((created) => {
        setBrands((prev) => [created, ...prev]);
        return created;
      });
  }, []);

  const updateBrand = useCallback((id: string, data: Partial<NewBrand>) => {
    setBrands((prev) => prev.map((b) => (b.id === id ? { ...b, ...data } : b)));
    api.put<BrandRecord>(`/brands/${id}`, data).catch(console.error);
  }, []);

  const deleteBrand = useCallback((id: string) => {
    setBrands((prev) => prev.filter((b) => b.id !== id));
    api.del(`/brands/${id}`).catch(console.error);
  }, []);

  return { brands, addBrand, updateBrand, deleteBrand };
}
