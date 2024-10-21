import React from "react";
import styled from "styled-components";
import logoSymbol from "../assets/images/logo-symbol-W.svg";
import iconEmail from "../assets/images/icon-email.svg";
import iconGithub from "../assets/images/icon-github.svg";
import { Link, useNavigate } from "react-router-dom";

export default function LoginMethod() {
  const navigate = useNavigate();
  return (
    <MainStyle>
      <h1>
        <img src={logoSymbol} alt="로고" />
      </h1>
      <LoginMethodStyle>
        <button
          type="button"
          onClick={() => {
            navigate("/login");
          }}
        >
          <img src={iconEmail} alt="" />
          이메일로 로그인
        </button>
        <button type="button">
          <img src={iconGithub} alt="" />
          깃허브 계정으로 로그인
        </button>
        <LinkStyle>
          <Link to="/signup">회원가입</Link>
          <span> | </span>
          <Link to="/">비밀번호 찾기</Link>
        </LinkStyle>
      </LoginMethodStyle>
    </MainStyle>
  );
}

const MainStyle = styled.main`
  background: var(--color-bg);
  width: 100%;
  height: 100vh;
  text-align: center;
  padding-top: 178px;
  position: relative;
`;

const LoginMethodStyle = styled.div`
  height: 319px;
  width: 390px;
  background: white;
  position: absolute;
  bottom: 0;
  border-radius: 20px 20px 0 0;
  padding: 94px 0 83px 0;

  button {
    width: 322px;
    height: 44px;
    color: var(--color-dark);
    font-size: 14px;
    border-radius: 20px;
    position: relative;

    img {
      position: absolute;
      left: 18px;
    }

    &:nth-child(1) {
      border: 1px solid var(--color-main);
    }

    &:nth-child(2) {
      border: 1px solid var(--color-dark);
      margin: 20px 0;
    }
  }
`;

const LinkStyle = styled.div`
  font-size: 12px;
  color: var(--color-dark);
`;
