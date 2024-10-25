import React from "react";
import styled from "styled-components";

interface InputProps {
  width?: string;
  height?: string;
  color?: string;
  type?: "email" | "password" | "text";
  id?: string;
  value?: string;
  placeholder?: string;
  borderBottom?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({
  width,
  height,
  color,
  type = "text",
  id,
  value,
  placeholder = "이메일 주소를 입력해주세요.",
  borderBottom,
  onChange,
}) => {
  return (
    <StyledInput
      type={type}
      id={id}
      value={value}
      width={width}
      height={height}
      color={color}
      placeholder={placeholder}
      borderBottom={borderBottom}
      onChange={onChange}
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
