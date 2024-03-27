"use client";
import { getQuestionById } from "@/services/api_services/question_api";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

function EditQuestionPage() {
  const [questionDetails, setQuestionDetails] = useState();
  var search = useSearchParams();
  var question = search.get("question");
  var partId = search.get("partId");
  var questId = search.get("questId");

  const getQuestionDetailById = async () => {
    var res = await getQuestionById(questId!);
    console.log("resQuest", res);
  };

  useEffect(() => {
    if (questId) {
      getQuestionDetailById();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>EditQuestionPage</>;
}

export default EditQuestionPage;
