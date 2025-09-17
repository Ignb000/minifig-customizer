const cache = new Map<string, Promise<void>>();

export function preload(src: string) {
  if (!src) return Promise.resolve();
  if (cache.has(src)) return cache.get(src)!;
  const p = new Promise<void>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
  cache.set(src, p);
  return p;
}

export async function preloadAll(srcs: string[]) {
  await Promise.all(srcs.filter(Boolean).map(preload));
}