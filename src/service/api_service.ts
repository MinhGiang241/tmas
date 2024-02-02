import { RegisterFormData } from "@/data/form_interface";
import axios from "axios";

export const registerAccount = async (data: RegisterFormData) => {
  return await axios.post(
    `${process.env.NEXT_PUBLIC_API_BC}/apimodel/user.register`,
    data,
  );
};
