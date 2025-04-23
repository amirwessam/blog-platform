import { useState, useEffect } from "react";
import styled from "styled-components";

const PromptContainer = styled.div`
	position: fixed;
	bottom: 16px;
	left: 16px;
	padding: 15px 20px;
	background-color: white;
	border-radius: 10px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	z-index: 1000;
	display: flex;
	align-items: center;
	gap: 15px;
	max-width: 350px;
	transform: ${(props) => (props.$show ? "translateY(0)" : "translateY(200%)")};
	transition: transform 0.3s ease-in-out;
`;

const AppIcon = styled.div`
	width: 48px;
	height: 48px;
	border-radius: 8px;
	background: linear-gradient(135deg, #4caf50, #2e7d32);
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 24px;
	color: white;
`;

const PromptContent = styled.div`
	flex: 1;
`;

const PromptTitle = styled.h3`
	margin: 0 0 5px 0;
	font-size: 16px;
	color: #333;
`;

const PromptText = styled.p`
	margin: 0;
	font-size: 14px;
	color: #666;
`;

const ButtonsContainer = styled.div`
	display: flex;
	gap: 10px;
	margin-top: 10px;
`;

const Button = styled.button`
	padding: 8px 12px;
	border-radius: 5px;
	cursor: pointer;
	font-size: 14px;
	font-weight: 500;
	border: none;

	&.primary {
		background-color: #4caf50;
		color: white;
	}

	&.secondary {
		background-color: transparent;
		color: #666;
	}
`;

const InstallPrompt = () => {
	const [showPrompt, setShowPrompt] = useState(false);
	const [installEvent, setInstallEvent] = useState(null);

	useEffect(() => {
		// Check if already installed or previously dismissed
		const isInstalled = window.matchMedia("(display-mode: standalone)").matches;
		const isDismissed =
			localStorage.getItem("installPromptDismissed") === "true";

		if (!isInstalled && !isDismissed) {
			window.addEventListener("beforeinstallprompt", (e) => {
				// Prevent Chrome 67 and earlier from automatically showing the prompt
				e.preventDefault();
				setInstallEvent(e);
				setShowPrompt(true);
			});
		}

		return () => {
			window.removeEventListener("beforeinstallprompt", () => {});
		};
	}, []);

	const handleInstall = () => {
		if (!installEvent) return;

		// Show the install prompt
		installEvent.prompt();

		// Wait for the user to respond to the prompt
		installEvent.userChoice.then((choiceResult) => {
			if (choiceResult.outcome === "accepted") {
			} else {
			}
			setShowPrompt(false);
		});
	};

	const handleDismiss = () => {
		setShowPrompt(false);
		localStorage.setItem("installPromptDismissed", "true");
	};

	if (!showPrompt) return null;

	return (
		<PromptContainer $show={showPrompt}>
			<AppIcon>B</AppIcon>
			<PromptContent>
				<PromptTitle>Install Blog App</PromptTitle>
				<PromptText>
					Install this application on your device for quick access even when
					offline.
				</PromptText>
				<ButtonsContainer>
					<Button
						className="primary"
						onClick={handleInstall}
						aria-label="Install Blog Platform App"
					>
						Install
					</Button>
					<Button
						className="secondary"
						onClick={handleDismiss}
						aria-label="Dismiss installation prompt"
					>
						Not now
					</Button>
				</ButtonsContainer>
			</PromptContent>
		</PromptContainer>
	);
};

export default InstallPrompt;
