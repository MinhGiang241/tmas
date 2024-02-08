import { LoginFormData, RegisterFormData } from "@/data/form_interface";
import { callApi } from "./base_api";

export const registerAccount = async (data: RegisterFormData) => {
  var results = await callApi.post(
    `${process.env.NEXT_PUBLIC_API_BC}/apimodel/user.register`,
    data,
  );
  return results;
};

export const login = async (data: LoginFormData) => {
  var results = await callApi.post(
    `${process.env.NEXT_PUBLIC_API_BC}/apimodel/user.login`,
    data,
  );

  return results;
};

export const sendOtpResetPassword = async ({ email }: { email?: string }) => {
  var result = await callApi.post(
    `${process.env.NEXT_PUBLIC_API_BC}/apimodel/authorization.generate_otp`,
    { mailTo: email },
  );

  return result;
};

export const verifyOtp = async ({
  mailTo,
  otp,
}: {
  mailTo?: string;
  otp?: string;
}) => {
  var result = await callApi.post(
    `${process.env.NEXT_PUBLIC_API_BC}/apimodel/authorization.verify_otp`,
    { mailTo, otp },
  );

  return result;
};

export const createNewPass = async ({
  email,
  new_pass,
}: {
  email?: string;
  new_pass?: string;
}) => {
  var result = await callApi.post(
    `${process.env.NEXT_PUBLIC_API_BC}/apimodel/authorization.create_new_pass`,
    { email, new_pass },
  );

  return result;
};
