import { LoginFormData, RegisterFormData } from "@/data/form_interface";
import { callApi } from "./base_api";
import { setToken } from "@/utils/cookies";

export const registerAccount = async (data: RegisterFormData) => {
  var results = await callApi.post(
    `${process.env.NEXT_PUBLIC_API_BC}/apimodel/user.register`,
    data
  );
  if (results?.code != 0) {
    throw results?.message ?? "";
  }
  return results.data;
};

export const login = async (data: LoginFormData) => {
  var results = await callApi.post(
    `${process.env.NEXT_PUBLIC_API_BC}/apimodel/user.login`,
    data
  );

  setToken(results?.data["access_token"]);

  // if (results?.code != 0) {
  //   throw results?.message ?? "";
  // }
  return results;
};

export const sendOtpResetPassword = async ({ email }: { email?: string }) => {
  var results = await callApi.post(
    `${process.env.NEXT_PUBLIC_API_BC}/apimodel/user.generate_otp`,
    { mailTo: email }
  );

  if (results?.code != 0) {
    throw results?.message ?? "";
  }
  return results.data;
};

export const verifyOtp = async ({
  mailTo,
  otp,
}: {
  mailTo?: string;
  otp?: string;
}) => {
  var results = await callApi.post(
    `${process.env.NEXT_PUBLIC_API_BC}/apimodel/user.verify_otp`,
    { mailTo, otp }
  );

  if (results?.code != 0) {
    throw results?.message ?? "";
  }
  return results.data;
};

export const createNewPass = async ({
  email,
  new_pass,
}: {
  email?: string;
  new_pass?: string;
}) => {
  var results = await callApi.post(
    `${process.env.NEXT_PUBLIC_API_BC}/apimodel/user.create_new_pass`,
    { email, new_pass }
  );

  if (results?.code != 0) {
    throw results?.message ?? "";
  }
  return results.data;
};

export const getUserMe = async () => {
  var results = await callApi.get(
    `${process.env.NEXT_PUBLIC_API_BC}/apimodel/user.me`
  );
  if (results?.code != 0) {
    throw results?.message ?? "";
  }
  return results.data;
};
