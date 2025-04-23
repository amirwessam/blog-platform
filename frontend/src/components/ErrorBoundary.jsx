import { Component } from "react";

class ErrorBoundary extends Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error) {
		return { hasError: true, error };
	}

	componentDidCatch(error, errorInfo) {
		console.error("Error caught by boundary:", error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			return (
				<div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
					<h1>Something went wrong</h1>
					<p>Error: {this.state.error?.message}</p>
					<button onClick={() => (window.location.href = "/")}>
						Go to Home Page
					</button>
				</div>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
