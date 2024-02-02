import { API_BC } from "@/constants/api_constant";
import { RegisterFormData } from "@/data/form_interface";
import axios from "axios";
import toast from "react-hot-toast";

export const registerAccount = async (data: RegisterFormData) => {
  console.log("api", API_BC);

  return await axios.post(`${API_BC}/apimodel/user.register`, data);
};
