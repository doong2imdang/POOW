import React, { useState } from "react";
import Header from "../components/Header";

export default function CheckList() {
  const [isBottomSheet, setIsBottomSheet] = useState<boolean>(false);

  const toggleBottomSheet = () => {
    setIsBottomSheet((prev) => !prev);
  };

  return (
    <Header
      text
      bottomSheetText="생성, 체크리스트 선택"
      isBottomSheet={isBottomSheet}
      toggleBottomSheet={toggleBottomSheet}
    />
  );
}
