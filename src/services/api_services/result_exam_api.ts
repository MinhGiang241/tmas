import { ExaminationResultParams } from "@/data/exam";
import { callStudioAPI } from "./base_api";

export const getExamInfo = async (IdExamTestResult: string) => {
  const results = await callStudioAPI.get(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/ExamTestResult/GetExamTestQuestion/${IdExamTestResult}`,
  );
  return results;
};

export const editExamTestResult = async (data: ExaminationResultParams) => {
  const results = await callStudioAPI.put(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/ExamTestResult/${data?.id}`,
    data,
  );
  return results;
};

export const deleteExamTestResult = async (id: string) => {
  const results = await callStudioAPI.delete(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/ExamTestResult/${id}`,
  );
  return results;
};
