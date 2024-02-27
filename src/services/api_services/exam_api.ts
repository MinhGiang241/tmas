import { ExamGroupData } from "@/data/exam";
import { callStudioAPI } from "./base_api";
import { errorToast } from "@/app/components/toast/customToast";

export const getExamGroupTest = async ({ text }: { text?: string }) => {
  var results = await callStudioAPI.get(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/GroupExam?Name=${text}`,
  );
  return results;
};

export const createExamGroupTest = async (data: any) => {
  var results = await callStudioAPI.newPost(
    `${process.env.NEXT_PUBLIC_API_STU}/dasdasapi/studio/GroupExam`,
    data,
  );
  console.log("sasda", results);

  return results;
};

export const updateExamGroupTest = async (data: any) => {
  var results = await callStudioAPI.put(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/GroupExam?Id=${data?.id}`,
    data,
  );
  return results;
};

export const deleteExamGroupTest = async (data?: ExamGroupData) => {
  var results = await callStudioAPI.delete(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/GroupExam?Id=${
      data?.id ?? ""
    }`,
  );
  return results;
};
