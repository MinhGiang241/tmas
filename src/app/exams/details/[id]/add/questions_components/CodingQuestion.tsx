import React from "react";
import { useTranslation } from "react-i18next";

function CodingQuestion() {
  const { t } = useTranslation("exam");
  const common = useTranslation();
  return <div>CodingQuestions</div>;
}

export default CodingQuestion;
