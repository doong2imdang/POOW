// src/hooks/useAuthListener.ts
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../firebase";
import { login, logout } from "../redux/authSlice";

export default function useAuthListener() {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userDocRef = doc(db, "user", user.uid);
        const unsubscribeDoc = onSnapshot(userDocRef, (doc) => {
          if (doc.exists()) {
            const userData = doc.data();
            dispatch(
              login({
                username: userData.username,
                accountID: userData.accountID,
                imageURL: userData.profileImage || null,
              })
            );
          }
        });

        return () => unsubscribeDoc();
      } else {
        dispatch(logout());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);
}
