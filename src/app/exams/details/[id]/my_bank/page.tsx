/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import MBreadcrumb from "@/app/components/config/MBreadcrumb";
import HomeLayout from "@/app/layouts/HomeLayout";
import { ExamData, QuestionGroupData } from "@/data/exam";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { getExamById } from "@/services/api_services/examination_api";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import MyBankAddTab from "./tabs/MyBankAddTab";
import { getQuestionGroups } from "@/services/api_services/exam_api";
import { setquestionGroupLoading } from "@/redux/exam_group/examGroupSlice";
import TmasExamAdd from "./tabs/TmasAdd";
import { errorToast } from "@/app/components/toast/customToast";
import { APIResults } from "@/data/api_results";
import { getExamQuestionPartList } from "@/services/api_services/question_api";
import { BaseQuestionData } from "@/data/question";
import MButton from "@/app/components/config/MButton";

function AddFromMyBank({ params }: any) {
  const { t } = useTranslation("exam");
  const common = useTranslation();
  const questTrans = useTranslation("question");
  const [exam, setExam] = useState<ExamData | undefined>();
  const user = useAppSelector((state: RootState) => state?.user?.user);
  const dispatch = useAppDispatch();
  const router = useRouter();
  var search = useSearchParams();
  var tab = search.get("tab") ?? "0";
  var partId = search.get("partId");
  var index = ["0", "1"].includes(tab) ? tab : "0";

  const loadExamById = async () => {
    var res = await getExamById(params?.id);
    if (res.code != 0) {
      errorToast(res, res?.message ?? "");
      return;
    }
    setExam(res?.data?.records[0]);
    console.log("exam", exam);
  };
  useEffect(() => {
    loadExamById();
    loadQuestionGroupList();
  }, [user]);

  const questionGroups: QuestionGroupData[] | undefined = useAppSelector(
    (state: RootState) => state?.examGroup?.questions,
  );
  const loadQuestionGroupList = async (init?: boolean) => {
    if (init) {
      dispatch(setquestionGroupLoading(true));
    }
    var dataResults: APIResults = await getQuestionGroups(
      "",
      user?.studio?._id,
    );
    dispatch(setquestionGroupLoading(false));
    if (dataResults.code != 0) {
      return [];
    } else {
      var data = dataResults?.data as QuestionGroupData[];
      return data;
    }
  };
  const [examQuestList, setExamQuestList] = useState<BaseQuestionData[]>([]);
  const getExamQuestionList = async () => {
    const res = await getExamQuestionPartList({
      paging: { startIndex: 1, recordPerPage: 1000 },
      studioSorters: [{ name: "createdTime", isAsc: true }],
      // truyền idexam thay vì ids
      // ids: [params.id],
      idExams: [params.id],
    });
    if (res.code != 0) {
      return;
    }
    const data = res?.data?.records ?? [];
    const list = data.reduce((s: any, i: any) => {
      return [...s, ...(i?.examQuestions ?? [])];
    }, []) as BaseQuestionData[];
    setExamQuestList(list);
  };

  return (
    <HomeLayout>
      <div className="h-4" />
      <div className="w-full flex justify-between items-center">
        <MBreadcrumb
          items={[
            { text: t("exam_list"), href: "/exams" },
            // { text: exam?.name, href: `/exams/details/${exam?.id}` },
            {
              href: `/exams/details/${exam?.id}`,
              text: exam?.name,
              active: true,
            },
            {
              href:
                index === "0"
                  ? `/exams/details/${exam?.id}/my_bank?tab=0`
                  : `/exams/details/${exam?.id}/my_bank?tab=1`,
              text:
                index == "0"
                  ? questTrans.t("add_from_my_bank")
                  : questTrans.t("add_from_tmas"),
              active: true,
            },
          ]}
        />
        <MButton
          className="max-lg:mr-5"
          type="secondary"
          onClick={() => {
            router.back();
          }}
          text={common.t("back")}
        />
      </div>
      <div className="h-3  lg:h-1" />

      <div className="w-full flex border-b-m_neutral_200 h-12 border-b mt-4">
        <button
          onClick={() => {
            router.replace(
              `/exams/details/${params?.id}/my_bank?tab=0&partId=${partId ?? ""
              }`,
            );
          }}
          className={`${index === "0"
              ? "text-m_primary_500 border-b-m_primary_500 border-b-[3px]"
              : "text-m_neutral_500"
            } h-12 text-center lg:min-w-40 px-2 body_semibold_16 lg:px-4 max-lg:w-1/2`}
        >
          {t("my_bank")}
        </button>
        <button
          onClick={() => {
            router.replace(
              `/exams/details/${params?.id}/my_bank?tab=1&partId=${partId ?? ""
              }`,
            );
          }}
          className={`${index === "1"
              ? "text-m_primary_500 border-b-m_primary_500 border-b-[3px]"
              : "text-m_neutral_500"
            } h-12 text-center lg:min-w-40 body_semibold_16 lg:px-4 max-lg:w-1/2 `}
        >
          {t("tmas_bank")}
        </button>
      </div>
      <div className="h-3 " />
      {index === "0" ? (
        <MyBankAddTab
          hidden={index != "0"}
          examQuestList={examQuestList}
          exam={exam}
          partId={partId ?? undefined}
        />
      ) : (
        <TmasExamAdd
          hidden={index != "1"}
          exam={exam}
          partId={partId ?? undefined}
        />
      )}

      <div className="h-3" />
    </HomeLayout>
  );
}

export default AddFromMyBank;
