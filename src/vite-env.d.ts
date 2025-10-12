/// <reference types="vite/client" />

interface MinifigData {
  productId: number;
  ajaxUrl: string;
  nonce: string;
  price: string;
}

interface MinifigCustomizerAPI {
  addToCart: (data: {
    selection: Record<string, string>;
    config: Record<string, string | undefined>;
    layers: string[];
  }) => void;
}

interface Window {
  minifigData?: MinifigData;
  MinifigCustomizer?: MinifigCustomizerAPI;
}