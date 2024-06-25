import { callApi } from "./base_api";

export interface onBoardingTopic {
  name?: string;
  _id?: string;
  parentId?: string;
}

// export interface onBoardingTopicChild {
//   name?: string;
//   _id?: string;
//   parentId?: string;
// }

export const getTopic = async () => {
  return await callApi.get(
    `${process.env.NEXT_PUBLIC_API_BC}/apimodel/onboarding.get_topic`,
    {}
  );
};

export const getTopicChild = async (parentId: any) => {
  return await callApi.post(
    `${process.env.NEXT_PUBLIC_API_BC}/apimodel/onboarding.get_topic_child_level`,
    { parentId }
  );
};

export const getExamTopic = async (topicIds: any) => {
  return await callApi.post(
    `${process.env.NEXT_PUBLIC_API_BC}/apimodel/onboarding.list_exam_by_topic`,
    { topicIds }
  );
};

// export const getExamversion = async (versionId: any) => {
//   return await callApi.post(
//     `${process.env.NEXT_PUBLIC_API_BC}/apimodel/examversion.add_to_studio`,
//     { versionId }
//   );
// };

export const getListExam = async (topicIds: any) => {
  return await callApi.post(
    `${process.env.NEXT_PUBLIC_API_BC}/apimodel/onboarding.list_exam_by_topic`,
    { topicIds }
  );
};

export interface DataGroupChild {
  parent?: {
    id?: string;
    name?: string;
  };
  children?: {
    id?: string;
    name?: string;
  }[];
}

export const getListExamChild = async (data: DataGroupChild[]) => {
  return await callApi.post(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/GroupExam/Import`,
    {
      groupExams: data,
    }
  );
};

export const trained = async () => {
  return await callApi.post(
    `${process.env.NEXT_PUBLIC_API_BC}/apimodel/user.had_been_trained`,
    {}
  );
};
