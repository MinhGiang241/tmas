import { ExamFormData, ParamGetExamList } from "@/data/form_interface";
import { callStudioAPI } from "./base_api";
import { ExamData } from "@/data/exam";

export const createExaminationList = async (data: ExamFormData) => {
  const results = await callStudioAPI.post(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/Exam`,
    data,
  );

  return results;
};

export const getExaminationList = async (params: ParamGetExamList) => {
  const results = await callStudioAPI.get(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/Exam`,
    { params },
  );

  return results;
};

export const getAllExaminationList = async (Id?: string, StudioId?: string) => {
  const results = await callStudioAPI.get(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/Exam/${StudioId}/${Id}`,
  );

  return results;
};

export const deleteExamination = async (Id?: string) => {
  const results = await callStudioAPI.delete(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/Exam/${Id}`,
  );

  return results;
};

export const getExamById = async (Id?: string) => {
  const results = await callStudioAPI.get(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/Exam/${Id}`,
  );

  return results;
};

export const updateExam = async (data?: ExamFormData) => {
  const results = await callStudioAPI.put(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/Exam`,
    data,
  );

  return results;
};
