const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const blogRoutes = require("./routes/blogRoutes");
const path = require("path");
const cors = require("cors");
const compression = require("compression");
const fs = require("fs");
require("dotenv").config();

const app = express();
connectDB();

// Add before other middleware
app.use(compression());

// Configure CORS to accept requests from Vite's development server
app.use(
	cors({
		origin: ["http://localhost:3000", "http://localhost:5173"], // Accept both origins
		methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
	})
);

app.use(bodyParser.json());

// Serve static files from the uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Add this after your other middleware but before your routes

// Serve PWA files - manifest and icons
app.use(express.static(path.join(__dirname, "frontend/dist")));

// Add before your routes
const cacheControl = (req, res, next) => {
	// Cache static assets for 1 week
	if (req.url.match(/\.(css|js|jpg|jpeg|png|gif|ico|svg|webp)$/)) {
		res.setHeader("Cache-Control", "public, max-age=604800");
	} else {
		// HTML and API responses - no cache
		res.setHeader("Cache-Control", "no-cache");
	}
	next();
};

app.use(cacheControl);

app.use("/api/blogs", blogRoutes);

// Add this at the end of your file, after your API routes
// This ensures React Router works with client-side routing
app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "frontend/dist", "index.html"));
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {});
