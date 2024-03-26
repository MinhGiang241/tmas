import MDropdown from "@/app/components/config/MDropdown";
import MInput from "@/app/components/config/MInput";
import MTreeSelect from "@/app/components/config/MTreeSelect";
import { ExamGroupData, QuestionGroupData } from "@/data/exam";
import React from "react";
import { useTranslation } from "react-i18next";
import { errorToast, successToast } from "@/app/components/toast/customToast";
import { setQuestionLoading } from "@/redux/questions/questionSlice";
import cheerio from "cheerio";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { FormikErrors, useFormik } from "formik";
import { RandomQuestionFormData } from "@/data/form_interface";
import { createRandomQuestion } from "@/services/api_services/question_api";

interface Props {
  questionGroups?: QuestionGroupData[];
  submitRef?: any;
  idExam?: string;
}

function RandomQuestion({
  questionGroups: examGroups,
  submitRef,
  idExam,
}: Props) {
  const { t } = useTranslation("exam");
  const common = useTranslation();
  const router = useRouter();
  const search = useSearchParams();
  const idExamQuestionPart = search.get("questId");
  const dispatch = useAppDispatch();

  const optionSelect = (examGroups ?? []).map<any>(
    (v: QuestionGroupData, i: number) => ({
      label: v?.name,
      value: v?.id,
    }),
  );

  interface RandomQuestionValue {
    point?: string;
    question_group?: string;
  }

  const initialValues: RandomQuestionValue = {
    point: undefined,
    question_group: undefined,
  };

  const validate = async (values: RandomQuestionValue) => {
    const errors: FormikErrors<RandomQuestionValue> = {};

    if (!values.point) {
      errors.point = "common_not_empty";
    }

    return errors;
  };

  const formik = useFormik({
    initialValues,
    validate,
    onSubmit: async (values: RandomQuestionValue) => {
      dispatch(setQuestionLoading(true));
      const submitData: RandomQuestionFormData = {
        idExam,
        numberPoint: values.point ? parseInt(values.point) : undefined,
        idGroupQuestion: values.question_group,
        idExamQuestionPart: idExamQuestionPart ?? undefined,
        questionType: "Random",
      };

      var res = await createRandomQuestion(submitData);
      dispatch(setQuestionLoading(false));
      if (res.code != 0) {
        errorToast(res?.message ?? "");
        return;
      }
      successToast(t("success_add_question"));
      router.push(`/exams/details/${idExam}`);
    },
  });

  return (
    <div className="grid grid-cols-12 gap-4 max-lg:px-5">
      <button
        className="hidden"
        onClick={() => {
          formik.handleSubmit();
        }}
        ref={submitRef}
      />

      <div className="bg-white rounded-lg lg:col-span-4 col-span-12 p-5 h-fit">
        <MInput
          onKeyDown={(e) => {
            if (!e.key.match(/[0-9]/g) && e.key != "Backspace") {
              e.preventDefault();
            }
          }}
          formik={formik}
          h="h-9"
          name="point"
          id="point"
          required
          title={t("point")}
        />
        <MDropdown
          formik={formik}
          options={optionSelect}
          h="h-9"
          title={t("question_group")}
          placeholder={t("select_question_group")}
          id="question_group"
          name="question_group"
        />
      </div>
      <div className="bg-white rounded-lg lg:col-span-8 col-span-12 p-5 h-fit">
        <div className="body_semibold_14">
          {t("question")}
          <span className="text-m_error_500"> *</span>
        </div>
        <div className="mt-2 border rounded-lg p-3">
          <p className="body_regular_14">
            {t("group_random_quest")}
            <span className="text-[#4D7EFF]">
              {" "}
              {examGroups?.find((a) => a.id === formik.values?.question_group)
                ?.name ?? ""}
            </span>
          </p>
        </div>
        <div className="mt-4 body_semibold_14">{t("guide")}</div>

        <div className="mt-2 border rounded-lg p-3 body_regular_14">
          {t("guide_intro")}
        </div>
      </div>
    </div>
  );
}

export default RandomQuestion;
