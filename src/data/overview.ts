import { Condition } from "./exam";

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
}

export interface TimeOnChartData {
  day?: number;
  month?: number;
  year?: number;
  total?: number;
}

export interface ExamCounterData {
  paging?: {
    startIndex?: number;
    recordPerPage?: number;
  };
  ids?: string[];
  studioSorters?: {
    name?: string;
    isAsc?: boolean;
  }[];
  filters?: {
    fieldName?: string;
    condition?: Condition;
    value?: string;
    convertTextToUnsigned: boolean;
  }[];
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
}

export interface OverviewListRevenueData {
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
