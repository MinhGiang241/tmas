import { ExamCompletionState } from "./exam";
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
  Evaluation = "Evaluation",
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
  idExamQuestionBank?: boolean;
  isQuestionBank?: boolean;
  createdBy?: string;
  ownerId?: string;
  updateTime?: string;
  createdTime?: string;
  studioId?: string;
  groupQuestionName?: string;
  // find
  hidden?: boolean;
}

export interface CodingQuestionData extends BaseQuestionData {
  content?: {
    codingScroringMethod?: "PassAllTestcase" | "EachTestcase";
    codeLanguages?:
      | any
      | "PHP"
      | "Javascript"
      | "Java"
      | "Python"
      | "Ruby"
      | "CSharp"[];
    testcases?: {
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

export interface SurveyQuestionData extends BaseQuestionData {
  content?: {
    answers?: {
      point?: string;
      text?: string;
      idIcon?: string;
      label?: string;
    }[];
    explainAnswer?: string;
    isChangePosition?: boolean;
  };
}

export interface ConnectQuestionData extends BaseQuestionData {
  content?: {
    explainAnswer?: string;
    pairingScroringMethod?: "EachCorrectItem" | "CorrectAll";
    questions?: ConnectQuestAns[];
    answers?: ConnectQuestAns[];
    pairings?: {
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

export interface FillBlankCandidateAnswer {
  anwserItems?: {
    anwsers?: string[];
    label?: string;
    isCorrect?: boolean;
  }[];
}

export interface ConnectCandidateAnswer {
  anwserPairings: { idAnswer?: string; idQuestion?: string }[];
}

export interface MultiCandidateAnswer {
  answers?: {
    label?: string;
    isCorrect?: boolean;
  }[];
}

export interface EssayCandidateAnswer {
  anwserHtml?: string;
  idFiles?: any[];
}

export interface EvaluationCandidateAnswer {
  answers?: {
    label?: string;
    isCorrect?: boolean;
    idIcon?: string;
    point?: number;
    text?: string;
  }[];
}

export interface ParamsCheckMultiAnswer {
  idExamTestResult?: string;
  answerItems?: {
    evaluatorComment?: string;
    score?: number;
    idExamQuestion?: string;
  }[];
  completionState?: ExamCompletionState;
}

export interface SqlCandidateAnswer {
  querySql?: string;
  stdOut?: string;
  metadata?: string;
  stdOutRaw?: any[];
}

export interface SqlAnswerMetadata {
  code?: number;
  message?: string;
  data?: {
    buildErrMsg?: string;
    complete?: boolean;
    correct?: number;
    createdTime?: string;
    duration?: number;
    expectedOutput?: string;
    matched?: boolean;
    querySql?: string;
    schema?: string;
    schemaSql?: string;
    startAt?: string;
    state?: string;
    stdErr?: string;
    stdOut?: string;
    stdOutRaw?: any[];
    testDir?: any;
    updatedTime?: string;
    wrong?: number;
  };
}

export interface CodingCandidateAnswer {
  testCaseScoreds?: {
    matched?: boolean;
    id?: string;
    name?: string;
    inputData?: string;
    outputData?: string;
  }[];
  buildErrMsg?: string;
  metadata?: string;
  languageSelected?: string;
  code?: string;
}

export interface CodingAnswerMetadata {
  code?: number;
  message?: string;
  data?: {
    buildErrMsg?: string;
    codingTemplate?: {
      nameFunction?: string;
      parameterInputs?: any;
      returnType?: string;
    };
    completed?: boolean;
    content?: string;
    contentMode?: string;
    correct?: number;
    createdTime?: string;
    duration?: number;
    endAt?: string;
    fullContent?: string;
    language?: string;
    projectId?: string;
    schema?: string;
    startAt?: string;
    state?: string;
    testDir?: string;
    testcases?: {
      actualResult?: any;
      createdTime?: string;
      inputData?: string;
      matched?: boolean;
      name?: string;
      outputData?: string;
      updatedTime?: string;
    }[];
    updatedTime?: string;
    wrong?: number;
  };
}

export interface EvaluationAnswer extends BaseQuestionData {
  content?: {
    explainAnswer?: string;
    isChangePosition?: boolean;
    answers?: {
      idIcon?: string;
      label?: string;
      point?: number;
      text?: string;
    }[];
  };
}
