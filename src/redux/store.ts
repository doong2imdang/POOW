// redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./authSlice";
import { moodReducer } from "./moodSlice";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage

import { combineReducers } from "redux";

// 여러 리듀서를 합치기
const rootReducer = combineReducers({
  auth: authReducer,
  moods: moodReducer,
});

// persist 설정
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "moods"], // 저장하고 싶은 슬라이스
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
