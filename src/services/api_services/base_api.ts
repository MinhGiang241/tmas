import { APIResults } from "@/data/api_results";
import axios, { AxiosRequestConfig } from "axios";

export class callApi {
  static post = async (
    url: string,
    data: any,
    config?: AxiosRequestConfig<any> | undefined,
  ): Promise<any> => {
    var results = await axios.post(url, data, config);
    var resultData = results["data"] as APIResults | undefined;
    if (!resultData) {
      throw "Lỗi kết nối";
    } else if (resultData?.code != 0) {
      throw resultData?.message ?? "";
    }

    return resultData?.data;
  };
  static get = async (
    url: string,
    config?: AxiosRequestConfig<any> | undefined,
  ): Promise<any> => {
    var results = await axios.get(url, config);
    var resultData = results["data"] as APIResults | undefined;
    if (!resultData) {
      throw "Lỗi kết nối";
    } else if (resultData?.code != 0) {
      throw resultData?.message ?? "";
    }

    return resultData?.data;
  };
}
