import { useState, useEffect } from "react";
import styled from "styled-components";

const StatusIndicator = styled.div`
	position: fixed;
	bottom: 16px;
	right: 16px;
	padding: 8px 12px;
	border-radius: 20px;
	font-size: 12px;
	font-weight: 500;
	background-color: ${(props) => (props.$online ? "#e8f5e9" : "#ffebee")};
	color: ${(props) => (props.$online ? "#2e7d32" : "#c62828")};
	display: flex;
	align-items: center;
	transition: all 0.3s ease;
	opacity: ${(props) => (props.$visible ? 1 : 0)};
	pointer-events: none;
	z-index: 1000;
	box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

	&::before {
		content: "";
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background-color: ${(props) => (props.$online ? "#2e7d32" : "#c62828")};
		margin-right: 6px;
	}
`;

const NetworkStatus = () => {
	const [isOnline, setIsOnline] = useState(navigator.onLine);
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const handleOnline = () => {
			setIsOnline(true);
			setVisible(true);
			// Hide after 3 seconds
			setTimeout(() => setVisible(false), 3000);
		};

		const handleOffline = () => {
			setIsOnline(false);
			setVisible(true);
		};

		window.addEventListener("online", handleOnline);
		window.addEventListener("offline", handleOffline);

		// Initial check
		if (!navigator.onLine) {
			setVisible(true);
		}

		return () => {
			window.removeEventListener("online", handleOnline);
			window.removeEventListener("offline", handleOffline);
		};
	}, []);

	return (
		<StatusIndicator $online={isOnline} $visible={visible}>
			{isOnline ? "Online" : "Offline"}
		</StatusIndicator>
	);
};

export default NetworkStatus;
