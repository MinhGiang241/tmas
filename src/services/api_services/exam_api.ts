import { ExamGroupData, QuestionGroupData } from "@/data/exam";
import { callApi, callStudioAPI } from "./base_api";
import { errorToast } from "@/app/components/toast/customToast";
import { APIResults } from "@/data/api_results";
import QuestionGroup from "@/app/exam_group/tabs/QuestionGroup";

export const getExamGroupTest = async ({ text }: { text?: string }) => {
  var results = await callStudioAPI.get(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/GroupExam?Name=${text}`,
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

export const deleteExamGroupTest = async (data?: ExamGroupData) => {
  var results: APIResults = await callStudioAPI.delete(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/GroupExam?Id=${
      data?.id ?? ""
    }`,
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

export const getQuestionGroups = async (text?: string) => {
  var results: APIResults = await callStudioAPI.get(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/GroupQuestion?Name=${
      text ?? ""
    }`,
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

export const deleteQuestionGroup = async (data?: QuestionGroupData) => {
  var results: APIResults = await callStudioAPI.delete(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/GroupQuestion?Id=${data?.id}`,
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
