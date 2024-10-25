import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import styled from "styled-components";
import { MainStyle } from "./Login";
import Input from "../components/Input";
import Button from "../components/Button";
import uploadProfile from "../assets/images/img-profile.svg";
import imgButton from "../assets/images/icon-image-upload.svg";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";

export default function Signup() {
  const navigate = useNavigate();
  const [disabled, setDisabled] = useState<boolean>(true);
  const [profile, setProfile] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [accountID, setAccountID] = useState<string>("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [usernameError, setUsernameError] = useState<string>("");
  const [accountIDError, setAccountIDError] = useState<string>("");

  useEffect(() => {
    if (profile) {
      setDisabled(
        !(username && accountID && !usernameError && !accountIDError)
      );
    } else {
      setDisabled(!(email && password && !emailError && !passwordError));
    }
  }, [
    email,
    password,
    username,
    accountID,
    profile,
    emailError,
    passwordError,
    usernameError,
    accountIDError,
  ]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const credentials = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await updateProfile(credentials.user, {
      displayName: username,
    });

    await setDoc(doc(db, "user", credentials.user.uid), {
      email: email,
      username: username,
      accountID: accountID,
      image: profileImage,
    });
    navigate("/login");

    console.log({ email, password, username, accountID, profileImage });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => setProfileImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);

    if (value.length < 2 || value.length > 7) {
      setUsernameError("사용자 이름은 2자에서 7자 이내여야 합니다.");
    } else {
      setUsernameError("");
    }
  };

  const handleAccountIDChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAccountID(value);

    const accountIDPattern = /^[a-zA-Z0-9._]+$/;
    if (!accountIDPattern.test(value)) {
      setAccountIDError(
        "계정 ID는 영문, 숫자, 특수문자(.)와 (_)만 사용할 수 있습니다."
      );
    } else {
      setAccountIDError("");
    }
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
                <input
                  type="file"
                  id="profile-upload"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            </ProfileUploadButtonStyle>
            <label htmlFor="input-email">사용자이름</label>
            <Input
              type="text"
              id="input-username"
              placeholder="2~7자 이내여야 합니다."
              value={username}
              onChange={handleUsernameChange}
            />
            {usernameError && <ErrorMessage>{usernameError}</ErrorMessage>}
            <label htmlFor="input-pw">계정ID</label>
            <Input
              type="text"
              id="input-accountID"
              placeholder="영문, 숫자, 특수문자(.),(_)만 사용 가능합니다."
              value={accountID}
              onChange={handleAccountIDChange}
            />
            {accountIDError && <ErrorMessage>{accountIDError}</ErrorMessage>}
            <Button
              type="submit"
              $width="322px"
              $height="44px"
              disabled={disabled}
              text="POOW 시작하기"
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
            {emailError && <ErrorMessage>{emailError}</ErrorMessage>}
            <label htmlFor="input-pw">비밀번호</label>
            <Input
              type="password"
              id="input-pw"
              placeholder="비밀번호를 입력해주세요."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {passwordError && <ErrorMessage>{passwordError}</ErrorMessage>}
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

const ErrorMessage = styled.p`
  color: #eb5757;
  font-size: 12px;
  margin-top: 6px;
`;
