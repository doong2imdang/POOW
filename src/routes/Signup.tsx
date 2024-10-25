import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import styled from "styled-components";
import { MainStyle } from "./Login";
import Input from "../components/Input";
import Button from "../components/Button";
import uploadProfile from "../assets/images/img-profile.svg";
import imgButton from "../assets/images/icon-image-upload.svg";

export default function Signup() {
  const [disabled, setDisabled] = useState<boolean>(true);
  const [profile, setProfile] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [accountID, setAccountID] = useState<string>("");
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setDisabled(!(username && accountID));
    } else {
      setDisabled(!(email && password));
    }
  }, [email, password, username, accountID, profile]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    console.log({ email, password });
  };

  console.log("disabeld", disabled, "profile", profile);
  return (
    <MainStyle>
      <form onSubmit={handleSubmit}>
        {profile ? (
          <>
            <h1>프로필 설정</h1>
            <strong>나중에 언제든지 변경할 수 있습니다.</strong>
            <ProfileUploadButtonStyle>
              <div>
                <img src={profileImage || uploadProfile} />
              </div>
              <label htmlFor="profile-upload">
                <img src={imgButton} />
                <input type="file" id="profile-upload" accept="image/*" />
              </label>
            </ProfileUploadButtonStyle>
            <label htmlFor="input-email">사용자이름</label>
            <Input
              type="text"
              id="input-username"
              placeholder="2~7자 이내여야 합니다."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <label htmlFor="input-pw">계정ID</label>
            <Input
              type="text"
              id="input-accountID"
              placeholder="영문, 숫자, 특수문자(.),(_)만 사용 가능합니다."
              value={accountID}
              onChange={(e) => setAccountID(e.target.value)}
            />
            <Button
              type="submit"
              $width="322px"
              $height="44px"
              disabled={disabled}
              text="POOW 시작하기"
              onClick={() => {}}
            />
          </>
        ) : (
          <>
            <h1>이메일로 회원가입</h1>
            <label htmlFor="input-email">이메일</label>
            <Input
              type="email"
              id="input-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="input-pw">비밀번호</label>
            <Input
              type="password"
              id="input-pw"
              placeholder="비밀번호를 입력해주세요."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="button"
              $width="322px"
              $height="44px"
              disabled={disabled}
              text="다음"
              onClick={() => {
                setProfile(true);
                setDisabled(true);
              }}
            />
          </>
        )}
      </form>
    </MainStyle>
  );
}

const ProfileUploadButtonStyle = styled.div`
  position: relative;

  div > img {
    display: block;
    margin: 0 auto 30px auto;
    width: 110px;
    height: 110px;
    border-radius: 50%;
    overflow: hidden;
  }

  label {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: var(--color-main);
    position: absolute;
    top: 70%;
    left: 55%;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 22px;
      height: 22px;
    }
  }

  input[type="file"] {
    display: none;
  }
`;
