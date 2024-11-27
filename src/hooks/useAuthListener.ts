// src/hooks/useAuthListener.ts
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { login, logout } from "../redux/authSlice";

export default function useAuthListener() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Firebase 인증 상태 감지
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Firestore에서 사용자 정보 가져오기
        const userDocRef = doc(db, "user", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          // Redux 상태 업데이트
          dispatch(
            login({
              username: userData.username,
              accountID: userData.accountID,
              imageURL: userData.profileImage || null,
            })
          );
        }
      } else {
        // 로그아웃 상태로 Redux 초기화
        dispatch(logout());
      }
    });

    return () => unsubscribe(); // 컴포넌트 언마운트 시 listener 해제
  }, [dispatch]);
}
