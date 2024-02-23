import React from "react";
import { APIResults } from "@/data/api_results";
import axios, { AxiosRequestConfig } from "axios";
import i18next from "i18next";

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
