import React, { useState, useEffect, FormEvent } from "react";
import { MainStyle } from "./Login";
import Input from "../components/Input";
import Button from "../components/Button";

export default function Signup() {
  const [disabled, setDisabled] = useState<boolean>(true);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  useEffect(() => {
    setDisabled(!(email && password));
  }, [email, password]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    console.log({ email, password });
  };
  return (
    <MainStyle>
      <h1>이메일로 회원가입</h1>
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
          text="다음"
        />
      </form>
    </MainStyle>
  );
}
