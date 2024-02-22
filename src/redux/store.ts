import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import memberReducer from "./members/MemberSlice";
import homeReducer from "./home/homeSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    members: memberReducer,
    home: homeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
