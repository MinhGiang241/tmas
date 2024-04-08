import { CodingDataType, ParameterType } from "./form_interface";

export interface MultiAnswer {
  id?: string;
  label?: string;
  text?: string;
  isCorrectAnswer?: boolean;
}

export interface ConnectQuestAns {
  id?: string;
  label?: string;
  content?: string;
}
export interface ConnectPairing {
  idQuestion?: string;
  idAnswer?: string;
}

export enum QuestionType {
  MutilAnswer = "MutilAnswer",
  YesNoQuestion = "YesNoQuestion",
  SQL = "SQL",
  FillBlank = "FillBlank",
  Pairing = "Pairing",
  Coding = "Coding",
  Essay = "Essay",
  Random = "Random",
}

export interface BaseQuestionData {
  id?: string;
  question?: string;
  numberPoint?: number;
  numberPointAsInt?: number;
  idGroupQuestion?: string;
  questionType?: QuestionType;
  idExam?: string;
  idExamQuestionPart?: string;
  idExamQuestionBank?: string;
  studioIdstudioId?: string;
  createdBy?: string;
  ownerId?: string;
  updateTime?: string;
  createdTime?: string;
  studioId?: string;
}

export interface CodingQuestionData extends BaseQuestionData {
  content?: {
    codingScroringMethod?: "PassAllTestcase" | "EachTestcase";
    codeLanguages:
      | any
      | "PHP"
      | "Javascrip"
      | "Java"
      | "Python"
      | "Ruby"
      | "CShape"[];
    testcases: {
      name?: string;
      inputData?: string;
      outputData?: string;
    }[];
    codingTemplate?: {
      nameFunction?: string;
      returnType?: CodingDataType;
      parameterInputs?: ParameterType[];
      template?: string;
      explainAnswer?: string;
    };
  };
}

export interface EssayQuestionData extends BaseQuestionData {
  content?: {
    gradingNote?: string;
    requiredFile?: boolean;
  };
}

export interface FillBlankQuestionData extends BaseQuestionData {
  content?: {
    fillBlankScoringMethod?: "CorrectAllBlank" | "EachCorrectBlank";
    explainAnswer?: string;
    formatBlank?: string;
    anwserItems?: { label?: string; anwsers?: string[] }[];
  };
}

export interface MultiAnswerQuestionData extends BaseQuestionData {
  content?: {
    explainAnswer?: string;
    isChangePosition?: boolean;
    answers?: { label?: string; text?: string; isCorrectAnswer?: boolean }[];
  };
}

export interface ConnectQuestionData extends BaseQuestionData {
  content?: {
    explainAnswer?: string;
    pairingScroringMethod?: "EachCorrectItem" | "CorrectAll";
    questions?: ConnectQuestAns[];
    answers?: ConnectQuestAns[];
    pairings: {
      idQuestion?: string;
      idAnswer?: string;
    }[];
  };
}

export interface RandomQuestionData extends BaseQuestionData {
  content?: any;
}

export interface SqlQuestionData extends BaseQuestionData {
  content?: {
    explainAnswer?: string;
    schemaSql?: string;
    expectedOutput?: string;
  };
}
