import styles from "./Settings.module.css";
import { useCustomizer } from "../context/useCustomizer";
import { catalog } from "../data/catalog";
import type { PartGroup } from "../data/catalog";
import Toggle from "./Toggle";

function Section({ group, title, icon }: { group: PartGroup; title: string; icon: string }) {
  const { selection, setPart } = useCustomizer();
  const items = catalog[group];

  return (
    <details className={styles.section}>
      <summary>
        <span className={styles.summaryLabel}>
          <span className={styles.icon}>{icon}</span>
          {title}
        </span>
      </summary>
      <div className={styles.animateWrap}>
        <div className={styles.list}>
          {items.map((item) => {
            const active = selection[group] === item.id;
            const thumb = item.thumbnail ?? item.src;
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
      </div>
    </details>
  );
}

export default function Settings() {
  return (
    <div className={`${styles.wrap} sticky`}>
      <Toggle />
      <Section group="headgear" title="Kepurės ir plaukai" icon="🎩" />
      <Section group="face" title="Veidai" icon="😊" />
      <Section group="torso" title="Aprangos" icon="👕" />
      <Section group="legs" title="Kelnės" icon="👖" />
    </div>
  );
}