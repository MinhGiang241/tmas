import { ExamGroupData, QuestionGroupData } from "@/data/exam";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface ExamGroupState {
  list?: ExamGroupData[];
  loading?: boolean;
  questions?: QuestionGroupData[];
}

const initialState: ExamGroupState = {
  list: [],
  loading: false,
  questions: [],
};

export const fetchDataExamGroup = createAsyncThunk(
  "examGroup",
  async (fetcher: any, _) => {
    const data = await fetcher();
    return data;
  },
);

export const examGroupSlice = createSlice({
  name: "exam_group",
  initialState,
  reducers: {
    setExamGroupList: (state, action) => {
      return { ...state, loading: false, list: action.payload };
    },
    setExamGroupLoading: (state, action) => {
      return { ...state, loading: true, list: [] };
    },
    setquestionGroupList: (state, action) => {
      return { ...state, loading: false, questions: action.payload };
    },
    setquestionGroupLoading: (state, action) => {
      return { ...state, loading: true, questions: [] };
    },
    setExamAndQuestionLoading: (state, action) => {
      return { loading: true, questions: [], list: [] };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchDataExamGroup.fulfilled, (state, action) => {
      state.list = action.payload;
      state.loading = false;
    });
  },
});

export const {
  setExamGroupList,
  setExamGroupLoading,
  setquestionGroupList,
  setquestionGroupLoading,
  setExamAndQuestionLoading,
} = examGroupSlice.actions;

export default examGroupSlice.reducer;
