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
}

const Button: React.FC<ButtonProps> = ({
  $background = "transparent",
  $width = "90px",
  $height = "32px",
  $color = "var(--color-dark)",
  type = "button",
  text = "저장",
  disabled = true,
}) => {
  return (
    <ButtonStyle
      $background={$background}
      $width={$width}
      $height={$height}
      $color={$color}
      type={type}
      disabled={disabled}
    >
      {text}
    </ButtonStyle>
  );
};

const ButtonStyle = styled.button<ButtonProps>`
  background-color: ${(props) => props.$background};
  width: ${(props) => props.$width};
  height: ${(props) => props.$height};
  color: ${(props) => props.$color};
  border-radius: 20px;
  font-weight: bold;
  font-size: 14px;

  ${(props) =>
    props.disabled
      ? `background-color: var(--color-disabled); color: #fff; pointer-events: none; `
      : `background-color: var(--color-main); color: var(--color-dark); `}
`;

export default Button;
