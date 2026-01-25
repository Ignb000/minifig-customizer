export type PartGroup = 'headgear' | 'face' | 'torso' | 'legs';

export type CatalogItem = {
  id: string;
  label: string;
  src: string;
  thumb?: string;
};

export const catalog: Record<PartGroup, CatalogItem[]> = {
  headgear: [],
  face: [],
  torso: [],
  legs: [],
};

export const defaultSelection: Record<PartGroup, string> = {
  headgear: '',
  face: '',
  torso: '',
  legs: '',
};

/**
 * Load catalog from WordPress API
 */
export async function loadCatalog(): Promise<void> {
  try {
    // Get API URL from WordPress
    const apiUrl = window.minifigData?.partsApiUrl;

    if (!apiUrl) {
      console.error('Parts API URL not found in minifigData');
      return;
    }

    const response = await fetch(apiUrl);
    const result = await response.json();

    if (result.success && result.data) {
      // Populate catalog
      Object.keys(result.data).forEach((group) => {
        if (catalog[group as PartGroup]) {
          catalog[group as PartGroup] = result.data[group];
        }
      });

      // Set default selections (first item in each category)
      defaultSelection.headgear = catalog.headgear[0]?.id ?? '';
      defaultSelection.face = catalog.face[0]?.id ?? '';
      defaultSelection.torso = catalog.torso[0]?.id ?? '';
      defaultSelection.legs = catalog.legs[0]?.id ?? '';

      console.log('✅ Catalog loaded:', catalog);
    }
  } catch (error) {
    console.error('Failed to load parts catalog:', error);
  }
}
