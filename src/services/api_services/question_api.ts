import {
  CodingQuestionFormData,
  ConnectQuestionFormData,
  EssayQuestionFormData,
  ExamQuestionPart,
  FillBlankQuestionFormData,
  MultiAnswerQuestionFormData,
  PagingGetData,
  RandomQuestionFormData,
  SqlQuestionFormData,
} from "@/data/form_interface";
import { callStudioAPI } from "./base_api";
import { result } from "lodash";

export const createCodingQuestion = async (data: CodingQuestionFormData) => {
  const results = await callStudioAPI.post(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/ExamQuestionCoding`,
    data,
  );

  return results;
};

export const updateCodingQuestion = async (data: CodingQuestionFormData) => {
  const results = await callStudioAPI.put(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/ExamQuestionCoding`,
    data,
  );

  return results;
};

export const createEssayQuestion = async (data: EssayQuestionFormData) => {
  const results = await callStudioAPI.post(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/ExamQuestionEssay`,
    data,
  );

  return results;
};

export const updateEssayQuestion = async (data: EssayQuestionFormData) => {
  const results = await callStudioAPI.put(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/ExamQuestionEssay`,
    data,
  );

  return results;
};

export const createFillBlankQuestion = async (
  data: FillBlankQuestionFormData,
) => {
  const results = await callStudioAPI.post(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/ExamQuestionFillBlank`,
    data,
  );

  return results;
};

export const updateFillBlankQuestion = async (
  data: FillBlankQuestionFormData,
) => {
  const results = await callStudioAPI.put(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/ExamQuestionFillBlank`,
    data,
  );

  return results;
};

export const createMultiAnswerQuestion = async (
  data: MultiAnswerQuestionFormData,
) => {
  const results = await callStudioAPI.post(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/ExamQuestionMultiAnswer`,
    data,
  );

  return results;
};

export const updateMultiAnswerQuestion = async (
  data: MultiAnswerQuestionFormData,
) => {
  const results = await callStudioAPI.put(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/ExamQuestionMultiAnswer`,
    data,
  );

  return results;
};

export const createConnectQuestion = async (data: ConnectQuestionFormData) => {
  const results = await callStudioAPI.post(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/ExamQuestionPairing`,
    data,
  );

  return results;
};

export const updateConnectQuestion = async (data: ConnectQuestionFormData) => {
  const results = await callStudioAPI.put(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/ExamQuestionPairing`,
    data,
  );

  return results;
};

export const createRandomQuestion = async (data: RandomQuestionFormData) => {
  const results = await callStudioAPI.post(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/ExamQuestionRandom`,
    data,
  );

  return results;
};

export const updateRandomQuestion = async (data: RandomQuestionFormData) => {
  const results = await callStudioAPI.put(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/ExamQuestionRandom`,
    data,
  );

  return results;
};

export const createSqlQuestion = async (data: SqlQuestionFormData) => {
  const results = await callStudioAPI.post(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/ExamQuestionSql`,
    data,
  );

  return results;
};

export const updateSqlQuestion = async (data: SqlQuestionFormData) => {
  const results = await callStudioAPI.put(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/ExamQuestionSql`,
    data,
  );

  return results;
};

export const getQuestionList = async (data: PagingGetData) => {
  const results = await callStudioAPI.put(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/ExamQuestionMaster/Paging`,
    data,
  );

  return results;
};

export const getQuestionById = async (questId?: string) => {
  const results = await callStudioAPI.get(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/ExamQuestionMaster/${questId}`,
  );

  return results;
};

export const deleteQuestionById = async (questId?: string) => {
  const results = await callStudioAPI.delete(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/ExamQuestionMaster/${questId}`,
  );
  console.log(results)
  return results;
};

export const deleteManyQuestion = async (data: { ids?: string[] }) => {
  const results = await callStudioAPI.post(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/ExamQuestionMaster/PostDelete`,
    data,
  );

  return results;
};

export const getExamQuestionPartList = async (data?: PagingGetData) => {
  const results = await callStudioAPI.post(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/ExamQuestionPart/GetPaging`,
    data,
  );

  return results;
};

export const createAExamQuestionPart = async (data?: ExamQuestionPart) => {
  const results = await callStudioAPI.post(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/ExamQuestionPart`,
    data,
  );

  return results;
};

export const createManyExamQuestionPart = async (data?: {
  items?: ExamQuestionPart[];
}) => {
  const results = await callStudioAPI.post(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/ExamQuestionPart/CreateList`,
    data,
  );

  return results;
};

export const updateAExamQuestionPart = async (data?: ExamQuestionPart) => {
  const results = await callStudioAPI.post(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/ExamQuestionPart/${data?._id}`,
    data,
  );

  return results;
};

export const updateManyExamQuestionPart = async (data?: ExamQuestionPart[]) => {
  const results = await callStudioAPI.post(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/ExamQuestionPart/UpdateList`,
    {
      items: (data ?? []).map((d: ExamQuestionPart) => ({
        id: d?._id,
        content: {
          name: d?.name,
          description: d?.description,
        },
      })),
    },
  );

  return results;
};

export const getExamQuestionPartById = async (examPartId?: string) => {
  const results = await callStudioAPI.get(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/ExamQuestionPart/${examPartId}`,
  );

  return results;
};

export const deleteQuestionPartById = async (id?: string) => {
  const results = await callStudioAPI.delete(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/ExamQuestionPart/${id}`,
  );
  console.log(results)
  return results;
};