export type PartGroup = 'headgear' | 'face' | 'torso' | 'legs';

export type CatalogItem = {
  id: string;
  label: string;
  src: string;
  thumb?: string;
};

export type CatalogData = {
  headgear: CatalogItem[];
  face: CatalogItem[];
  torso: CatalogItem[];
  legs: CatalogItem[];
  backgrounds: string[]; // Added
};

export let chainSrc: string | null = null;

export const catalog: CatalogData = {
  headgear: [],
  face: [],
  torso: [],
  legs: [],
  backgrounds: [], // Added
};

export const defaultSelection: Record<PartGroup, string> = {
  headgear: '',
  face: '',
  torso: '',
  legs: '',
};

export async function loadCatalog(): Promise<void> {
  try {
    const apiUrl = window.minifigData?.partsApiUrl;
    if (!apiUrl) {
      console.error('Parts API URL not found in minifigData');
      return;
    }

    const response = await fetch(apiUrl);
    const result = await response.json();

    if (result.success && result.data) {
      const data = result.data;
      // Load parts
      Object.keys(data).forEach((group) => {
        if (group === 'backgrounds') {
          catalog.backgrounds = data.backgrounds || [];
        } else if (catalog[group as PartGroup]) {
          catalog[group as PartGroup] = data[group];
        }
      });
      chainSrc = data.chain ?? null;

      // Set defaults
      defaultSelection.headgear = catalog.headgear[0]?.id ?? '';
      defaultSelection.face = catalog.face[0]?.id ?? '';
      defaultSelection.torso = catalog.torso[0]?.id ?? '';
      defaultSelection.legs = catalog.legs[0]?.id ?? '';

      console.log('✅ Catalog loaded:', catalog);
      console.log('🎨 Backgrounds found:', catalog.backgrounds.length);
    }
  } catch (error) {
    console.error('Failed to load parts catalog:', error);
  }
}

/**
 * Get random background URL (or null if empty)
 */
export function getRandomBackground(): string | null {
  if (catalog.backgrounds.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * catalog.backgrounds.length);
  return catalog.backgrounds[randomIndex];
}
