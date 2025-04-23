import axios from "axios";

const CACHE_KEY = "offlineBlogs";

class BlogSyncService {
	// Get blogs - tries online first, falls back to cache
	async getBlogs(filter = "") {
		try {
			// Try to get fresh data from the API
			let url = "http://localhost:5001/api/blogs";
			if (filter === "drafts") {
				url += "?isDraft=true";
			} else if (filter === "published") {
				url += "?isDraft=false";
			}

			const response = await axios.get(url);

			// If successful, update the cache
			this.saveToCache(response.data);

			return response.data;
		} catch (error) {
			return this.getFromCache(filter);
		}
	}

	// Save blogs to cache for offline use
	saveToCache(blogs) {
		try {
			localStorage.setItem(CACHE_KEY, JSON.stringify(blogs));
		} catch (error) {}
	}

	// Get blogs from cache
	getFromCache(filter = "") {
		try {
			const cachedBlogs = JSON.parse(localStorage.getItem(CACHE_KEY)) || [];

			// Apply filtering if needed
			if (filter === "drafts") {
				return cachedBlogs.filter((blog) => blog.isDraft === true);
			} else if (filter === "published") {
				return cachedBlogs.filter((blog) => blog.isDraft === false);
			}

			return cachedBlogs;
		} catch (error) {
			return [];
		}
	}

	// Queue operation for offline use
	queueOperation(operation) {
		const queue = JSON.parse(localStorage.getItem("operationsQueue")) || [];
		queue.push({
			...operation,
			timestamp: new Date().getTime(),
		});
		localStorage.setItem("operationsQueue", JSON.stringify(queue));
	}

	// Attempt to sync queued operations when online
	async syncQueuedOperations() {
		if (!navigator.onLine) return;

		const queue = JSON.parse(localStorage.getItem("operationsQueue")) || [];
		if (queue.length === 0) return;

		const newQueue = [];

		for (const operation of queue) {
			try {
				if (operation.type === "create") {
					await axios.post("http://localhost:5001/api/blogs", operation.data);
				} else if (operation.type === "update") {
					await axios.put(
						`http://localhost:5001/api/blogs/${operation.id}`,
						operation.data
					);
				} else if (operation.type === "updateOrder") {
					await axios.post(
						"http://localhost:5001/api/blogs/batch-update-order",
						{
							updates: operation.updates,
						}
					);
				} else if (operation.type === "delete") {
					await axios.delete(`http://localhost:5001/api/blogs/${operation.id}`);
				}
			} catch (error) {
				newQueue.push(operation);
			}
		}

		localStorage.setItem("operationsQueue", JSON.stringify(newQueue));
	}

	// Register online/offline listeners
	registerSyncListeners() {
		window.addEventListener("online", () => {
			this.syncQueuedOperations();
		});
	}
}

const blogSyncService = new BlogSyncService();
export default blogSyncService;
