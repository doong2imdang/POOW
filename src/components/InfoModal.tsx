import React from "react";
import styled from "styled-components";
import iconTemp from "../assets/images/icon-temp.svg";
import iconPrecipitation from "../assets/images/icon-precipitation.svg";

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
        {isModalType == "weather" && (
          <>
            <Title>
              고양<span> 날씨</span>
            </Title>
            <Contents>
              <WeatherIcon>
                <img src="" alt="날씨 아이콘" />
                <p>살짝흐림</p>
              </WeatherIcon>
              <TempAverage>
                <img src={iconTemp} alt="온도계 이미지" />
                <span>
                  28.6<span>℃</span>
                </span>
              </TempAverage>
              <TempRange>
                <p>
                  최저<span>26.5</span>℃최고<span>30</span>℃
                </p>
              </TempRange>
              <RainProb>
                <img src={iconPrecipitation} alt="강수 이미지" />
                <span>
                  50<span>%</span>
                </span>
              </RainProb>
            </Contents>
          </>
        )}
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
  padding: 34px 12px;

  display: grid;
  grid-template-areas:
    " icon temp "
    " icon range "
    " icon rain  ";
`;

const WeatherIcon = styled.div`
  grid-area: icon;
  width: 100px;
  height: 100px;
  position: relative;
  justify-self: center;

  p {
    font-size: 10px;
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
  }
`;

const TempAverage = styled.div`
  grid-area: temp;
  font-size: 16px;
  font-weight: bold;
  position: relative;
  align-self: center;

  > span {
    padding-left: 6px;
    position: absolute;
    bottom: 50%;
    transform: translateY(50%);
  }
`;

const TempRange = styled.div`
  grid-area: range;
  font-size: 10px;
`;

const RainProb = styled.div`
  grid-area: rain;
  font-size: 16px;
  align-self: center;

  img {
    padding-right: 5px;
  }
`;
