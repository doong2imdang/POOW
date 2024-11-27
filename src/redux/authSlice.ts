import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isLoggedIn: boolean;
  username: string;
  accountID: string;
  imageURL: string | null;
}

const initialState: AuthState = {
  isLoggedIn: false,
  username: "",
  accountID: "",
  imageURL: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(
      state,
      action: PayloadAction<{
        username: string;
        accountID: string;
        imageURL: string | null;
      }>
    ) {
      state.isLoggedIn = true;
      state.username = action.payload.username;
      state.accountID = action.payload.accountID;
      state.imageURL = action.payload.imageURL;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.username = "";
      state.accountID = "";
      state.imageURL = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export const authReducer = authSlice.reducer;
