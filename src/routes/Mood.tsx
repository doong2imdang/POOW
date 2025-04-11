import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import styled from "styled-components";
import iconSMoreVertical from "../assets/images/s-icon-more-vertical.svg";
import iconLeftSlide from "../assets/images/icon-left-slide.svg";
import iconRightSlide from "../assets/images/icon-right-slide.svg";
import { BtnDotStyle, ImageSliderStyle, type Mood } from "./Home";
import BottomSheet from "../components/BottomSheet";

export default function Mood() {
  const location = useLocation();
  const mood = location.state as Mood | null;

  const [isBottomSheet, setIsBottomSheet] = useState<boolean>(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  const toggleBottomSheet = () => {
    setIsBottomSheet((prev) => !prev);
  };

  if (!mood) {
    return <p>데이터가 없습니다.</p>;
  }

  const handleImageIndexChange = (newIndex: number) => {
    setCurrentImageIndex(newIndex);
  };

  const date = mood.createdAt.toDate();
  const formattedDate = date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      {isBottomSheet && (
        <BottomSheet
          text="삭제, 수정"
          toggleBottomSheet={toggleBottomSheet || (() => {})}
          selectedMood={mood}
        />
      )}
      <Header back />
      <MoodList>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleBottomSheet();
          }}
        >
          <img src={iconSMoreVertical} alt="바텀시트 열기 버튼" />
        </button>

        <span>{mood.textAreaValue}</span>

        {mood.fileURLs.length > 0 && (
          <div>
            <ImageSliderStyle>
              {mood.fileURLs.length > 1 && currentImageIndex !== 0 && (
                <button
                  onClick={() =>
                    handleImageIndexChange(
                      currentImageIndex === 0
                        ? mood.fileURLs.length - 1
                        : currentImageIndex - 1
                    )
                  }
                  type="button"
                >
                  <img src={iconLeftSlide} alt="이전 이미지" />
                </button>
              )}

              <div className="image-container">
                <img src={mood.fileURLs[currentImageIndex]} alt="무드 이미지" />
              </div>

              {mood.fileURLs.length > 1 &&
                currentImageIndex < mood.fileURLs.length - 1 && (
                  <button
                    onClick={() =>
                      handleImageIndexChange(
                        currentImageIndex === mood.fileURLs.length - 1
                          ? 0
                          : currentImageIndex + 1
                      )
                    }
                    type="button"
                  >
                    <img src={iconRightSlide} alt="다음 이미지" />
                  </button>
                )}
            </ImageSliderStyle>
          </div>
        )}

        <p>
          <span>{formattedDate}</span>
        </p>

        <BtnDotStyle>
          {mood.fileURLs.length > 1 &&
            mood.fileURLs.map((url: string, dotIndex: number) => (
              <button
                key={dotIndex}
                type="button"
                className={mood.currentImageIndex === dotIndex ? "active" : ""}
              ></button>
            ))}
        </BtnDotStyle>
      </MoodList>
    </>
  );
}

const MoodList = styled.div`
  padding: 21px 28px;
  display: flex;
  flex-direction: column;
  font-size: 14px;

  > button {
    margin-left: auto;
    transform: translateX(8px);
  }

  > img {
    display: block;
    width: 336px;
    height: 252px;
    border-radius: 10px;
    border: 1px solid #dbdbdb;
  }

  > span {
    padding-bottom: 16px;
  }

  p {
    padding: 16px 0 18px;
    color: #767676;
    font-size: 10px;
    display: flex;
    gap: 3px;
  }
`;
