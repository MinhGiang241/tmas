import { createSlice } from "@reduxjs/toolkit";
import _ from "lodash";
import { v4 as uuidv4 } from "uuid";

interface Question {
  loading: boolean;
  multiAnswerQuestions: MultiAnswer[];
  connectQuestions: ConnectAnswer[];
  connectAnswers: ConnectAnswer[];
}

const initialState: Question = {
  loading: false,
  connectQuestions: [
    {
      type: "Quest",
      id: uuidv4(),
      contentAnwser: undefined,
      contentQuestion: undefined,
      labelQuestion: undefined,
    },
    {
      type: "Quest",
      id: uuidv4(),
      contentAnwser: undefined,
      contentQuestion: undefined,
      labelQuestion: undefined,
    },
    {
      type: "Quest",
      id: uuidv4(),
      contentAnwser: undefined,
      contentQuestion: undefined,
      labelQuestion: undefined,
    },
    {
      type: "Quest",
      id: uuidv4(),
      contentAnwser: undefined,
      contentQuestion: undefined,
      labelQuestion: undefined,
    },
  ],

  connectAnswers: [
    {
      type: "Answ",
      id: uuidv4(),
      contentAnwser: undefined,
      contentQuestion: undefined,
      labelQuestion: undefined,
    },
    {
      type: "Answ",
      id: uuidv4(),
      contentAnwser: undefined,
      contentQuestion: undefined,
      labelQuestion: undefined,
    },
    {
      type: "Answ",
      id: uuidv4(),
      contentAnwser: undefined,
      contentQuestion: undefined,
      labelQuestion: undefined,
    },
    {
      type: "Answ",
      id: uuidv4(),
      contentAnwser: undefined,
      contentQuestion: undefined,
      labelQuestion: undefined,
    },
  ],
  multiAnswerQuestions: [
    { id: uuidv4(), label: undefined, text: undefined, isCorrectAnswer: false },
    { id: uuidv4(), label: undefined, text: undefined, isCorrectAnswer: false },
    { id: uuidv4(), label: undefined, text: undefined, isCorrectAnswer: false },
    { id: uuidv4(), label: undefined, text: undefined, isCorrectAnswer: false },
  ],
};

export const questionSlice = createSlice({
  name: "members",
  initialState,
  reducers: {
    setQuestionLoading: (state, action) => {
      return { ...state, loading: action.payload };
    },
    resetMultiAnswer: (state, action) => {
      return {
        ...state,
        multiAnswerQuestions: [
          {
            id: uuidv4(),
            label: undefined,
            text: undefined,
            isCorrectAnswer: false,
          },
          {
            id: uuidv4(),
            label: undefined,
            text: undefined,
            isCorrectAnswer: false,
          },
          {
            id: uuidv4(),
            label: undefined,
            text: undefined,
            isCorrectAnswer: false,
          },
          {
            id: uuidv4(),
            label: undefined,
            text: undefined,
            isCorrectAnswer: false,
          },
        ],
      };
    },
    addMoreAnswer: (state, action) => {
      return {
        ...state,
        multiAnswerQuestions: [
          ...state.multiAnswerQuestions,
          {
            id: uuidv4(),
            label: undefined,
            text: undefined,
            isCorrectAnswer: false,
          },
        ],
      };
    },
    addMoreConnectQuestion: (state, action) => {
      return {
        ...state,
        connectQuestions: [
          ...state.connectQuestions,
          {
            type: "Quest",
            id: uuidv4(),
            contentAnwser: undefined,
            contentQuestion: undefined,
            labelQuestion: undefined,
          },
        ],
      };
    },
    addMoreConnectAnswer: (state, action) => {
      return {
        ...state,
        connectAnswers: [
          ...state.connectAnswers,
          {
            type: "Answ",
            id: uuidv4(),
            contentAnwser: undefined,
            contentQuestion: undefined,
            labelQuestion: undefined,
          },
        ],
      };
    },
    deleteMultiAnswer: (state, action) => {
      var answerIndex = action.payload;
      var newList = _.cloneDeep(state.multiAnswerQuestions);
      newList.splice(answerIndex, 1);
      return { ...state, multiAnswerQuestions: newList };
    },
    updateTextMultiAnswer: (state, action) => {
      var newList = _.cloneDeep(state.multiAnswerQuestions);
      var answerIndex = action.payload.index as number;
      newList[answerIndex].text = action.payload.value;
      newList[answerIndex].label = action.payload.value;
      return { ...state, multiAnswerQuestions: newList };
    },
    updateCheckCorrectAnswer: (state, action) => {
      var newList = _.cloneDeep(state.multiAnswerQuestions);
      var answerIndex = action.payload.index as number;
      newList[answerIndex].isCorrectAnswer = action.payload.value;
      return { ...state, multiAnswerQuestions: newList };
    },
    deleteConnectQuestion: (state, action) => {
      var answerIndex = action.payload;
      var newList = _.cloneDeep(state.connectQuestions);
      newList.splice(answerIndex, 1);
      return { ...state, connectQuestions: newList };
    },
    deleteConnectAnswer: (state, action) => {
      var answerIndex = action.payload;
      var newList = _.cloneDeep(state.connectAnswers);
      newList.splice(answerIndex, 1);
      return { ...state, connectAnswers: newList };
    },
    updateTextConnectQuestion: (state, action) => {
      var newList = _.cloneDeep(state.connectQuestions);
      var questionIndex = action.payload.index as number;
      newList[questionIndex].labelQuestion = action.payload.value;
      newList[questionIndex].contentQuestion = action.payload.value;
      return { ...state, connectQuestions: newList };
    },
    updateTextConnectAnswer: (state, action) => {
      var newList = _.cloneDeep(state.connectAnswers);
      var answerIndex = action.payload.index as number;
      newList[answerIndex].labelAnwser = action.payload.value;
      newList[answerIndex].contentAnwser = action.payload.value;
      return { ...state, connectAnswers: newList };
    },
    updateAnswerToQuestion: (state, action) => {
      var newList = _.cloneDeep(state.connectQuestions);
      var questionIndex = action.payload.index as number;
      newList[questionIndex].idAns = action.payload.value;
      return { ...state, connectQuestions: newList };
    },

    resetConnectAnswer: (state, action) => {
      return {
        ...state,
        connectCharAnswerQuestions: [
          {
            type: "Quest",
            id: uuidv4(),
            contentAnwser: undefined,
            contentQuestion: undefined,
            labelQuestion: undefined,
          },
          {
            type: "Quest",
            id: uuidv4(),
            contentAnwser: undefined,
            contentQuestion: undefined,
            labelQuestion: undefined,
          },
          {
            type: "Quest",
            id: uuidv4(),
            contentAnwser: undefined,
            contentQuestion: undefined,
            labelQuestion: undefined,
          },
          {
            type: "Quest",
            id: uuidv4(),
            contentAnwser: undefined,
            contentQuestion: undefined,
            labelQuestion: undefined,
          },
        ],

        connectNumAnswerQuestions: [
          {
            type: "Answ",
            id: uuidv4(),
            contentAnwser: undefined,
            contentQuestion: undefined,
            labelQuestion: undefined,
          },
          {
            type: "Answ",
            id: uuidv4(),
            contentAnwser: undefined,
            contentQuestion: undefined,
            labelQuestion: undefined,
          },
          {
            type: "Answ",
            id: uuidv4(),
            contentAnwser: undefined,
            contentQuestion: undefined,
            labelQuestion: undefined,
          },
          {
            type: "Answ",
            id: uuidv4(),
            contentAnwser: undefined,
            contentQuestion: undefined,
            labelQuestion: undefined,
          },
        ],
      };
    },
  },
});

export const {
  addMoreConnectQuestion,
  addMoreConnectAnswer,
  resetMultiAnswer,
  addMoreAnswer,
  deleteMultiAnswer,
  updateTextMultiAnswer,
  updateCheckCorrectAnswer,
  setQuestionLoading,
  deleteConnectAnswer,
  deleteConnectQuestion,
  resetConnectAnswer,
  updateAnswerToQuestion,
  updateTextConnectAnswer,
  updateTextConnectQuestion,
} = questionSlice.actions;

export default questionSlice.reducer;