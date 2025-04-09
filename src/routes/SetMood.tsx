import React, { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import styled, { css } from "styled-components";
import iconDropdown from "../assets/images/icon-dropdown.svg";
import iconUploadFile from "../assets/images/icon-image-upload.svg";
import iconDelete from "../assets/images/icon-delete-white.svg";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { useNavigate, useLocation } from "react-router-dom";

export default function SetMood() {
  const [disabled, setDisabled] = useState<boolean>(true);
  const [category, setCategory] = useState<string>("");
  const [categoryList, setCategoryList] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [fileURLs, setFileURLs] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [textAreaValue, setTextAreaValue] = useState<string>("");
  const categoryListRef = useRef<HTMLUListElement>(null);
  const userId = useSelector((state: RootState) => state.auth.uid);
  const navigate = useNavigate();
  const location = useLocation();
  const selectedMood = location.state?.mood;

  // console.log(selectedMood, "selectedMood");

  useEffect(() => {
    if (userId && selectedMood) {
      setCategory(selectedMood.category);
      setFileURLs(selectedMood.fileURLs || []);
      setUploadedFiles([]);
      setTextAreaValue(selectedMood.textAreaValue);
    }
  }, [userId, selectedMood]);

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
    if (index < fileURLs.length) {
      // 기존 파일 삭제 (fileURLs에 있는 경우)
      setFileURLs((prev) => prev.filter((_, i) => i !== index));
    } else {
      // 새로 업로드한 파일 삭제 (uploadedFiles에 있는 경우)
      const newIndex = index - fileURLs.length;
      setUploadedFiles((prev) => prev.filter((_, i) => i !== newIndex));
    }
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

      const oldCategory = selectedMood?.category;
      const oldCategoryDocRef = oldCategory
        ? doc(userRef, "mood", oldCategory)
        : null;
      const oldDocumentsCollectionRef = oldCategoryDocRef
        ? collection(oldCategoryDocRef, "documents")
        : null;
      const oldDocumentRef =
        oldDocumentsCollectionRef && selectedMood?.id
          ? doc(oldDocumentsCollectionRef, selectedMood.id)
          : null;

      const newCategoryDocRef = doc(userRef, "mood", category);
      await setDoc(newCategoryDocRef, { name: category }, { merge: true });

      const newDocumentsCollectionRef = collection(
        newCategoryDocRef,
        "documents"
      );

      let updatedFileURLs = [...fileURLs];
      let newDocRef;

      // 새로 업로드한 파일 처리
      for (const file of uploadedFiles) {
        if (typeof file !== "string") {
          const fileRef = ref(
            storage,
            `mood/${userId}/${category}/${file.name}`
          );
          await uploadBytes(fileRef, file);
          const fileURL = await getDownloadURL(fileRef);
          updatedFileURLs.push(fileURL);
        }
      }

      if (selectedMood?.id) {
        // 문서 데이터 가져오기
        const docSnapshot = await getDoc(oldDocumentRef!);
        const oldData = docSnapshot.exists() ? docSnapshot.data() : null;

        if (oldData) {
          // 기존 데이터 복사 후 category 변경하여 새 카테고리에 추가
          const newDocRef = doc(newDocumentsCollectionRef, selectedMood.id);
          await setDoc(newDocRef, {
            ...oldData,
            fileURLs: updatedFileURLs,
            textAreaValue,
            updatedAt: new Date(),
            category, // 카테고리 업데이트
          });

          // 기존 문서 삭제
          if (oldCategory !== category && oldDocumentRef) {
            await deleteDoc(oldDocumentRef);
          }
        }
      } else {
        // 새 문서 생성
        const data = {
          fileURLs: updatedFileURLs,
          textAreaValue,
          createdAt: new Date(),
          category,
        };

        newDocRef = await addDoc(newDocumentsCollectionRef, data);
        console.log("새 게시글 저장 완료:", newDocRef.id);
      }

      navigate("/");
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
          {[...uploadedFiles, ...fileURLs].map((file, index) => (
            <FilePreview key={index}>
              <img
                src={
                  typeof file === "string" ? file : URL.createObjectURL(file)
                }
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
