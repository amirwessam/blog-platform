import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import styled from "styled-components";

const GalleryContainer = styled.div`
	margin: 20px 0;
	padding: 15px;
	border-radius: 8px;
	background-color: #f8f9fa;
	border: 1px dashed #ddd;
`;

const GalleryHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 15px;
`;

const GalleryTitle = styled.h3`
	margin: 0;
	font-size: 1rem;
	color: #555;
	font-weight: 500;
`;

const ImagesGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
	gap: 10px;
`;

const ImageItem = styled.div`
	position: relative;
	border-radius: 6px;
	overflow: hidden;
	box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
	transition: all 0.2s;
	cursor: grab;
	background-color: white;

	${(props) =>
		props.$isDragging &&
		`
    transform: scale(1.05);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
    z-index: 10;
    opacity: 0.8;
    border: 2px solid #4caf50;
  `}

	&:hover .image-actions {
		opacity: 1;
	}
`;

const BlogImage = styled.img`
	width: 100%;
	height: 100px;
	object-fit: cover;
	display: block;
`;

const ImageActions = styled.div`
	position: absolute;
	top: 0;
	right: 0;
	left: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.4);
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8px;
	opacity: 0;
	transition: opacity 0.2s;
	class-name: "image-actions";
`;

const ActionButton = styled.button`
	background: white;
	border: none;
	border-radius: 50%;
	width: 30px;
	height: 30px;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	font-size: 14px;
	color: #333;

	&:hover {
		background: #4caf50;
		color: white;
	}
`;

const EmptyState = styled.div`
	text-align: center;
	padding: 30px;
	color: #999;
	font-size: 0.9rem;
`;

const DragFeedback = styled.div`
	position: fixed;
	bottom: 20px;
	left: 50%;
	transform: translateX(-50%);
	padding: 8px 16px;
	border-radius: 20px;
	background-color: ${(props) =>
		props.$type === "success" ? "#e8f5e9" : "#e3f2fd"};
	color: ${(props) => (props.$type === "success" ? "#2e7d32" : "#1565c0")};
	box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
	display: flex;
	align-items: center;
	z-index: 1000;
	transition: all 0.3s ease;
	opacity: ${(props) => (props.$active ? 1 : 0)};
	visibility: ${(props) => (props.$active ? "visible" : "hidden")};
	font-size: 0.9rem;

	&::before {
		content: ${(props) => (props.$type === "success" ? '"✓"' : '"↕"')};
		margin-right: 8px;
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

const ImageGallery = ({ images, onReorder, onRemove }) => {
	const [feedback, setFeedback] = useState({
		active: false,
		type: "info",
		message: "",
	});

	const handleDragStart = () => {
		setFeedback({
			active: true,
			type: "info",
			message: "Dragging image...",
		});
	};

	const handleDragEnd = (result) => {
		// Hide the feedback after a delay
		setTimeout(() => {
			setFeedback({
				active: false,
				type: "info",
				message: "",
			});
		}, 1500);

		// If dropped outside the list
		if (!result.destination) return;

		// If dropped in the same position
		if (result.destination.index === result.source.index) {
			setFeedback({
				active: true,
				type: "info",
				message: "Image position unchanged",
			});
			return;
		}

		// Create a copy of the images array
		const reorderedImages = Array.from(images);
		// Remove the dragged item
		const [movedImage] = reorderedImages.splice(result.source.index, 1);
		// Insert it at the new position
		reorderedImages.splice(result.destination.index, 0, movedImage);

		// Call the onReorder callback with the new order
		onReorder(reorderedImages);

		setFeedback({
			active: true,
			type: "success",
			message: "Image order updated",
		});
	};

	return (
		<GalleryContainer>
			<GalleryHeader>
				<GalleryTitle>Uploaded Images ({images.length})</GalleryTitle>
				<div className="gallery-controls">
					<small style={{ color: "#888" }}>Drag to reorder images</small>
				</div>
			</GalleryHeader>

			{images.length === 0 ? (
				<EmptyState>
					No images uploaded yet. Use the "Insert Image" button above to add
					images.
				</EmptyState>
			) : (
				<DragDropContext
					onDragStart={handleDragStart}
					onDragEnd={handleDragEnd}
				>
					<Droppable droppableId="image-gallery" direction="horizontal">
						{(provided, snapshot) => (
							<ImagesGrid
								ref={provided.innerRef}
								{...provided.droppableProps}
								style={{
									background: snapshot.isDraggingOver
										? "#f1f8e9"
										: "transparent",
									padding: snapshot.isDraggingOver ? "10px" : "0",
									borderRadius: "4px",
									transition: "all 0.2s",
								}}
							>
								{images.map((image, index) => (
									<Draggable
										key={`image-${index}`}
										draggableId={`image-${index}`}
										index={index}
									>
										{(provided, snapshot) => (
											<ImageItem
												ref={provided.innerRef}
												{...provided.draggableProps}
												{...provided.dragHandleProps}
												$isDragging={snapshot.isDragging}
												style={provided.draggableProps.style}
											>
												<BlogImage
													src={ensureFullImageUrl(image)}
													alt={`Blog image ${index + 1}`}
													onError={(e) => {
														console.error(`Failed to load image: ${image}`);
														e.target.onerror = null;
														e.target.src =
															"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNlZWUiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9InN5c3RlbS11aSIgZm9udC1zaXplPSIxMnB4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBhbGlnbm1lbnQtYmFzZWxpbmU9Im1pZGRsZSIgZmlsbD0iIzk5OSI+SW1hZ2UgTm90IEZvdW5kPC90ZXh0Pjwvc3ZnPg==";
													}}
													style={{
														objectFit: "cover",
														width: "100%",
														height: "100px",
														display: "block",
													}}
												/>
												<ImageActions>
													<ActionButton
														onClick={(e) => {
															e.stopPropagation();
															onRemove(index);
														}}
														title="Remove image"
													>
														×
													</ActionButton>
												</ImageActions>
											</ImageItem>
										)}
									</Draggable>
								))}
								{provided.placeholder}
							</ImagesGrid>
						)}
					</Droppable>
				</DragDropContext>
			)}

			<DragFeedback $active={feedback.active} $type={feedback.type}>
				{feedback.message}
			</DragFeedback>
		</GalleryContainer>
	);
};

export default ImageGallery;
