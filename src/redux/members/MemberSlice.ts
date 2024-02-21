import { createSlice } from "@reduxjs/toolkit";
import { UserData } from "@/data/user";

interface MemberState {
  loading: boolean;
  members: UserData[];
}

const initialState: MemberState = {
  loading: false,
  members: [],
};

export const memberSlice = createSlice({
  name: "members",
  initialState,
  reducers: {
    setLoadingMember: (state, action) => {
      return { ...state, loading: action.payload };
    },
    addMemberData: (state, action) => {
      return { loading: false, members: [...state.members, ...action.payload] };
    },
    setMemberData: (state, action) => {
      return { loading: false, members: [...action.payload] };
    },
  },
});

export const { setLoadingMember, setMemberData, addMemberData } =
  memberSlice.actions;

export default memberSlice.reducer;
