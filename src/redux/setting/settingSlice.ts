import { SettingData } from "@/data/user";
import { createSlice } from "@reduxjs/toolkit";

const initialState: SettingData = {};

export const settingSlice = createSlice({
  name: "setting",
  initialState,
  reducers: {
    setSettingConfig: (state, action) => {
      return { ...action.payload };
    },
  },
});

export const { setSettingConfig } = settingSlice.actions;

export default settingSlice.reducer;
