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
