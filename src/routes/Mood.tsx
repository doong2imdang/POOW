import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";

export default function Mood() {
  const location = useLocation();
  const mood = location.state;

  const [isBottomSheet, setIsBottomSheet] = useState<boolean>(false);
  const toggleBottomSheet = () => {
    setIsBottomSheet((prev) => !prev);
  };

  if (!mood) {
    return <p>데이터가 없습니다.</p>;
  }

  return (
    <>
      <Header back />
      <h2>{mood.id}</h2>
    </>
  );
}
