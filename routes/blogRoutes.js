const express = require("express");
const router = express.Router();
const {
	createBlog,
	getAllBlogs,
	getBlogById,
	updateBlog,
	deleteBlog,
	upload, // Importing upload for image handling
	publishBlog, // Importing publishBlog for publishing drafts
	uploadImage, // Importing uploadImage for rich text editor image upload
	batchUpdateOrder, // Importing batchUpdateOrder for batch updating blog orders
} = require("../controllers/blogController");

router.post("/", upload.array("images", 10), createBlog); // Create with image upload (up to 10 images)
router.get("/", getAllBlogs); // Read all blogs
router.get("/:id", getBlogById); // Read a single blog by ID
router.put("/:id", upload.array("images", 10), updateBlog); // Update with image upload (up to 10 images)
router.delete("/:id", deleteBlog); // Delete a blog by ID

// Add a route to publish a draft
router.patch("/:id/publish", publishBlog);

// Route for uploading images from the rich text editor
router.post("/upload", upload.single("images"), uploadImage);

// Route for batch updating blog orders
router.post("/batch-update-order", batchUpdateOrder);

module.exports = router;
