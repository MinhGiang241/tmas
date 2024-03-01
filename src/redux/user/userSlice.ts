import { createSlice } from "@reduxjs/toolkit";
import { UserData } from "@/data/user";

interface UserState {
  user: UserData;
}

const initialState: UserState = {
  user: {},
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action) => {
      console.log("action payload", action.payload);

      return { user: action.payload };
    },
    userClear: (state, _) => {
      // localStorage.removeItem("access_token");
      return { user: {} };
    },
  },
});

export const { setUserData, userClear } = userSlice.actions;

export default userSlice.reducer;
