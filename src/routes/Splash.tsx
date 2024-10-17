import React from "react";
import styled, { keyframes } from "styled-components";
import Logo from "../assets/images/logo-txt-reverse.svg";
import Symbol from "../assets/images/logo-symbol.svg";

const flipAnimation = keyframes`
  0% {
    transform: scaleX(1) scaleY(1);
  }
  50% {
    transform: scaleX(-1) scaleY(1);
  }
  100% {
    transform: scaleX(-1) scaleY(-1);
  }
`;

const LogoImage = styled.img`
	animation: ${flipAnimation} 2s forwards;
`;

const Container = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100vh;
`;

export default function Splash() {
	return (
		<Container>
			<LogoImage src={Logo} alt="Logo" />
		</Container>
	);
}
