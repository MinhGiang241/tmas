import { ExamGroupData } from "@/data/exam";
import { createSlice } from "@reduxjs/toolkit";

interface ExamGroupState {
  list?: ExamGroupData[];
  loading?: boolean;
}

const initialState: ExamGroupState = {
  list: [],
  loading: false,
};

export const examGroupSlice = createSlice({
  name: "exam_group",
  initialState,
  reducers: {
    setExamGroupList: (_, action) => {
      return { lopading: false, list: action.payload };
    },
    setExamGroupLoading: (_, action) => {
      return { loading: true, list: [] };
    },
  },
});

export const { setExamGroupList, setExamGroupLoading } = examGroupSlice.actions;

export default examGroupSlice.reducer;
