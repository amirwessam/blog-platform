// Service worker powered by Workbox

importScripts(
	"https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js"
);

workbox.setConfig({
	debug: false,
});

const { registerRoute } = workbox.routing;
const { CacheFirst, NetworkFirst, StaleWhileRevalidate } = workbox.strategies;
const { CacheableResponsePlugin } = workbox.cacheableResponse;
const { ExpirationPlugin } = workbox.expiration;

// Add explicit caching for manifest.json
// This ensures it's available offline
workbox.routing.registerRoute(
	/manifest\.json$/,
	new CacheFirst({
		cacheName: "manifest-cache",
	})
);

// Cache page navigations (HTML)
registerRoute(
	({ request }) => request.mode === "navigate",
	new NetworkFirst({
		cacheName: "pages-cache",
		plugins: [
			new CacheableResponsePlugin({
				statuses: [200],
			}),
			new ExpirationPlugin({
				maxEntries: 50,
			}),
		],
	})
);

// Cache CSS, JS, and Web Worker requests
registerRoute(
	({ request }) =>
		request.destination === "style" ||
		request.destination === "script" ||
		request.destination === "worker",
	new StaleWhileRevalidate({
		cacheName: "assets-cache",
		plugins: [
			new CacheableResponsePlugin({
				statuses: [200],
			}),
			new ExpirationPlugin({
				maxEntries: 60,
				maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
			}),
		],
	})
);

// Cache images
registerRoute(
	({ request }) => request.destination === "image",
	new CacheFirst({
		cacheName: "images-cache",
		plugins: [
			new CacheableResponsePlugin({
				statuses: [200],
			}),
			new ExpirationPlugin({
				maxEntries: 60,
				maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
			}),
		],
	})
);

// Cache API requests
registerRoute(
	({ url }) =>
		url.origin === "http://localhost:5001" && url.pathname.startsWith("/api/"),
	new NetworkFirst({
		cacheName: "api-cache",
		plugins: [
			new CacheableResponsePlugin({
				statuses: [200],
			}),
			new ExpirationPlugin({
				maxEntries: 100,
				maxAgeSeconds: 12 * 60 * 60, // 12 hours
			}),
		],
	})
);

// This allows the web app to trigger skipWaiting via
// registration.waiting.postMessage({type: 'SKIP_WAITING'})
self.addEventListener("message", (event) => {
	if (event.data && event.data.type === "SKIP_WAITING") {
		self.skipWaiting();
	}
});
