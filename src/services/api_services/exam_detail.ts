import { callApi, callStudioAPI } from "./base_api";

export const getExamDetail = async (versionId: any) => {
  var results = await callApi.post(
    `${process.env.NEXT_PUBLIC_API_BC}/apimodel/examversion.get?skip=${0}&limit=${100}`,
    { versionId },
  );

  if (results.code === 0) {
    return results.data;
  }
  return 0;
};

