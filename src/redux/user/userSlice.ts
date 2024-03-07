import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { UserData } from "@/data/user";

interface UserState {
  user: UserData;
}

const initialState: UserState = {
  user: {},
};

export const fetchDataUser = createAsyncThunk(
  "dataUser",
  async (fetcher: any, _) => {
    const data = await fetcher();
    return data;
  },
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action) => {
      return { user: action.payload };
    },
    userClear: (state, _) => {
      // localStorage.removeItem("access_token");
      return { user: {} };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchDataUser.fulfilled, (state, action) => {
      return void (state.user = action.payload);
    });
  },
});

export const { setUserData, userClear } = userSlice.actions;

export default userSlice.reducer;
