import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Header from "../components/Header";
import MyProfile from "../components/MyProfile";
import MySchedule from "../components/MySchedule";
import MyMood from "../components/MyMood";

export default function Profile() {
  const [isBottomSheet, setIsBottomSheet] = useState<boolean>(false);
  const toggleBottomSheet = () => {
    setIsBottomSheet((prev) => !prev);
  };

  return (
    <>
      <Header
        text
        bottomSheetText="설정 및 개인정보, 로그아웃"
        isBottomSheet={isBottomSheet}
        toggleBottomSheet={toggleBottomSheet}
      />
      <Main>
        <MyProfile />
        <MySchedule />
        <MyMood />
      </Main>
    </>
  );
}

const Main = styled.main`
  background: #f2f2f2;
  height: calc(100% - 60px);
  display: flex;
  flex-direction: column;
  gap: 6px;
`;
