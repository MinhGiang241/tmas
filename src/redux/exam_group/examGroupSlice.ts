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
export const fetchDataQuestionGroup = createAsyncThunk(
  "questionGroup",
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
      return { ...state, loading: true };
    },
    setquestionGroupList: (state, action) => {
      return { ...state, loading: false, questions: action.payload };
    },
    setquestionGroupLoading: (state, action) => {
      return { ...state, loading: true };
    },
    setExamAndQuestionLoading: (state, action) => {
      return { ...state, loading: true };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchDataExamGroup.fulfilled, (state, action) => {
      return { ...state, list: action.payload, loading: false };
    });
    builder.addCase(fetchDataQuestionGroup.fulfilled, (state, action) => {
      return { ...state, questions: action.payload, loading: false };
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
