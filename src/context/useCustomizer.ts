import { useContext } from "react";
import { CustomizerContext } from "./CustomizerContext";

export function useCustomizer() {
  const ctx = useContext(CustomizerContext);
  if (!ctx) throw new Error("useCustomizer must be used within CustomizerProvider");
  return ctx;
}