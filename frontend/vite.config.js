import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import fs from "fs";

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react(),
		{
			name: "copy-service-worker",
			writeBundle() {
				// Ensure service worker is copied to the dist directory
				const srcPath = resolve(__dirname, "public/service-worker.js");
				const destPath = resolve(__dirname, "dist/service-worker.js");
				if (fs.existsSync(srcPath)) {
					fs.copyFileSync(srcPath, destPath);
					console.log("✓ Service worker copied to dist/");
				} else {
					console.error("❌ Service worker source file not found!");
				}
			},
		},
	],
	define: {
		global: "window",
	},
	resolve: {
		alias: {
			"react-draft-wysiwyg": "react-draft-wysiwyg/dist/react-draft-wysiwyg.js",
		},
	},
	build: {
		outDir: "dist",
		emptyOutDir: true,
		rollupOptions: {
			output: {
				manualChunks: {
					vendor: ["react", "react-dom", "react-router-dom"],
					editor: [
						"draft-js",
						"react-draft-wysiwyg",
						"draftjs-to-html",
						"html-to-draftjs",
					],
					ui: ["styled-components"],
					utils: ["axios"],
				},
				assetFileNames: (assetInfo) => {
					if (assetInfo.name.endsWith(".css")) {
						return "assets/css/[name]-[hash][extname]";
					}
					return "assets/[name]-[hash][extname]";
				},
			},
		},
		cssCodeSplit: true,
		minify: "terser",
		terserOptions: {
			compress: {
				drop_console: true,
			},
		},
	},
});
