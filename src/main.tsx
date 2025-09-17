import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/variables.css";
import "./styles/globals.css";
import App from "./App";
import { CustomizerProvider } from "./context/CustomizerProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <CustomizerProvider>
      <App />
    </CustomizerProvider>
  </React.StrictMode>
);