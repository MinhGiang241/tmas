import { ParamGetExamList } from "@/data/form_interface";
import { callApi } from "./base_api";

export enum ExaminationVersionState {
  Pending = "Pending",
  Approved = "Approved",
  Rejected = "Rejected",
}

interface ParamsGetExamVersion {
  skip: number;
  limit: number;
  text?: string;
  state?: ExaminationVersionState;
  from_date?: string;
  to_date?: string;
}

export const getExaminationVersionList = async (
  params: ParamsGetExamVersion
) => {
  const results = await callApi.get(
    `${process.env.NEXT_PUBLIC_API_BC}/apimodel/examversion.search_by_studio`,
    { params }
  );

  return results;
};

interface ParamsCreateExamVersion {
  name: string;
  group_name: string;
  examId: string;
  data: any;
}

export const createExaminationVersion = async (
  params: ParamsCreateExamVersion
) => {
  const results = await callApi.post(
    `${process.env.NEXT_PUBLIC_API_BC}/apimodel/examversion.create_version`,
    params
  );

  return results;
};
