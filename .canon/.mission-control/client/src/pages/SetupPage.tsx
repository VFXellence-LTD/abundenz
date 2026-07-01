import { useParams, NavLink, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { SetupStepper } from "@/components/SetupStepper";
import { AddChannel } from "@/components/AddChannel";
import { BrandSelector } from "@/components/BrandSelector";
import { BrandCreateForm } from "@/components/BrandCreateForm";
import { useSetupProgress } from "@/hooks/useSetupProgress";
import { useSetupData } from "@/hooks/useSetupData";
import { useBrands } from "@/hooks/useBrands";
import { usePlatformAccounts } from "@/hooks/usePlatformAccounts";
import { isStepComplete } from "@/lib/setup-completion";
import { SETUP_STEPS } from "@/data/setup-steps";
import { CONTENT_SEED_PLATFORMS } from "@/data/brand-channels";
import { cn } from "@/lib/utils";
import type { EcosystemId, SetupStep } from "@/types";

export function SetupPage() {
  const { ecosystem = "content" } = useParams<{ ecosystem: string }>();
  const ecoId = ecosystem as EcosystemId;
  const [searchParams, setSearchParams] = useSearchParams();
  const activeBrandId = searchParams.get("brand");
  const [showCreate, setShowCreate] = useState(false);

  const { brands, addBrand, updateBrand } = useBrands();
  const { accounts, addAccount, updateAccount, deleteAccount } = usePlatformAccounts(activeBrandId ?? undefined);
  const ecoBrands = brands.filter((b) => b.ecosystemId === ecoId);
  const activeBrand = ecoBrands.find((b) => b.id === activeBrandId) ?? null;

  const { progress, toggleStep } = useSetupProgress(activeBrandId ?? undefined);
  const { getFieldValue, saveFieldValue, setLocal, isSaved } = useSetupData(ecoId, activeBrandId ?? undefined);

  const ctx = { accounts, progress, brandEmail: activeBrand?.email ?? "" };
  const isStepDone = (step: SetupStep) => isStepComplete(step, ctx);
  const isComplete = (stepId: string) => !!progress[stepId];

  const toggleChannel = (step: SetupStep) => {
    const specs = step.channelSpec ?? [];
    const allActive = specs.every((s) => accounts.find((a) => a.platform === s.platform)?.status === "active");
    const nextStatus = allActive ? "not-started" : "active";
    for (const s of specs) {
      const acct = accounts.find((a) => a.platform === s.platform);
      if (acct?.id !== undefined) updateAccount(acct.id, { status: nextStatus });
    }
  };

  // Email step writes to Brand.email rather than setup_data.
  const saveField = (stepId: string, fieldKey: string, value: string) => {
    if (stepId === "email" && fieldKey === "address" && activeBrandId) {
      updateBrand(activeBrandId, { email: value });
      return;
    }
    saveFieldValue(stepId, fieldKey, value);
  };
  const getField = (stepId: string, fieldKey: string) => {
    if (stepId === "email" && fieldKey === "address") return activeBrand?.email ?? "";
    return getFieldValue(stepId, fieldKey);
  };

  const selectBrand = (id: string) => {
    const next = new URLSearchParams(searchParams);
    next.set("brand", id);
    setSearchParams(next);
    setShowCreate(false);
  };

  const seedChannels = (brandId: string) => {
    for (const platform of CONTENT_SEED_PLATFORMS) {
      addAccount({ brandId, platform, status: "not-started" });
    }
  };

  const contentSteps = SETUP_STEPS.filter((s) => s.ecosystemId === "content");
  const contentCompleted = contentSteps.filter((s) => isStepDone(s)).length;
  const contentTotal = contentSteps.length;
  const contentPercent = contentTotal > 0 ? (contentCompleted / contentTotal) * 100 : 0;

  const tabs: { id: EcosystemId; label: string }[] = [
    { id: "content", label: "Content" },
    { id: "viral", label: "Viral" },
    { id: "products", label: "Products" },
    { id: "affiliate", label: "Affiliate" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Setup Wizard</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Complete each ecosystem foundation before moving to revenue operations.
        </p>
      </div>

      {/* Ecosystem tabs */}
      <div className="flex gap-1 bg-zinc-900 border border-zinc-800 rounded-lg p-1 w-fit">
        {tabs.map((tab) => (
          <NavLink
            key={tab.id}
            to={`/setup/${tab.id}`}
            className={cn(
              "px-4 py-1.5 rounded text-sm font-medium transition-colors",
              ecosystem === tab.id
                ? "bg-zinc-700 text-zinc-100"
                : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            {tab.label}
          </NavLink>
        ))}
      </div>

      {/* Brand selector + create */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <BrandSelector
            brands={ecoBrands}
            activeBrandId={activeBrandId}
            onSelect={selectBrand}
            onNew={() => setShowCreate(true)}
          />
        </div>
        {showCreate && (
          <BrandCreateForm
            ecosystemId={ecoId}
            onCreate={addBrand}
            onSeedChannels={seedChannels}
            onCreated={selectBrand}
          />
        )}
        {!activeBrandId && !showCreate && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 text-center text-sm text-zinc-400">
            Select a brand or create one to begin setup.
          </div>
        )}
      </div>

      {/* Content ecosystem */}
      {ecosystem === "content" && activeBrandId && (
        <div className="space-y-4">
          {/* Progress */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-zinc-400">Foundation Progress</span>
              <span className="text-sm font-medium text-zinc-300">
                {contentCompleted} / {contentTotal} steps
              </span>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-1.5">
              <div
                className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${contentPercent}%` }}
              />
            </div>
          </div>

          <SetupStepper
            steps={contentSteps}
            isComplete={isComplete}
            onToggleStep={toggleStep}
            locked={false}
            getFieldValue={getField}
            saveFieldValue={saveField}
            setLocal={setLocal}
            isSaved={isSaved}
            accounts={accounts}
            updateAccount={updateAccount}
            isStepDone={isStepDone}
            onToggleChannel={toggleChannel}
          />
        </div>
      )}

      {/* Viral ecosystem (active) */}
      {ecosystem === "viral" && activeBrandId && (
        <div className="space-y-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-zinc-400">Foundation Progress</span>
              <span className="text-sm font-medium text-orange-400">Active — Vertical Selection</span>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-1.5" />
          </div>
          <AddChannel
            accounts={accounts}
            onAdd={(platform, handle) => addAccount({ brandId: activeBrandId, platform, handle, status: "active" })}
            onRemove={(id) => deleteAccount(id)}
          />
        </div>
      )}

      {/* Products ecosystem (parked) */}
      {ecosystem === "products" && activeBrandId && (
        <div className="space-y-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-zinc-400">Foundation Progress</span>
              <span className="text-sm font-medium text-zinc-500">Parked</span>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-1.5" />
          </div>
          <AddChannel
            accounts={accounts}
            onAdd={(platform, handle) => addAccount({ brandId: activeBrandId, platform, handle, status: "active" })}
            onRemove={(id) => deleteAccount(id)}
          />
        </div>
      )}

      {/* Affiliate ecosystem (parked) */}
      {ecosystem === "affiliate" && activeBrandId && (
        <div className="space-y-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-zinc-400">Foundation Progress</span>
              <span className="text-sm font-medium text-zinc-500">Parked</span>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-1.5" />
          </div>
          <AddChannel
            accounts={accounts}
            onAdd={(platform, handle) => addAccount({ brandId: activeBrandId, platform, handle, status: "active" })}
            onRemove={(id) => deleteAccount(id)}
          />
        </div>
      )}
    </div>
  );
}
