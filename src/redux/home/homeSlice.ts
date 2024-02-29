import { createSlice } from "@reduxjs/toolkit";

interface HomeState {
  index: string;
}

const initialState: HomeState = {
  index: "0",
};

export const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    setHomeIndex: (_, action) => {
      return { index: action.payload };
    },
  },
});

export const { setHomeIndex } = homeSlice.actions;

export default homeSlice.reducer;
