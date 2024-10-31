import React, { useState } from "react";
import Header from "../components/Header";

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
    </>
  );
}
