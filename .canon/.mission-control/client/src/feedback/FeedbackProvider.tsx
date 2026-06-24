import { createContext, useContext, useReducer, useState, useCallback, type ReactNode } from "react";
import { feedbackReducer, type FeedbackItem } from "@/feedback/feedbackReducer";

interface FeedbackContextValue {
  items: FeedbackItem[];
  panelOpen: boolean;
  add: (item: FeedbackItem) => void;
  remove: (index: number) => void;
  clear: () => void;
  openPanel: () => void;
  closePanel: () => void;
}

const FeedbackContext = createContext<FeedbackContextValue | null>(null);

export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(feedbackReducer, []);
  const [panelOpen, setPanelOpen] = useState(false);

  const add = useCallback((item: FeedbackItem) => dispatch({ type: "ADD", item }), []);
  const remove = useCallback((index: number) => dispatch({ type: "REMOVE", index }), []);
  const clear = useCallback(() => dispatch({ type: "CLEAR" }), []);
  const openPanel = useCallback(() => setPanelOpen(true), []);
  const closePanel = useCallback(() => setPanelOpen(false), []);

  return (
    <FeedbackContext.Provider value={{ items, panelOpen, add, remove, clear, openPanel, closePanel }}>
      {children}
    </FeedbackContext.Provider>
  );
}

export function useFeedback(): FeedbackContextValue {
  const ctx = useContext(FeedbackContext);
  if (!ctx) throw new Error("useFeedback must be used within FeedbackProvider");
  return ctx;
}
