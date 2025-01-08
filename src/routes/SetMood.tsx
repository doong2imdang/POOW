import React, { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import styled, { css } from "styled-components";
import iconDropdown from "../assets/images/icon-dropdown.svg";
import iconUploadFile from "../assets/images/icon-image-upload.svg";
import iconDelete from "../assets/images/icon-delete-white.svg";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { addDoc, collection, doc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { useNavigate } from "react-router-dom";

export default function SetMood() {
  const [disabled, setDisabled] = useState<boolean>(true);
  const [category, setCategory] = useState<string>("");
  const [categoryList, setCategoryList] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [textAreaValue, setTextAreaValue] = useState<string>("");
  const categoryListRef = useRef<HTMLUListElement>(null);
  const userId = useSelector((state: RootState) => state.auth.uid);
  const navigate = useNavigate();

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

  // console.log("categoryList", categoryList);

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

  // 파일 업로드
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setUploadedFiles((prev) => [...prev, ...files]);
    }
  };

  // 파일 삭제
  const handleDeleteFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // textarea 변경
  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextAreaValue(e.target.value);
  };

  // 저장 버튼 활성화 조건
  useEffect(() => {
    if (
      (uploadedFiles.length > 0 || textAreaValue.trim() !== "") &&
      categoryList.includes(category)
    ) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [uploadedFiles, textAreaValue, category, categoryList]);

  // 저장하기
  const handleSave = async () => {
    console.log(category, uploadedFiles, textAreaValue);

    if (!userId) {
      console.error("사용자가 로그인되지 않았습니다.");
      return;
    }

    if (!category.trim()) {
      console.error("카테고리 값이 유효하지 않습니다.");
      return;
    }

    try {
      const storage = getStorage();
      const userRef = doc(db, "user", userId);

      // 카테고리 문서 참조 생성
      const categoryDocRef = doc(userRef, "mood", category);

      // category 문서가 존재하지 않으면 생성
      await setDoc(categoryDocRef, { name: category }, { merge: true });

      // 카테고리 문서의 documents 컬렉션 참조
      const documentsCollectionRef = collection(categoryDocRef, "documents");

      // 업로드된 파일의 URL을 저장할 배열
      const fileURLs: string[] = [];

      for (const file of uploadedFiles) {
        // Storage에 파일 업로드
        const fileRef = ref(storage, `mood/${userId}/${category}/${file.name}`);
        await uploadBytes(fileRef, file);

        // 업로드된 파일의 URL 가져오기
        const fileURL = await getDownloadURL(fileRef);
        fileURLs.push(fileURL);
      }

      // Firestore에 한 번만 문서 저장
      const data = {
        fileURLs,
        textAreaValue,
        createdAt: new Date(),
      };

      // documents 컬렉션에 새 문서 추가
      const newDocRef = await addDoc(documentsCollectionRef, data);
      console.log("저장완료:", newDocRef.id);
      navigate("/mood");
    } catch (e) {
      console.error("저장 중 오류 발생", e);
    }
  };

  return (
    <>
      <Header set buttonDisabled={disabled} onSave={handleSave} />
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
        <TextAreaStyle
          value={textAreaValue}
          onChange={handleTextAreaChange}
        ></TextAreaStyle>
        <UploadedFileContainer>
          {uploadedFiles.map((file, index) => (
            <FilePreview key={index}>
              <img
                src={URL.createObjectURL(file)}
                alt={`업로드된 파일 ${index + 1}`}
              />
              <button type="button" onClick={() => handleDeleteFile(index)}>
                <img src={iconDelete} alt="삭제버튼" />
              </button>
            </FilePreview>
          ))}
        </UploadedFileContainer>
        <UploadButtonStyle htmlFor="upload-file">
          <img src={iconUploadFile} alt="파일업로드버튼" />
          <input
            type="file"
            id="upload-file"
            multiple
            onChange={handleFileUpload}
          />
        </UploadButtonStyle>
      </MainStyle>
    </>
  );
}

export const MainStyle = styled.main`
  padding: 19px 21px;
  position: relative;
  width: 100%;
  height: calc(100% - 48px);
`;

export const CategoryStyle = styled.div<{ $isFocused: boolean }>`
  position: relative;
  button {
    position: absolute;
    top: 50%;
    left: 46%;
    transform: translate(-50%, -50%);

    img {
      ${(props) =>
        props.$isFocused &&
        css`
          transform: rotate(180deg);
          transition: all 0.3s;
        `}
    }
  }
`;

export const CategoryInput = styled.input`
  border: 1px solid var(--color-disabled);
  color: var(--color-dark);
  border-radius: 20px;
  width: 180px;
  padding: 9px 0;
  font-size: 14px;
  text-align: center;

  &::placeholder {
    color: var(--color-disabled);
  }

  &:focus {
    border: 1px solid var(--color-main);
  }
`;

export const CategoryLists = styled.ul`
  border: 1px solid var(--color-disabled);
  background: #fff;
  width: 180px;
  min-height: 28px;
  border-radius: 10px;
  margin-top: 9.5px;
  text-align: center;
  overflow: hidden;
  color: var(--color-dark);
  position: absolute;
  z-index: 100;

  li {
    padding: 7px 0;
    border-bottom: 1px solid var(--color-disabled);
    cursor: pointer;

    &:hover {
      background-color: var(--color-main);
    }

    &:last-child {
      border-bottom: none;
    }
  }
`;

export const EmptyMessage = styled.p`
  color: var(--color-disabled);
  padding: 7px 0;
  font-size: 14px;
`;

const TextAreaStyle = styled.textarea`
  width: 100%;
  height: 54px;
  border: none;
  outline: none;
  color: var(--color-dark);
  margin: 13px 0 20px 0;
  font-size: 14px;
  resize: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const UploadedFileContainer = styled.div`
  display: flex;
  gap: 8px;
  overflow-x: auto;

  &::-webkit-scrollbar {
    background-color: #fff;
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--color-main);
    height: 13px;
    border: 4px solid #fff;
    border-radius: 10px;
    cursor: pointer;
  }
`;

const FilePreview = styled.div`
  position: relative;
  width: 168px;
  height: 126px;
  flex: 0 0 auto;
  border: 1px solid var(--color-disabled);
  border-radius: 10px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  button {
    position: absolute;
    top: 5px;
    right: 5px;
    cursor: pointer;
  }
`;

const UploadButtonStyle = styled.label`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--color-main);
  position: absolute;
  bottom: 22px;
  right: 22px;
  cursor: pointer;

  img {
    width: 26px;
    height: 26px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  input[type="file"] {
    display: none;
  }
`;
