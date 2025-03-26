import React, { useEffect, useState } from "react";
import styled from "styled-components";
import iconPostListOn from "../assets/images/icon-post-list-on.svg";
import iconPostListOff from "../assets/images/icon-post-list-off.svg";
import iconPostAlbumOn from "../assets/images/icon-post-album-on.svg";
import iconPostAlbumOff from "../assets/images/icon-post-album-off.svg";
import iconSMoreVertical from "../assets/images/s-icon-more-vertical.svg";
import iconLeftSlide from "../assets/images/icon-left-slide.svg";
import iconRightSlide from "../assets/images/icon-right-slide.svg";
import symbolLogoGray from "../assets/images/symbol-logo-gray.svg";
import iconImgLayers from "../assets/images/iccon-img-layers.svg";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import {
  BtnDotStyle,
  EmptyMoodContainer,
  ImageSliderStyle,
  Mood,
} from "../routes/Home";
import { useNavigate } from "react-router-dom";
import BottomSheet from "./BottomSheet";

export default function MyMood() {
  const moods = useSelector((state: RootState) => state.moods.moods);
  console.log(moods);
  const navigate = useNavigate();
  const [isBottomSheet, setIsBottomSheet] = useState<boolean>(false);
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [filteredMoods, setFilteredMoods] = useState<Mood[]>([]);
  const [viewMode, setViewMode] = useState<"list" | "album">("list");

  // moods 데이터가 변경될 떄마다 filteredMoods 업데이트
  useEffect(() => {
    setFilteredMoods(moods);
  }, [moods]);

  // 바텀시트 토글 함수
  const toggleBottomSheet = (mood: Mood | null = null) => {
    setSelectedMood(mood);
    setIsBottomSheet((prev) => !prev);
  };

  // 이미지 인덱스 변경
  const handleImageIndexChange = (moodIndex: number, newIndex: number) => {
    setFilteredMoods((prev) =>
      prev.map((mood, index) =>
        index === moodIndex ? { ...mood, currentImageIndex: newIndex } : mood
      )
    );

    // console.log(filteredMoods, "filteredMoods");
  };

  return (
    <>
      {isBottomSheet && (
        <BottomSheet
          text="삭제, 수정"
          toggleBottomSheet={toggleBottomSheet || (() => {})}
          selectedMood={selectedMood}
        />
      )}
      <MyMoodStyle>
        <PostDisplayToggle>
          <button type="button" onClick={() => setViewMode("list")}>
            <img
              src={viewMode === "list" ? iconPostListOn : iconPostListOff}
              alt="리스트형식버튼"
            />
          </button>
          <button type="button" onClick={() => setViewMode("album")}>
            <img
              src={viewMode === "album" ? iconPostAlbumOn : iconPostAlbumOff}
              alt="앨범형식버튼"
            />
          </button>
        </PostDisplayToggle>
        {viewMode === "list" ? (
          <MoodList>
            {moods.length > 0 ? (
              filteredMoods.map((mood, index) => {
                const date = mood.createdAt.toDate();
                const formattedDate = date.toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                });

                return (
                  <li key={index}>
                    <button
                      type="button"
                      onClick={() => {
                        toggleBottomSheet(mood);
                      }}
                    >
                      <img src={iconSMoreVertical} alt="바텀시트 열기 버튼" />
                    </button>
                    <span>{mood.textAreaValue}</span>
                    {mood.fileURLs.length > 0 && (
                      <div>
                        <ImageSliderStyle>
                          {mood.fileURLs.length > 1 &&
                            mood.currentImageIndex !== 0 && (
                              <button
                                onClick={() =>
                                  handleImageIndexChange(
                                    index,
                                    mood.currentImageIndex === 0
                                      ? mood.fileURLs.length - 1
                                      : mood.currentImageIndex - 1
                                  )
                                }
                                type="button"
                              >
                                <img src={iconLeftSlide} alt="" />
                              </button>
                            )}
                          <div className="image-container">
                            <img
                              src={mood.fileURLs[mood.currentImageIndex]}
                              alt="무드 이미지"
                            />
                          </div>

                          {mood.fileURLs.length > 1 &&
                            mood.currentImageIndex >= 0 &&
                            mood.currentImageIndex !==
                              mood.fileURLs.length - 1 && (
                              <button
                                onClick={() =>
                                  handleImageIndexChange(
                                    index,
                                    mood.currentImageIndex ===
                                      mood.fileURLs.length - 1
                                      ? 0
                                      : mood.currentImageIndex + 1
                                  )
                                }
                                type="button"
                              >
                                <img src={iconRightSlide} alt="" />
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
                            className={
                              mood.currentImageIndex === dotIndex
                                ? "active"
                                : ""
                            }
                          ></button>
                        ))}
                    </BtnDotStyle>
                  </li>
                );
              })
            ) : (
              <EmptyMoodContainer>
                <img src={symbolLogoGray} alt="" />
                <p>mood를 등록해보세요!</p>
                <button
                  type="button"
                  onClick={() => {
                    navigate("/setmood");
                  }}
                >
                  mood 등록
                </button>
              </EmptyMoodContainer>
            )}
          </MoodList>
        ) : (
          <MoodAlbum>
            {filteredMoods.map((mood, index) => (
              <div key={index} className="album-item">
                <img
                  src={mood.fileURLs[0]}
                  className="album-item-img"
                  alt="앨범형 mood 이미지"
                />
                {mood.fileURLs.length > 1 && (
                  <img
                    src={iconImgLayers}
                    className="has-multiple-items"
                    alt="해당mood에 파일이 2개이상일 경우"
                  />
                )}
              </div>
            ))}
          </MoodAlbum>
        )}
      </MyMoodStyle>
    </>
  );
}

export const MyMoodStyle = styled.div`
  background: #fff;
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100%;
`;

const PostDisplayToggle = styled.div`
  margin-left: auto;
  padding: 9px 16px;

  button {
    &:nth-of-type(2) {
      margin-left: 16px;
    }
  }

  &::after {
    content: "";
    position: absolute;
    width: 100%;
    height: 1px;
    background: #dbdbdb;
    top: 46.7px;
    left: 0;
  }
`;

export const MoodList = styled.ul`
  font-size: 14px;
  margin: 0 auto;
  padding-bottom: 60px;

  li {
    border-bottom: 1px solid var(--color-disabled);
    padding-top: 18px;
    display: flex;
    flex-direction: column;
    cursor: pointer;

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
      width: 326px;
      margin-bottom: 16px;
    }

    p {
      padding-bottom: 18px;
      color: #767676;
      font-size: 10px;
      display: flex;
      gap: 3px;
      margin-top: 16px;
    }

    &:last-child {
      border-bottom: none;
    }
  }
`;

const MoodAlbum = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  padding: 16px;
  position: relative;

  .album-item {
    width: 100%;
    height: 100px;
    overflow: hidden;
    cursor: pointer;
  }

  .album-item-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .has-multiple-items {
    position: absolute;
    transform: translate(-25px, 5px);
  }
`;
