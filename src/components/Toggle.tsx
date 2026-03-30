import { useCustomizer } from "../context/useCustomizer";
import styles from "./Toggle.module.css";

export default function Toggle() {
  const { chainEnabled, toggleChain } = useCustomizer();

  return (
    <div className={styles.toggle}>
      <button
        type="button"
        className={`${styles.option} ${chainEnabled ? styles.active : ""}`}
        onClick={() => !chainEnabled && toggleChain()}
      >
        Pakabukas
      </button>
      <button
        type="button"
        className={`${styles.option} ${!chainEnabled ? styles.active : ""}`}
        onClick={() => chainEnabled && toggleChain()}
      >
        Tik figūrėlė
      </button>
      <div
        className={styles.slider}
        style={{ transform: chainEnabled ? "translateX(0)" : "translateX(100%)" }}
      />
    </div>
  );
}
