import { useState, useMemo, type ReactNode } from "react";
import { catalog, defaultSelection } from "../data/catalog";
import { CustomizerContext, type Ctx, type Selection } from "./CustomizerContext";
import type { PartGroup } from "../data/catalog";

export function CustomizerProvider({ children }: { children: ReactNode }) {
  const [selection, setSelection] = useState<Selection>(defaultSelection);

  const setPart = (group: PartGroup, id: string) =>
    setSelection((s) => ({ ...s, [group]: id }));

  const layers = useMemo(() => {
    const ids = [
      catalog.legs.find(i => i.id === selection.legs)?.src,
      catalog.torso.find(i => i.id === selection.torso)?.src,
      catalog.face.find(i => i.id === selection.face)?.src,
      catalog.headgear.find(i => i.id === selection.headgear)?.src,
    ].filter(Boolean) as string[];
    return ids;
  }, [selection]);

  const value: Ctx = { selection, setPart, layers };

  return (
    <CustomizerContext.Provider value={value}>
      {children}
    </CustomizerContext.Provider>
  );
}