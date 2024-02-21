import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import memberReducer from "./members/MemberSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    members: memberReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
