import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import SelectModal from "./SelectModal";
import { useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { Mood } from "../routes/Home";

interface BottomSheetProps {
  text?: string;
  toggleBottomSheet: () => void;
  selectedMood?: Mood | null;
}

const BottomSheet: React.FC<BottomSheetProps> = ({
  text,
  toggleBottomSheet,
  selectedMood,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<string | null>(null);
  const [confirmText, setConfirmText] = useState<string>("");

  const modalTexts = text ? text.split(",") : [];

  const handleOpenModal = (type: string) => {
    const lastWord = type.split(" ").pop() || "";
    setModalType(type);

    if (type === "설정 및 개인정보") {
      setConfirmText("확인");
    } else {
      setConfirmText(lastWord);
    }
    setIsModalOpen(true);

    console.log(selectedMood);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalType(null);
    setConfirmText("");
    toggleBottomSheet();
  };

  const handleModalConfirm = async () => {
    console.log(`${modalType} confirmed`);

    if (modalType === " 로그아웃") {
      try {
        await signOut(auth);
        dispatch(logout());
        console.log("사용자가 로그아웃되었습니다.");
        navigate("/loginmethod");
      } catch (e) {
        console.error("로그아웃 실패", e);
      }
    }

    handleCloseModal();
  };

  const handleModalCancel = () => {
    console.log(`${modalType} canceled`);
    handleCloseModal();
  };

  return (
    <>
      {isModalOpen && (
        <SelectModal
          message={
            modalType === "설정 및 개인정보" ? (
              <>
                {modalType}로 <br /> 이동하시겠습니까?
              </>
            ) : (
              `${modalType}하시겠습니까?`
            )
          }
          confirmText={confirmText}
          cancelText="취소"
          onConfirm={handleModalConfirm}
          onCancel={handleModalCancel}
        />
      )}
      <BottomSheetBg onClick={toggleBottomSheet}></BottomSheetBg>
      <BottomSheetWrapper>
        <BottomSheetHeader>
          <button type="button" onClick={toggleBottomSheet}></button>
        </BottomSheetHeader>
        <BottomSheetContent>
          {modalTexts.length > 1 ? (
            modalTexts.map((item, index) => (
              <TextItem
                key={index}
                onClick={() => {
                  handleOpenModal(item);
                }}
              >
                {item.trim()}
              </TextItem>
            ))
          ) : (
            <TextItem
              onClick={() => {
                handleOpenModal(text || "");
              }}
            >
              {text}
            </TextItem>
          )}
        </BottomSheetContent>
      </BottomSheetWrapper>
    </>
  );
};

const slideIn = keyframes`
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
`;

// const slideOut = keyframes`
//   from {
// transform: translateY(0)
//   }

//   to {
// transform: translateY(100%);
//   }
// `;

const BottomSheetBg = styled.div`
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 390px;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 9;
`;

const BottomSheetWrapper = styled.div`
  position: fixed;
  bottom: 0;
  z-index: 10;
  min-height: 92px;
  width: 390px;
  background: var(--color-bg);
  border-radius: 10px 10px 0 0;
  animation: ${slideIn} 0.5s ease-out;
`;

const BottomSheetHeader = styled.div`
  display: flex;
  justify-content: center;
  padding: 16px 0;

  button {
    width: 50px;
    height: 5px;
    background: var(--color-dark);
    border-radius: 5px;
  }
`;

const BottomSheetContent = styled.div`
  padding-bottom: 10px;
`;

const TextItem = styled.div`
  font-size: 14px;
  padding: 14px 26px;
  border-radius: 5px;
  color: var(--color-dark);
  cursor: pointer;

  &:hover {
    background-color: var(--color-main);
  }
`;

export default BottomSheet;
