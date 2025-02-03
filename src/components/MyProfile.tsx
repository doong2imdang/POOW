import React from "react";
import styled from "styled-components";
import Button from "../components/Button";
import profileImage from "../assets/images/img-profile.svg";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

export default function MyProfile() {
  const navigate = useNavigate();
  const { username, accountID, imageURL } = useSelector(
    (state: RootState) => state.auth
  );
  const moods = useSelector((state: RootState) => state.moods.moods);

  return (
    <MyProfileStyle>
      <img src={imageURL || profileImage} alt="" />
      <strong>{username}</strong>
      <p>
        <span>@</span>
        {accountID}
      </p>
      <p>
        mood<span>{moods.length}</span>
      </p>
      <Button
        $width="120px"
        $background="white"
        disabled={false}
        text="프로필 수정"
        onClick={() => {
          navigate("/editprofile");
        }}
      />
      <Button
        $width="120px"
        $height="34px"
        $background="var(--color-main)"
        disabled={false}
        text="일정 추가"
        onClick={() => {
          navigate("/setschedule");
        }}
      />
    </MyProfileStyle>
  );
}

const MyProfileStyle = styled.div`
  padding: 29px 67px 26px 67px;
  background: #fff;
  display: grid;
  grid-template-areas:
    "profileImage username"
    "profileImage accountID"
    "profileImage mood"
    "edit schedule";

  img {
    grid-area: profileImage;
    width: 110px;
    height: 110px;
    border-radius: 50%;
  }

  strong {
    font-size: 16px;
    font-weight: bold;
    padding-top: 22px;
  }

  p {
    &:nth-of-type(1) {
      font-size: 12px;
      color: #767676;
    }

    &:nth-of-type(2) {
      font-size: 16px;
      padding-bottom: 17px;

      span {
        font-size: 18px;
        font-weight: bold;
        padding-left: 10px;
      }
    }
  }

  button {
    margin-top: 22px;

    &:nth-of-type(1) {
      border: 1px solid var(--color-dark);
      margin-right: 15px;
      grid-area: edit;
    }
  }
`;
