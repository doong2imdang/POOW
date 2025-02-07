import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./authSlice";
import { moodReducer } from "./moodSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    moods: moodReducer,
  },
  middleware: (getDefaultware) =>
    getDefaultware({
      serializableCheck: false,
    }),
});

// 타입 정의
export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
