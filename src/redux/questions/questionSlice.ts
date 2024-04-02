import { createSlice } from "@reduxjs/toolkit";
import _ from "lodash";
import { v4 as uuidv4 } from "uuid";
import cheerio from "cheerio";
import { ConnectPairing, ConnectQuestAns, MultiAnswer } from "@/data/question";

interface Question {
  loading: boolean;
  multiAnswerQuestions: MultiAnswer[];
  connectQuestions: ConnectQuestAns[];
  connectAnswers: ConnectQuestAns[];
  connectPairing: ConnectPairing[];
}

const initialState: Question = {
  loading: false,
  connectPairing: [],
  connectQuestions: [
    {
      id: uuidv4(),
      label: undefined,
      content: undefined,
    },
    {
      id: uuidv4(),
      label: undefined,
      content: undefined,
    },
  ],

  connectAnswers: [
    {
      id: uuidv4(),
      label: undefined,
      content: undefined,
    },
    {
      id: uuidv4(),
      label: undefined,
      content: undefined,
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
    setMultiAnswer: (state, action) => {
      return { ...state, multiAnswerQuestions: [...action.payload] };
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
    setConnectQuestion: (state, action) => {
      return { ...state, connectQuestions: action.payload };
    },
    addMoreConnectQuestion: (state, action) => {
      return {
        ...state,
        connectQuestions: [
          ...state.connectQuestions,
          {
            id: uuidv4(),
            label: undefined,
            content: undefined,
          },
        ],
      };
    },
    setConnectAnswer: (state, action) => {
      return { ...state, connectAnswers: action.payload };
    },

    addMoreConnectAnswer: (state, action) => {
      return {
        ...state,
        connectAnswers: [
          ...state.connectAnswers,
          {
            id: uuidv4(),
            label: undefined,
            content: undefined,
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
      newList[answerIndex].label = cheerio.load(action.payload.value).text();
      return { ...state, multiAnswerQuestions: newList };
    },
    updateCheckCorrectAnswer: (state, action) => {
      var newList = _.cloneDeep(state.multiAnswerQuestions);
      var answerIndex = action.payload.index as number;
      newList[answerIndex].isCorrectAnswer = action.payload.value;
      return { ...state, multiAnswerQuestions: newList };
    },
    deleteConnectQuestion: (state, action) => {
      var questionIndex = action.payload;
      var newList = _.cloneDeep(state.connectQuestions);
      var pairings = _.cloneDeep(state.connectPairing).filter(
        (e) => !(newList[questionIndex].id === e.idQuestion),
      );

      newList.splice(questionIndex, 1);

      return { ...state, connectQuestions: newList, connectPairing: pairings };
    },
    deleteConnectAnswer: (state, action) => {
      var answerIndex = action.payload;
      var newList = _.cloneDeep(state.connectAnswers);
      var pairings = _.cloneDeep(state.connectPairing).filter(
        (e) => !(newList[answerIndex].id === e.idAnswer),
      );

      newList.splice(answerIndex, 1);

      return { ...state, connectAnswers: newList, connectPairing: pairings };
    },
    updateTextConnectQuestion: (state, action) => {
      var newList = _.cloneDeep(state.connectQuestions);
      var questionIndex = action.payload.index as number;
      newList[questionIndex].label = cheerio.load(action.payload.value).text();
      newList[questionIndex].content = action.payload.value;
      return { ...state, connectQuestions: newList };
    },
    updateTextConnectAnswer: (state, action) => {
      var newList = _.cloneDeep(state.connectAnswers);
      var answerIndex = action.payload.index as number;
      newList[answerIndex].label = cheerio.load(action.payload.value).text();
      newList[answerIndex].content = action.payload.value;
      return { ...state, connectAnswers: newList };
    },
    updateAnswerToQuestion: (state, action) => {
      var newList = _.cloneDeep(state.connectQuestions);
      var questionIndex = action.payload.index;
      console.log("newList", newList, questionIndex);
      console.log("newList2", newList, questionIndex);
      return { ...state, connectQuestions: newList };
    },
    setConnectPairing: (state, action) => {
      return { ...state, connectPairing: action.payload };
    },
    updateCheckConnectPairing: (state, action) => {
      const pairings = _.cloneDeep(state.connectPairing);
      if (action.payload.check) {
        pairings.push({
          idAnswer: action.payload.idAnswer,
          idQuestion: action.payload.idQuestion,
        });
        return { ...state, connectPairing: pairings };
      } else {
        var newList = pairings.filter((f) => {
          return !(
            f.idAnswer === action.payload.idAnswer &&
            f.idQuestion === action.payload.idQuestion
          );
        });
        return { ...state, connectPairing: newList };
      }
    },

    resetConnectAnswer: (state, action) => {
      return {
        ...state,
        connectPairing: [],
        connectAnswers: [
          {
            id: uuidv4(),
            label: undefined,
            content: undefined,
          },
          {
            id: uuidv4(),
            label: undefined,
            content: undefined,
          },
        ],

        connectQuestions: [
          {
            id: uuidv4(),
            label: undefined,
            content: undefined,
          },
          {
            id: uuidv4(),
            label: undefined,
            content: undefined,
          },
        ],
      };
    },
  },
});

export const {
  setConnectPairing,
  updateCheckConnectPairing,
  setConnectQuestion,
  setConnectAnswer,
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
  setMultiAnswer,
} = questionSlice.actions;

export default questionSlice.reducer;
