import React from "react";
import styled from "styled-components";
import iconPostListOn from "../assets/images/icon-post-list-on.svg";
import iconPostListOff from "../assets/images/icon-post-list-off.svg";
import iconPostAlbumOn from "../assets/images/icon-post-album-on.svg";
import iconPostAlbumOff from "../assets/images/icon-post-album-off.svg";
import iconSMoreVertical from "../assets/images/s-icon-more-vertical.svg";

export default function MyMood() {
  return (
    <MyMoodStyle>
      <PostDisplayToggle>
        <button type="button">
          <img src={iconPostListOn} alt="리스트형식버튼" />
        </button>
        <button type="button">
          <img src={iconPostAlbumOff} alt="앨범형식버튼" />
        </button>
      </PostDisplayToggle>
      <MoodList>
        <li>
          <button type="button">
            <img src={iconSMoreVertical} alt="바텀시트 열기 버튼" />
          </button>
          <span>
            국회는 의장 1인과 부의장 2인을 선출한다. 모든 국민은 신체의 자유를
            가진다. 누구든지 법률에 의하지 아니하고는 체포·구속·압수·수색 또는
            심문을 받지 아니하며, 법률과 적법한 절차에 의하지 아니하고는
            처벌·보안처분 또는 강제노역을 받지 아니한다.
          </span>
          <img src="" alt="무드 이미지" />
          <p>
            <span>2024년</span>
            <span>10월</span>
            <span>4일</span>
          </p>
        </li>
        <li>
          <button type="button">
            <img src={iconSMoreVertical} alt="바텀시트 열기 버튼" />
          </button>
          <span>
            국회는 의장 1인과 부의장 2인을 선출한다. 모든 국민은 신체의 자유를
            가진다. 누구든지 법률에 의하지 아니하고는 체포·구속·압수·수색 또는
            심문을 받지 아니하며, 법률과 적법한 절차에 의하지 아니하고는
            처벌·보안처분 또는 강제노역을 받지 아니한다.
          </span>
          <img src="" alt="무드 이미지" />
          <p>
            <span>2024년</span>
            <span>10월</span>
            <span>4일</span>
          </p>
        </li>
      </MoodList>
    </MyMoodStyle>
  );
}

const MyMoodStyle = styled.div`
  background: #fff;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const PostDisplayToggle = styled.div`
  margin-left: auto;
  padding: 9px 16px;

  button {
    &:nth-of-type(2) {
      margin-left: 16px;
    }
  }

  &::after {
    content: "";
    position: absolute;
    width: 100%;
    height: 1px;
    background: #dbdbdb;
    top: 46.7px;
    left: 0;
  }
`;

const MoodList = styled.ul`
  font-size: 14px;
  padding: 0 29px 60px 29px;

  li {
    border-bottom: 1px solid var(--color-disabled);
    padding-top: 18px;
    display: flex;
    flex-direction: column;

    > button {
      margin-left: auto;
    }

    > img {
      display: block;
      width: 336px;
      height: 252px;
      border-radius: 10px;
      border: 1px solid #dbdbdb;
      margin: 16px 0;
    }

    p {
      padding-bottom: 18px;
      color: #767676;
      font-size: 10px;
      display: flex;
      gap: 3px;
    }

    &:last-child {
      border-bottom: none;
    }
  }
`;
