import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.jsx"

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then((reg) => console.log('SW registered:', reg.scope))
    .catch((err) => console.log('SW error:', err));
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
