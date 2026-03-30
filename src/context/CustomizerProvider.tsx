import { useEffect, useMemo, useState, type ReactNode } from 'react';
import type { PartGroup } from '../data/catalog';
import { catalog, chainSrc, defaultSelection, loadCatalog } from '../data/catalog';
import { CustomizerContext, type Ctx, type Selection } from './CustomizerContext';

export function CustomizerProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [selection, setSelection] = useState<Selection>(defaultSelection);

  // Load catalog from WordPress on mount
  useEffect(() => {
    loadCatalog().then(() => {
      // After catalog loads, update selection with actual first items
      setSelection({
        headgear: catalog.headgear[0]?.id ?? '',
        face: catalog.face[0]?.id ?? '',
        torso: catalog.torso[0]?.id ?? '',
        legs: catalog.legs[0]?.id ?? '',
      });
      setIsLoading(false);
    });
  }, []);

  const [chainEnabled, setChainEnabled] = useState(true);
  const toggleChain = () => setChainEnabled((prev) => !prev);

  const setPart = (group: PartGroup, id: string) => setSelection((s) => ({ ...s, [group]: id }));

  const layers = useMemo(() => {
    const parts = [
      catalog.legs.find((i) => i.id === selection.legs)?.src,
      catalog.torso.find((i) => i.id === selection.torso)?.src,
      catalog.face.find((i) => i.id === selection.face)?.src,
      catalog.headgear.find((i) => i.id === selection.headgear)?.src,
    ].filter(Boolean) as string[];

    if (chainEnabled && chainSrc) {
      return [chainSrc, ...parts];
    }
    return parts;
  }, [selection, chainEnabled]);

  const value: Ctx = { selection, setPart, layers, chainEnabled, toggleChain };

  if (isLoading) {
    return (
      <div
        style={{
          padding: '2rem',
          textAlign: 'center',
          color: '#666',
        }}
      >
        Kraunama... ⏳
      </div>
    );
  }

  return <CustomizerContext.Provider value={value}>{children}</CustomizerContext.Provider>;
}
