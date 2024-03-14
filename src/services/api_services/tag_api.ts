import { TagParams } from "@/data/tag";
import { callStudioAPI } from "./base_api";

export const createTag = async (tags: any[]) => {
  const results = await callStudioAPI.post(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/Tag`,
    { names: tags },
  );
  return results;
};

export const getTags = async (params: TagParams) => {
  const results = await callStudioAPI.get(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/Tag`,
    { params },
  );
  return results;
};

export const getTagById = async (id?: string) => {
  const results = await callStudioAPI.get(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/Tag/${id}`,
  );
  return results;
};

export const deleteTags = async (Ids?: string) => {
  const results = await callStudioAPI.delete(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/Tag?Ids=${Ids}`,
  );
  return results;
};

export const deleteById = async (id?: string) => {
  const results = await callStudioAPI.delete(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/${id}`,
  );
  return results;
};
