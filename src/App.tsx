import { useEffect } from "react";
import "./styles/layout.css";
import Preview from "./components/Preview";
import Settings from "./components/Settings";
import { useCustomizer } from "./context/useCustomizer";
import { catalog } from "./data/catalog";

export default function App(){
  const { selection, layers } = useCustomizer();

  // Send config to WordPress on mount and whenever selection changes
  useEffect(() => {
    const config = {
      headgear: catalog.headgear.find(i => i.id === selection.headgear)?.label,
      face: catalog.face.find(i => i.id === selection.face)?.label,
      torso: catalog.torso.find(i => i.id === selection.torso)?.label,
      legs: catalog.legs.find(i => i.id === selection.legs)?.label,
    };

    if (window.MinifigCustomizer?.addToCart) {
      window.MinifigCustomizer.addToCart({
        selection,
        config,
        layers
      });
    }
  }, [selection, layers]);

  return (
    <main className="app">
      <section className="panel preview-sticky">
        <Preview/>
      </section>
      <aside className="panel"><Settings/></aside>
    </main>
  );
}