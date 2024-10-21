import React from "react";
import styled from "styled-components";

interface InputProps {
  width?: string;
  height?: string;
  color?: string;
  type?: "email" | "password" | "text";
  id?: string;
  placeholder?: string;
  borderBottom?: string;
}

const Input: React.FC<InputProps> = ({
  width,
  height,
  color,
  type = "text",
  id,
  placeholder = "이메일 주소를 입력해주세요.",
  borderBottom,
}) => {
  return (
    <StyledInput
      type={type}
      id={id}
      width={width}
      height={height}
      color={color}
      placeholder={placeholder}
      borderBottom={borderBottom}
    />
  );
};

const StyledInput = styled.input<InputProps>`
  width: ${(props) => props.width || "322px"};
  height: ${(props) => props.height || "33px"};
  color: ${(props) => props.color || "var(--color-dark)"};
  border-bottom: ${(props) =>
    props.borderBottom || "1px solid var(--color-disabled)"};
  &::placeholder {
    color: var(--color-disabled);
  }
`;

export default Input;
