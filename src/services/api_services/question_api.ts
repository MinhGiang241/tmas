import {
  CodingQuestionFormData,
  ConnectQuestionFormData,
  DuplicateQuestionParams,
  EssayQuestionFormData,
  ExamQuestionPart,
  FillBlankQuestionFormData,
  ImportTmasExamParams,
  MultiAnswerQuestionFormData,
  PagingGetData,
  RandomQuestionFormData,
  SqlQuestionFormData,
} from "@/data/form_interface";
import { callApi, callStudioAPI } from "./base_api";
import { result } from "lodash";
import axios from "axios";
import { BaseTmasQuestionData } from "@/data/exam";
import { APIResults } from "@/data/api_results";
import { mapTmasQuestionToStudioQuestion } from "../ui/mapTmasToSTudio";
import { BaseQuestionData, QuestionType } from "@/data/question";

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

export const createTrueFalseQuestion = async (
  data: MultiAnswerQuestionFormData,
) => {
  const results = await callStudioAPI.post(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/ExamQuestionYesNo`,
    data,
  );

  return results;
};

export const updateTrueFalseQuestion = async (
  data: MultiAnswerQuestionFormData,
) => {
  const results = await callStudioAPI.put(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/ExamQuestionYesNo`,
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
  const results = await callStudioAPI.post(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/ExamQuestionMaster/Paging`,
    data,
  );

  return results;
};

export const getQuestionById = async (
  questId?: string,
  isQuestionBank?: boolean,
) => {
  const results = await callStudioAPI.get(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/ExamQuestionMaster/${questId}?isQuestionBank=${isQuestionBank}`,
  );

  return results;
};

export const deleteQuestionById = async (questId?: string) => {
  const results = await callStudioAPI.delete(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/ExamQuestionMaster/${questId}`,
  );
  // console.log(results);
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
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/ExamQuestionPart/GetPagingDetail`,
    data,
  );
  // console.log("data results", results);
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
  // console.log("dat", data)
  const results = await callStudioAPI.put(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/ExamQuestionPart/${data?.id}`,
    data,
  );
  return results;
};

export const updateManyExamQuestionPart = async (data?: ExamQuestionPart[]) => {
  const results = await callStudioAPI.post(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/ExamQuestionPart/UpdateList`,
    {
      items: (data ?? []).map((d: ExamQuestionPart) => ({
        id: d?.id,
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
  // console.log(results)
  return results;
};

export const ExamQuestionPartById = async (data?: PagingGetData) => {
  const results = await callStudioAPI.post(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/ExamQuestionPart/GetPagingDetail`,
    data,
  );
  return results;
};

export const CopyQuestion = async (id?: string) => {
  const results = await callStudioAPI.post(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/Exam/Copy/${id}`,
    {},
  );
  return results;
};

export const deleteQuestionPart = async (id?: string) => {
  const results = await callStudioAPI.delete(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/Exam/${id}`,
  );
  // console.log(results)
  return results;
};

export const getExamById = async (id?: string) => {
  const results = await callStudioAPI.get(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/Exam/${id}`,
  );
  return results;
};

export const duplicateQuestion = async (data: DuplicateQuestionParams) => {
  const results = await callStudioAPI.post(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/ExamQuestionMaster/Copy`,
    data,
  );
  return results;
};

export const getTmasQuestList = async ({
  text,
  skip,
  limit,
  type,
  tags,
}: {
  text?: string;
  skip?: number;
  limit?: number;
  fields?: any;
  type?: string;
  tags?: string[];
}) => {
  const results = await callApi.post(
    `${process.env.NEXT_PUBLIC_API_BC}/apimodel/questionbank.search`,
    {
      text: text ?? "",
      skip,
      limit,
      type,
      tags,
    },
  );
  return results;
};

export const cloneQuestionFromTmas = async (question: BaseQuestionData) => {
  var res: APIResults = { data: undefined };
  switch (question?.questionType) {
    case QuestionType.MutilAnswer:
      res = await createMultiAnswerQuestion(question);
      break;
    case QuestionType.YesNoQuestion:
      res = await createTrueFalseQuestion(question);
      break;
    case QuestionType.SQL:
      res = await createSqlQuestion(question);
      break;
    case QuestionType.Essay:
      res = await createEssayQuestion(question);
      break;
    case QuestionType.Coding:
      res = await createCodingQuestion(question);
      break;
    case QuestionType.FillBlank:
      res = await createFillBlankQuestion(question);
      break;
    case QuestionType.Pairing:
      res = await createConnectQuestion(question);
      break;
    case QuestionType.Random:
      res = await createRandomQuestion(question);
      break;
  }
  return res;
};

export const createBatchQuestion = async (items: BaseQuestionData[]) => {
  const results = await callStudioAPI.post(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/ExamQuestionMaster/CreateBatch`,
    { items },
  );
  return results;
};

export const importTmasExamData = async (data: ImportTmasExamParams) => {
  var results = await callStudioAPI.post(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/Exam/Import`,
    data,
  );
  return results;
};

// export const getExamTestId = async (Id?: string | null) => {
//   const results = await callStudioAPI.get(
//     `${process.env.NEXT_PUBLIC_API_STU}/api/studio/ExamTest/${Id}`,
//     { params: { IsIncludeExamVersion: true } },
//   );

//   return results;
// };

export const getExamTestId = async (params: any) => {
  const results = await callStudioAPI.post(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/ExamTest/GetExamVersion`,
    { ...params }, { params }
  );

  return results;
};

export const getExamExport = async (data: any) => {
  const results = await callStudioAPI.post(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/Exam/Export`,
    data
  );
  // console.log(results, "result");

  return results;
};
