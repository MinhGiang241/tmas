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
