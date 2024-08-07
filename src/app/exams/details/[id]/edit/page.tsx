"use client";
import HomeLayout from "@/app/layouts/HomeLayout";
import LoadingPage from "@/app/loading";
import { APIResults } from "@/data/api_results";
import { getQuestionById } from "@/services/api_services/question_api";
import { redirect, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import CreateQuestionPage from "../add/page";
import { type } from "os";
import { BaseQuestionFormData, QuestionType } from "@/data/form_interface";
import { useRouter } from "next/navigation";
import { renderQuestTypeRoute } from "@/services/ui/navigate";
import { useOnMountUnsafe } from "@/services/ui/useOnMountUnsafe";

function EditQuestionPage({ params }: any) {
  const [questionDetails, setQuestionDetails] = useState<
    BaseQuestionFormData | undefined
  >();
  var search = useSearchParams();
  var question = search.get("question");
  var isBank = search.get("isBank");
  var partId = search.get("partId");
  var questId = search.get("questId");
  console.log("isBank", isBank);

  const router = useRouter();

  const getQuestionDetailById = async () => {
    console.log({ isBank });

    var results: APIResults = await getQuestionById(questId!, isBank == "true");

    if (results.code != 0) {
      return;
    }
    if (results?.data?.records && results?.data?.records?.length != 0) {
      setQuestionDetails(results?.data?.records[0]);
    }

    const type = await renderQuestTypeRoute(
      results?.data?.records[0]?.questionType, //results?.data?.records[0]?.questionType,
    );

    router.replace(
      `edit/?partId=${
        results?.data?.records[0]?.idExamQuestionPart ?? partId ?? ""
      }&questId=${results?.data?.records[0]?.id}&question=${type}&isBank=${
        isBank == "true"
      }`,
    );

    console.log("resQuest", results);
  };
  useOnMountUnsafe(() => {
    if (questId) {
      getQuestionDetailById();
    }
  });

  return (
    <>
      {!questionDetails ? (
        <HomeLayout>
          <LoadingPage />
        </HomeLayout>
      ) : (
        <CreateQuestionPage params={params} question={questionDetails} />
      )}
    </>
  );
}

export default EditQuestionPage;
