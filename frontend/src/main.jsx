import React from "react";
import ReactDOM from "react-dom/client";
// Import the polyfill first before any other imports
import "./polyfills.js";
import App from "./App.jsx";
import "./index.css"; // Make sure this CSS is imported

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);

// Register the service worker
if ("serviceWorker" in navigator) {
	window.addEventListener("load", () => {
		navigator.serviceWorker
			.register("/service-worker.js")
			.then((registration) => {
			})
			.catch((registrationError) => {
			});
	});
}
