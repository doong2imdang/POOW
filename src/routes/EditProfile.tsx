import React, { ChangeEvent, useState } from "react";
import styled from "styled-components";
import Header from "../components/Header";
import { ErrorMessage, ProfileUploadButtonStyle } from "./Signup";
import Input from "../components/Input";
import uploadProfile from "../assets/images/img-profile.svg";
import imgButton from "../assets/images/icon-image-upload.svg";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, storage } from "../firebase";
import { MainStyle } from "./Login";

export default function EditProfile() {
  const [disabled, setDisabled] = useState<boolean>(true);
  const [username, setUsername] = useState<string>("");
  const [accountID, setAccountID] = useState<string>("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [usernameError, setUsernameError] = useState<string>("");
  const [accountIDError, setAccountIDError] = useState<string>("");

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

  return (
    <>
      <Header
        set
        buttonDisabled={disabled}
        background="var(--color-main)"
        color="var(--color-dark)"
      />
      <EditProfileMainStyle>
        <form>
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
        </form>
      </EditProfileMainStyle>
    </>
  );
}

const EditProfileMainStyle = styled(MainStyle)`
  padding-top: 30px;
`;
