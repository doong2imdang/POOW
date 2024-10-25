import React, { useState } from "react";
import Button from "../components/Button";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Input from "../components/Input";
import { auth } from "../firebase";

export default function Login() {
  const [disabeld, setDisabeld] = useState(true);
  return (
    <MainStyle>
      <h1>로그인</h1>
      <form>
        <label htmlFor="input-email">이메일</label>
        <Input type="email" id="input-email" />
        <label htmlFor="input-pw">비밀번호</label>
        <Input
          type="password"
          id="input-pw"
          placeholder="비밀번호를 입력해주세요."
        />
        <Button
          type="submit"
          $width="322px"
          $height="44px"
          disabled={disabeld}
          text="로그인"
        />
        <Link to="/signup">이메일로 회원가입</Link>
      </form>
    </MainStyle>
  );
}

const MainStyle = styled.main`
  padding: 0 34px;
  h1 {
    text-align: center;
    padding: 30px 0 40px 0;
    font-size: 24px;
    font-weight: bold;
  }

  label {
    display: block;
    font-size: 12px;
    color: var(--color-dark);
  }

  label:nth-of-type(2) {
    padding-top: 16px;
  }

  input:nth-of-type(2) {
    margin-bottom: 30px;
  }

  a {
    display: block;
    margin-top: 20px;
    text-align: center;
    color: var(--color-dark);
    font-size: 12px;
  }
`;
