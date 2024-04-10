import { callApi, callStudioAPI } from "./base_api";

export const getExamDetail = async (versionId: any) => {
    console.log(versionId, "versionId ");

    var results = await callApi.post(
        `${process.env.NEXT_PUBLIC_API_BC}/apimodel/examversion.get?skip=${0}&limit=${100}`, { versionId }
    );
    // console.log(results, "getDataDetail");

    if (results.code === 0) {
        return results.data;
    }
    return 0;
};