import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Header from "../components/Header";
import iconDropdown from "../assets/images/icon-dropdown.svg";
import iconSMoreVertical from "../assets/images/s-icon-more-vertical.svg";
import {
  CategoryStyle,
  CategoryInput,
  CategoryLists,
  EmptyMessage,
} from "./SetMood";
import { MoodList, MyMoodStyle } from "../components/MyMood";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export default function Home() {
  const [category, setCategory] = useState<string>("");
  const [categoryList, setCategoryList] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const categoryListRef = useRef<HTMLUListElement>(null);
  const userId = useSelector((state: RootState) => state.auth.uid);

  // 초기 카테고리 목록
  useEffect(() => {
    const fetchCategories = async () => {
      if (!userId) return;

      try {
        const categoryCollectionRef = collection(db, "user", userId, "mood");

        const querySnapshot = await getDocs(categoryCollectionRef);

        if (querySnapshot.empty) {
          console.log("해당 카테고리 문서가 존재하지 않음");
        } else {
          const categories = querySnapshot.docs.map((doc) => doc.data().name);
          setCategoryList(categories);
        }
      } catch (e) {
        console.error("카테고리 로드 중 오류 발생", e);
      }
    };
    fetchCategories();
  }, [userId]);

  // 화면 바깥 클릭 감지
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        categoryListRef.current &&
        !categoryListRef.current.contains(e.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // 카테고리 입력 시
  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategory(e.target.value);
  };

  // 카테고리 Enter로 등록
  const handleCategoryKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && category.trim() !== "") {
      if (!categoryList.includes(category.trim())) {
        setCategoryList((prev) => [...prev, category.trim()]);
      }
    }
  };

  // 카테고리 선택 시
  const handleCategorySelect = (selectedCategory: string) => {
    setCategory(selectedCategory);
    setIsFocused(false);
  };
  return (
    <>
      <Header main />
      <MainStyle>
        <CategoryContainer>
          <CategoryStyle $isFocused={isFocused}>
            <CategoryInput
              type="text"
              placeholder="카테고리 입력"
              value={category}
              onChange={handleCategoryChange}
              onKeyPress={handleCategoryKeyPress}
              onFocus={() => {
                setCategory("");
                setIsFocused(true);
              }}
            />
            <button
              type="button"
              onClick={() => {
                setIsFocused(!isFocused);
              }}
            >
              <img src={iconDropdown} alt="화살표 버튼" />
            </button>
          </CategoryStyle>
          {isFocused && (
            <CategoryLists
              ref={categoryListRef}
              onMouseDown={(e) => e.preventDefault()}
            >
              {categoryList.length === 0 ? (
                <EmptyMessage>카테고리를 추가하세요.</EmptyMessage>
              ) : (
                categoryList.map((category, index) => (
                  <li
                    key={index}
                    onClick={() => handleCategorySelect(category)}
                  >
                    {category}
                  </li>
                ))
              )}
            </CategoryLists>
          )}
        </CategoryContainer>
        <MyMoodStyle>
          <MoodList>
            <li>
              <button type="button">
                <img src={iconSMoreVertical} alt="바텀시트 열기 버튼" />
              </button>
              <span>
                국회는 의장 1인과 부의장 2인을 선출한다. 모든 국민은 신체의
                자유를 가진다. 누구든지 법률에 의하지 아니하고는
                체포·구속·압수·수색 또는 심문을 받지 아니하며, 법률과 적법한
                절차에 의하지 아니하고는 처벌·보안처분 또는 강제노역을 받지
                아니한다.
              </span>
              <img src="" alt="무드 이미지" />
              <p>
                <span>2024년</span>
                <span>10월</span>
                <span>4일</span>
              </p>
            </li>
            <li>
              <button type="button">
                <img src={iconSMoreVertical} alt="바텀시트 열기 버튼" />
              </button>
              <span>
                국회는 의장 1인과 부의장 2인을 선출한다. 모든 국민은 신체의
                자유를 가진다. 누구든지 법률에 의하지 아니하고는
                체포·구속·압수·수색 또는 심문을 받지 아니하며, 법률과 적법한
                절차에 의하지 아니하고는 처벌·보안처분 또는 강제노역을 받지
                아니한다.
              </span>
              <img src="" alt="무드 이미지" />
              <p>
                <span>2024년</span>
                <span>10월</span>
                <span>4일</span>
              </p>
            </li>
          </MoodList>
        </MyMoodStyle>
      </MainStyle>
    </>
  );
}

const MainStyle = styled.main`
  height: calc(100% - 60px);
  overflow-x: hidden;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const CategoryContainer = styled.div`
  padding: 19px 21px 0 21px;
`;
