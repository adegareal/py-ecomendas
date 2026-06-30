import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AppSessionProvider } from "./components/providers/AppSessionProvider";
import ToastProvider from "./components/providers/ToastProvider";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AppSessionProvider>
      <BrowserRouter>
        <ToastProvider />
        <App />
      </BrowserRouter>
    </AppSessionProvider>
  </React.StrictMode>
);