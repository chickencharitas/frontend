import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { CssBaseline } from "@mui/material";
import ThemeProviderCustom from "./context/ThemeContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <ThemeProviderCustom>
      <CssBaseline />
      <App />
    </ThemeProviderCustom>
  </React.StrictMode>
);
