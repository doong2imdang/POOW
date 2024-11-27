import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./authSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

// 타입 정의
export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
