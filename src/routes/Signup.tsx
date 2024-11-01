import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import styled from "styled-components";
import { MainStyle } from "./Login";
import Input from "../components/Input";
import Button from "../components/Button";
import uploadProfile from "../assets/images/img-profile.svg";
import imgButton from "../assets/images/icon-image-upload.svg";
import { auth, db, storage } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

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

  const handleSignUpSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const credentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await setDoc(doc(db, "user", credentials.user.uid), {
        email: email,
        username: "",
        accountID: "",
        profileImage: "",
      });

      setProfile(true);
    } catch (error: any) {
      console.log(error);

      if (error.code === "auth/email-already-in-use") {
        setEmailError("이미 사용 중인 이메일입니다.");
      } else if (error.code === "auth/weak-password") {
        setPasswordError("비밀번호는 6자리 이상이어야 합니다.");
      } else {
        setEmailError("회원가입 중 오류가 발생했습니다.");
      }
    }
  };
  console.log({ email, password, username, accountID, profileImage });

  const handleProfileSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (auth.currentUser) {
      try {
        const accountIDQuery = query(
          collection(db, "user"),
          where("accountID", "==", accountID)
        );
        const querySnapshot = await getDocs(accountIDQuery);

        if (!querySnapshot.empty) {
          setAccountIDError("이미 사용 중인 ID입니다.");
          return;
        }

        await updateProfile(auth.currentUser, {
          displayName: username,
          photoURL: profileImage,
        });

        await updateDoc(doc(db, "user", auth.currentUser.uid), {
          username: username,
          accountID: accountID,
          profileImage: profileImage || "",
        });
        navigate("/login");
      } catch (e) {
        console.log("프로필설정 중 오류 발생", e);
      }
    }

    console.log({ email, password, username, accountID, profileImage });
  };

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const storageRef = ref(storage, `profileImages/${auth.currentUser?.uid}`);

      // Firebase Storage에 이미지 업로드
      await uploadBytes(storageRef, file);

      // 업로드된 이미지의 다운로드 URL 가져오기
      const downloadURL = await getDownloadURL(storageRef);
      setProfileImage(downloadURL);
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
      setAccountIDError("영문, 숫자, 밑줄 및 마침표만 사용할 수 있습니다.");
    } else {
      setAccountIDError("");
    }
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailError("");
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setPasswordError("");
  };

  console.log("disabeld", disabled, "profile", profile);
  return (
    <MainStyle>
      {profile ? (
        <form onSubmit={handleProfileSubmit}>
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
          <label htmlFor="input-username">사용자이름</label>
          <Input
            type="text"
            id="input-username"
            placeholder="2~7자 이내여야 합니다."
            value={username}
            onChange={handleUsernameChange}
          />
          {usernameError && <ErrorMessage>{usernameError}</ErrorMessage>}
          <label htmlFor="input-accountID">계정ID</label>
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
        </form>
      ) : (
        <form onSubmit={handleSignUpSubmit}>
          <h1>이메일로 회원가입</h1>
          <label htmlFor="input-email">이메일</label>
          <Input
            type="email"
            id="input-email"
            value={email}
            onChange={handleEmailChange}
          />
          {emailError && <ErrorMessage>{emailError}</ErrorMessage>}
          <label htmlFor="input-pw">비밀번호</label>
          <Input
            type="password"
            id="input-pw"
            placeholder="비밀번호를 입력해주세요."
            value={password}
            onChange={handlePasswordChange}
          />
          {passwordError && <ErrorMessage>{passwordError}</ErrorMessage>}
          <Button
            type="submit"
            $width="322px"
            $height="44px"
            disabled={disabled}
            text="다음"
          />
        </form>
      )}
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

    img {
      width: 22px;
      height: 22px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }

  input[type="file"] {
    display: none;
  }
`;

export const ErrorMessage = styled.p`
  color: #eb5757;
  font-size: 12px;
  margin-top: 6px;
`;
