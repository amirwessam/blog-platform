import { useState, useRef, useEffect, useCallback } from "react";
import {
	EditorState,
	convertToRaw,
	ContentState,
	AtomicBlockUtils,
} from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import axios from "axios";
import styled from "styled-components";
import "../styles/editor.css"; // Import the CSS file we created
import ImageGallery from "./ImageGallery";

const EditorContainer = styled.div`
	width: 100%;
	max-width: 800px;
	margin: 0 auto;
`;

const TitleInput = styled.input`
	width: 100%;
	font-size: 24px;
	padding: 16px;
	margin-bottom: 20px;
	border: 1px solid #e0e0e0;
	border-radius: 8px;
	background-color: white;
	color: #333;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
	transition: all 0.3s;

	&:focus {
		border-color: #4caf50;
		box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
		outline: none;
	}

	&::placeholder {
		color: #aaa;
	}
`;

const ButtonGroup = styled.div`
	margin-top: 25px;
	display: flex;
	gap: 12px;
`;

const Button = styled.button`
	padding: 12px 18px;
	border: none;
	border-radius: 30px;
	cursor: pointer;
	font-weight: 500;
	transition: all 0.2s;
	display: flex;
	align-items: center;
	justify-content: center;

	&:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}

	&:hover:not(:disabled) {
		transform: translateY(-2px);
	}
`;

const SaveButton = styled(Button)`
	background-color: white;
	color: #333;
	border: 1px solid #ddd;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

	&:hover:not(:disabled) {
		background-color: #f5f5f5;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	}
`;

const PublishButton = styled(Button)`
	background: linear-gradient(135deg, #4caf50, #2e7d32);
	color: white;
	box-shadow: 0 2px 6px rgba(46, 125, 50, 0.3);

	&:hover:not(:disabled) {
		background: linear-gradient(135deg, #388e3c, #1b5e20);
		box-shadow: 0 4px 10px rgba(46, 125, 50, 0.4);
	}
`;

const ImageButton = styled.button`
	margin-bottom: 15px;
	padding: 10px 16px;
	background: white;
	border: 1px solid #ddd;
	border-radius: 30px;
	cursor: pointer;
	display: flex;
	align-items: center;
	font-weight: 500;
	color: #666;
	transition: all 0.2s;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

	&:hover {
		background-color: #f5f5f5;
		transform: translateY(-2px);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	}

	&::before {
		content: "📷";
		margin-right: 8px;
		font-size: 16px;
	}
`;

const UploadingIndicator = styled.div`
	margin: 15px 0;
	padding: 10px 15px;
	background-color: #e8f5e9;
	border-left: 4px solid #4caf50;
	border-radius: 4px;
	color: #2e7d32;
	display: flex;
	align-items: center;

	&::before {
		content: "";
		width: 16px;
		height: 16px;
		border-radius: 50%;
		border: 2px solid #e8f5e9;
		border-top-color: #4caf50;
		animation: spin 1s linear infinite;
		margin-right: 10px;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
`;

const WysiwygEditor = styled.div`
	border: 1px solid #e0e0e0;
	border-radius: 8px;
	overflow: hidden;
	background: white;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
	margin-bottom: 20px;
	position: relative; /* Needed for inline toolbar positioning */

	.rdw-editor-toolbar {
		/* Keep this minimal as it's handled in CSS file */
		display: flex;
		align-items: center;
		min-height: 40px;
		height: auto !important;
	}

	.rdw-editor-main {
		min-height: 350px;
		padding: 24px;
		font-size: 16px;
		line-height: 1.6;
		color: #333;
	}

	/* Improved toolbar button styling */
	.toolbar-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 14px; /* Smaller font size */
	}

	/* Style the dropdown trigger */
	.toolbar-dropdown {
		display: flex;
		align-items: center;
		padding: 0 6px; /* Smaller padding */
		font-weight: 500;
		font-size: 14px; /* Smaller font */
	}

	/* Make dropdown smaller */
	.rdw-dropdown-wrapper {
		height: 28px !important; /* Match button height */
	}
`;

const BlogEditor = ({ initialBlog, onSave }) => {
	const [title, setTitle] = useState(initialBlog?.title || "");
	const [editorState, setEditorState] = useState(() => {
		if (initialBlog?.content) {
			const blocksFromHtml = htmlToDraft(initialBlog.content);
			const { contentBlocks, entityMap } = blocksFromHtml;
			const contentState = ContentState.createFromBlockArray(
				contentBlocks,
				entityMap
			);
			return EditorState.createWithContent(contentState);
		}
		return EditorState.createEmpty();
	});
	const [saving, setSaving] = useState(false);
	const [uploading, setUploading] = useState(false);
	const [uploadedImages, setUploadedImages] = useState(
		initialBlog?.images || []
	);

	// Add a fileInput ref
	const fileInputRef = useRef(null);

	// Improved image upload callback
	const uploadImageCallback = (file) => {
		return new Promise((resolve, reject) => {
			setUploading(true);
			const formData = new FormData();
			formData.append("images", file);

			axios
				.post("http://localhost:5001/api/blogs/upload", formData, {
					headers: {
						"Content-Type": "multipart/form-data",
					},
				})
				.then((response) => {
					setUploading(false);

					// Pass the correct link structure that react-draft-wysiwyg expects
					resolve({ data: { link: response.data.imageUrl } });
				})
				.catch((error) => {
					setUploading(false);
					alert("Failed to upload image. Please try again.");
					reject(error);
				});
		});
	};

	// Add this function to trigger the file input
	const handleImageButtonClick = () => {
		fileInputRef.current.click();
	};

	// Update the handleFileChange function
	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (!file) return;

		// Check if offline
		if (!navigator.onLine) {
			alert(
				"Image uploads require an internet connection. You can still save your blog post text, and upload images when you're back online."
			);
			return;
		}

		setUploading(true);

		const formData = new FormData();
		formData.append("images", file);

		axios
			.post("http://localhost:5001/api/blogs/upload", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			})
			.then((response) => {
				setUploading(false);

				// Add the image URL to our state - use imagePath if available or extract from imageUrl
				const imagePath = response.data.imagePath || response.data.imageUrl;
				setUploadedImages((prev) => [...prev, imagePath]);

				// Insert the image into the editor using the full URL
				const contentState = editorState.getCurrentContent();
				const contentStateWithEntity = contentState.createEntity(
					"IMAGE",
					"IMMUTABLE",
					{ src: response.data.imageUrl, alt: file.name, width: "100%" }
				);
				const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
				const newEditorState = EditorState.set(editorState, {
					currentContent: contentStateWithEntity,
				});
				setEditorState(
					AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, " ")
				);
			})
			.catch((error) => {
				setUploading(false);

				// Provide a more detailed error message
				if (!navigator.onLine) {
					alert(
						"Network is offline. Please try uploading images when your connection is restored."
					);
				} else {
					alert("Failed to upload image. Please try again.");
				}
			});
	};

	// Add these handler functions
	const handleImagesReorder = (newImages) => {
		setUploadedImages(newImages);
	};

	const handleImageRemove = (index) => {
		setUploadedImages((prev) => prev.filter((_, i) => i !== index));
	};

	// Store editor reference for debugging
	useEffect(() => {
		// Expose editor for debugging
		window.editor = { editorState, setEditorState };

		return () => {
			delete window.editor;
		};
	}, [editorState]);

	// Update the saveBlog function to include images
	const saveBlog = async (isDraft = true) => {
		setSaving(true);
		try {
			const contentHtml = draftToHtml(
				convertToRaw(editorState.getCurrentContent())
			);

			const blogData = {
				title,
				content: contentHtml,
				isDraft,
				images: uploadedImages, // Include the images array
			};

			await onSave(blogData);
			setSaving(false);
		} catch (error) {
			setSaving(false);
			alert("Failed to save blog. Please try again.");
		}
	};

	return (
		<EditorContainer>
			<TitleInput
				type="text"
				placeholder="Enter your blog title"
				value={title}
				onChange={(e) => setTitle(e.target.value)}
			/>

			{/* Add hidden file input */}
			<input
				type="file"
				ref={fileInputRef}
				style={{ display: "none" }}
				accept="image/gif,image/jpeg,image/jpg,image/png,image/svg"
				onChange={handleFileChange}
			/>

			{/* Add custom image upload button with improved styling */}
			<ImageButton type="button" onClick={handleImageButtonClick}>
				Insert Image
			</ImageButton>

			{uploadedImages.length > 0 && (
				<ImageGallery
					images={uploadedImages}
					onReorder={handleImagesReorder}
					onRemove={handleImageRemove}
				/>
			)}

			<WysiwygEditor>
				<Editor
					editorState={editorState}
					onEditorStateChange={setEditorState}
					wrapperClassName="rdw-editor-wrapper"
					editorClassName="rdw-editor-main"
					toolbarClassName="rdw-editor-toolbar"
					toolbar={{
						options: ["inline", "blockType", "list"],
						inline: {
							options: ["bold", "italic", "underline"],
							bold: {
								className: "toolbar-btn",
								title: "Bold",
							},
							italic: {
								className: "toolbar-btn",
								title: "Italic",
							},
							underline: {
								className: "toolbar-btn",
								title: "Underline",
							},
						},
						blockType: {
							className: "toolbar-dropdown",
							dropdownClassName: "toolbar-dropdown-menu",
							options: ["H1", "H2", "H3", "Blockquote"],
						},
						list: {
							className: "toolbar-btn-wrapper",
							unordered: {
								className: "toolbar-btn",
								title: "Bullet List",
							},
							ordered: {
								className: "toolbar-btn",
								title: "Numbered List",
							},
						},
					}}
				/>
			</WysiwygEditor>

			{uploading && (
				<UploadingIndicator>Uploading image, please wait...</UploadingIndicator>
			)}

			<ButtonGroup>
				<SaveButton
					onClick={() => saveBlog(true)}
					disabled={saving || uploading}
				>
					{saving ? "Saving..." : "Save as Draft"}
				</SaveButton>
				<PublishButton
					onClick={() => saveBlog(false)}
					disabled={saving || uploading}
				>
					{saving ? "Publishing..." : "Publish"}
				</PublishButton>
			</ButtonGroup>
		</EditorContainer>
	);
};

export default BlogEditor;
