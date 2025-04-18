import React from "react";
import styled from "styled-components";

interface Props {
  isSelected?: boolean;
  isModalType?: string;
  onClose: () => void;
}

export default function InfoModal({ isSelected, isModalType, onClose }: Props) {
  if (!isSelected) return null;

  return (
    <>
      <InfoModalBg onClick={onClose}></InfoModalBg>
      <InfoModalContainer>
        <Title>
          고양<span> 날씨</span>
        </Title>
        <Contents></Contents>
      </InfoModalContainer>
    </>
  );
}

const InfoModalBg = styled.div`
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 390px;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 9;
`;

const InfoModalContainer = styled.div`
  position: absolute;
  z-index: 10;
  width: 329px;
  background: #fff;
  padding: 12px 11px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 10px;
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: bold;
  padding: 7px 0;
  color: var(--color-bg);
  background: var(--color-dark);
  border-radius: 10px;
  text-align: center;
`;

const Contents = styled.div`
  border: 1px solid var(--color-disabled);
  min-height: 171px;
  border-radius: 10px;
  margin-top: 13px;
`;
