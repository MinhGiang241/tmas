import { LoginFormData, RegisterFormData } from "@/data/form_interface";
import { APIResults } from "@/data/api_results";
import axios from "axios";

export const registerAccount = async (data: RegisterFormData) => {
  var resultsData = await axios.post(
    `${process.env.NEXT_PUBLIC_API_BC}/apimodel/user.register`,
    data,
  );
  var results = resultsData["data"] as APIResults | undefined;
  console.log("data", results);
  if (results?.code != 0) {
    throw results?.message ?? "";
  }
  return results;
};

export const login = async (data: LoginFormData) => {
  var resultsData = await axios.post(
    `${process.env.NEXT_PUBLIC_API_BC}/apimodel/user.login`,
    data,
  );
  var results = resultsData["data"] as APIResults | undefined;
  console.log("data", results);
  if (results?.code != 0) {
    throw results?.message ?? "";
  }
  return results;
};
