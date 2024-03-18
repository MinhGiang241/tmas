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
