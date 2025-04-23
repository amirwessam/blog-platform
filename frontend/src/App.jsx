import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import BlogEditorPage from "./pages/BlogEditorPage";
import ErrorBoundary from "./components/ErrorBoundary";
import InstallPrompt from "./components/InstallPrompt";
import NetworkStatus from "./components/NetworkStatus";
import { createGlobalStyle } from "styled-components";

// Update the GlobalStyle to fix light/dark mode issues
const GlobalStyle = createGlobalStyle`
  :root {
    color: #213547 !important;
    background-color: #ffffff !important;
  }
  
  #root {
    max-width: none !important;
    text-align: left !important;
    padding: 0 !important;
    margin: 0 auto !important;
  }
`;

function App() {
	return (
		<>
			<GlobalStyle />
			<ErrorBoundary>
				<Router>
					<Routes>
						<Route path="/" element={<HomePage />} />
						<Route path="/editor" element={<BlogEditorPage />} />
						<Route path="/editor/:id" element={<BlogEditorPage />} />
					</Routes>
					<InstallPrompt />
					<NetworkStatus />
				</Router>
			</ErrorBoundary>
		</>
	);
}

export default App;
