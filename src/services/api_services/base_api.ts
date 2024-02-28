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
    try {
      var response = await axios.post(url, data, { headers, ...config });
      if (response?.data?.code != 0) {
        return {
          code: response?.data?.code,
          data: response.data?.data ?? response.data,
          message: response.data?.message,
        };
      }
      return {
        code: 0,
        data: response?.data?.data ?? response.data,
        message: response?.data?.message,
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
      if (response?.data?.code != 0) {
        return {
          code: response?.data?.code,
          data: response.data?.data ?? response.data,
          message: response.data?.message,
        };
      }
      return {
        code: 0,
        data: response?.data?.data ?? response.data,
        message: response?.data?.message,
      };
    } catch (error: any) {
      return {
        code: 1,
        message: error.message,
        data: error.message,
      };
    }
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
      var response = await axios.post(url, data, { headers, ...config });
      return {
        code: 0,
        data: response?.data,
        message: response?.status,
      };
    } catch (e: any) {
      return {
        code: 1,
        data: e.message,
        message: e.message,
      };
    }
  };
}

export class callStudioAPI {
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
          data: response.data?.data ?? response.data,
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
          data: response.data?.data ?? response.data,
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
          data: response.data?.data ?? response.data,
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
          data: response.data?.data ?? response.data,
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
