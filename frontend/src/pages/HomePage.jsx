import { useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import axios from "axios";
import styled from "styled-components";
import blogSyncService from "../services/BlogSyncService";

// Update these components for a modern feed layout

const HomeContainer = styled.div`
	max-width: 1000px;
	margin: 0 auto;
	padding: 30px 20px;
	background-color: #f8f9fa;
	min-height: 100vh;
`;

const PageHeader = styled.div`
	text-align: center;
	margin-bottom: 40px;
	position: relative;
`;

const PageTitle = styled.h1`
	font-size: 2.8rem;
	background: linear-gradient(45deg, #4caf50, #2196f3);
	-webkit-background-clip: text;
	background-clip: text;
	color: transparent;
	margin-bottom: 12px;
	font-weight: 700;
`;

const PageSubtitle = styled.p`
	color: #666;
	font-size: 1.1rem;
	max-width: 600px;
	margin: 0 auto;
`;

const BlogGrid = styled.div`
	display: flex;
	flex-direction: column;
	gap: 16px;
	margin-top: 20px;
	width: 100%;
	max-width: 800px;
	margin: 20px auto;

	/* Add this for smoother transitions */
	& > * {
		transition: transform 0.2s ease;
	}
`;

const DragHandle = styled.div`
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	width: 10px;
	cursor: grab;
	background: linear-gradient(to bottom, #4caf50, #8bc34a);
	border-radius: 4px 0 0 4px;
	transition: all 0.15s ease;
	opacity: 0.7;

	&:hover {
		width: 15px;
		opacity: 1;
	}

	&:active {
		cursor: grabbing;
		opacity: 1;
	}

	/* Show grip dots on hover */
	&::after {
		content: "⋮";
		position: absolute;
		color: white;
		font-size: 18px;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		opacity: 0;
		transition: opacity 0.2s;
	}

	&:hover::after {
		opacity: 1;
	}
`;

const BlogCard = styled.div`
	border: 1px solid #eaeaea;
	border-radius: 12px;
	padding: 20px;
	padding-left: 25px; /* Space for the drag handle */
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
	background-color: white;
	transition: all 0.3s ease;
	position: relative;
	overflow: hidden;

	&:hover {
		transform: translateY(-4px);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
	}
`;

const DraggingCard = styled(BlogCard)`
	background-color: #f9f9f9;
	transform: scale(1.02) !important;
	opacity: 0.9;
	box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15) !important;
	border: 1px dashed #4caf50;
`;

const BlogTitle = styled.h2`
	margin-top: 8px;
	font-size: 1.7rem;
	color: #333;
	font-weight: 600;
`;

const BlogPreview = styled.div`
	color: #555;
	margin: 12px 0;
	font-size: 1rem;
	line-height: 1.5;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 3;
	-webkit-box-orient: vertical;
`;

const BlogMeta = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-top: 16px;
`;

const CardFooter = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-top: 16px;
`;

const EditLink = styled(Link)`
	display: inline-flex;
	align-items: center;
	padding: 8px 16px;
	border-radius: 20px;
	background-color: #e8f5e9;
	color: #2e7d32;
	font-weight: 500;
	text-decoration: none;
	transition: all 0.2s;

	&:hover {
		background-color: #c8e6c9;
		text-decoration: none;
	}
`;

const TimeInfo = styled.span`
	color: #888;
	font-size: 0.85rem;
`;

// Better badge styling
const Badge = styled.span`
	padding: 6px 12px;
	border-radius: 20px;
	font-size: 0.85rem;
	font-weight: 500;
	display: inline-flex;
	align-items: center;
`;

const DraftBadge = styled(Badge)`
	background-color: #fff3e0;
	color: #e65100;

	&::before {
		content: "•";
		margin-right: 6px;
		font-size: 16px;
	}
`;

const PublishedBadge = styled(Badge)`
	background-color: #e8f5e9;
	color: #2e7d32;

	&::before {
		content: "•";
		margin-right: 6px;
		font-size: 16px;
	}
`;

// Attractive filter buttons
const FilterContainer = styled.div`
	display: flex;
	gap: 10px;
	margin-bottom: 30px;
	justify-content: center;
`;

const FilterButton = styled.button`
	background-color: ${(props) => (props.$active ? "#4caf50" : "white")};
	color: ${(props) => (props.$active ? "white" : "#333")};
	border: 1px solid ${(props) => (props.$active ? "#4caf50" : "#ddd")};
	padding: 10px 20px;
	border-radius: 30px;
	cursor: pointer;
	font-weight: 500;
	box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
	transition: all 0.2s;

	&:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
		background-color: ${(props) => (props.$active ? "#43a047" : "#f5f5f5")};
	}
`;

// More attractive floating button
const FloatingButton = styled.button`
	position: fixed;
	bottom: 30px;
	right: 30px;
	width: 60px;
	height: 60px;
	border-radius: 50%;
	background: linear-gradient(135deg, #4caf50, #2e7d32);
	color: white;
	border: none;
	font-size: 24px;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
	cursor: pointer;
	transition: all 0.3s;

	&:hover {
		transform: scale(1.1) rotate(90deg);
		box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
	}
`;

const LoadingState = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 60px 0;
	color: #666;

	&::before {
		content: "";
		width: 40px;
		height: 40px;
		border-radius: 50%;
		border: 3px solid #f0f0f0;
		border-top-color: #4caf50;
		animation: spin 1s linear infinite;
		margin-bottom: 20px;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
`;

const EmptyState = styled.div`
	text-align: center;
	padding: 60px 0;
	color: #666;

	h3 {
		margin-bottom: 16px;
		font-size: 1.4rem;
		color: #444;
	}

	p {
		margin-bottom: 24px;
	}

	button {
		background: linear-gradient(135deg, #4caf50, #2e7d32);
		color: white;
		border: none;
		padding: 10px 24px;
		border-radius: 30px;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s;

		&:hover {
			transform: translateY(-2px);
			box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
		}
	}
`;

// Add this component for feedback during drag operations

const DragFeedback = styled.div`
	position: fixed;
	bottom: 20px;
	left: 50%;
	transform: translateX(-50%);
	padding: 10px 20px;
	border-radius: 30px;
	background-color: ${(props) => {
		switch (props.$type) {
			case "success":
				return "#e8f5e9";
			case "error":
				return "#ffebee";
			case "loading":
				return "#e3f2fd";
			default:
				return "#f5f5f5";
		}
	}};
	color: ${(props) => {
		switch (props.$type) {
			case "success":
				return "#2e7d32";
			case "error":
				return "#c62828";
			case "loading":
				return "#1565c0";
			default:
				return "#424242";
		}
	}};
	box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
	display: flex;
	align-items: center;
	z-index: 1000;
	transition: all 0.3s ease;
	opacity: ${(props) => (props.$active ? 1 : 0)};
	visibility: ${(props) => (props.$active ? "visible" : "hidden")};

	&::before {
		content: ${(props) => {
			switch (props.$type) {
				case "success":
					return '"✓"';
				case "error":
					return '"×"';
				case "loading":
					return '""';
				default:
					return '"ℹ"';
			}
		}};
		margin-right: 10px;
		font-size: 18px;
		${(props) =>
			props.$type === "loading" &&
			`
      width: 18px;
      height: 18px;
      border-radius: 50%;
      border: 2px solid #bbdefb;
      border-top-color: #1565c0;
      animation: spin 1s linear infinite;
      margin-right: 10px;
    `}
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
`;

// Add this component and state

const DragInstructionTip = styled.div`
	text-align: center;
	background: #e8f5e9;
	border-radius: 8px;
	padding: 12px;
	margin-bottom: 20px;
	color: #2e7d32;
	font-size: 0.9rem;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 2px 6px rgba(46, 125, 50, 0.1);

	&::before {
		content: "💡";
		margin-right: 8px;
		font-size: 16px;
	}

	button {
		background: transparent;
		color: #1b5e20;
		border: none;
		font-weight: 500;
		padding: 0 6px;
		cursor: pointer;
		text-decoration: underline;
	}
`;

const BlogImagePreview = styled.div`
	margin: 15px 0;
	border-radius: 8px;
	overflow: hidden;
	position: relative;
	height: 180px;
	background-color: #f0f0f0;

	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.3s ease;
	}

	&:hover img {
		transform: scale(1.05);
	}

	&::after {
		content: "${(props) =>
			props.$count > 1 ? `+${props.$count - 1} more` : ""}";
		position: absolute;
		bottom: 10px;
		right: 10px;
		background: rgba(0, 0, 0, 0.6);
		color: white;
		padding: 4px 8px;
		border-radius: 12px;
		font-size: 0.75rem;
		opacity: ${(props) => (props.$count > 1 ? 1 : 0)};
	}
`;

const ensureFullImageUrl = (imagePath) => {
	if (!imagePath) return ""; // Handle null/undefined

	// If it already has http/https, return as is
	if (imagePath.startsWith("http")) {
		return imagePath;
	}

	// Make sure the path has the correct format
	// If it's just a filename without path
	if (!imagePath.includes("/")) {
		return `http://localhost:5001/uploads/${imagePath}`;
	}

	// If it's a relative path starting with uploads/
	if (imagePath.startsWith("uploads/")) {
		return `http://localhost:5001/${imagePath}`;
	}

	// For any other format, just prepend the server URL
	return `http://localhost:5001/${imagePath}`;
};

// Replace your hasImages check and add this content image extraction function

// Just before your ensureFullImageUrl function, add this helper:
const extractImageFromContent = (content) => {
	if (!content) return null;

	// Parse the content to find image tags
	const imgRegex = /<img.*?src=["'](.*?)["'].*?>/g;
	const matches = [...content.matchAll(imgRegex)];

	if (matches.length > 0) {
		// Return the first image src found
		return matches[0][1];
	}

	return null;
};

// Add a styled delete button - add this with your other styled components
const DeleteButton = styled.button`
	display: inline-flex;
	align-items: center;
	padding: 8px 16px;
	border-radius: 20px;
	background-color: #ffebee;
	color: #c62828;
	font-weight: 500;
	border: none;
	text-decoration: none;
	transition: all 0.2s;
	position: absolute;
	top: 15px;
	right: 15px;
	cursor: pointer;
	font-size: 14px;

	&:hover {
		background-color: #ffcdd2;
		transform: translateY(-2px);
		box-shadow: 0 2px 8px rgba(198, 40, 40, 0.2);
	}

	&::before {
		content: "✕";
		margin-right: 5px;
		font-size: 14px;
	}
`;

const HomePage = () => {
	const [blogs, setBlogs] = useState([]);
	const [filter, setFilter] = useState("all");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [isDragging, setIsDragging] = useState(false);
	const [dragFeedback, setDragFeedback] = useState({
		active: false,
		message: "",
		type: "info",
	});
	const [showDragTip, setShowDragTip] = useState(true);

	useEffect(() => {
		fetchBlogs();
	}, [filter]);

	const fetchBlogs = async () => {
		try {
			setLoading(true);
			const blogs = await blogSyncService.getBlogs(filter);

			// Sort blogs by their order property (if it exists)
			const sortedBlogs = blogs.sort((a, b) => {
				// Default to 0 if order property doesn't exist
				const orderA = a.order !== undefined ? a.order : 0;
				const orderB = b.order !== undefined ? b.order : 0;
				return orderA - orderB;
			});

			setBlogs(sortedBlogs);
			setLoading(false);
		} catch (error) {
			setError("Failed to load blogs. Please try again.");
			setLoading(false);
		}
	};

	useEffect(() => {
		blogSyncService.registerSyncListeners();
	}, []);

	// Add a drag start handler
	const handleDragStart = (start) => {
		setIsDragging(true);
		setDragFeedback({
			active: true,
			message: "Reordering blog posts...",
			type: "info",
		});

		// Find the blog being dragged
		const draggedBlog = blogs.find((blog) => blog._id === start.draggableId);

		// Optional: Add sound effect
		const audio = new Audio("/drag-start.mp3");
		audio.volume = 0.2;
		audio.play().catch(() => {
			// Silent catch - audio might not play if user hasn't interacted with page
		});
	};

	// Replace the entire handleDragEnd function with this implementation

	const handleDragEnd = async (result) => {
		setIsDragging(false);

		// If dropped outside the list or no destination
		if (!result.destination) {
			setDragFeedback({
				active: true,
				message: "Reordering cancelled",
				type: "info",
			});

			setTimeout(() => {
				setDragFeedback({ active: false, message: "", type: "info" });
			}, 2000);

			return;
		}

		// If dropped in the same position
		if (result.destination.index === result.source.index) {
			setDragFeedback({
				active: true,
				message: "Order unchanged",
				type: "info",
			});

			setTimeout(() => {
				setDragFeedback({ active: false, message: "", type: "info" });
			}, 2000);

			return;
		}

		// Set feedback
		setDragFeedback({
			active: true,
			message: "Saving new order...",
			type: "loading",
		});

		// Reorder the blogs array for optimistic UI update
		const items = Array.from(blogs);
		const [reorderedItem] = items.splice(result.source.index, 1);
		items.splice(result.destination.index, 0, reorderedItem);

		// Update the order property for each blog
		const updatedItems = items.map((blog, index) => ({
			...blog,
			order: index,
		}));

		// Update the state immediately for a smooth UI experience
		setBlogs(updatedItems);

		try {
			// Extract the actual blog ID from the draggableId by removing the "blog-" prefix
			const blogId = result.draggableId.replace("blog-", "");

			// Create a batch update payload with all the changes
			const updates = updatedItems.map((blog) => ({
				id: blog._id,
				order: blog.order,
			}));

			// Use a batch update endpoint or queue for offline
			if (navigator.onLine) {
				await axios.post("http://localhost:5001/api/blogs/batch-update-order", {
					updates,
				});
			} else {
				// Queue for later if offline
				blogSyncService.queueOperation({
					type: "updateOrder",
					updates: updates,
				});
			}

			setDragFeedback({
				active: true,
				message: navigator.onLine
					? "New order saved"
					: "Order saved locally (offline)",
				type: "success",
			});

			setTimeout(() => {
				setDragFeedback({ active: false, message: "", type: "info" });
			}, 2000);
		} catch (error) {
			setDragFeedback({
				active: true,
				message: "Failed to save new order",
				type: "error",
			});

			// Revert to original order by refetching
			fetchBlogs();

			setTimeout(() => {
				setDragFeedback({ active: false, message: "", type: "info" });
			}, 3000);
		}
	};

	const stripHtml = (html) => {
		const doc = new DOMParser().parseFromString(html, "text/html");
		return doc.body.textContent || "";
	};

	// Add this function inside your HomePage component
	const handleDeleteBlog = async (blogId, e) => {
		e.stopPropagation(); // Prevent triggering drag

		// Ask for confirmation
		if (
			!confirm(
				"Are you sure you want to delete this blog post? This cannot be undone."
			)
		) {
			return;
		}

		// Set feedback for deletion
		setDragFeedback({
			active: true,
			message: "Deleting blog post...",
			type: "loading",
		});

		try {
			if (navigator.onLine) {
				// Online deletion
				await axios.delete(`http://localhost:5001/api/blogs/${blogId}`);

				// Update state by removing the deleted blog
				setBlogs((prev) => prev.filter((blog) => blog._id !== blogId));

				setDragFeedback({
					active: true,
					message: "Blog post deleted successfully",
					type: "success",
				});
			} else {
				// Offline deletion - queue for sync
				blogSyncService.queueOperation({
					type: "delete",
					id: blogId,
				});

				// Update local state
				setBlogs((prev) => prev.filter((blog) => blog._id !== blogId));

				setDragFeedback({
					active: true,
					message: "Blog deleted (will sync when online)",
					type: "success",
				});
			}

			// Hide feedback after delay
			setTimeout(() => {
				setDragFeedback({ active: false, message: "", type: "info" });
			}, 2000);
		} catch (error) {
			setDragFeedback({
				active: true,
				message: "Failed to delete blog post",
				type: "error",
			});

			setTimeout(() => {
				setDragFeedback({ active: false, message: "", type: "info" });
			}, 3000);
		}
	};

	if (loading) {
		return (
			<HomeContainer>
				<PageHeader>
					<PageTitle>My Blog Feed</PageTitle>
				</PageHeader>
				<LoadingState>Loading your posts...</LoadingState>
			</HomeContainer>
		);
	}

	if (error) {
		return (
			<HomeContainer>
				<PageHeader>
					<PageTitle>My Blog Feed</PageTitle>
				</PageHeader>
				<EmptyState>
					<h3>Something went wrong</h3>
					<p>{error}</p>
					<button onClick={fetchBlogs}>Try Again</button>
				</EmptyState>
			</HomeContainer>
		);
	}

	if (blogs.length === 0) {
		return (
			<HomeContainer>
				<PageHeader>
					<PageTitle>My Blog Feed</PageTitle>
					<PageSubtitle>
						Share your thoughts, ideas, and stories with the world
					</PageSubtitle>
				</PageHeader>
				<FilterContainer>
					<FilterButton
						$active={filter === "all"}
						onClick={() => setFilter("all")}
						disabled={isDragging}
					>
						All Posts
					</FilterButton>
					<FilterButton
						$active={filter === "drafts"}
						onClick={() => setFilter("drafts")}
						disabled={isDragging}
					>
						Drafts
					</FilterButton>
					<FilterButton
						$active={filter === "published"}
						onClick={() => setFilter("published")}
						disabled={isDragging}
					>
						Published
					</FilterButton>
				</FilterContainer>
				<EmptyState>
					<h3>No posts found</h3>
					<p>Start creating your first blog post!</p>
					<Link to="/editor">
						<button>Create New Post</button>
					</Link>
				</EmptyState>
			</HomeContainer>
		);
	}

	return (
		<HomeContainer>
			<PageHeader>
				<PageTitle>My Blog Feed</PageTitle>
				<PageSubtitle>
					Share your thoughts, ideas, and stories with the world
				</PageSubtitle>
			</PageHeader>

			<FilterContainer>
				<FilterButton
					$active={filter === "all"}
					onClick={() => setFilter("all")}
					disabled={isDragging}
				>
					All Posts
				</FilterButton>
				<FilterButton
					$active={filter === "drafts"}
					onClick={() => setFilter("drafts")}
					disabled={isDragging}
				>
					Drafts
				</FilterButton>
				<FilterButton
					$active={filter === "published"}
					onClick={() => setFilter("published")}
					disabled={isDragging}
				>
					Published
				</FilterButton>
			</FilterContainer>

			{showDragTip && blogs.length > 1 && (
				<DragInstructionTip>
					Pro Tip: You can rearrange blog posts by dragging them using the
					colored handle on the left
					<button onClick={() => setShowDragTip(false)}>Got it!</button>
				</DragInstructionTip>
			)}

			<DragDropContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
				<Droppable droppableId="blogs">
					{(provided, snapshot) => (
						<BlogGrid
							{...provided.droppableProps}
							ref={provided.innerRef}
							style={{
								background: snapshot.isDraggingOver ? "#f1f8e9" : "transparent",
								padding: snapshot.isDraggingOver ? "15px" : "0",
								borderRadius: "8px",
								transition: "all 0.2s ease",
							}}
						>
							{blogs.map((blog, index) => {
								// Get the date object
								const date = new Date(blog.updatedAt || blog.createdAt);
								const formattedDate = new Intl.DateTimeFormat("en-US", {
									month: "short",
									day: "numeric",
									year: "numeric",
								}).format(date);

								// Add this inside the blogs.map() function right before returning the Draggable

								// Then modify the hasImages check to be more thorough:
								const hasImages =
									blog.images &&
									Array.isArray(blog.images) &&
									blog.images.length > 0;
								const contentImage = !hasImages
									? extractImageFromContent(blog.content)
									: null;
								const hasVisibleImage = hasImages || contentImage;

								return (
									<Draggable
										key={`blog-${blog._id}`} // Add prefix to ensure uniqueness
										draggableId={`blog-${blog._id}`} // Add same prefix here
										index={index}
										isDragDisabled={loading} // Prevent dragging while loading
									>
										{(provided, snapshot) => (
											<Fragment>
												{snapshot.isDragging ? (
													<DraggingCard
														ref={provided.innerRef}
														{...provided.draggableProps}
														style={{
															...provided.draggableProps.style,
															height: "auto", // Maintain height during drag
														}}
													>
														{blog.isDraft ? (
															<DraftBadge>Draft</DraftBadge>
														) : (
															<PublishedBadge>Published</PublishedBadge>
														)}
														<DeleteButton
															onClick={(e) => handleDeleteBlog(blog._id, e)}
															aria-label="Delete blog post"
														>
															Delete
														</DeleteButton>
														<BlogTitle>{blog.title}</BlogTitle>

														{/* Add this for image display in dragging state */}
														{hasVisibleImage && (
															<BlogImagePreview
																$count={hasImages ? blog.images.length : 1}
															>
																<img
																	src={
																		hasImages
																			? ensureFullImageUrl(blog.images[0])
																			: contentImage
																	}
																	alt={`Preview for ${blog.title}`}
																/>
															</BlogImagePreview>
														)}

														<BlogPreview>{stripHtml(blog.content)}</BlogPreview>
														<CardFooter>
															<TimeInfo>Last updated: {formattedDate}</TimeInfo>
															<EditLink to={`/editor/${blog._id}`}>
																Edit Post
															</EditLink>
														</CardFooter>
													</DraggingCard>
												) : (
													<BlogCard
														ref={provided.innerRef}
														{...provided.draggableProps}
														style={{
															...provided.draggableProps.style,
														}}
													>
														<DragHandle {...provided.dragHandleProps} />
														{blog.isDraft ? (
															<DraftBadge>Draft</DraftBadge>
														) : (
															<PublishedBadge>Published</PublishedBadge>
														)}
														<DeleteButton
															onClick={(e) => handleDeleteBlog(blog._id, e)}
															aria-label="Delete blog post"
														>
															Delete
														</DeleteButton>
														<BlogTitle>{blog.title}</BlogTitle>

														{/* Add this for image display */}
														{hasVisibleImage && (
															<BlogImagePreview
																$count={hasImages ? blog.images.length : 1}
															>
																<img
																	src={
																		hasImages
																			? ensureFullImageUrl(blog.images[0])
																			: contentImage
																	}
																	alt={`Preview for ${blog.title}`}
																/>
															</BlogImagePreview>
														)}

														<BlogPreview>{stripHtml(blog.content)}</BlogPreview>
														<CardFooter>
															<TimeInfo>Last updated: {formattedDate}</TimeInfo>
															<EditLink to={`/editor/${blog._id}`}>
																Edit Post
															</EditLink>
														</CardFooter>
													</BlogCard>
												)}
											</Fragment>
										)}
									</Draggable>
								);
							})}
							{provided.placeholder}
						</BlogGrid>
					)}
				</Droppable>
			</DragDropContext>

			<Link to="/editor">
				<FloatingButton>+</FloatingButton>
			</Link>
			<DragFeedback $active={dragFeedback.active} $type={dragFeedback.type}>
				{dragFeedback.message}
			</DragFeedback>
		</HomeContainer>
	);
};

export default HomePage;
