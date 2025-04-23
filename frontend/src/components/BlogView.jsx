import styled from "styled-components";

const BlogContainer = styled.div`
	width: 100%;
	max-width: 800px;
	margin: 0 auto;
`;

const BlogContent = styled.div`
	margin-top: 20px;
	line-height: 1.6;

	img {
		max-width: 100%;
		height: auto;
		margin: 15px 0;
	}

	h1,
	h2,
	h3,
	h4,
	h5,
	h6 {
		margin-top: 25px;
		margin-bottom: 15px;
	}

	p {
		margin-bottom: 15px;
	}

	ul,
	ol {
		margin-left: 20px;
		margin-bottom: 15px;
	}
`;

const BlogView = ({ blog }) => {
	return (
		<BlogContainer>
			<BlogContent dangerouslySetInnerHTML={{ __html: blog.content }} />
		</BlogContainer>
	);
};

export default BlogView;
