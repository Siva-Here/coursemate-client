import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./AuthContext";
import { IdProvider } from "./IdContext";
import { ResourceProvider } from "./ResourceContext";

const container = document.getElementById("root");
const root = createRoot(container);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/firebase-messaging-sw.js")
      .then((registration) => {
        console.log(
          "Service Worker registered with scope:",
          registration.scope
        );
      })
      .catch((registrationError) => {
        console.log("Service Worker registration failed:", registrationError);
      });
  });
}

root.render(
  <Router>
    <AuthProvider>
      <IdProvider>
        <ResourceProvider>
          <App />
        </ResourceProvider>
      </IdProvider>
    </AuthProvider>
  </Router>
);
