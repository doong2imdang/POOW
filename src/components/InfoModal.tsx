import React, { useEffect, useState } from "react";
import styled from "styled-components";
import iconTemp from "../assets/images/icon-temp.svg";
import iconPrecipitation from "../assets/images/icon-precipitation.svg";
import iconCheckListFill from "../assets/images/icon-checkbox-fill.svg";
import iconCheck from "../assets/images/icon-checkbox.svg";
import fortuneBg from "../assets/images/bg-horoscope.svg";
import fortuneCard from "../assets/images/card-horoscope.svg";

interface Props {
  isSelected?: boolean;
  isModalType?: string;
  schedule: any;
  onClose: () => void;
}

interface Item {
  id: number;
  label: string;
  isChecked: boolean;
}

const initialItems: Item[] = [
  { id: 1, label: "슬로건", isChecked: false },
  { id: 2, label: "응원봉", isChecked: false },
  { id: 3, label: "민증", isChecked: false },
];

export default function InfoModal({
  isSelected,
  isModalType,
  schedule,
  onClose,
}: Props) {
  const [items, setItems] = useState<Item[]>(initialItems);
  const fortuneCards = Array(8).fill(fortuneCard);
  const [currAngle, setCurrAngle] = useState(0);
  const [weatherData, setWeatherData] = useState<any>(null);

  console.log(schedule.fcltynm, "clickedSchedule infomodal");

  // 위도,경도 변환 api
  const getCoordinates = async (address: string) => {
    const REST_API_KEY = process.env.REACT_APP_KAKAO_REST_API_KEY;
    const url = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(
      address
    )}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `KakaoAK ${REST_API_KEY}`,
        },
      });
      if (!response.ok) {
        throw new Error("주소 요청 실패");
      }

      const data = await response.json();
      if (data.documents.length === 0) {
        console.warn("해당 주소의 결과가 없습니다.");
        return null;
      }

      const { x, y } = data.documents[0];
      return { latitude: y, longitude: x };
    } catch (error) {
      console.error("좌표 조회 실패:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchCoords = async () => {
      if (!schedule?.fcltynm) return;

      const cleanedAddress = schedule.fcltynm.split(" (")[0];
      const result = await getCoordinates(cleanedAddress);

      console.log("좌표결과", result);
    };
    fetchCoords();
  }, [schedule]);

  // 날씨 정보 api
  useEffect(() => {
    if (isModalType !== "weather") return;

    const fetchWeather = async () => {
      const lat = 37.6584;
      const lon = 126.832;
      const apiKey = process.env.REACT_APP_WEATHER_API_KEY;

      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=kr`
        );
        const data = await response.json();
        setWeatherData(data);
      } catch (error) {
        console.error("날씨 데이터를 가져오는데 실패했습니다", error);
      }
    };

    fetchWeather();
  }, [isModalType]);

  console.log(weatherData);

  const handleCheck = (id: number) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, isChecked: !item.isChecked } : item
      )
    );
  };

  useEffect(() => {
    if (isModalType !== "fortune") return;

    const interval = setInterval(() => {
      setCurrAngle((prev) => prev + 360 / fortuneCards.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [isModalType, fortuneCards.length]);

  if (!isSelected) return null;

  return (
    <>
      <InfoModalBg onClick={onClose}></InfoModalBg>
      <InfoModalContainer>
        {isModalType === "fortune" && (
          <FortuneContainer>
            <FortuneLists
              style={{
                transform: `translate(-50%, -50%) rotateY(${currAngle}deg)`,
              }}
            >
              {fortuneCards.map((card, index) => {
                const rotate = (360 / fortuneCards.length) * index;
                const radius = 140;
                return (
                  <FortuneContent
                    key={index}
                    style={{
                      transform: `rotateY(${rotate}deg) translateZ(${radius}px)`,
                    }}
                  >
                    <img src={card} alt="운세카드" />
                  </FortuneContent>
                );
              })}
            </FortuneLists>
          </FortuneContainer>
        )}
        {isModalType === "checklist" && (
          <Container>
            <CheckTitle>
              <p>2024. 10. 13 (일)</p>
              <strong>어울림 누리 개관 20주년 기념 스페셜 콘서트 VOL.2</strong>
            </CheckTitle>
            <CheckContents>
              <ul>
                {items.map(({ id, label, isChecked }) => (
                  <li key={id} onClick={() => handleCheck(id)}>
                    <img
                      src={isChecked ? iconCheckListFill : iconCheck}
                      alt="체크박스 아이콘"
                    />
                    <input
                      type="checkbox"
                      id={`list-${id}`}
                      checked={isChecked}
                      readOnly
                    />
                    <label htmlFor={`list-${id}`}>{label}</label>
                  </li>
                ))}
              </ul>
            </CheckContents>
          </Container>
        )}
        {isModalType === "weather" && (
          <Container>
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
          </Container>
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
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 10px;
`;

const FortuneContainer = styled.div`
  width: 100%;
  height: 400px;
  background: no-repeat center/cover url(${fortuneBg});
  border-radius: 10px;
  perspective: 1600px;
  overflow: hidden;
`;

const FortuneLists = styled.ul`
  position: absolute;
  top: 50%;
  left: 50%;
  transform-style: preserve-3d;
  transition: transform 1s ease-in-out;
`;

const FortuneContent = styled.li`
  position: absolute;
  transform-style: preserve-3d;

  img {
    width: 105px;
    transform: translate(-50%, -40%);
    position: absolute;
    top: 50%;
    left: 50%;
  }
`;

const Container = styled.div`
  padding: 12px 11px;
`;

const CheckTitle = styled.div`
  strong {
    display: block;
    font-size: 18px;
    font-weight: bold;
    padding-top: 4px;
    color: var(--color-dark);
  }

  p {
    font-size: 12px;
    color: var(--color-disabled);
  }
`;

const CheckContents = styled.div`
  color: var(--color-dark);
  background: #fff;
  min-height: 150px;
  border: 1px solid var(--color-disabled);
  border-radius: 10px;
  margin-top: 9px;

  & > ul {
    padding: 12px;

    > li {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 8px;

      input[type="checkbox"] {
        display: none;
      }

      label {
        font-size: 16px;
      }

      img {
        width: 15px;
        height: 16px;
      }
    }
  }
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
