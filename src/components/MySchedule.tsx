import React from "react";
import styled from "styled-components";

export default function MySchedule() {
  return (
    <MyScheduleStyle>
      <h2>일정</h2>
      <ScheduleList>
        <li>
          <img src="" alt="일정사진" />
          <p>어울림누리 개관 20주년 기념 스페셜 콘서트 VOL.2</p>
          <span>2024. 10. 13 (일)</span>
        </li>
        <li>
          <img src="" alt="일정사진" />
          <p>어울림누리 개관 20주년 기념 스페셜 콘서트 VOL.2</p>
          <span>2024. 10. 13 (일)</span>
        </li>
        <li>
          <img src="" alt="일정사진" />
          <p>어울림누리 개관 20주년 기념 스페셜 콘서트 VOL.2</p>
          <span>2024. 10. 13 (일)</span>
        </li>
        <li>
          <img src="" alt="일정사진" />
          <p>어울림누리 개관 20주년 기념 스페셜 콘서트 VOL.2</p>
          <span>2024. 10. 13 (일)</span>
        </li>
        <li>
          <img src="" alt="일정사진" />
          <p>어울림누리 개관 20주년 기념 스페셜 콘서트 VOL.2</p>
          <span>2024. 10. 13 (일)</span>
        </li>
      </ScheduleList>
    </MyScheduleStyle>
  );
}

const MyScheduleStyle = styled.div`
  background: #fff;
  padding: 19px 16px 0 16px;

  h2 {
    font-size: 16px;
    color: #000;
    font-weight: bold;
    padding-bottom: 9px;
  }
`;

const ScheduleList = styled.ul`
  display: flex;
  gap: 12px;
  width: 100%;
  overflow-x: scroll;

  &::-webkit-scrollbar {
    background-color: #fff;
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--color-disabled);
    height: 13px;
    border: 4px solid #fff;
    border-radius: 10px;
    cursor: pointer;
  }

  li {
    width: 87px;
    height: 138px;
    border: 1px solid var(--color-disabled);
    border-radius: 5px;
    padding: 5px;
    margin-bottom: 9px;

    img {
      width: 77px;
      height: 106px;
      border-radius: 5px;
      display: block;
      overflow: hidden;
    }

    p {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      font-size: 10px;
      color: var(--color-dark);
      font-weight: bold;
    }

    span {
      font-size: 8px;
      color: var(--color-main);
      display: block;
      padding-top: 3px;
      font-weight: bold;
    }
  }
`;
