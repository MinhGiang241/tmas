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

export interface ExamGetPagingParams {
  paging?: {
    startIndex?: number;
    recordPerPage?: number;
  };
  filterByIds?: {
    name?: string;
    inValues?: string[];
  };
  filterByNameOrTag?: {
    name?: string;
    inValues?: string[];
  };
  filterByIdTag?: {
    name?: string;
    inValues?: string[];
  };
  filterByExamGroupId?: {
    name?: string;
    inValues?: string[];
  };
  sortByCreateTime?: {
    name?: string;
    isAsc?: boolean;
  };
  sortByName?: {
    name?: string;
    isAsc?: boolean;
  };
  isReportTotal?: boolean;
  fromTime?: string;
  toTime?: string;

  isIncludeExamVersion?: boolean;
}

export interface ExamPagingData {
  additionData?: {
    maximumTimeSeconds?: number;
    medianScoreAsInt?: number;
    minimumTimeSeconds?: number;
    numberOfQuestions?: number;
    numberOfTest?: number;
    totalPass?: number;
    totalScoreAsInt?: number;
    totalTimeSeconds?: number;
    goldCouter?: {
      discount?: number;
      netRevenue?: number;
      revenue?: number;
    };
    numberOfTestByDay?: {
      couterByDate?: string;
      numberOfData?: number;
    };
  };
  paging?: {
    recordPerPage?: number;
    startIndex?: number;
  };
  totalOfRecords?: number;

  records?: ExamData[];
}

export interface ExamTestPagingData {
  additionData?: {
    maximumTimeSeconds?: number;
    medianScoreAsInt?: number;
    minimumTimeSeconds?: number;
    numberOfQuestions?: number;
    numberOfTest?: number;
    totalPass?: number;
    totalScoreAsInt?: number;
    totalTimeSeconds?: number;
    goldCouter?: {
      discount?: number;
      netRevenue?: number;
      revenue?: number;
    };
    numberOfTestByDay?: {
      couterByDate?: string;
      numberOfData?: number;
    };
  };
  paging?: {
    recordPerPage?: number;
    startIndex?: number;
  };
  totalOfRecords?: number;
  records?: ExaminationData[];
}

export interface ListExamReportParams {
  target_schema?: string;
  segment_schema?: boolean;
  output_schema?: string;
  collection?: string;
  postQuery?: string;
  preQuery?: string;
  withMergeValidation?: boolean;
  mergeValidationScript?: string;
  showMergeError?: boolean;
  mergeErrorMessage?: string;
  postQueryBeforePaging?: boolean;
  group?: DGroupFilter;
  sorted?: DSort[];
  text?: string;
  skipDefaultTextSearch?: boolean;
  search_fields?: string[];
  skip?: number;
  limit?: number;
  withRecords?: boolean;
  fields?: string;
  inline?: boolean;
  delimiter?: string;
  is_debug?: boolean;
  unionWiths?: string[];
  unionLimit?: number;
}

export interface ListExamTestReportParams {
  _id?: string;
  name?: string;
  createdTime?: string;
  updatedTime?: string;
  creator?: string;
  updater?: string;
  version?: any;
  target_schema?: string;
  segment_schema?: boolean;
  output_schema?: string;
  collection?: string;
  postQuery?: string;
  preQuery?: string;
  withMergeValidation?: boolean;
  mergeValidationScript?: string;
  showMergeError?: boolean;
  mergeErrorMessage?: string;
  postQueryBeforePaging?: boolean;
  group?: DGroupFilter;
  description?: string;
  sorted?: DSort[];
  text?: string;
  skipDefaultTextSearch?: boolean;
  search_fields?: string[];
  skip?: number;
  limit?: number;
  withRecords?: boolean;
  fields?: string;
  inline?: boolean;
  delimiter?: string;
  is_debug?: boolean;
  unionWiths?: string[];
  unionLimit?: number;
}

export interface DGroupFilter {
  id?: string;
  value?: string;
  propType?: string;
  namespace?: string;
  operation?: string;
  customQuery?: string;
  rawFilter?: boolean;
  op?: "AND" | "OR";
  children?: DGroupFilter[];
}

export interface DSort {
  id?: string;
  desc?: boolean;
}

export interface ExamReportData {
  data?: ListExamReportData;
  records?: number;
  summary?: {
    numberOfQuestions?: number;
    totalExamTestResult?: number;
    totalExamTestResultToday?: number;
    totalGold?: number;
  };
}
export interface ListExamReportData {
  _id?: string;
  createdTime?: string;
  groupName?: string;
  name?: string;
  numberOfQuestions?: number;
  tags?: string[];
  totalGold?: number;
  totalPoints?: number;
  totalPointsAsInt?: number;
  testResultReport?: {
    avgScore?: number;
    avgTimeDoTestSeconds?: number;
    maxTimeDoTestSeconds?: number;
    medianScore?: number;
    minTimeDoTestSeconds?: number;
    totalExamTestResult?: number;
    totalExamTestResultToday?: number;
    totalFailed?: number;
    totalPass?: number;
    totalPassPercent?: number;
  };
}

export interface ExamTestReportData {
  data?: ListExamTestReportData;
  records?: number;
  summary?: {
    numberOfQuestions?: number;
    totalExamTestResult?: number;
    totalExamTestResultToday?: number;
    totalGold?: number;
  };
}

export interface ListExamTestReportData {
  _id?: string;
  goldSetting?: { isEnable?: boolean; goldPrice?: number };
  groupName?: string;
  name?: string;
  numberOfQuestions?: number;
  passingSetting?: {
    failMessage?: string;
    passMessage?: string;
    passPointPercent?: number;
  };
  sharingSetting?: "Private" | "Public";
  stateInfo?: {
    approvedState?: "Approved" | "Pending" | "Rejected";
    isLibrary?: boolean;
    lockState?: "Unlock" | "Lock";
    visibleState?: "On" | "Off";
  };
  visibleState?: "Active" | "Inactive";
  tags?: string[];
  testResultReport?: {
    avgScore?: number;
    avgTimeDoTestSeconds?: number;
    maxTimeDoTestSeconds?: number;
    medianScore?: number;
    minTimeDoTestSeconds?: number;
    totalExamTestResult?: number;
    totalExamTestResultToday?: number;
    totalFailed?: number;
    totalPass?: number;
    totalPassPercent?: number;
  };
  totalGold?: number;
  totalPoints?: number;
  totalPointsAsInt?: number;
  validAccessSetting?: {
    ipWhiteLists?: string[];
    validFrom?: string;
    validTo?: string;
  };
}
