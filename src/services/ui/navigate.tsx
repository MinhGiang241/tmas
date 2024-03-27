"use server";
import { QuestionType } from "@/data/form_interface";
import { redirect } from "next/navigation";

export async function navigateRoute(url: string) {
  redirect(url);
}
export const renderQuestTypeRoute = (type?: QuestionType) => {
  switch (type) {
    case "MutilAnswer":
      return "many_results";
    case "YesNoQuestion":
      return "true_false";
    case "Pairing":
      return "connect_quest";
    case "Essay":
      return "explain";
    case "Coding":
      return "coding";
    case "SQL":
      return "sql";
    case "FillBlank":
      return "fill_blank";
    case "Random":
      return "random";
    default:
      return "";
  }
};
