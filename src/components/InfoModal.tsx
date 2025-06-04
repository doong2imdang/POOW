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

interface ForecastItem {
  dt: number;
  main: {
    temp: number;
    temp_min?: number;
    temp_max?: number;
  };
  pop?: number;
}

interface ForecastResponse {
  list: ForecastItem[];
}

export default function InfoModal({
  isSelected,
  isModalType,
  schedule,
  onClose,
}: Props) {
  // 운세
  const fortuneCards = Array(8).fill(fortuneCard);
  const [currAngle, setCurrAngle] = useState(0);

  // 날씨
  const [weatherData, setWeatherData] = useState<any>(null);
  const [weatherCoords, setWeatherCoors] = useState<{
    lat: number;
    lon: number;
  } | null>(null);
  const [minTemp, setMinTemp] = useState<number | null>(null);
  const [maxTemp, setMaxTemp] = useState<number | null>(null);
  const [currTemp, setCurrTemp] = useState<number | null>(null);
  const [cityName, setCityName] = useState<string>("");
  const [weatherIcon, setWeatherIcon] = useState<string | null>(null);
  const [weatherDescription, setWeatherDescription] = useState<string | null>(
    null
  );
  const [rainProb, setRainProb] = useState<number | null>(null);

  // 메모
  const [items, setItems] = useState<Item[]>(initialItems);

  // console.log(schedule.fcltynm, "clickedSchedule infomodal");

  // 위도,경도 변환 및 도시이름 가져오기기 api
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
      if (data.documents.length > 0) {
        const { address_name, x, y } = data.documents[0];
        const [city] = address_name.split(" ");

        return {
          city,
          latitude: y,
          longitude: x,
        };
      } else {
        return {
          city: "알 수 없음",
          latitude: "",
          longitude: "",
        };
      }
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

      if (result) {
        setWeatherCoors({
          lat: parseFloat(result.latitude),
          lon: parseFloat(result.longitude),
        });
        setCityName(result.city);
      }
    };
    fetchCoords();
  }, [schedule]);

  // 날씨 정보 api
  useEffect(() => {
    if (!weatherCoords) return;
    if (isModalType !== "weather") return;

    const fetchWeatherData = async () => {
      const { lat, lon } = weatherCoords;
      const apiKey = process.env.REACT_APP_WEATHER_API_KEY;

      try {
        // 현재 날씨
        const weatherRes = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=kr`
        );
        const weatherData = await weatherRes.json();

        setCurrTemp(weatherData.main.temp);
        setWeatherIcon(weatherData.weather[0].icon);
        setWeatherDescription(weatherData.weather[0].description);

        // 예보 (3시간 간격)
        const forecastRes = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=kr`
        );
        const forecastData: ForecastResponse = await forecastRes.json();

        setWeatherData(forecastData);

        // 오늘 날짜 기준 최저/최고 기온 계산
        const today = new Date().getDate();
        const todayForecasts = forecastData.list.filter((item) => {
          const date = new Date(item.dt * 1000);
          return date.getDate() === today;
        });

        const temps = todayForecasts.map((item) => item.main.temp);
        setMinTemp(Math.min(...temps));
        setMaxTemp(Math.max(...temps));

        // 강수 확률
        const pop = forecastData.list?.[0]?.pop || 0;
        setRainProb(Math.round(pop * 100));
      } catch (error) {
        console.error("날씨 정보를 가져오는데 실패했습니다", error);
      }
    };

    fetchWeatherData();
  }, [weatherCoords, isModalType]);

  console.log(
    weatherData,
    "weatherData",
    weatherCoords,
    "weatherCoords",
    rainProb,
    "rainProb"
  );

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
              {cityName}
              <span> 날씨</span>
            </Title>
            <Contents>
              <WeatherIcon>
                <img
                  src={`https://openweathermap.org/img/wn/${weatherIcon}@2x.png`}
                  alt="날씨 아이콘"
                />
                <p>{weatherDescription}</p>
              </WeatherIcon>
              <TempAverage>
                <img src={iconTemp} alt="온도계 이미지" />
                <span>
                  {currTemp}
                  <span>℃</span>
                </span>
              </TempAverage>
              <TempRange>
                <p>
                  최저<span>{minTemp}</span>℃ 최고<span>{maxTemp}</span>℃
                </p>
              </TempRange>
              <RainProb>
                <img src={iconPrecipitation} alt="강수 이미지" />
                <span>
                  {rainProb}
                  <span>%</span>
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
