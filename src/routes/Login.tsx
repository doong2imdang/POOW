import React, { FormEvent, useEffect, useState } from "react";
import Button from "../components/Button";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Input from "../components/Input";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function Login() {
  const navigate = useNavigate();
  const [disabled, setDisabled] = useState<boolean>(true);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const user = auth.currentUser;
  console.log(user);

  useEffect(() => {
    setDisabled(!(email && password));
  }, [email, password]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      navigate("/");
    } catch (e) {
      console.log(e);
    }

    console.log({ email, password });
  };

  return (
    <MainStyle>
      <h1>로그인</h1>
      <form onSubmit={handleSubmit}>
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
          type="submit"
          $width="322px"
          $height="44px"
          disabled={disabled}
          text="로그인"
        />
        <Link to="/signup">이메일로 회원가입</Link>
      </form>
    </MainStyle>
  );
}

export const MainStyle = styled.main`
  padding: 0 34px;
  h1 {
    text-align: center;
    padding: 30px 0 40px 0;
    font-size: 24px;
    font-weight: bold;
  }

  strong {
    display: block;
    text-align: center;
    font-size: 14px;
    color: #767676;
    margin: -18px 0 30px 0;
  }

  label {
    display: block;
    font-size: 12px;
    color: var(--color-dark);
  }

  label:nth-of-type(2) {
    padding-top: 16px;
  }

  button {
    margin-top: 30px;
  }

  a {
    display: block;
    margin-top: 20px;
    text-align: center;
    color: var(--color-dark);
    font-size: 12px;
  }
`;
