import { callApi } from "./base_api";

export interface onBoardingTopic {
  name?: string;
  _id?: string;
}

export interface onBoardingTopicChild {
  name?: string;
  _id?: string;
}

export const getTopic = async () => {
  return await callApi.get(
    `${process.env.NEXT_PUBLIC_API_BC}/apimodel/onboarding.get_topic`,
    {}
  );
};

export const getTopicChild = async () => {
  return await callApi.get(
    `${process.env.NEXT_PUBLIC_API_BC}/apimodel/onboarding.get_topic_child_level`,
    {}
  );
};
