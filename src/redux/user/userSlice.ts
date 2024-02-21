import { createSlice } from "@reduxjs/toolkit";
import { UserData } from "@/data/user";

const initialState: UserData = {};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action) => {
      return action.payload;
    },
    userLogout: (__, _) => {
      localStorage.removeItem("access_token");
      return {};
    },
  },
});

export const { setUserData, userLogout } = userSlice.actions;

export default userSlice.reducer;
