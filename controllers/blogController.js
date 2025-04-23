// controllers/blogController.js
const Blog = require("../models/blogModel");
const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

// Configure Multer for image uploads
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "uploads/"); // Directory to store images
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + "-" + file.originalname); // Unique file name
	},
});

const upload = multer({ storage: storage });
exports.upload = upload; // Export upload for route usage

// Create a new blog
exports.createBlog = async (req, res) => {
	try {
		// Get uploaded file paths
		const uploadedFilePaths = req.files
			? req.files.map((file) => `uploads/${file.filename}`)
			: [];

		// Combine with images from request body
		let allImages = [];
		if (req.body.images && Array.isArray(req.body.images)) {
			allImages = [...req.body.images, ...uploadedFilePaths];
		} else {
			allImages = uploadedFilePaths;
		}

		// Create blog with combined images
		const newBlog = new Blog({
			...req.body,
			images: allImages,
		});

		const savedBlog = await newBlog.save();
		res.status(201).json(savedBlog);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

// Get all blogs
exports.getAllBlogs = async (req, res) => {
	try {
		const filter = {};

		// If isDraft query parameter exists, filter by it
		if (req.query.isDraft !== undefined) {
			filter.isDraft = req.query.isDraft === "true";
		}

		const blogs = await Blog.find(filter);
		res.json(blogs);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Get a single blog by ID
exports.getBlogById = async (req, res) => {
	try {
		const blog = await Blog.findById(req.params.id);
		if (blog) res.json(blog);
		else res.status(404).json({ message: "Blog not found" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Update a blog
exports.updateBlog = async (req, res) => {
	try {
		const blog = await Blog.findById(req.params.id);
		if (!blog) {
			return res.status(404).json({ message: "Blog not found" });
		}

		// If we're only updating the order, don't require other fields
		if (req.body.order !== undefined && Object.keys(req.body).length === 1) {
			blog.order = req.body.order;
			await blog.save();
			return res.json(blog);
		}

		// Handle images from request body
		const updatedData = { ...req.body };

		// Handle new file uploads if any
		const newUploadedImages = req.files
			? req.files.map((file) => `uploads/${file.filename}`)
			: [];

		// Combine existing images (from request) with newly uploaded ones
		if (Array.isArray(updatedData.images)) {
			updatedData.images = [...updatedData.images, ...newUploadedImages];
		} else {
			updatedData.images = newUploadedImages;
		}

		// Set update timestamp
		updatedData.updatedAt = Date.now();

		const updatedBlog = await Blog.findByIdAndUpdate(
			req.params.id,
			updatedData,
			{ new: true }
		);

		res.json(updatedBlog);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Delete a blog
exports.deleteBlog = async (req, res) => {
	try {
		await Blog.findByIdAndDelete(req.params.id);
		res.json({ message: "Blog deleted" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Add a new function to publish a draft
exports.publishBlog = async (req, res) => {
	try {
		const blog = await Blog.findByIdAndUpdate(
			req.params.id,
			{ isDraft: false, updatedAt: Date.now() },
			{ new: true }
		);

		if (!blog) {
			return res.status(404).json({ message: "Blog not found" });
		}

		res.json(blog);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

// Replace the uploadImage function
exports.uploadImage = async (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).json({ message: "No file uploaded" });
		}

		// Generate optimized filename with webp extension
		const filename = `${Date.now()}-optimized.webp`;
		const outputPath = path.join("uploads", filename);
		const fullOutputPath = path.join(__dirname, "..", outputPath);

		// Process image with sharp: resize and convert to WebP
		await sharp(req.file.path)
			.resize(1200, null, { withoutEnlargement: true })
			.webp({ quality: 80 })
			.toFile(fullOutputPath);

		// Delete the original uploaded file
		fs.unlinkSync(req.file.path);

		// Return both paths
		const imagePath = outputPath;
		const imageUrl = `http://localhost:5001/${outputPath}`;

		res.json({ imageUrl, imagePath });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Add this new function

// Batch update blog order
exports.batchUpdateOrder = async (req, res) => {
	try {
		const { updates } = req.body;

		if (!updates || !Array.isArray(updates)) {
			return res.status(400).json({ message: "Invalid updates data" });
		}

		// Use Promise.all to perform all updates concurrently
		const updatePromises = updates.map((update) =>
			Blog.findByIdAndUpdate(update.id, { order: update.order }, { new: true })
		);

		await Promise.all(updatePromises);

		res.json({ message: "Blog orders updated successfully" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
