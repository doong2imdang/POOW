import React from "react";
import styled from "styled-components";
import iconArrowLeft from "../assets/images/icon-arrow-left.svg";
import logoTxt from "../assets/images/logo-txt.svg";
import iconSearch from "../assets/images/icon-search-light.svg";
import iconMoreVertical from "../assets/images/icon-more-vertical.svg";
import iconBack from "../assets/images/icon-back.svg";
import iconNext from "../assets/images/icon-next.svg";
import Button from "./Button";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  main?: boolean;
  search?: boolean;
  text?: boolean;
  set?: boolean;
  buttonDisabled?: boolean;
  hasInput?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  main,
  search,
  text,
  set,
  buttonDisabled,
  hasInput,
}) => {
  const navigate = useNavigate();
  return (
    <HeaderStyle>
      {main && (
        <>
          <button type="button">
            <img src={logoTxt} alt="Logo" />
          </button>
          <button type="button" onClick={() => navigate("/search")}>
            <img src={iconSearch} alt="Search" />
          </button>
        </>
      )}

      {search && (
        <>
          <button type="button">
            <img src={iconArrowLeft} alt="Back" />
          </button>
          <InputStyle type="text" placeholder="mood를 검색해보세요." />
        </>
      )}

      {text && (
        <>
          <button type="button">
            <img src={iconArrowLeft} alt="Back" />
          </button>
          <IconsWrapper>
            {hasInput && (
              <>
                <button type="button">
                  <img src={iconBack} alt="뒤로가기" />
                </button>
                <button type="button">
                  <img src={iconNext} alt="다음" />
                </button>
              </>
            )}
            <button type="button">
              <img src={iconMoreVertical} alt="More" />
            </button>
          </IconsWrapper>
        </>
      )}

      {set && (
        <>
          <button type="button">
            <img src={iconArrowLeft} alt="Back" />
          </button>
          <Button
            background="var(--color-disabled)"
            color="#fff"
            type="submit"
            disabled={buttonDisabled}
          />
        </>
      )}
    </HeaderStyle>
  );
};

const HeaderStyle = styled.header`
  display: flex;
  height: 48px;
  width: 390px;
  background: var(--color-dark);
  padding: 0 18px;
  justify-content: space-between;
  align-items: center;
`;

const InputStyle = styled.input`
  width: 316px;
  background-color: #f2f2f2;
  padding: 10px 11px;
  border-radius: 20px;
  color: var(--color-dark);
`;

const IconsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 17px;

  button:nth-child(3) {
    padding-left: 15px;
  }
`;

export default Header;
