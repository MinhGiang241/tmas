import { ExamGroupData } from "@/data/exam";
import { callStudioAPI } from "./base_api";

export const getExamGroupTest = async ({ text }: { text?: string }) => {
  var results = await callStudioAPI.get(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/GroupExam?Name=${text}`,
  );
  return results;
};

export const createExamGroupTest = async (data: ExamGroupData) => {
  var results = await callStudioAPI.post(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/GroupExam`,
    data,
  );
  return results;
};

export const UpdateExamGrouptest = async (data: ExamGroupData) => {
  var results = await callStudioAPI.put(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/GroupExam?Id=${data?.id}`,
    data,
  );
  return results;
};
