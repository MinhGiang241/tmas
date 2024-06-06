import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import memberReducer from "./members/MemberSlice";
import homeReducer from "./home/homeSlice";
import examGroupReducer from "./exam_group/examGroupSlice";
import questionReducer from "./questions/questionSlice";
import paymentReducer from "./payment/paymentSlice";
import settingReducer from "./setting/settingSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    members: memberReducer,
    home: homeReducer,
    examGroup: examGroupReducer,
    question: questionReducer,
    payment: paymentReducer,
    setting: settingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
