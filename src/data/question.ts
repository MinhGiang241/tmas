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
  // Random = "Random",
}
