import { callStudioAPI } from "./base_api";

export const getExamTest = async ({ text }: { text?: string }) => {
  var results = await callStudioAPI.get(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/GroupExam?Name=${text}`,
  );
  return results;
};
