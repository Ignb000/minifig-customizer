import { useEffect, useRef, useState } from 'react';
import { useCustomizer } from '../context/useCustomizer';
import { getRandomBackground } from '../data/catalog';
import { preloadAll } from '../utils/preloader';
import styles from './Preview.module.css';

export default function Preview() {
  const { layers } = useCustomizer();
  const [ready, setReady] = useState(false);
  const [pulseKey, setPulseKey] = useState(0); // jėgai atnaujinti animaciją
  const [bgImage, setBgImage] = useState<string | null>(null);
  const prevLayersRef = useRef<string>('');

  // Pick random background on mount
  useEffect(() => {
    const randomBg = getRandomBackground();
    setBgImage(randomBg);
    console.log('🎨 Random background:', randomBg || 'Using diagonal stripes fallback');
  }, []);

  useEffect(() => {
    const signature = layers.join('|');
    if (signature !== prevLayersRef.current) {
      setReady(false);
      preloadAll(layers).then(() => {
        setReady(true);
        setPulseKey((k) => k + 1);
        prevLayersRef.current = signature;
      });
    } else {
      setReady(true);
    }
  }, [layers]);

  return (
    <div className={styles.wrap}>
      <div
        className={styles.frame}
        style={bgImage ? { backgroundImage: `url(${bgImage})` } : {}}
        aria-busy={!ready}
      >
        {layers.map((src, i) => (
          <img
            key={src + pulseKey} // remount → „pop" animacija
            src={src}
            alt=""
            className={`${styles.layer} ${ready ? styles.pop : ''}`}
            style={{ zIndex: 10 + i }}
            draggable={false}
          />
        ))}
      </div>
    </div>
  );
}
