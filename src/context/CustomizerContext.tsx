// src/context/CustomizerContext.tsx
import { createContext } from "react";
import type { PartGroup } from "../data/catalog";

export type Selection = Record<PartGroup, string>;

export type Ctx = {
  selection: Selection;
  setPart: (group: PartGroup, id: string) => void;
  layers: string[];
};

// Sukuriam kontekstą, bet reikšmę užpildys tik CustomizerProvider
export const CustomizerContext = createContext<Ctx | null>(null);