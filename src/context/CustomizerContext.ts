import { createContext } from "react";
import type { PartGroup } from "../data/catalog";

export type Selection = Record<PartGroup, string>;

export type Ctx = {
  selection: Selection;
  setPart: (group: PartGroup, id: string) => void;
  layers: string[];
};

// Tik context objektas, be logikos
export const CustomizerContext = createContext<Ctx | null>(null);