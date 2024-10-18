import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import Logo from "../assets/images/logo-txt-dark.svg";
import Symbol from "../assets/images/logo-symbol.svg";

const flipAnimation = keyframes`
  0% {
    transform: scaleX(-1) scaleY(-1);
  }
  50% {
    transform: scaleX(1) scaleY(-1);
  }
  100% {
    transform: scaleX(1) scaleY(1);
  }
`;

const LogoImage = styled.img`
	animation: ${flipAnimation} 1.5s forwards;
`;

const SymbolImage = styled.img`
	position: absolute;
	top: calc(50% -20px);
	left: 50%;
	transform: translate(-50%, -100%);
	opacity: 0;
	transition: opacity 0.5s ease-in-out;
	&.visible {
		opacity: 1;
	}
`;

const Container = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100vh;
	position: relative;
`;

export default function Splash() {
	const [showSymbol, setShowSymbol] = useState(false);

	useEffect(() => {
		const timer = setTimeout(() => {
			setShowSymbol(true);
		}, 1000);

		return () => clearTimeout(timer);
	}, []);

	return (
		<Container>
			<LogoImage src={Logo} alt="Logo" />
			<SymbolImage
				src={Symbol}
				alt="Symbol"
				className={showSymbol ? "visible" : ""}
			/>
		</Container>
	);
}
