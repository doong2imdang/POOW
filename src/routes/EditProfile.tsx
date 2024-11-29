import React, { ChangeEvent, useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useSelector, UseSelector } from "react-redux";
import { RootState } from "../redux/store";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import {
  collection,
  doc,
  getDocs,
  updateDoc,
  where,
  query,
} from "firebase/firestore";
import { updateProfile } from "firebase/auth";

import Header from "../components/Header";
import Input from "../components/Input";
import { ErrorMessage, ProfileUploadButtonStyle } from "./Signup";
import { MainStyle } from "./Login";
import { auth, db, storage } from "../firebase";

import uploadProfile from "../assets/images/img-profile.svg";
import imgButton from "../assets/images/icon-image-upload.svg";

export default function EditProfile() {
  const navigate = useNavigate();
  const {
    username: initialUsername,
    accountID: initialAccountID,
    imageURL,
  } = useSelector((state: RootState) => state.auth);

  const [disabled, setDisabled] = useState<boolean>(true);
  const [username, setUsername] = useState<string>(initialUsername);
  const [accountID, setAccountID] = useState<string>(initialAccountID);
  const [profileImage, setProfileImage] = useState<string | null>(imageURL);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [usernameError, setUsernameError] = useState<string>("");
  const [accountIDError, setAccountIDError] = useState<string>("");

  // 버튼 disabled 상태 관리 로직 수정
  useEffect(() => {
    if (
      usernameError || // 사용자 이름에 에러가 있을 때
      accountIDError || // 계정 ID에 에러가 있을 때
      !username || // 사용자 이름이 비어 있을 때
      !accountID // 계정 ID가 비어 있을 때
    ) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [
    username,
    accountID,
    usernameError,
    accountIDError,
    previewImage,
    initialUsername,
    initialAccountID,
  ]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const previewURL = URL.createObjectURL(file);
      setPreviewImage(previewURL);
      setDisabled(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!auth.currentUser) return;

    try {
      const userDocRef = doc(db, "user", auth.currentUser.uid);

      // 사용자 정보 업데이트
      await updateDoc(userDocRef, { username, accountID });

      // 프로필 이미지 업로드 및 업데이트
      if (previewImage) {
        const file =
          document.querySelector<HTMLInputElement>("#profile-upload")
            ?.files?.[0];
        if (file) {
          const storageRef = ref(
            storage,
            `profileImages/${auth.currentUser.uid}`
          );
          await uploadBytes(storageRef, file);
          const downloadURL = await getDownloadURL(storageRef);

          setProfileImage(downloadURL);
          await updateProfile(auth.currentUser, { photoURL: downloadURL });
          await updateDoc(userDocRef, { profileImage: downloadURL });
        }
      }

      navigate("/profile");
    } catch (e) {
      console.error("Error saving profile", e);
    }
  };

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);

    if (value.length < 2 || value.length > 7) {
      setUsernameError("사용자 이름은 2자에서 7자 이내여야 합니다.");
      setDisabled(true);
    } else {
      setUsernameError("");
      if (!accountIDError) {
        setDisabled(false);
      }
    }
  };

  const handleAccountIDChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAccountID(value);

    const accountIDPattern = /^[a-zA-Z0-9._]+$/;

    if (!accountIDPattern.test(value)) {
      setAccountIDError("영문, 숫자, 밑줄 및 마침표만 사용할 수 있습니다.");
      setDisabled(true);
      return;
    }

    // 자신의 계정 ID는 중복 검사에서 제외
    if (value === initialAccountID) {
      setAccountIDError("");
      if (!usernameError) {
        setDisabled(false);
        return;
      }
    }

    // FireStore에서 계정ID 중복 확인
    const accountIDQuery = query(
      collection(db, "user"),
      where("accountID", "==", value)
    );

    const querySnapshot = await getDocs(accountIDQuery);

    if (!querySnapshot.empty) {
      setAccountIDError("이미 사용 중인 계정ID입니다.");
      setDisabled(true);
    } else {
      setAccountIDError("");
      if (!usernameError) {
        setDisabled(false);
      }
    }
  };

  return (
    <>
      <Header
        set
        buttonDisabled={disabled}
        background="var(--color-main)"
        color="var(--color-dark)"
        onSave={handleSaveProfile}
      />
      <EditProfileMainStyle>
        <form>
          <ProfileUploadButtonStyle>
            <div>
              <img
                src={previewImage || profileImage || uploadProfile}
                alt="프로필이미지"
              />
            </div>
            <label htmlFor="profile-upload">
              <img src={imgButton} alt="프로필사진 업로드 버튼" />
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
        </form>
      </EditProfileMainStyle>
    </>
  );
}

const EditProfileMainStyle = styled(MainStyle)`
  padding-top: 30px;
`;
