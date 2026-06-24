import { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTour } from "@/tour/TourProvider";
import { useFeedback } from "@/feedback/FeedbackProvider";

export function TourOverlay() {
  const { active, stepIndex, steps, next, back, skip } = useTour();
  const { openPanel } = useFeedback();
  const navigate = useNavigate();
  const location = useLocation();
  const [rect, setRect] = useState<DOMRect | null>(null);

  const step = active ? steps[stepIndex] : null;

  const measure = useCallback(() => {
    if (!step) return;
    const el = document.querySelector(`[data-tour-id="${step.targetId}"]`);
    setRect(el ? el.getBoundingClientRect() : null);
  }, [step]);

  // Navigate to the step's route if needed, then locate its target (retry across frames).
  useEffect(() => {
    if (!step) return;
    if (step.route && location.pathname !== step.route) {
      navigate(step.route);
      return; // effect re-runs once pathname updates
    }
    let tries = 0;
    let raf = 0;
    const tick = () => {
      const el = document.querySelector(`[data-tour-id="${step.targetId}"]`);
      if (el) setRect(el.getBoundingClientRect());
      else if (tries++ < 30) raf = requestAnimationFrame(tick);
      else setRect(null);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [step, location.pathname, navigate]);

  // Keep the spotlight aligned on resize/scroll.
  useEffect(() => {
    if (!active) return;
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [active, measure]);

  if (!active || !step) return null;

  const isLast = stepIndex === steps.length - 1;
  const handleNext = () => {
    if (isLast) openPanel();
    next();
  };

  const pad = 8;
  const tooltipTop = rect
    ? Math.max(pad, Math.min(rect.bottom + pad, window.innerHeight - 220))
    : window.innerHeight / 2 - 100;
  const tooltipLeft = rect
    ? Math.max(pad, Math.min(rect.left, window.innerWidth - 340))
    : window.innerWidth / 2 - 160;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      {/* Spotlight cutout (or full dim if target not found yet) */}
      {rect ? (
        <div
          className="absolute rounded-md"
          style={{
            top: rect.top - 4,
            left: rect.left - 4,
            width: rect.width + 8,
            height: rect.height + 8,
            boxShadow: "0 0 0 9999px rgba(0,0,0,0.72)",
          }}
        />
      ) : (
        <div className="absolute inset-0 bg-black/70" />
      )}

      {/* Tooltip card */}
      <div
        className="absolute pointer-events-auto w-80 rounded-xl border border-zinc-800 bg-zinc-900 shadow-2xl p-4"
        style={{ top: tooltipTop, left: tooltipLeft }}
      >
        <div className="mb-1.5 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-zinc-100">{step.title}</h3>
          <span className="text-xs text-zinc-600">{stepIndex + 1}/{steps.length}</span>
        </div>
        <p className="mb-3 text-sm text-zinc-400">{step.body}</p>
        <div className="flex items-center justify-between">
          <button onClick={skip} className="text-xs text-zinc-600 hover:text-zinc-400">Skip</button>
          <div className="flex gap-2">
            {stepIndex > 0 && (
              <button onClick={back} className="rounded-md px-3 py-1 text-sm text-zinc-400 hover:text-zinc-200">
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              className="rounded-md bg-emerald-600 px-3 py-1 text-sm font-medium text-white hover:bg-emerald-500"
            >
              {isLast ? "Finish & give feedback" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
