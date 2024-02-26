import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import memberReducer from "./members/MemberSlice";
import homeReducer from "./home/homeSlice";
import examGroupReducer from "./exxam_group/examGroupSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    members: memberReducer,
    home: homeReducer,
    examGroup: examGroupReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
