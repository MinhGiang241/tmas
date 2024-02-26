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
    setExamGroupLoaidng: (_, action) => {
      return { loading: action.payload, list: [] };
    },
  },
});

export const { setExamGroupList, setExamGroupLoaidng } = examGroupSlice.actions;

export default examGroupSlice.reducer;
