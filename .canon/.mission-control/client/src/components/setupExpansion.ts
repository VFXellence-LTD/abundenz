export type ExpansionState = Record<string, boolean>;

export type ExpansionAction =
  | { type: "TOGGLE"; stepId: string }
  | { type: "EXPAND_ALL"; stepIds: string[] }
  | { type: "COLLAPSE_ALL"; stepIds: string[] };

export function initExpansion(stepIds: string[]): ExpansionState {
  const out: ExpansionState = {};
  for (const id of stepIds) out[id] = true;
  return out;
}

export function expansionReducer(state: ExpansionState, action: ExpansionAction): ExpansionState {
  switch (action.type) {
    case "TOGGLE":
      return { ...state, [action.stepId]: !(state[action.stepId] ?? true) };
    case "EXPAND_ALL": {
      const next = { ...state };
      for (const id of action.stepIds) next[id] = true;
      return next;
    }
    case "COLLAPSE_ALL": {
      const next = { ...state };
      for (const id of action.stepIds) next[id] = false;
      return next;
    }
    default:
      return state;
  }
}
