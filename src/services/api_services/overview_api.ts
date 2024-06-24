import {
  ActivitiesParams,
  ExamCounterParams,
  ExamGetPagingParams,
  OverviewListRevenueParams,
} from "@/data/overview";
import { callApi, callStudioAPI } from "./base_api";

export const overviewGetNum = async (studioId?: string) => {
  const results = await callStudioAPI.get(
    `${process.env.NEXT_PUBLIC_API_STU}/ActivitiesReport/getNum`,
    { params: { studioId } },
  );
  return results;
};

export const overviewActivitiesReport = async (params: ActivitiesParams) => {
  const results = await callStudioAPI.get(
    `${process.env.NEXT_PUBLIC_API_STU}/ActivitiesReport/NumberOfTestsOverTime`,
    { params },
  );
  return results;
};

export const overviewGetRemaining = async () => {
  const results = await callApi.get(
    `${process.env.NEXT_PUBLIC_API_BC}/apimodel/user.number_of_tests_remaining`,
  );
  return results;
};

export const overviewGetTotalExamByExamGroup = async (studioId?: string) => {
  const results = await callStudioAPI.get(
    `${process.env.NEXT_PUBLIC_API_STU}/ActivitiesReport/getTotalExamByExamGroup`,
    { params: { studioId } },
  );
  return results;
};

export const overviewExamCounter = async (data: ExamCounterParams) => {
  const results = await callStudioAPI.post(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/ExamCounter/GetPaging`,
    // `${process.env.NEXT_PUBLIC_API_STU}/api/studio/Exam/GetPaging`,
    data,
  );
  return results;
};

export const overviewExamCounterExcel = async (data: ExamCounterParams) => {
  const results = await callStudioAPI.post(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/ExamCounter/ExportExcel`,
    data,
    { responseType: "blob" },
  );
  return results;
};

export const overviewExamTestCounter = async (data: ExamCounterParams) => {
  const results = await callStudioAPI.post(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/ExamTestCounter/GetPaging`,
    data,
  );
  return results;
};

export const overviewExamTestCounterExcel = async (data: ExamCounterParams) => {
  const results = await callStudioAPI.post(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/ExamTestCounter/ExportExcel`,
    data,
    { responseType: "blob" },
  );
  return results;
};

export const overviewRevenue = async (studioId?: string) => {
  const results = await callApi.post(
    `${process.env.NEXT_PUBLIC_API_BC}/apimodel/goldtransaction.overviewRevenue`,
    { studioId },
  );
  return results;
};

export const overviewListRevenue = async (data?: OverviewListRevenueParams) => {
  const results = await callApi.post(
    `${process.env.NEXT_PUBLIC_API_BC}/apimodel/goldtransaction.overviewListRevenue`,
    data,
  );
  return results;
};

export const overviewListRevenueExel = async (studioId?: string) => {
  const results = await callApi.post(
    `${process.env.NEXT_PUBLIC_API_BC}/apimodel/goldtransaction.excelDowloadOverviewListRevenue`,
    { studioId },
  );
  return results;
};

export const overviewRevenueStu = async (studioId?: string) => {
  const results = await callStudioAPI.get(
    `${process.env.NEXT_PUBLIC_API_STU}/ActivitiesReport/getOverViewRevenue`,
    { params: { studioId } },
  );
  return results;
};

export const overviewExamGetPaging = async (data: ExamGetPagingParams) => {
  const results = await callStudioAPI.post(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/Exam/GetPaging`,
    data,
  );
  return results;
};

export const overviewExamTestGetPaging = async (data: ExamGetPagingParams) => {
  const results = await callStudioAPI.post(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/ExamTest/GetPaging`,
    data,
  );
  return results;
};

export const overviewExamStatiticExcel = async (data: ExamCounterParams) => {
  const results = await callStudioAPI.post(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/Exam/ExportStatisticExcel`,
    data,
    { responseType: "blob" },
  );
  return results;
};

export const overviewExamTestStatiticExcel = async (
  data: ExamCounterParams,
) => {
  const results = await callStudioAPI.post(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/ExamTest/ExportStatisticExcel`,
    data,
    { responseType: "blob" },
  );
  return results;
};
