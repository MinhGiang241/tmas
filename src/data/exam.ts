import { AccessCodeExaminantionSetting } from "./form_interface";

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
  examinations?: ExaminationData[];
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
  idSession?: string;
}

export interface ExamVersion {
  id?: string;
  approvedState?: {
    approvedState?: string;
    rejectedMessage?: string;
  };
  createdBy?: string;
  createdTime?: string;
  description?: string;
  documents?: any;
  examNextQuestion?: string;
  examViewQuestionType?: string;
  externalLinks?: string[];
  idDocuments?: any[];
  idExamGroup?: string;
  idTags?: any;
  language?: string;
  name?: string;
  numberOfQuestions?: number;
  numberOfTests?: number;
  ownerId?: string;
  playAudio?: string;
  studioId?: string;
  tags?: any;
  timeLimitMinutes?: number;
  totalPoints?: number;
  updateBy?: string;
  updateTime?: string;
  version?: string;
}

export interface ExaminationData {
  id?: string;
  idSession?: string;
  updateTime?: string;
  createdTime?: string;
  examVersion?: ExamVersion;
  accessCodeSettings?: AccessCodeExaminantionSetting[];
  cheatingSetting?: {
    disableCopy?: boolean;
    disablePatse?: boolean;
    limitExitScreen?: number;
  };
  studioId?: string;
  isActive?: boolean;
  isAvaiableTest?: boolean;
  linkQRJoinTest?: string;
  description?: string;
  ownerId?: string;
  idAvatarThumbnail?: string;
  idExam?: string;
  name?: string;
  linkJoinTest?: string;
  passingSetting?: {
    passPointPercent?: number;
    passMessage?: string;
    failMessage?: string;
  };
  requiredInfoSetting?: {
    phoneNumber?: boolean;
    fullName?: boolean;
    idGroup?: boolean;
    birthday?: boolean;
    email?: boolean;
    identifier?: boolean;
    jobPosition?: boolean;
  };
  sharingSetting?: "Public" | "Private";
  testResultSetting?: {
    showPoint?: boolean;
    showPercent?: boolean;
    showPassOrFail?: boolean;
    showPassOrFailDetail?: boolean;
  };
  validAccessSetting?: {
    validFrom?: string;
    validTo?: string;
    ipWhiteLists?: string[];
  };
}
