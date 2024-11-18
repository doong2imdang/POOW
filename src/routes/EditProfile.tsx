import React, { ChangeEvent, useEffect, useState } from "react";
import styled from "styled-components";
import Header from "../components/Header";
import { ErrorMessage, ProfileUploadButtonStyle } from "./Signup";
import Input from "../components/Input";
import uploadProfile from "../assets/images/img-profile.svg";
import imgButton from "../assets/images/icon-image-upload.svg";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, db, storage } from "../firebase";
import { MainStyle } from "./Login";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {
  const navigate = useNavigate();
  const [disabled, setDisabled] = useState<boolean>(true);
  const [username, setUsername] = useState<string>("");
  const [accountID, setAccountID] = useState<string>("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [usernameError, setUsernameError] = useState<string>("");
  const [accountIDError, setAccountIDError] = useState<string>("");
  const [currentAccountID, setCurrentAccountID] = useState<string>("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(db, "user", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUsername(userData.username || "");
          setAccountID(userData.accountID || "");
          setCurrentAccountID(userData.accountID || "");
        }
      }

      if (user?.photoURL) {
        setProfileImage(user.photoURL);
      } else {
        setProfileImage(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const previewURL = URL.createObjectURL(file);
      setPreviewImage(previewURL);
      setDisabled(false);
    }
  };

  const handleSaveProfile = async () => {
    if (auth.currentUser) {
      try {
        const userDocRef = doc(db, "user", auth.currentUser.uid);
        await updateDoc(userDocRef, {
          username: username,
          accountID: accountID,
        });

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
            console.log("Profile image URL saved.");
          }
        }
        navigate("/profile");
      } catch (error) {
        console.error("Error saving profile: ", error);
      }
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
    } else {
      setAccountIDError("");
    }

    // 자신의 계정 ID는 중복 검사에서 제외
    if (value === currentAccountID) {
      setAccountIDError("");
      if (!usernameError) {
        setDisabled(false);
      }
      return;
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
