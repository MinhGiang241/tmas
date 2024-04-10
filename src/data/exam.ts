import { ExaminationVersionState } from "@/services/api_services/examination_bc_api";
import { AccessCodeExaminantionSetting } from "./form_interface";
import { QuestionType } from "./question";

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
  changePositionQuestion?: boolean;
  name?: string;
  numberOfTests?: number;
  numberOfQuestions?: number;
  totalPoints?: number;
  idExamGroup?: string;
  version?: string;
  timeLimitMinutes?: number;
  TimeLimitMinutes?: number;
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

export enum AppovedState {
  Rejected = "Rejected",
  Approved = "Approved",
}

export interface ExamVersion {
  id?: string;
  approvedState?: {
    approvedState?: AppovedState;
    rejectedMessage?: string;
    rejectedReason?: string;
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
  examTestCode?: string;
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
  isPushToBank?: boolean;
  goldSetting?: {
    isEnable?: boolean;
    goldPrice?: number;
  };
}

export interface TmasExamVersion {
  code?: string;
  createdTime?: string;
  updatedTime?: string;
  examId?: string;
  examData?: TmasStudioExamData;
  group_name?: string;
  name?: string;
  state?: ExaminationVersionState;
  studioId?: string;
  userId?: string;
  version: number;
  _id?: string;
}

export interface TmasExamData {
  code?: string;
  createdTime?: string;
  updatedTime?: string;
  userId?: string;
  versionId?: string;
  _id?: string;
  visibleState: string;
  version: TmasExamVersion;
}

export interface TmasStudioExamData {
  ApprovedState?: {
    ApprovedState?: AppovedState;
  };
  ChangePositionQuestion?: boolean;
  CreatedBy?: string;
  CreatedTime?: string;
  Description?: string;
  Documents?: any[];
  ExamNextQuestion?: "FreeByUser" | "ByOrderQuestion";
  ExamViewQuestionType?: "SinglePage" | "MultiplePages";
  ExternalLinks?: string[];
  Group?: { Level?: number; Name?: string }[];
  IdDocuments?: any[];
  IdExamGroup?: string;
  IdSession?: string;
  IdTags?: string[];
  Language?: string;
  Name?: string;
  NumberOfQuestions?: number;
  NumberOfTests?: number;
  OwnerId?: string;
  Parts: {
    Description?: string;
    Name?: string;
    Questions?: {
      Base?: {
        Content?: {
          Answers?: {
            IsCorrectAnswer?: boolean;
            Label?: string;
            Text?: string;
          }[];
          ExplainAnswer?: string;
          IsChangePosition?: boolean;
        };
        NumberPoint?: number;
        Question?: string;

        NumberPointAsInt?: number;
        QuestionType: QuestionType;
      };
      IdExam?: string;
      IdExamQuestion?: string;
      UnsignedName?: string;
      IdExamQuestionPart?: string;
      IdGroupQuestion?: string;
      IsQuestionBank?: boolean;
      NumberPointAsInt?: number;
      QuestionType: QuestionType;
    }[];
  }[];
  PlayAudio?: "OnlyOneTime" | "MultipleTimes";
  StudioId?: string;
  Tags?: any[];
  TimeLimitMinutes?: number;
  TotalPointsAsInt?: number;
  UnsignedName?: string;
  UpdateBy?: string;
  UpdateTime?: string;
  Version?: string;
}
