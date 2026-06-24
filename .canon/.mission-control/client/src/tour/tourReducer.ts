export interface TourStep {
  targetId: string;
  title: string;
  body: string;
  route?: string;
}

export interface TourState {
  active: boolean;
  stepIndex: number;
}

export type TourAction =
  | { type: "START" }
  | { type: "NEXT" }
  | { type: "BACK" }
  | { type: "SKIP" }
  | { type: "FINISH" };

export const initialTourState: TourState = { active: false, stepIndex: 0 };

export function tourReducer(state: TourState, action: TourAction, totalSteps: number): TourState {
  switch (action.type) {
    case "START":
      return { active: true, stepIndex: 0 };
    case "NEXT": {
      if (!state.active) return state;
      const next = state.stepIndex + 1;
      if (next >= totalSteps) return { active: false, stepIndex: 0 };
      return { active: true, stepIndex: next };
    }
    case "BACK":
      if (!state.active) return state;
      return { active: true, stepIndex: Math.max(0, state.stepIndex - 1) };
    case "SKIP":
    case "FINISH":
      return { active: false, stepIndex: 0 };
    default:
      return state;
  }
}
