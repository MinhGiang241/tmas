import React from "react";
import { APIResults } from "@/data/api_results";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import i18next from "i18next";
import { errorToast } from "@/app/components/toast/customToast";

export class callApi {
  static post = async function (
    url: string,
    data: any,
    config?: AxiosRequestConfig<any> | undefined,
  ): Promise<any> {
    const token = localStorage.getItem("access_token");
    var headers = {
      Lang: i18next.language == "en" ? "en_US" : "vi_VN",
      Authorization: token ? `Bearer ${token}` : null,
    };
    var results = await axios.post(url, data, { headers, ...config });
    var resultData = results["data"] as APIResults | undefined;
    if (!resultData) {
      throw i18next.language == "vi" ? "Lỗi kết nối" : "Connection Error";
    } else if (resultData?.code != 0) {
      throw resultData?.message ?? "";
    }

    return resultData?.data;
  };
  static get = async function (
    url: string,
    config?: AxiosRequestConfig<any> | undefined,
  ): Promise<any> {
    const token = localStorage.getItem("access_token");
    var headers = {
      Lang: i18next.language == "en" ? "en_US" : "vi_VN",
      Authorization: token ? `Bearer ${token}` : null,
    };

    var results = await axios.get(url, { headers, ...config });
    var resultData = results["data"] as APIResults | undefined;
    if (!resultData) {
      throw i18next.language == "vi" ? "Lỗi kết nối" : "Connection Error";
    } else if (resultData?.code != 0) {
      throw resultData?.message ?? "";
    }

    return resultData?.data;
  };

  static upload = async function (
    url: string,
    data: any,
    config?: AxiosRequestConfig<any> | undefined,
  ) {
    const token = localStorage.getItem("access_token");
    var headers = {
      Lang: i18next.language == "en" ? "en_US" : "vi_VN",
      Authorization: token ? `Bearer ${token}` : null,
    };
    try {
      var results = await axios.post(url, data, { headers, ...config });
      return results;
    } catch (e) {
      throw e;
    }
  };
}

export class callStudioAPI {
  static post = async function (
    url: string,
    data: any,
    config?: AxiosRequestConfig<any> | undefined,
  ): Promise<any> {
    const token = localStorage.getItem("access_token");
    var headers: any = {
      Lang: i18next.language == "en" ? "en_US" : "vi_VN",
      Authorization: token ? `Bearer ${token}` : null,
    };
    try {
      var results = await axios.post(url, data, { headers, ...config });
      console.log("postError", results);

      if (results.status != 200) {
        throw new Error(results.statusText);
      } else if (results?.data?.isSuccess == false) {
        throw new Error(
          results?.data.errors?.map((c: any) => c.message)?.join(". "),
        );
      }

      return results.data;
    } catch (e: any) {
      throw e.message;
    }
  };

  static newPost = async function (
    url: string,
    data: any,
    config?: AxiosRequestConfig<any> | undefined,
  ) {
    const token = localStorage.getItem("access_token");
    var headers: any = {
      Lang: i18next.language == "en" ? "en_US" : "vi_VN",
      Authorization: token ? `Bearer ${token}` : null,
    };
    try {
      var response = await axios.post(url, data, { headers, ...config });
      return {
        code: 0,
        status: response.status,
        data: response.data,
      };
    } catch (error: any) {
      errorToast(error.message);
      return {
        code: 1,
        status: error.status,
        data: error.response,
      };
    }
  };

  static get = async function (
    url: string,
    config?: AxiosRequestConfig<any> | undefined,
  ): Promise<any> {
    const token = localStorage.getItem("access_token");
    var headers = {
      Lang: i18next.language == "en" ? "en_US" : "vi_VN",
      Authorization: token ? `Bearer ${token}` : null,
    };
    var results = await axios.get(url, { headers, ...config });
    console.log("sdada", results);

    if (results.status != 200) {
      throw results.statusText;
    }
    if (results?.data?.isSuccess == false) {
      throw results?.data.errors?.map((c: any) => c.message)?.join(". ");
    }
    return results.data;
  };

  static put = async function (
    url: string,
    data: any,
    config?: AxiosRequestConfig<any> | undefined,
  ): Promise<any> {
    const token = localStorage.getItem("access_token");
    var headers: any = {
      Lang: i18next.language == "en" ? "en_US" : "vi_VN",
      Authorization: token ? `Bearer ${token}` : null,
    };
    var results = await axios.put(url, data, { headers, ...config });
    if (results.status != 200) {
      throw results.statusText;
    }
    if (results?.data?.isSuccess == false) {
      throw results?.data.errors?.map((c: any) => c.message)?.join(". ");
    }

    return results.data;
  };

  static delete = async function (
    url: string,
    config?: AxiosRequestConfig<any> | undefined,
  ): Promise<any> {
    const token = localStorage.getItem("access_token");
    var headers: any = {
      Lang: i18next.language == "en" ? "en_US" : "vi_VN",
      Authorization: token ? `Bearer ${token}` : null,
    };
    var results = await axios.delete(url, { headers, ...config });
    if (results.status != 200) {
      throw results.statusText;
    }
    if (results?.data?.isSuccess == false) {
      throw results?.data.errors?.map((c: any) => c.message)?.join(". ");
    }

    return results.data;
  };
}
