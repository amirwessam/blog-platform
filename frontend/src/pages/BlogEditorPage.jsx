import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import BlogEditor from "../components/BlogEditor";
import BlogView from "../components/BlogView";
import styled from "styled-components";
import blogSyncService from "../services/BlogSyncService"; // Ensure this is at the top

const EditorContainer = styled.div`
	max-width: 1000px;
	margin: 0 auto;
	padding: 30px 20px;
	background-color: #f8f9fa;
	min-height: 100vh;
	position: relative;
`;

const PageHeader = styled.div`
	text-align: center;
	margin-bottom: 30px;
	position: relative;
`;

const PageTitle = styled.h1`
	font-size: 2.5rem;
	background: linear-gradient(45deg, #4caf50, #2196f3);
	-webkit-background-clip: text;
	background-clip: text;
	color: transparent;
	margin-bottom: 10px;
	font-weight: 700;
`;

const PageSubtitle = styled.p`
	color: #666;
	font-size: 1.1rem;
	max-width: 600px;
	margin: 0 auto 20px;
`;

const ViewContainer = styled.div`
	background: white;
	border-radius: 12px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
	padding: 30px;
	margin-top: 20px;
	position: relative;

	&::before {
		content: "";
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		width: 5px;
		background: linear-gradient(to bottom, #4caf50, #2196f3);
		border-radius: 4px 0 0 4px;
	}
`;

const ViewHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20px;
	padding-bottom: 15px;
	border-bottom: 1px solid #eaeaea;
`;

const BlogTitle = styled.h1`
	color: #333;
	font-size: 2.2rem;
	margin: 0;
`;

const ActionButton = styled.button`
	padding: 10px 18px;
	background: ${(props) =>
		props.primary ? "linear-gradient(135deg, #4caf50, #2e7d32)" : "white"};
	color: ${(props) => (props.primary ? "white" : "#333")};
	border: ${(props) => (props.primary ? "none" : "1px solid #ddd")};
	border-radius: 30px;
	cursor: pointer;
	font-weight: 500;
	box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
	transition: all 0.2s;
	display: flex;
	align-items: center;
	justify-content: center;

	&:hover {
		transform: translateY(-2px);
		background: ${(props) =>
			props.primary ? "linear-gradient(135deg, #388e3c, #1b5e20)" : "#f5f5f5"};
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	}
`;

const BackLink = styled(Link)`
	display: inline-flex;
	align-items: center;
	padding: 8px 16px;
	margin-bottom: 20px;
	border-radius: 20px;
	background-color: white;
	color: #666;
	font-weight: 500;
	text-decoration: none;
	transition: all 0.2s;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

	&:hover {
		background-color: #f5f5f5;
		transform: translateX(-4px);
		text-decoration: none;
	}

	&::before {
		content: "←";
		margin-right: 8px;
	}
`;

const EditorWrapper = styled.div`
	background: white;
	border-radius: 12px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
	padding: 30px;
	position: relative;

	&::before {
		content: "";
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		width: 5px;
		background: linear-gradient(to bottom, #4caf50, #2196f3);
		border-radius: 4px 0 0 4px;
	}
`;

const LoadingContainer = styled.div`
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

const BlogEditorPage = () => {
	const [blog, setBlog] = useState(null);
	const [isEditing, setIsEditing] = useState(true);
	const [loading, setLoading] = useState(false);
	const { id } = useParams();
	const navigate = useNavigate();

	useEffect(() => {
		if (id) {
			fetchBlog(id);
		} else {
			// New blog, start in edit mode
			setIsEditing(true);
			setBlog(null);
		}
	}, [id]);

	const fetchBlog = async (blogId) => {
		setLoading(true);
		try {
			const response = await axios.get(
				`http://localhost:5001/api/blogs/${blogId}`
			);
			setBlog(response.data);
			setIsEditing(false);
			setLoading(false);
		} catch (error) {
			console.error("Error fetching blog:", error);
			setLoading(false);
		}
	};

	const handleSave = async (blogData) => {
		try {
			setLoading(true);

			// Check if we're offline
			if (!navigator.onLine) {
				// Handle offline saving
				const tempId = blog?._id || "temp_" + new Date().getTime();

				// Queue the operation for later sync
				if (blog?._id) {
					blogSyncService.queueOperation({
						type: "update",
						id: blog._id,
						data: blogData,
					});
				} else {
					blogSyncService.queueOperation({
						type: "create",
						data: { ...blogData, _id: tempId },
					});
				}

				// Update the local cache
				if (blog?._id) {
					const cachedBlogs = blogSyncService.getFromCache();
					const updatedCache = cachedBlogs.map((b) =>
						b._id === blog._id ? { ...b, ...blogData } : b
					);
					blogSyncService.saveToCache(updatedCache);
				} else {
					const cachedBlogs = blogSyncService.getFromCache();
					blogSyncService.saveToCache([
						...cachedBlogs,
						{
							...blogData,
							_id: tempId,
							createdAt: new Date(),
							updatedAt: new Date(),
						},
					]);
				}

				// Create a mock response for UI feedback
				const mockResponse = {
					data: {
						...blogData,
						_id: tempId,
						createdAt: new Date(),
						updatedAt: new Date(),
					},
				};

				setBlog(mockResponse.data);
				setIsEditing(false);
				setLoading(false);

				// Show offline success notification
				alert("Blog saved offline. It will sync when you're back online.");

				// Redirect to home page
				navigate("/");
				return;
			}

			// Online behavior - unchanged
			let response;
			if (blog?._id) {
				response = await axios.put(
					`http://localhost:5001/api/blogs/${blog._id}`,
					blogData
				);
			} else {
				response = await axios.post(
					"http://localhost:5001/api/blogs",
					blogData
				);
			}

			setBlog(response.data);
			setIsEditing(false);
			setLoading(false);

			// Redirect to home page after saving
			navigate("/");
		} catch (error) {
			console.error("Error saving blog:", error);
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<EditorContainer>
				<PageHeader>
					<PageTitle>
						{blog ? "Loading Blog..." : "Preparing Editor..."}
					</PageTitle>
				</PageHeader>
				<LoadingContainer>
					{blog ? "Loading blog content..." : "Setting up your editor..."}
				</LoadingContainer>
			</EditorContainer>
		);
	}

	return (
		<EditorContainer>
			<BackLink to="/">Back to Feed</BackLink>

			{isEditing ? (
				<>
					<PageHeader>
						<PageTitle>{blog ? "Edit Blog" : "New Blog"}</PageTitle>
						<PageSubtitle>
							{blog ? "Edit your blog post below" : "Create a new blog post"}
						</PageSubtitle>
					</PageHeader>
					<EditorWrapper>
						<BlogEditor initialBlog={blog} onSave={handleSave} />
					</EditorWrapper>
				</>
			) : (
				<>
					<PageHeader>
						<PageTitle>Blog Preview</PageTitle>
						<PageSubtitle>
							See how your blog post will appear to readers
						</PageSubtitle>
					</PageHeader>
					<ViewContainer>
						<ViewHeader>
							<BlogTitle>{blog.title}</BlogTitle>
							<ActionButton primary onClick={() => setIsEditing(true)}>
								Edit
							</ActionButton>
						</ViewHeader>
						<BlogView blog={blog} />
					</ViewContainer>
				</>
			)}
		</EditorContainer>
	);
};

export default BlogEditorPage;
