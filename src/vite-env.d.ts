/// <reference types="vite/client" />

interface MinifigData {
  productId: number;
  ajaxUrl: string;
  nonce: string;
  price: string;
  partsApiUrl: string; // ← ADD THIS LINE
}

interface MinifigCustomizerAPI {
  addToCart: (data: {
    selection: Record<string, string>;
    config: Record<string, string | undefined>;
    layers: string[];
    chainEnabled: boolean;
  }) => void;
}

interface Window {
  minifigData?: MinifigData;
  MinifigCustomizer?: MinifigCustomizerAPI;
}
