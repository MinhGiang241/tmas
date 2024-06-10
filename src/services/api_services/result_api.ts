import { callStudioAPI } from "./base_api";

export const updateCodingQuestion = async (data: any) => {
    const results = await callStudioAPI.post(
        `${process.env.NEXT_PUBLIC_API_STU}/api/studio/ExamQuestionCoding`,
        data,
    );

    return results;
};
