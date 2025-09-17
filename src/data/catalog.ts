export type PartGroup = "headgear" | "face" | "torso" | "legs";

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

const modules = import.meta.glob("../assets/*/*.{webp,png,jpg}", { eager: true });

Object.entries(modules).forEach(([path, mod]) => {
  const rel = path.split("/assets/")[1]; // pvz: "headgear/cap_red.webp"
  const [group, filename] = rel.split("/");
  const id = filename.replace(/\.(webp|png|jpg)$/, "");
  const label = id.replace(/_/g, " ");

  if (catalog[group as PartGroup]) {
    catalog[group as PartGroup].push({
      id,
      label,
      src: (mod as { default: string }).default,
    });
  }
});

// Default selection turi būti po to, kai jau užpildytas catalog
export const defaultSelection: Record<PartGroup,string> = {
  headgear: catalog.headgear[0]?.id ?? "",
  face:     catalog.face[0]?.id ?? "",
  torso:    catalog.torso[0]?.id ?? "",
  legs:     catalog.legs[0]?.id ?? "",
};