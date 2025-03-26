import React from "react";
import { useLocation } from "react-router-dom";

export default function Mood() {
  const location = useLocation();
  const mood = location.state;

  if (!mood) {
    return <p>데이터가 없습니다.</p>;
  }

  return (
    <div>
      <h2>{mood.id}</h2>
    </div>
  );
}
