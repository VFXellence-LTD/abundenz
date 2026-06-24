export interface FeedbackItem {
  text: string;
  area?: string;
  severity?: string;
}

export type FeedbackAction =
  | { type: "ADD"; item: FeedbackItem }
  | { type: "REMOVE"; index: number }
  | { type: "CLEAR" };

export function feedbackReducer(state: FeedbackItem[], action: FeedbackAction): FeedbackItem[] {
  switch (action.type) {
    case "ADD":
      if (!action.item.text.trim()) return state;
      return [...state, { ...action.item, text: action.item.text.trim() }];
    case "REMOVE":
      return state.filter((_, i) => i !== action.index);
    case "CLEAR":
      return [];
    default:
      return state;
  }
}
