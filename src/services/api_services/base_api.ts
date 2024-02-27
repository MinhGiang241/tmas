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
  static oldpost = async function (
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

  static post = async function (
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
      console.log("res", response);

      if (response?.data?.isSuccess === false) {
        return {
          code: 1,
          data: response.data?.data,
          message: response.data.errors?.map((c: any) => c.message)?.join(". "),
        };
      } else if (response.status === 200) {
        return {
          code: 0,
          data: response?.data?.data ?? response.data,
        };
      }

      return {
        code: 1,
        data: response.statusText,
        message: response.statusText,
      };
    } catch (error: any) {
      return {
        code: 1,
        message: error.message,
        data: error.message,
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
    try {
      var response = await axios.get(url, { headers, ...config });
      if (response?.data?.isSuccess === false) {
        return {
          code: 1,
          data: response.data?.data,
          message: response.data.errors?.map((c: any) => c.message)?.join(". "),
        };
      } else if (response.status === 200) {
        return {
          code: 0,
          data: response?.data?.data ?? response.data,
        };
      }

      return {
        code: 1,
        data: response.statusText,
        message: response.statusText,
      };
    } catch (error: any) {
      return {
        code: 1,
        message: error.message,
        data: error.message,
      };
    }
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
    try {
      var response = await axios.put(url, data, { headers, ...config });
      if (response?.data?.isSuccess === false) {
        return {
          code: 1,
          data: response.data?.data,
          message: response.data.errors?.map((c: any) => c.message)?.join(". "),
        };
      } else if (response.status === 200) {
        return {
          code: 0,
          data: response?.data?.data ?? response.data,
        };
      }

      return {
        code: 1,
        data: response.statusText,
        message: response.statusText,
      };
    } catch (error: any) {
      return {
        code: 1,
        message: error.message,
        data: error.message,
      };
    }
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

    try {
      var response = await axios.delete(url, { headers, ...config });
      if (response?.data?.isSuccess === false) {
        return {
          code: 1,
          data: response.data?.data,
          message: response.data.errors?.map((c: any) => c.message)?.join(". "),
        };
      } else if (response.status === 200) {
        return {
          code: 0,
          data: response?.data?.data ?? response.data,
        };
      }

      return {
        code: 1,
        data: response.statusText,
        message: response.statusText,
      };
    } catch (error: any) {
      return {
        code: 1,
        message: error.message,
        data: error.message,
      };
    }
  };
}
