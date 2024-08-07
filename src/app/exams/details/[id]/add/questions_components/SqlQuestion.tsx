import MButton from "@/app/components/config/MButton";
import MDropdown from "@/app/components/config/MDropdown";
import MInput from "@/app/components/config/MInput";
import dynamic from "next/dynamic";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import CodeMirror from "@uiw/react-codemirror";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { ExamGroupData, QuestionGroupData } from "@/data/exam";
import MTreeSelect from "@/app/components/config/MTreeSelect";
import { sql } from "@codemirror/lang-sql";
import { useAppDispatch } from "@/redux/hooks";
import { useRouter, useSearchParams } from "next/navigation";
import cheerio from "cheerio";
import { FormikErrors, useFormik } from "formik";
import {
  BaseQuestionFormData,
  SqlQuestionFormData,
} from "@/data/form_interface";
import {
  createSqlQuestion,
  updateSqlQuestion,
} from "@/services/api_services/question_api";
import { setQuestionLoading } from "@/redux/questions/questionSlice";
import { errorToast, successToast } from "@/app/components/toast/customToast";
import { useOnMountUnsafe } from "@/services/ui/useOnMountUnsafe";
import NoticeIcon from "@/app/components/icons/notice.svg";

const EditorHook = dynamic(
  () => import("@/app/exams/components/react_quill/EditorWithUseQuill"),
  {
    ssr: false,
  },
);

interface Props {
  questionGroups?: QuestionGroupData[];
  submitRef?: any;
  clickQuestGroup?: any;
  idExam?: string;
  question?: BaseQuestionFormData;
}

function SqlQuestion({
  clickQuestGroup,
  questionGroups: examGroups,
  submitRef,
  idExam,
  question,
}: Props) {
  const { t } = useTranslation("exam");
  const common = useTranslation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const search = useSearchParams();
  const idExamQuestionPart = search.get("partId");

  const existedQuest =
    question && question?.questionType === "SQL"
      ? (question as SqlQuestionFormData)
      : undefined;

  useOnMountUnsafe(() => {
    if (existedQuest) {
      setSchemaSql(existedQuest?.content?.schemaSql ?? undefined);
      setExpectedOutput(existedQuest?.content?.expectedOutput ?? undefined);
    }
  });
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
    schema_sql?: string;
    expected_output?: string;
  }

  const initialValues: SqlQuestionValue = {
    point: question?.numberPoint?.toString() ?? undefined,
    question_group: question?.idGroupQuestion ?? undefined,
    question: question?.question ?? undefined,
    explain: existedQuest?.content?.explainAnswer ?? undefined,
  };

  const validate = async (values: SqlQuestionValue) => {
    const errors: FormikErrors<SqlQuestionValue> = {};
    const $ = cheerio.load(values.question?.trim() ?? "");

    if (!schemaSql) {
      errors.schema_sql = common.t("not_empty");
    }
    if (!expectedOutput) {
      errors.expected_output = common.t("not_empty");
    }

    if (!values.question || !$.text()) {
      errors.question = "common_not_empty";
    }

    if (!values.question_group) {
      errors.question_group = "common_not_empty";
    }

    if (!values.point) {
      errors.point = "common_not_empty";
    } else if (values.point?.match(/\.\d{3,}/g)) {
      errors.point = "2_digit_behind_dot";
    } else if (values.point?.match(/(.*\.){2,}/g)) {
      errors.point = "invalid_number";
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
        id: question?.id ?? undefined,
        isQuestionBank: idExam ? false : true,
        idExam: question?.idExam ?? idExam,
        question: values?.question?.trim(),
        numberPoint: values.point ? parseFloat(values.point) : undefined,
        idGroupQuestion: values.question_group,
        questionType: "SQL",
        idExamQuestionPart:
          question?.idExamQuestionPart ??
          (!!idExamQuestionPart ? idExamQuestionPart : undefined) ??
          undefined,
        content: {
          schemaSql: schemaSql?.trim()?.replace(/  +/g, " "),
          expectedOutput: expectedOutput?.trim()?.replace(/  +/g, " "),
          explainAnswer: values.explain?.trim(),
        },
      };

      var res = question
        ? await updateSqlQuestion(submitData)
        : await createSqlQuestion(submitData);
      dispatch(setQuestionLoading(false));
      if (res.code != 0) {
        errorToast(res, res?.message ?? "");
        return;
      }
      successToast(
        res?.message ?? question
          ? t("success_update_question")
          : t("success_add_question"),
      );
      router.push(!idExam ? `/exam_bank` : `/exams/details/${idExam}`);
    },
  });

  return (
    <div className="grid grid-cols-12 gap-4 max-lg:px-5">
      <button
        className="hidden"
        onClick={() => {
          formik.handleSubmit();
          Object.keys(formik.errors).map(async (v) => {
            await formik.setFieldTouched(v, true);
          });
        }}
        ref={submitRef}
      />

      <div className="bg-white rounded-lg lg:col-span-4 col-span-12 p-5 h-fit">
        <MInput
          namespace="exam"
          onKeyDown={(e) => {
            if (!e.key.match(/[0-9.]/g) && e.key != "Backspace") {
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
          required
          formik={formik}
          options={optionSelect}
          h="h-9"
          title={t("question_group")}
          placeholder={t("select_question_group")}
          id="question_group"
          name="question_group"
        />
        <button
          onClick={() => {
            clickQuestGroup();
          }}
          className="mb-3 body_regular_14 underline underline-offset-4 text-m_primary_500"
        >
          {t("create_exam_group")}
        </button>
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
              onBlur={async () => {
                await formik.setFieldTouched("schema_sql", true);
              }}
              value={schemaSql}
              lang="sql"
              theme={dracula}
              height="300px"
              extensions={[sql()]}
              onChange={(v) => {
                setSchemaSql(v);
                formik.validateForm();
              }}
            />
          </div>
          {formik.errors.schema_sql && formik.touched.schema_sql && (
            <div className={`flex items-center `}>
              <div className="min-w-4">
                <NoticeIcon />
              </div>
              <div className={`text-m_error_500 body_regular_14`}>
                {(formik.errors?.schema_sql ?? "") as string}
              </div>
            </div>
          )}
        </div>

        <div className="body_semibold_14 mt-4">{t("expected_output")}</div>
        <div className="body_regular_14 mb-3">{t("expected_output_intro")}</div>
        <div className="border rounded-lg p-4">
          <div className="bg-m_neutral_100 rounded-lg">
            <div className="p-4 flex body_semibold_14 ">{t("mysql")}</div>
            <CodeMirror
              onBlur={async () => {
                await formik.setFieldTouched("expected_output", true);
              }}
              value={expectedOutput}
              lang="sql"
              theme={dracula}
              height="300px"
              extensions={[sql()]}
              onChange={(v) => {
                setExpectedOutput(v);
                formik.validateForm();
              }}
            />
          </div>
          {formik.errors.expected_output && formik.touched.expected_output && (
            <div className={`flex items-center `}>
              <div className="min-w-4">
                <NoticeIcon />
              </div>
              <div className={`text-m_error_500 body_regular_14`}>
                {(formik.errors?.expected_output ?? "") as string}
              </div>
            </div>
          )}
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
