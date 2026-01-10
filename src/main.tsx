import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { CustomizerProvider } from './context/CustomizerProvider';
import './styles/buttons.css'; // ← Add this line
import './styles/globals.css';
import './styles/variables.css';

ReactDOM.createRoot(document.getElementById('product-customizer')!).render(
  <React.StrictMode>
    <CustomizerProvider>
      <App />
    </CustomizerProvider>
  </React.StrictMode>,
);
