import i18next from "i18next";

export interface RegisterFormValues {
  full_name?: string;
  company_name?: string;
  phone?: string;
  register_email?: string;
  register_password?: string;
  re_password?: string;
  invitationId?: string;
}

export interface RegisterFormData {
  full_name?: string;
  company?: string;
  phone?: string;
  email?: string;
  password?: string;
  sso_token?: string;
  reg_type?: string;
  captcha_token?: string;
  invitationId?: string;
}

export interface LoginFormValue {
  email?: string;
  password?: string;
}

export interface LoginFormData {
  email?: string;
  password?: string;
  captcha_token?: string;
  log_type?: string;
  sso_token?: string;
}

export interface StudioFormData {
  studio_name?: string;
  stu_banner?: string;
  stu_btn_color?: string;
  stu_text_color?: string;
  stu_logo?: string;
}

export interface ExamFormData {
  idTags?: string[];
  id?: string;
  studioId?: string;
  description?: string;
  changePositionQuestion?: boolean;
  examNextQuestion?: "FreeByUser" | "ByOrderQuestion";
  examViewQuestionType?: "SinglePage" | "MultiplePages";
  externalLinks?: string[];
  idDocuments?: string[];
  idExamGroup?: string;
  language?: "English" | "Vietnamese";
  name?: string;
  playAudio?: "OnlyOneTime" | "MultipleTimes";
  tags?: string[];
  timeLimitMinutes?: number;
  approvedState?: {
    approvedState?: "Approved" | "Pending" | "Rejected";
    rejectedMessage?: string;
  };
  idSession?: string;
}

export interface ParamGetExamList {
  "FilterByIds.Name"?: string;
  "FilterByIds.InValues"?: string;
  "FilterByNameOrTag.Name"?: string;
  "FilterByNameOrTag.InValues"?: string;
  "FilterByExamGroupId.Name"?: string;
  "FilterByExamGroupId.InValues"?: string;
  "SortByCreateTime.Name"?: string;
  "SortByCreateTime.IsAsc"?: boolean;
  "SortByName.IsAsc"?: boolean;
  "Paging.StartIndex"?: number;
  "Paging.RecordPerPage"?: number;
}

export interface AccessCodeExaminantionSetting {
  id?: string;
  createdTime?: string;
  createdBy?: string;
  updatedBy?: string;
  ownerId?: string;
  studioId?: string;
  code?: string;
  numberOfAccess?: number;
  limitOfAccess?: number;
}

export interface ExaminationFormData {
  id?: string;
  idSession?: string;
  isActive?: boolean;
  accessCodeSettingType?: "None" | "One" | "MultiCode";
  accessCodeSettings?: AccessCodeExaminantionSetting[];
  cheatingSetting?: {
    disableCopy?: boolean;
    disablePatse?: boolean;
    limitExitScreen?: number;
  };
  description?: string;
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

export interface ExaminationListParams {
  "FilterByExamGroupId.InValues"?: string;
  "FilterByExamGroupId.Name"?: string;
  "FilterByName.Name"?: string;
  "FilterByName.InValues"?: string;
  "FilterByIds.Name"?: string;
  "FilterByIds.InValues"?: string;
  "FilterByExamId.Name"?: string;
  "FilterByExamId.InValues"?: string;
  "Sorter.Name"?: string;
  "Sorter.IsAsc"?: boolean;
  "Paging.StartIndex"?: number;
  "Paging.RecordPerPage"?: number;
  "SorterByCreateTime.Name"?: string;
  "SorterByCreateTime.IsAsc"?: boolean;
  "SorterByName.Name"?: string;
  "SorterByName.isAsc"?: boolean;
}

export type CodingDataType =
  | "String"
  | "Integer"
  | "LongInteger"
  | "Float"
  | "Boolean"
  | "Double"
  | "Character"
  | "IntegerArray"
  | "StringArray"
  | "LongIntegerArray"
  | "FloatArray"
  | "DoubleArray"
  | "CharacterArray"
  | "BooleanArray"
  | "Integer2DArray"
  | "String2DArray"
  | "LongInteger2DArray"
  | "Float2DArray"
  | "Double2DArray"
  | "Character2DArray"
  | "Boolean2DArray"
  | "Void";

export type QuestionType =
  | "MutilAnswer"
  | "YesNoQuestion"
  | "Pairing"
  | "Essay"
  | "Coding"
  | "SQL"
  | "FillBlank"
  | "Random";

export interface BaseQuestionFormData {
  question?: string;
  numberPoint?: number;
  idGroupQuestion?: string;
  questionType?: QuestionType;
  idExam?: string;
  idExamQuestionPart?: string;
}

export interface CodingQuestionFormData extends BaseQuestionFormData {
  content?: {
    codingScroringMethod?: "PassAllTestcase" | "EachTestcase";
    codeLanguages:
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
      parameterInputs?: {
        nameParameter?: string;
        returnType?: CodingDataType;
      }[];
      template?: string;
      explainAnswer?: string;
    };
  };
}

export interface ExamQuestionPart {
  _id?: string;
  name?: string;
  description?: string;
}

export interface PagingGetData {
  paging?: {
    startIndex?: number;
    recordPerPage?: number;
  };
  ids?: string[];
  sorters?: { name?: string; isAsc?: boolean }[];
}

export interface EssayQuestionFormData extends BaseQuestionFormData {
  content?: {
    gradingNote?: string;
    requiredFile?: boolean;
  };
}

export interface FillBlankQuestionFormData extends BaseQuestionFormData {
  content?: {
    fillBlankScoringMethod?: "CorrectAllBlank" | "EachCorrectBlank";
    explainAnswer?: string;
    formatBlank?: string;
    anwserItems?: { label?: string; anwsers?: string[] }[];
  };
}

export interface MultiAnswerQuestionFormData extends BaseQuestionFormData {
  content?: {
    explainAnswer?: string;
    isChangePosition?: boolean;
    answers?: { label?: string; text?: string; isCorrectAnswer?: boolean }[];
  };
}

export interface ConnectQuestionFormData extends BaseQuestionFormData {
  content?: {
    explainAnswer?: string;
    pairingScroringMethod?: "EachCorrectItem" | "CorrectAll";
    questions?: {
      labelQuestion?: string;
      labelAnwser?: string;
      contentQuestion?: string;
      contentAnwser?: string;
    }[];
  };
}

export interface RandomQuestionFormData extends BaseQuestionFormData {
  content?: any;
}

export interface SqlQuestionFormData extends BaseQuestionFormData {
  content?: {
    explainAnswer?: string;
    schemaSql?: string;
    expectedOutput?: string;
  };
}
