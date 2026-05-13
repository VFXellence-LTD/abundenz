import { useParams, NavLink } from "react-router-dom";
import { SetupStepper } from "@/components/SetupStepper";
import { useSetupProgress } from "@/hooks/useSetupProgress";
import { SETUP_STEPS } from "@/data/setup-steps";
import { cn } from "@/lib/utils";
import type { EcosystemId } from "@/types";

// Placeholder locked steps for Products + Affiliate
const PRODUCTS_PLACEHOLDER = [
  { id: "p1", title: "Set Up Storefront", description: "Gumroad or Lemon Squeezy" },
  { id: "p2", title: "Define Product Suite", description: "Templates, plugins, scripts" },
  { id: "p3", title: "Write Sales Page", description: "Copy and positioning" },
  { id: "p4", title: "Set Pricing", description: "Tiered pricing strategy" },
  { id: "p5", title: "Launch First Product", description: "MVP — quick win" },
];

const AFFILIATE_PLACEHOLDER = [
  { id: "a1", title: "Research Programs", description: "Identify affiliate opportunities" },
  { id: "a2", title: "Apply to Programs", description: "Join relevant networks" },
  { id: "a3", title: "Create Review Content", description: "Honest tool reviews" },
  { id: "a4", title: "Add Affiliate Links", description: "Integrate into content" },
  { id: "a5", title: "Track Performance", description: "Monitor clicks and conversions" },
];

export function SetupPage() {
  const { ecosystem = "content" } = useParams<{ ecosystem: string }>();
  const { isComplete, toggleStep, getEcosystemProgress } = useSetupProgress();

  const contentSteps = SETUP_STEPS.filter((s) => s.ecosystemId === "content");
  const contentProgress = getEcosystemProgress(
    "content",
    contentSteps.map((s) => s.id)
  );

  const tabs: { id: EcosystemId; label: string }[] = [
    { id: "content", label: "Content" },
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

      {/* Content ecosystem */}
      {ecosystem === "content" && (
        <div className="space-y-4">
          {/* Progress */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-zinc-400">Foundation Progress</span>
              <span className="text-sm font-medium text-zinc-300">
                {contentProgress.completed} / {contentProgress.total} steps
              </span>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-1.5">
              <div
                className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${contentProgress.percent}%` }}
              />
            </div>
          </div>

          <SetupStepper
            steps={contentSteps}
            isComplete={isComplete}
            onToggleStep={toggleStep}
            locked={false}
          />
        </div>
      )}

      {/* Products ecosystem (locked) */}
      {ecosystem === "products" && (
        <div className="space-y-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-zinc-400">Foundation Progress</span>
              <span className="text-sm font-medium text-zinc-500">Parked</span>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-1.5" />
          </div>
          <SetupStepper
            steps={PRODUCTS_PLACEHOLDER.map((s, i) => ({
              ...s,
              ecosystemId: "products" as EcosystemId,
              order: i + 1,
              instructions: "",
            }))}
            isComplete={() => false}
            onToggleStep={() => {}}
            locked={true}
            lockedLabel="Products Parked"
          />
        </div>
      )}

      {/* Affiliate ecosystem (locked) */}
      {ecosystem === "affiliate" && (
        <div className="space-y-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-zinc-400">Foundation Progress</span>
              <span className="text-sm font-medium text-zinc-500">Parked</span>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-1.5" />
          </div>
          <SetupStepper
            steps={AFFILIATE_PLACEHOLDER.map((s, i) => ({
              ...s,
              ecosystemId: "affiliate" as EcosystemId,
              order: i + 1,
              instructions: "",
            }))}
            isComplete={() => false}
            onToggleStep={() => {}}
            locked={true}
            lockedLabel="Affiliate Parked"
          />
        </div>
      )}
    </div>
  );
}
