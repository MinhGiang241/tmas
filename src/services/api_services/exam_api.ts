import {
  ExamGroupData,
  QuestionExcelParams,
  QuestionGroupData,
} from "@/data/exam";
import { callApi, callStudioAPI } from "./base_api";
import { errorToast } from "@/app/components/toast/customToast";
import { APIResults } from "@/data/api_results";
import QuestionGroup from "@/app/exam_group/tabs/QuestionGroup";
import { QuestionType } from "@/data/question";

export const getExamGroupTest = async ({
  text,
  studioId,
}: {
  text?: string;
  studioId?: string;
}) => {
  var results = await callStudioAPI.get(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/GroupExam?Name=${
      text ?? ""
    }&&StudioId=${studioId ?? ""}`,
  );

  return results;
};

export const createExamGroupTest = async (data: any) => {
  var results: APIResults = await callStudioAPI.post(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/GroupExam`,
    data,
  );

  return results;
};

export const updateExamGroupTest = async (data: any) => {
  var results: APIResults = await callStudioAPI.put(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/GroupExam?Id=${data?.id}`,
    data,
  );
  return results;
};

export const deleteExamGroupTest = async (
  data?: ExamGroupData,
  studioId?: string,
) => {
  var results: APIResults = await callStudioAPI.delete(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/GroupExam?Id=${
      data?.id ?? ""
    }&&StudioId=${studioId ?? ""}`,
  );
  return results;
};

export const createChildsGroup = async (data: any) => {
  var results: APIResults = await callStudioAPI.post(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/groupexam/batch`,
    data,
  );
  return results;
};

export const createQuestionGroup = async (data: any) => {
  var results: APIResults = await callStudioAPI.post(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/GroupQuestion`,
    data,
  );

  return results;
};

export const getQuestionGroups = async (text?: string, studioId?: string) => {
  var results: APIResults = await callStudioAPI.get(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/GroupQuestion?Name=${
      text ?? ""
    }&&StudioId=${studioId ?? ""}`,
  );

  return results;
};

export const updateQuestionGroups = async (data?: QuestionGroupData) => {
  var results: APIResults = await callStudioAPI.put(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/GroupQuestion`,
    data,
  );

  return results;
};

export const deleteQuestionGroup = async (
  data?: QuestionGroupData,
  studioId?: string,
) => {
  var results: APIResults = await callStudioAPI.delete(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/GroupQuestion?Id=${
      data?.id ?? ""
    }&&StudioId=${studioId ?? ""}`,
  );

  return results;
};

export const getSuggestValueHastag = async (text?: string) => {
  var results = await callApi.post(
    `${process.env.NEXT_PUBLIC_API_BC}/apimodel/hashtag.search`,
    {
      text,
      types: "job",
      skip: 0,
      limit: 100,
    },
  );
  if (results.code === 0) {
    return results.data;
  }

  return 0;
};

export const readQuestionTemplateExcel = async (
  type?: QuestionType,
  data?: any,
) => {
  var results: APIResults = await callStudioAPI.post(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/ExamQuestionMaster/ReadTemplateExcel`,
    data,
    {
      params: {
        ExpectedQuestionType: type,
      },
    },
  );

  return results;
};

export const importDataQuestionFromExcel = async (
  data: QuestionExcelParams,
) => {
  var results: APIResults = await callStudioAPI.post(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/ExamQuestionMaster/ImportDataFromExcel`,
    data,
  );

  return results;
};

export const downloadQuestionTemplateExcel = async (type: QuestionType) => {
  var qString =
    type != QuestionType.SQL
      ? type == QuestionType.YesNoQuestion
        ? "YesNo"
        : type == QuestionType.MutilAnswer
          ? "MultiAnswer"
          : type
      : "Sql";
  var results: APIResults = await callStudioAPI.get(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/ExamQuestion${qString}/DownloadTemplateExcel`,
    { responseType: "blob" },
  );

  return results;
};
