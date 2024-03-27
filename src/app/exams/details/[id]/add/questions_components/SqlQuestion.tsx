import MButton from "@/app/components/config/MButton";
import MDropdown from "@/app/components/config/MDropdown";
import MInput from "@/app/components/config/MInput";
import dynamic from "next/dynamic";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { ExamGroupData, QuestionGroupData } from "@/data/exam";
import MTreeSelect from "@/app/components/config/MTreeSelect";
import { sql } from "@codemirror/lang-sql";
import { useAppDispatch } from "@/redux/hooks";
import { useRouter, useSearchParams } from "next/navigation";
import cheerio from "cheerio";
import { FormikErrors, useFormik } from "formik";
import { SqlQuestionFormData } from "@/data/form_interface";
import { createSqlQuestion } from "@/services/api_services/question_api";
import { setQuestionLoading } from "@/redux/questions/questionSlice";
import { errorToast, successToast } from "@/app/components/toast/customToast";

const EditorHook = dynamic(
  () => import("@/app/exams/components/react_quill/EditorWithUseQuill"),
  {
    ssr: false,
  },
);

interface Props {
  questionGroups?: QuestionGroupData[];
  submitRef?: any;
  idExam?: string;
}

function SqlQuestion({ questionGroups: examGroups, submitRef, idExam }: Props) {
  const { t } = useTranslation("exam");
  const common = useTranslation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const search = useSearchParams();
  const idExamQuestionPart = search.get("partId");

  const optionSelect = (examGroups ?? []).map<any>(
    (v: QuestionGroupData, i: number) => ({
      label: v?.name,
      value: v?.id,
    }),
  );

  interface SqlQuestionValue {
    point?: string;
    question_group?: string;
    question?: string;
    explain?: string;
  }

  const initialValues: SqlQuestionValue = {
    point: undefined,
    question_group: undefined,
    question: undefined,
    explain: undefined,
  };

  const validate = async (values: SqlQuestionValue) => {
    const errors: FormikErrors<SqlQuestionValue> = {};
    const $ = cheerio.load(values.question ?? "");

    if (!values.question || !$.text()) {
      errors.question = "common_not_empty";
    }

    if (!values.point) {
      errors.point = "common_not_empty";
    }
    return errors;
  };
  const [schemaSql, setSchemaSql] = useState<string | undefined>();
  const [expectedOutput, setExpectedOutput] = useState<string | undefined>();

  const formik = useFormik({
    initialValues,
    validate,
    onSubmit: async (values: SqlQuestionValue) => {
      dispatch(setQuestionLoading(true));
      const submitData: SqlQuestionFormData = {
        idExam,
        question: values?.question,
        numberPoint: values.point ? parseInt(values.point) : undefined,
        idGroupQuestion: values.question_group,
        idExamQuestionPart: idExamQuestionPart ?? undefined,
        content: {
          schemaSql,
          expectedOutput,
          explainAnswer: values.explain,
        },
      };

      var res = await createSqlQuestion(submitData);
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
        <EditorHook
          formik={formik}
          placeholder={t("enter_content")}
          isCount={false}
          required
          id="question"
          name="question"
          title={t("question")}
        />
        <div className="w-full items-center my-3 flex">
          <div className="body_semibold_14">
            {t("schema")}
            <span className="text-m_error_500"> *</span>
          </div>
          <div className="flex-1" />
          <MButton h="h-11" className="min-w-28" text={t("test")} />
        </div>

        <div className="border rounded-lg p-4">
          <div className="bg-m_neutral_100 rounded-lg">
            <div className="p-4 flex body_semibold_14 ">{t("mysql")}</div>
            <CodeMirror
              value={schemaSql}
              lang="sql"
              theme={dracula}
              height="300px"
              extensions={[sql()]}
              onChange={(v) => {
                setSchemaSql(v);
              }}
            />
          </div>
        </div>

        <div className="body_semibold_14 mt-4">{t("expected_output")}</div>
        <div className="body_regular_14 mb-3">{t("expected_output_intro")}</div>
        <div className="border rounded-lg p-4">
          <div className="bg-m_neutral_100 rounded-lg">
            <div className="p-4 flex body_semibold_14 ">{t("mysql")}</div>
            <CodeMirror
              value={expectedOutput}
              lang="sql"
              theme={dracula}
              height="300px"
              extensions={[sql()]}
              onChange={(v) => {
                setExpectedOutput(v);
              }}
            />
          </div>
        </div>

        <div className="h-4" />
        <EditorHook
          formik={formik}
          placeholder={t("enter_content")}
          isCount={false}
          id="explain"
          name="explain"
          title={t("explain_result")}
        />
      </div>
    </div>
  );
}

export default SqlQuestion;
