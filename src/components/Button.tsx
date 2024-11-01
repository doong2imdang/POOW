import React from "react";
import styled from "styled-components";

interface ButtonProps {
  $background?: string;
  $width?: string;
  $height?: string;
  $color?: string;
  type?: "button" | "submit" | "reset";
  text?: string;
  disabled?: boolean;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({
  $background = "var(--color-main)",
  $width = "90px",
  $height = "32px",
  $color = "var(--color-dark)",
  type = "button",
  text = "저장",
  disabled = true,
  onClick,
}) => {
  return (
    <ButtonStyle
      $background={$background}
      $width={$width}
      $height={$height}
      $color={$color}
      type={type}
      disabled={disabled}
      onClick={onClick}
    >
      {text}
    </ButtonStyle>
  );
};

const ButtonStyle = styled.button<ButtonProps>`
  width: ${(props) => props.$width};
  height: ${(props) => props.$height};
  color: ${(props) => props.$color};
  font-weight: bold;
  font-size: 14px;
  border-radius: 20px;
  background-color: ${(props) =>
    props.disabled ? "var(--color-disabled)" : props.$background};
  color: ${(props) => (props.disabled ? "#fff" : props.$color)};
  pointer-events: ${(props) => (props.disabled ? "none" : "auto")};
`;

export default Button;
