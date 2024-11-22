import React, { ReactNode } from "react";
import styled from "styled-components";

interface SelectModalProps {
  message: ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function SelectModal({
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
}: SelectModalProps) {
  return (
    <>
      <SelectModalWrapper>
        <p>{message}</p>
        <button type="button" onClick={onCancel}>
          {cancelText}
        </button>
        <button type="button" onClick={onConfirm}>
          {confirmText}
        </button>
      </SelectModalWrapper>
    </>
  );
}

const SelectModalWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  z-index: 10;
  border-radius: 10px;
  overflow: hidden;
  color: var(--color-dark);
  display: grid;
  text-align: center;
  grid-template-areas:
    "text text"
    "left right";

  p {
    font-size: 16px;
    padding: 26px 0;
    grid-area: text;
    line-height: 20px;
    margin: 0 auto;
  }

  button {
    font-size: 14px;
    padding: 14px 0;
    border-top: 1px solid var(--color-disabled);
    min-width: 126px;

    &:hover {
      background: var(--color-main);
    }

    &:nth-of-type(2) {
      color: var(--color-main);
      border-left: 1px solid var(--color-disabled);

      &:hover {
        color: var(--color-dark);
      }
    }
  }
`;
