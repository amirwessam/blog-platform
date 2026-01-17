const mongoose = require("mongoose");

const connectDB = async () => {
	const mongoUri = process.env.MONGO_URI;
	
	// Validate environment variable exists
	if (!mongoUri) {
		const error = new Error(
			"MONGO_URI environment variable is not defined. " +
			"Please set it in your Vercel environment variables or .env file"
		);
		console.error(error.message);
		throw error;
	}

	try {
		await mongoose.connect(mongoUri, {
			connectTimeoutMS: 10000,
			serverSelectionTimeoutMS: 10000,
		});
		console.log("MongoDB connected successfully");
	} catch (error) {
		console.error("MongoDB connection error:", error.message);
		throw error;
	}
};

module.exports = connectDB;
