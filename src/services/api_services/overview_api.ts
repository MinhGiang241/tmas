import { ActivitiesParams } from "@/data/overview";
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
