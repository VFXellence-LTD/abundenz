import { createContext, useContext, useReducer, useCallback, useEffect, type ReactNode } from "react";
import { tourReducer, initialTourState, type TourStep, type TourState, type TourAction } from "@/tour/tourReducer";
import { TOUR_STEPS } from "@/tour/tourSteps";

interface TourContextValue {
  active: boolean;
  stepIndex: number;
  steps: TourStep[];
  start: () => void;
  next: () => void;
  back: () => void;
  skip: () => void;
}

const TourContext = createContext<TourContextValue | null>(null);
const SEEN_KEY = "mc_tour_seen";

export function TourProvider({ children }: { children: ReactNode }) {
  const steps = TOUR_STEPS;
  const [state, dispatch] = useReducer(
    (s: TourState, a: TourAction) => tourReducer(s, a, steps.length),
    initialTourState,
  );

  const start = useCallback(() => {
    localStorage.setItem(SEEN_KEY, "1");
    dispatch({ type: "START" });
  }, []);
  const next = useCallback(() => dispatch({ type: "NEXT" }), []);
  const back = useCallback(() => dispatch({ type: "BACK" }), []);
  const skip = useCallback(() => dispatch({ type: "SKIP" }), []);

  // Auto-launch on first visit only.
  useEffect(() => {
    if (!localStorage.getItem(SEEN_KEY)) start();
  }, [start]);

  return (
    <TourContext.Provider value={{ active: state.active, stepIndex: state.stepIndex, steps, start, next, back, skip }}>
      {children}
    </TourContext.Provider>
  );
}

export function useTour(): TourContextValue {
  const ctx = useContext(TourContext);
  if (!ctx) throw new Error("useTour must be used within TourProvider");
  return ctx;
}
