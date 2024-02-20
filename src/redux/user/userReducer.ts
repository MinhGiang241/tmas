import { createSlice } from "@reduxjs/toolkit";
import { UserData } from "@/data/user";

const initialState: UserData = {};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      return { ...state, ...action.payload };
    },
    userLogout: (state, _) => {
      localStorage.removeItem("access_token");
      return {};
    },
  },
});
