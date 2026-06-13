import { useState, useCallback } from "react";
import { useParams, NavLink } from "react-router-dom";
import {
  CheckCircle2,
  Circle,
  ExternalLink,
  Lock,
  Rocket,
  ChevronDown,
  ChevronRight,
  Download,
  ClipboardCopy,
  RefreshCw,
  Save,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLaunchProgress } from "@/hooks/useLaunchProgress";
import {
  LAUNCH_TEMPLATES,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
} from "@/data/launch-templates";
import { ECOSYSTEMS, VERTICALS } from "@/data/ecosystems";
import type { EcosystemId } from "@/types";
import type { LaunchStep, LaunchField } from "@/data/launch-templates";
import { generateText } from "@/lib/generate";
import { saveToVault } from "@/lib/save-to-vault";

function GenerateBtn({
  field,
  currentValue,
  onGenerated,
}: {
  field: LaunchField;
  currentValue: string;
  onGenerated: (text: string) => void;
}) {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  const handleGenerate = useCallback(async () => {
    setState("loading");
    try {
      const context = currentValue
        ? `\n\nCurrent text (improve or replace this):\n${currentValue}`
        : "";
      const prompt = `${field.generatePrompt}${context}\n\nRespond with ONLY the generated text, nothing else.`;
      const result = await generateText(prompt);
      onGenerated(result);
      setState("done");
      setTimeout(() => setState("idle"), 1500);
    } catch (err) {
      console.error("Generate failed:", err);
      setState("error");
      setTimeout(() => setState("idle"), 3000);
    }
  }, [field.generatePrompt, currentValue, onGenerated]);

  return (
    <button
      type="button"
      onClick={handleGenerate}
      disabled={state === "loading"}
      title="Generate new text with AI"
      className={cn(
        "flex-shrink-0 flex items-center gap-1 px-2 py-1.5 rounded text-xs font-medium transition-colors",
        state === "loading"
          ? "bg-purple-500/10 text-purple-400 animate-pulse cursor-wait"
          : state === "done"
            ? "bg-emerald-500/20 text-emerald-400"
            : state === "error"
              ? "bg-red-500/20 text-red-400"
              : "bg-zinc-800 text-zinc-400 hover:text-purple-300 hover:bg-purple-500/10"
      )}
    >
      <RefreshCw className={cn("w-3 h-3", state === "loading" && "animate-spin")} />
      {state === "loading" ? "Generating..." : state === "done" ? "Done!" : state === "error" ? "Failed" : "Generate"}
    </button>
  );
}

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [text]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        "flex-shrink-0 flex items-center gap-1 px-2 py-1.5 rounded text-xs font-medium transition-colors",
        copied
          ? "bg-emerald-500/20 text-emerald-400"
          : "bg-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700"
      )}
    >
      <ClipboardCopy className="w-3 h-3" />
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: LaunchField;
  value: string;
  onChange: (value: string) => void;
}) {
  const displayValue = value || field.placeholder || "";
  const hasCopyable = !!field.placeholder && field.type !== "select";

  if (field.type === "select") {
    return (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-zinc-950 border border-zinc-700 rounded-md px-3 py-1.5 text-sm text-zinc-200 focus:outline-none focus:border-zinc-500"
      >
        <option value="">—</option>
        {field.options?.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    );
  }

  if (field.type === "note") {
    return (
      <div className="flex gap-2">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          rows={3}
          className="flex-1 bg-zinc-950 border border-zinc-700 rounded-md px-3 py-1.5 text-sm text-zinc-200 focus:outline-none focus:border-zinc-500 resize-y"
        />
        <div className="flex flex-col gap-1">
          {hasCopyable && <CopyBtn text={displayValue} />}
          {field.generatable && <GenerateBtn field={field} currentValue={value} onGenerated={onChange} />}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <input
        type={field.type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        className="flex-1 bg-zinc-950 border border-zinc-700 rounded-md px-3 py-1.5 text-sm text-zinc-200 focus:outline-none focus:border-zinc-500"
      />
      {hasCopyable && <CopyBtn text={displayValue} />}
      {field.generatable && <GenerateBtn field={field} currentValue={value} onGenerated={onChange} />}
    </div>
  );
}

function StepCard({
  step,
  done,
  blocked,
  expanded,
  onToggle,
  onExpand,
  getFieldValue,
  setFieldValue,
}: {
  step: LaunchStep;
  done: boolean;
  blocked: boolean;
  expanded: boolean;
  onToggle: () => void;
  onExpand: () => void;
  getFieldValue: (stepId: string, fieldKey: string) => string;
  setFieldValue: (stepId: string, fieldKey: string, value: string) => void;
}) {
  const isNextUp = !done && !blocked;

  return (
    <div
      className={cn(
        "rounded-lg border transition-all",
        done
          ? "bg-zinc-900/30 border-zinc-800/50"
          : blocked
            ? "bg-zinc-950 border-zinc-800/30 opacity-40"
            : expanded
              ? "bg-zinc-900 border-zinc-600 ring-1 ring-zinc-600/50"
              : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
      )}
    >
      {/* Header row */}
      <div
        className="flex items-center gap-3 p-4 cursor-pointer"
        onClick={blocked ? undefined : onExpand}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (!blocked) onToggle();
          }}
          disabled={blocked}
          className={cn(
            "flex-shrink-0 transition-colors",
            blocked
              ? "text-zinc-700 cursor-not-allowed"
              : done
                ? "text-emerald-400"
                : "text-zinc-600 hover:text-zinc-400"
          )}
        >
          {blocked ? (
            <Lock className="w-5 h-5" />
          ) : done ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <Circle className="w-5 h-5" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4
              className={cn(
                "text-sm font-medium",
                done ? "text-zinc-500 line-through" : "text-zinc-200"
              )}
            >
              {step.title}
            </h4>
            <span
              className={cn(
                "text-xs px-1.5 py-0.5 rounded",
                CATEGORY_COLORS[step.category],
                "bg-zinc-800/50"
              )}
            >
              {CATEGORY_LABELS[step.category]}
            </span>
            {isNextUp && !expanded && (
              <span className="text-xs px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 animate-pulse">
                Next
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">{step.description}</p>
        </div>

        {!blocked && (
          <div className="flex-shrink-0 text-zinc-600">
            {expanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </div>
        )}
      </div>

      {/* Expanded content */}
      {expanded && !blocked && (
        <div className="px-4 pb-4 space-y-4 border-t border-zinc-800 pt-4 ml-8">
          {/* Instructions */}
          {step.instructions.length > 0 && (
            <div>
              <h5 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                Steps
              </h5>
              <ol className="space-y-1.5">
                {step.instructions.map((inst, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-zinc-300"
                  >
                    <span className="text-xs text-zinc-600 font-mono mt-0.5 w-4 text-right flex-shrink-0">
                      {i + 1}.
                    </span>
                    <span>{inst}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Links */}
          {step.urls && step.urls.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {step.urls.map((url) => (
                <a
                  key={url}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md bg-zinc-800 text-zinc-300 hover:text-zinc-100 hover:bg-zinc-700 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  {new URL(url).hostname.replace("www.", "")}
                </a>
              ))}
            </div>
          )}

          {/* Data capture fields */}
          {step.fields && step.fields.length > 0 && (
            <div>
              <h5 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                Record your details
              </h5>
              <div className="space-y-3">
                {step.fields.map((field) => (
                  <div key={field.key}>
                    <label className="text-xs text-zinc-500 block mb-1">
                      {field.label}
                      {field.sensitive && (
                        <span className="text-yellow-500 ml-1">(private)</span>
                      )}
                    </label>
                    <FieldInput
                      field={field}
                      value={getFieldValue(step.id, field.key)}
                      onChange={(val) =>
                        setFieldValue(step.id, field.key, val)
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mark complete button */}
          {!done && (
            <button
              onClick={onToggle}
              className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              Mark Complete
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export function LaunchPage() {
  const { ecosystem = "viral", vertical = "tech" } = useParams<{
    ecosystem: string;
    vertical: string;
  }>();
  const {
    isComplete,
    toggleStep,
    getProgress,
    getFieldValue: getRawField,
    setFieldValue: setRawField,
    exportData,
    exportMarkdown,
  } = useLaunchProgress();

  const [expandedStep, setExpandedStep] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const ecosystemId = ecosystem as EcosystemId;
  const steps = LAUNCH_TEMPLATES[ecosystemId] ?? [];
  const eco = ECOSYSTEMS.find((e) => e.id === ecosystemId);
  const vert = VERTICALS.find((v) => v.id === vertical);

  const completedSteps = new Set(
    steps.filter((s) => isComplete(ecosystem, vertical, s.id)).map((s) => s.id)
  );

  const isBlocked = (step: LaunchStep): boolean => {
    if (!step.dependsOn) return false;
    return step.dependsOn.some((dep) => !completedSteps.has(dep));
  };

  const progress = getProgress(
    ecosystem,
    vertical,
    steps.map((s) => s.id)
  );

  const categories = [...new Set(steps.map((s) => s.category))];

  const activeEcosystems = ECOSYSTEMS.filter(
    (e) => e.status === "Active" || e.status === "Design"
  );

  const getFieldValue = (stepId: string, fieldKey: string) =>
    getRawField(ecosystem, vertical, stepId, fieldKey);

  const setFieldValue = (stepId: string, fieldKey: string, value: string) =>
    setRawField(ecosystem, vertical, stepId, fieldKey, value);

  const nextStep = steps.find(
    (s) => !completedSteps.has(s.id) && !isBlocked(s)
  );

  // Auto-expand next step if nothing is expanded
  const effectiveExpanded =
    expandedStep ?? (nextStep ? nextStep.id : null);

  const handleExport = () => {
    const data = exportData(ecosystem, vertical);
    const json = JSON.stringify(data, null, 2);
    navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const data = exportData(ecosystem, vertical);
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `launch-${ecosystem}-${vertical}-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const handleSaveVault = async () => {
    setSaveState("saving");
    try {
      const md = exportMarkdown(ecosystem, vertical, steps);
      const filename = `${ecosystem}-${vertical}.md`;
      await saveToVault(filename, md);
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 2000);
    } catch (err) {
      console.error("Save to vault failed:", err);
      setSaveState("error");
      setTimeout(() => setSaveState("idle"), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Rocket className="w-5 h-5 text-orange-400" />
            <h1 className="text-2xl font-bold text-zinc-100">Launch Wizard</h1>
          </div>
          <p className="text-sm text-zinc-500 mt-1">
            {eco?.codename ?? ecosystem} → {vert?.name ?? vertical}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-zinc-400 bg-zinc-900 border border-zinc-700 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
          >
            <ClipboardCopy className="w-3.5 h-3.5" />
            {copied ? "Copied!" : "Copy data"}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-zinc-400 bg-zinc-900 border border-zinc-700 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Export JSON
          </button>
          <button
            onClick={handleSaveVault}
            disabled={saveState === "saving"}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors",
              saveState === "saved"
                ? "text-emerald-400 bg-emerald-500/20 border-emerald-500/30"
                : saveState === "error"
                  ? "text-red-400 bg-red-500/10 border-red-500/30"
                  : saveState === "saving"
                    ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30 animate-pulse cursor-wait"
                    : "text-emerald-400 bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/20"
            )}
          >
            <Save className="w-3.5 h-3.5" />
            {saveState === "saving" ? "Saving..." : saveState === "saved" ? "Saved!" : saveState === "error" ? "Failed" : "Save to Vault"}
          </button>
          <div className="text-right">
            <p className="text-2xl font-bold text-zinc-100 tabular-nums">
              {progress.percent}%
            </p>
            <p className="text-xs text-zinc-500">
              {progress.completed} / {progress.total} steps
            </p>
          </div>
        </div>
      </div>

      {/* Ecosystem tabs */}
      <div className="flex gap-1 bg-zinc-900 border border-zinc-800 rounded-lg p-1 w-fit">
        {activeEcosystems.map((e) => {
          const verticals = VERTICALS.filter(
            (v) => v.ecosystems.includes(e.id) && v.status === "active"
          );
          const firstVertical = verticals[0]?.id ?? "default";
          return (
            <NavLink
              key={e.id}
              to={`/launch/${e.id}/${firstVertical}`}
              className={cn(
                "px-4 py-1.5 rounded text-sm font-medium transition-colors",
                ecosystem === e.id
                  ? "bg-zinc-700 text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              {e.codename}
            </NavLink>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <span className="text-sm text-zinc-400">Launch Progress</span>
            {nextStep && (
              <span className="text-xs text-orange-400">
                Next: {nextStep.title}
              </span>
            )}
          </div>
          <span className="text-sm font-medium text-zinc-300">
            {progress.completed} / {progress.total} steps
          </span>
        </div>
        <div className="w-full bg-zinc-800 rounded-full h-2">
          <div
            className="bg-orange-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress.percent}%` }}
          />
        </div>
      </div>

      {/* Steps by category */}
      {categories.map((cat) => {
        const catSteps = steps.filter((s) => s.category === cat);
        const catDone = catSteps.filter((s) =>
          isComplete(ecosystem, vertical, s.id)
        ).length;
        const allDone = catDone === catSteps.length;

        return (
          <div key={cat}>
            <div className="flex items-center gap-2 mb-3">
              <h3
                className={cn(
                  "text-sm font-semibold uppercase tracking-wider",
                  allDone ? "text-zinc-600" : CATEGORY_COLORS[cat]
                )}
              >
                {CATEGORY_LABELS[cat]}
              </h3>
              <span className="text-xs text-zinc-600">
                {catDone}/{catSteps.length}
              </span>
              {allDone && (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              )}
            </div>
            <div className="space-y-2">
              {catSteps.map((step) => (
                <StepCard
                  key={step.id}
                  step={step}
                  done={completedSteps.has(step.id)}
                  blocked={isBlocked(step)}
                  expanded={effectiveExpanded === step.id}
                  onToggle={() => toggleStep(ecosystem, vertical, step.id)}
                  onExpand={() =>
                    setExpandedStep(
                      expandedStep === step.id ? null : step.id
                    )
                  }
                  getFieldValue={getFieldValue}
                  setFieldValue={setFieldValue}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
