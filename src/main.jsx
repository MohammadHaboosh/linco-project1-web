import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store/Store.js";
import App from "./App.jsx";
import { applyTheme, getPreferredTheme } from "./hooks/useTheme.js";

import "./index.css";

import "./i18n";

applyTheme(getPreferredTheme());

const rootElement = document.getElementById("root");
const application = (
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

if (rootElement.hasChildNodes()) {
  hydrateRoot(rootElement, application);
} else {
  createRoot(rootElement).render(application);
}
