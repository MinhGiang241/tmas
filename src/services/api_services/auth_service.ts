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
  localStorage.setItem("access_token", results["access_token"]);

  return results;
};

export const sendOtpResetPassword = async ({ email }: { email?: string }) => {
  var results = await callApi.post(
    `${process.env.NEXT_PUBLIC_API_BC}/apimodel/user.generate_otp`,
    { mailTo: email },
  );

  return results;
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
    { mailTo, otp },
  );

  return results;
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
    { email, new_pass },
  );

  return results;
};

export const getUserMe = async () => {
  var results = await callApi.get(
    `${process.env.NEXT_PUBLIC_API_BC}/apimodel/user.me`,
  );
  return results;
};
