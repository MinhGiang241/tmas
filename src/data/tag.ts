export interface TagParams {
  "Ids.Name"?: string;
  "Ids.InValues"?: string;
  "Names.Name"?: string;
  "Names.InValues"?: string;
  "Paging.StartIndex"?: number;
  "Paging.RecordPerPage"?: number;
}

export interface TagData {
  createdBy?: string;
  createdTime?: string;
  id?: string;
  name?: string;
  ownerId?: string;
  studioId?: string;
  updateBy?: string;
  updateTime?: string;
}
