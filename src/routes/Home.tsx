import React, { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import iconDropdown from "../assets/images/icon-dropdown.svg";
import {
  MainStyle,
  CategoryStyle,
  CategoryInput,
  CategoryLists,
  EmptyMessage,
} from "./SetMood";
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
                <li key={index} onClick={() => handleCategorySelect(category)}>
                  {category}
                </li>
              ))
            )}
          </CategoryLists>
        )}
      </MainStyle>
    </>
  );
}
