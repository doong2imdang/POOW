import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Button from "../components/Button";
import profileImage from "../assets/images/img-profile.svg";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";

export default function MyProfile() {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [accountID, setAccountID] = useState<string>("");
  const [imageURL, setImageURL] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(db, "user", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUsername(userData.username || "");
          setAccountID(userData.accountID || "");
        }
      }

      if (user?.photoURL) {
        setImageURL(user.photoURL);
      } else {
        setImageURL(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <MyProfileStyle>
      <img src={imageURL || profileImage} alt="" />
      <strong>{username}</strong>
      <p>
        <span>@</span>
        {accountID}
      </p>
      <p>
        mood<span>6</span>
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
