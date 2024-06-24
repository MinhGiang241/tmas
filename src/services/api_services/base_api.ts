import React from "react";
import { APIResults } from "@/data/api_results";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import i18next from "i18next";
import { errorToast, successToast } from "@/app/components/toast/customToast";
import { navigate } from "../ui/useRedirect";

export class callApi {
  static post = async function (
    url: string,
    data: any,
    config?: AxiosRequestConfig<any> | undefined,
  ): Promise<any> {
    const token =
      sessionStorage.getItem("access_token") ??
      localStorage.getItem("access_token");
    var headers = {
      Lang: i18next.language == "en" ? "en_US" : "vi_VN",
      Authorization: token ? `Bearer ${token}` : null,
    };
    try {
      var response = await axios.post(url, data, { headers, ...config });
      if (response?.data?.code == 2) {
        navigate("/signin");
        // successToast(i18next.t("error"));
      }

      if (response?.data?.code != 0) {
        return {
          code: response?.data?.code,
          data: response.data?.data ?? response.data,
          message: response.data?.message,
          records: response?.data?.records,
          dataTotal: response?.data?.dataTotal,
        };
      }

      return {
        code: 0,
        data: response?.data?.data ?? response.data,
        message: response?.data?.message,
        records: response?.data?.records,
        dataTotal: response?.data?.dataTotal,
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
    const token =
      sessionStorage.getItem("access_token") ??
      localStorage.getItem("access_token");
    var headers = {
      Lang: i18next.language == "en" ? "en_US" : "vi_VN",
      Authorization: token ? `Bearer ${token}` : null,
    };

    try {
      var response = await axios.get(url, { headers, ...config });
      if (response?.data?.code == 2) {
        navigate("/signin");
        // successToast(i18next.t("error"));
      }
      if (response?.data?.code != 0) {
        return {
          code: response?.data?.code,
          data: response.data?.data ?? response.data,
          message: response.data?.message,
          records: response?.data?.records,
        };
      }
      return {
        ...response.data,
        code: 0,
        data: response?.data?.data ?? response.data,
        message: response?.data?.message,
        records: response?.data?.records,
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
    const token =
      sessionStorage.getItem("access_token") ??
      localStorage.getItem("access_token");
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
    const token =
      sessionStorage.getItem("access_token") ??
      localStorage.getItem("access_token");
    var headers: any = {
      Lang: i18next.language,
      Authorization: token ? `Bearer ${token}` : null,
    };
    try {
      var response = await axios.post(url, data, { headers, ...config });

      if (response?.data?.isSuccess === false) {
        return {
          response: response.data,
          code: 1,
          data: response.data?.data ?? response.data,
          message: response.data.errors?.map((c: any) => c.message)?.join(". "),
        };
      } else if (response.status === 200) {
        return {
          code: 0,
          data: response?.data?.data ?? response.data,
          response: response.data,
        };
      }

      return {
        code: 1,
        data: response.statusText,
        message: response.statusText,
        response: response.data,
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
    const token =
      sessionStorage.getItem("access_token") ??
      localStorage.getItem("access_token");
    var headers = {
      Lang: i18next.language,
      Authorization: token ? `Bearer ${token}` : null,
    };
    try {
      var response = await axios.get(url, { headers, ...config });
      if (response?.data?.isSuccess === false) {
        return {
          code: 1,
          data: response.data?.data ?? response.data,
          message: response.data.errors?.map((c: any) => c.message)?.join(". "),
          response: response.data,
        };
      } else if (response.status === 200) {
        return {
          code: 0,
          data: response?.data?.data ?? response.data,
          response: response.data,
        };
      }

      return {
        code: 1,
        data: response.statusText,
        message: response.statusText,
        response: response.data,
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
    const token =
      sessionStorage.getItem("access_token") ??
      localStorage.getItem("access_token");
    var headers: any = {
      Lang: i18next.language,
      Authorization: token ? `Bearer ${token}` : null,
    };
    try {
      var response = await axios.put(url, data, { headers, ...config });
      if (response?.data?.isSuccess === false) {
        return {
          code: 1,
          data: response.data?.data ?? response.data,
          message: response.data.errors?.map((c: any) => c.message)?.join(". "),
          response: response.data,
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
        response: response.data,
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
    const token =
      sessionStorage.getItem("access_token") ??
      localStorage.getItem("access_token");
    var headers: any = {
      Lang: i18next.language,
      Authorization: token ? `Bearer ${token}` : null,
    };

    try {
      var response = await axios.delete(url, { headers, ...config });
      if (response?.data?.isSuccess === false) {
        return {
          code: 1,
          data: response.data?.data ?? response.data,
          message: response.data.errors?.map((c: any) => c.message)?.join(". "),
          response: response.data,
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
        response: response.data,
      };
    } catch (error: any) {
      return {
        code: 1,
        message: error.message,
        data: error.message,
      };
    }
  };

  static download = async function (
    url: string,
    config?: AxiosRequestConfig<any> | undefined,
  ): Promise<any> {
    const token =
      sessionStorage.getItem("access_token") ??
      localStorage.getItem("access_token");
    var headers: any = {
      Lang: i18next.language,
      Authorization: token ? `Bearer ${token}` : null,
    };

    try {
      var response = await axios.get(url, { headers, ...config });

      if (response.status == 200) {
        return {
          code: 0,
          data: response?.data,
        };
      }
    } catch (error: any) {
      return {
        code: 1,
        message: error.message,
        data: error.message,
      };
    }
  };
}
