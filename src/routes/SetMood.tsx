import React, { useState } from "react";
import Header from "../components/Header";
import styled from "styled-components";
import iconDropdown from "../assets/images/icon-dropdown.svg";
import iconUploadFile from "../assets/images/icon-image-upload.svg";
import iconDelete from "../assets/images/icon-delete-white.svg";

export default function SetMood() {
  const [disabled, setDisabled] = useState<boolean>(true);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

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

  return (
    <>
      <Header set buttonDisabled={disabled} />
      <MainStyle>
        <CategoryStyle>
          <CategoryInput type="text" placeholder="카테고리 입력" />
          <button type="button">
            <img src={iconDropdown} alt="화살표 버튼" />
          </button>
        </CategoryStyle>
        <CategoryLists>
          <li>콘서트</li>
          <li>팬미팅</li>
          <li>0712</li>
          <li>캡쳐</li>
          <li>경기</li>
        </CategoryLists>
        <TextAreaStyle></TextAreaStyle>
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

const MainStyle = styled.main`
  padding: 19px 21px;
  position: relative;
  width: 100%;
  height: calc(100% - 48px);
`;

const CategoryStyle = styled.div`
  position: relative;
  button {
    position: absolute;
    top: 50%;
    left: 46%;
    transform: translate(-50%, -50%);
  }
`;

const CategoryInput = styled.input`
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
`;

const CategoryLists = styled.ul`
  border: 1px solid var(--color-disabled);
  width: 180px;
  border-radius: 10px;
  margin-top: 9.5px;
  text-align: center;
  overflow: hidden;
  color: var(--color-dark);
  display: none;

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
    display: none;
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
