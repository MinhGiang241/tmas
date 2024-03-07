export interface ExamGroupData {
  name?: string;
  level?: 0 | 1;
  idParent?: null | undefined | string;
  id?: string;
  createdTime?: string;
  createdBy?: string;
  updatedTime?: string;
  updateBy?: string;
  ownerId?: string;
  studioId?: string;
  childs?: ExamGroupData[];
}

export interface QuestionGroupData {
  id?: string;
  name?: string;
  createdTime?: string;
  updatedTime?: string;
  updateBy?: string;
  ownerId?: string;
  studioId?: string;
}

export interface Hashtag {
  _id?: string;
  createdTime?: string;
  updatedTime?: string;
  creator?: string;
  type?: string;
  name?: string;
  code?: string;
}

export interface ExamListDataResult {
  paging?: {
    startIndex?: number;
    recordPerPage?: number;
  };
  records?: ExamData[];
  totalOfRecords?: number;
}

export interface ExamData {
  name?: string;
  numberOfTests?: number;
  numberOfQuestions?: number;
  totalPoints?: number;
  idExamGroup?: string;
  version?: string;
  timeLimitMinutes?: number;
  examNextQuestion: "FreeByUser" | "ByOrderQuestion";
  examViewQuestionType?: "SinglePage" | "MultiplePages";
  language?: "English" | "Vietnamese";
  playAudio?: "OnlyOneTime" | "MultipleTimes";
  idDocuments?: string[];
  externalLinks?: string[];
  tags?: string[];
  description?: string;
  id?: string;
  createdTime?: string;
  createdBy?: string;
  updateTime?: string;
  updateBy?: string;
  studioId?: string;
}
