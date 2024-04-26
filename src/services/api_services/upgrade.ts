import { callApi } from "./base_api";

export const loadPackage = async () => {
    const results = await callApi.post(
        `${process.env.NEXT_PUBLIC_API_BC}/apimodel/package.get_individual?skip=${0}&limit=${100}`,
        {},
    );
    return results;
};