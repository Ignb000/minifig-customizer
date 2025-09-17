import styles from "./Settings.module.css";
import { useCustomizer } from "../context/useCustomizer";
import { catalog } from "../data/catalog";
import type { PartGroup } from "../data/catalog";

function Section({ group, title }: { group: PartGroup; title: string }) {
  const { selection, setPart } = useCustomizer();
  const items = catalog[group];

  return (
    <details className={styles.section}>
      <summary>{title}</summary>
      <div className={styles.list}>
        {items.map((item) => {
          const active = selection[group] === item.id;
          const thumb = item.src;
          return (
            <button
              key={item.id}
              type="button"
              className={styles.item}
              aria-pressed={active}
              onClick={() => setPart(group, item.id)}
            >
              <img className={styles.thumb} src={thumb} alt={item.label} />
            </button>
          );
        })}
      </div>
    </details>
  );
}

export default function Settings() {
  return (
    <div className={`${styles.wrap} sticky`}>
      <Section group="headgear" title="Kepurės ir plaukai" />
      <Section group="face" title="Veidai" />
      <Section group="torso" title="Aprangos" />
      <Section group="legs" title="Kelnės" />
    </div>
  );
}