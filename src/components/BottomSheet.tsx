import React from "react";
import styled, { keyframes } from "styled-components";

interface BottomSheetProps {
  text?: string;
  toggleBottomSheet: () => void;
}

const BottomSheet: React.FC<BottomSheetProps> = ({
  text,
  toggleBottomSheet,
}) => {
  const modalTexts = text ? text.split(",") : [];

  return (
    <>
      <BottomSheetBg></BottomSheetBg>
      <BottomSheetWrapper>
        <BottomSheetHeader>
          <button type="button" onClick={toggleBottomSheet}></button>
        </BottomSheetHeader>
        <BottomSheetContent>
          {modalTexts.length > 1 ? (
            modalTexts.map((item, index) => (
              <TextItem key={index}>{item.trim()}</TextItem>
            ))
          ) : (
            <TextItem>{text}</TextItem>
          )}
        </BottomSheetContent>
      </BottomSheetWrapper>
    </>
  );
};

const slideIn = keyframes`
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
`;

// const slideOut = keyframes`
//   from {
// transform: translateY(0)
//   }

//   to {
// transform: translateY(100%);
//   }
// `;

const BottomSheetBg = styled.div`
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 390px;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 9;
`;

const BottomSheetWrapper = styled.div`
  position: fixed;
  bottom: 0;
  z-index: 10;
  min-height: 92px;
  width: 390px;
  background: var(--color-bg);
  border-radius: 10px 10px 0 0;
  animation: ${slideIn} 0.5s ease-out;
`;

const BottomSheetHeader = styled.div`
  display: flex;
  justify-content: center;
  padding: 16px 0;

  button {
    width: 50px;
    height: 5px;
    background: var(--color-dark);
    border-radius: 5px;
  }
`;

const BottomSheetContent = styled.div`
  padding-bottom: 10px;
`;

const TextItem = styled.div`
  font-size: 14px;
  padding: 14px 0 14px 26px;
  color: var(--color-dark);
  cursor: pointer;
`;

export default BottomSheet;
