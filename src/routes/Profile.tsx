import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Header from "../components/Header";
import MyProfile from "../components/MyProfile";

export default function Profile() {
  const [isBottomSheet, setIsBottomSheet] = useState<boolean>(false);
  const toggleBottomSheet = () => {
    setIsBottomSheet((prev) => !prev);
  };

  return (
    <>
      <Header
        text
        bottomSheetText="삭제, 수정"
        isBottomSheet={isBottomSheet}
        toggleBottomSheet={toggleBottomSheet}
      />
      <Main>
        <MyProfile />
      </Main>
    </>
  );
}

const Main = styled.main`
  background: #f2f2f2;
  height: calc(100% - 60px);
`;
