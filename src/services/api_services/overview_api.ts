import {
  ActivitiesParams,
  ExamCounterData,
  OverviewListRevenueParams,
} from "@/data/overview";
import { callApi, callStudioAPI } from "./base_api";

export const overviewGetNum = async () => {
  const results = await callStudioAPI.get(
    `${process.env.NEXT_PUBLIC_API_STU}/ActivitiesReport/getNum`,
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

export const overviewGetTotalExamByExamGroup = async () => {
  const results = await callStudioAPI.get(
    `${process.env.NEXT_PUBLIC_API_STU}/ActivitiesReport/getTotalExamByExamGroup`,
  );
  return results;
};

export const overviewExamCounter = async (data: ExamCounterData) => {
  const results = await callStudioAPI.post(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/ExamCounter/GetPaging`,
    data,
  );
  return results;
};

export const overviewExamCounterExcel = async (data: ExamCounterData) => {
  const results = await callStudioAPI.post(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/ExamCounter/ExportExcel`,
    data,
    { responseType: "blob" },
  );
  return results;
};

export const overviewExamTestCounter = async (data: ExamCounterData) => {
  const results = await callStudioAPI.post(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/ExamTestCounter/GetPaging`,
    data,
  );
  return results;
};

export const overviewExamTestCounterExcel = async (data: ExamCounterData) => {
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

export const overviewListRevenueExell = async (studioId?: string) => {
  const results = await callApi.post(
    `${process.env.NEXT_PUBLIC_API_BC}/apimodel/goldtransaction.excelDowloadOverviewListRevenue`,
    { studioId },
  );
  return results;
};
