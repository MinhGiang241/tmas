import { callApi, callStudioAPI } from "./base_api";

export const overviewGetNum = async () => {
  const results = await callStudioAPI.get(
    `${process.env.NEXT_PUBLIC_API_STU}/ActivitiesReport/getNum`,
  );
  return results;
};
