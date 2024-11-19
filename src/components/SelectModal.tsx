import React from "react";
import styled from "styled-components";

export default function SelectModal() {
  return (
    <>
      <SelectModalWrapper>
        <p>로그아웃하시겠습니까?</p>
        <button type="button">취소</button>
        <button type="button">로그아웃</button>
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
  grid-template-areas:
    "text text"
    "left right";

  p {
    font-size: 16px;
    padding: 26px 45px;
    grid-area: text;
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
