import { Condition, ExamData, ExaminationData } from "./exam";
import { TagObject } from "./form_interface";

export interface OverviewNumberData {
  totalDoingTest?: number;
  totalTest?: number;
  totalTestToday?: number;
  totalTestYesterday?: number;
  totalUserTest?: number;
  totalUserTestToday?: number;
  totalUserTestYesterday?: number;
}

export enum TimeChart {
  Week = "week",
  Month = "month",
  Day = "day",
  Year = "year",
}

export interface ActivitiesParams {
  startTime?: string;
  endTime?: string;
  typeTime?: TimeChart;
  lang?: string;
  studioId?: string;
}

export interface TimeOnChartData {
  day?: number;
  month?: number;
  year?: number;
  total?: number;
}

export interface SortData {
  fieldName?: string;
  sort?: "-1" | "1";
}

export interface FilterData {
  fieldName?: string;
  condition?: Condition;
  value?: string;
  convertTextToUnsigned?: boolean;
}

export interface ExamCounterParams {
  paging?: {
    startIndex?: number;
    recordPerPage?: number;
  };
  ids?: string[];
  studioSorters?: {
    name?: string;
    isAsc?: boolean;
  }[];
  filters?: FilterData[];
}

export interface RevenueData {
  discountData?: {
    revenue?: number;
    revenueToday?: number;
    revenueYesterday?: number;
  };
  netData?: {
    revenue?: number;
    revenueToday?: number;
    revenueYesterday?: number;
  };
  revenueData?: {
    revenue?: number;
    revenueToday?: number;
    revenueYesterday?: number;
  };
}

export interface OverviewListRevenueParams {
  skip?: number;
  limit?: number;
  groupId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  studioId?: string;
  sort?: SortData;
}

export interface OverviewListRevenueData {
  _id?: string;
  createdTime?: string;
  discountRevenue?: number;
  examTestName?: string;
  goldExamTest?: number;
  groupName?: string[];
  netRevenue?: number;
  revenue?: number;
  tagsName?: string[];
  status?: string;
}

export interface RevenueDataTotal {
  discountRevenue?: number;
  netRevenue?: number;
  revenue?: number;
}

export interface StuRevenueData {
  examTest?: {
    examTestPublic?: number;
    examTestPublicActive?: number;
  };
  subStudio?: {
    total?: number;
    totalToday?: number;
    totalYesterDay?: number;
  };
}

export interface ExamCounterData {
  id?: string;
  createdBy?: string;
  createdTime?: string;
  couter?: CouterData;
  info?: {
    tags?: TagObject[];
    exam?: ExamData;
    groupExam?: {
      id?: string;
      createdBy?: string;
      createdTime?: string;
      idParent?: string;
      level?: number;
      name?: string;
      ownerId?: string;
      studioId?: string;
      unsignedName?: string;
      updateBy?: string;
      updateTime?: string;
    };
  };
  key?: {
    couterByDate?: string;
    idExam?: string;
    idStudio?: string;
  };
  keyCouter?: string;
  ownerId?: string;
  studioId?: string;
  updateBy?: string;
  updateTime?: string;
}

export interface CouterData {
  goldCouter?: {
    discount?: number;
    netRevenue?: number;
    revenue?: number;
  };
  maximumTimeSeconds?: number;
  medianScoreAsInt?: number;
  minimumTimeSeconds?: number;
  numberOfQuestions?: number;
  numberOfTest?: number;
  totalPass?: number;
  totalScoreAsInt?: number;
  totalTimeSeconds?: number;
}

export interface ExamTestInfoData {
  examTest?: ExaminationData;
  groupExam?: {
    id?: string;
    createdBy?: string;
    createdTime?: string;
    idParent?: string;
    level?: number;
    name?: string;
    ownerId?: string;
    studioId?: string;
    unsignedName?: string;
    updateBy?: string;
    updateTime?: string;
  };
}

export interface ExamTestCounterData {
  couter?: CouterData;
  info?: ExamTestInfoData;
  key?: {
    couterByDate?: string;
    idExam?: string;
    idStudio?: string;
  };
  keyCouter?: string;
  ownerId?: string;
  studioId?: string;
  updateBy?: string;
  updateTime?: string;
}
