import {
  ExaminationResultParams,
  PagingAdminExamTestResultParams,
} from "@/data/exam";
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
// Admin

export const createAdminExamTestResult = async (
  data: ExaminationResultParams,
) => {
  const results = await callStudioAPI.post(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/AdminExamTestResult`,
    data,
  );
  return results;
};

export const editAdminExamTestResult = async (
  data: ExaminationResultParams,
) => {
  const results = await callStudioAPI.put(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/AdminExamTestResult/${data?.id}`,
    data,
  );
  return results;
};

export const deleteAdminExamTestResult = async (id?: string) => {
  const results = await callStudioAPI.delete(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/AdminExamTestResult/${id}`,
  );
  return results;
};

export const getAdminExamTestResultById = async (id?: string) => {
  const results = await callStudioAPI.get(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/AdminExamTestResult/${id}`,
  );
  return results;
};

export const createListAdminExamTestResult = async (
  items: ExaminationResultParams[],
) => {
  const results = await callStudioAPI.post(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/AdminExamTestResult/CreateList`,
    { items },
  );
  return results;
};

export const updateListAdminExamTestResult = async (
  items: ExaminationResultParams[],
) => {
  const results = await callStudioAPI.put(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/AdminExamTestResult/UpdateList`,
    { items },
  );
  return results;
};

export const getPagingAdminExamTestResult = async (
  data: PagingAdminExamTestResultParams,
) => {
  const results = await callStudioAPI.post(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/AdminExamTestResult/GetPaging`,
    data,
  );
  return results;
};

export const deleteListAdminExamTestResult = async (ids?: string[]) => {
  const results = await callStudioAPI.post(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/AdminExamTestResult/GetPaging/DeleteList`,
    { ids },
  );
  return results;
};
