import React, { useState } from "react";
import MDropdown from "@/app/components/config/MDropdown";
import MInput from "@/app/components/config/MInput";
import { Checkbox, Radio, Space, Switch } from "antd";
import dynamic from "next/dynamic";
import { useTranslation } from "react-i18next";
import { PlusOutlined, CloseCircleOutlined } from "@ant-design/icons";
import _ from "lodash";
import { ExamGroupData, QuestionGroupData } from "@/data/exam";
import MTreeSelect from "@/app/components/config/MTreeSelect";
import { useRouter, useSearchParams } from "next/navigation";
import { FormikErrors, useFormik } from "formik";
import cheerio from "cheerio";
import {
  BaseQuestionFormData,
  EssayQuestionFormData,
} from "@/data/form_interface";
import { useAppDispatch } from "@/redux/hooks";
import { setQuestionLoading } from "@/redux/questions/questionSlice";
import { createEssayQuestion } from "@/services/api_services/question_api";
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
  question?: BaseQuestionFormData;
}

function ExplainQuestion({
  questionGroups: examGroups,
  submitRef,
  idExam,
}: Props) {
  const { t } = useTranslation("exam");
  const common = useTranslation();
  const router = useRouter();
  const search = useSearchParams();
  const idExamQuestionPart = search.get("partId");
  const [requiredFile, setRequiredFile] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const optionSelect = (examGroups ?? []).map<any>(
    (v: QuestionGroupData, i: number) => ({
      label: v?.name,
      value: v?.id,
    }),
  );

  interface EssayQuestionValue {
    point?: string;
    question_group?: string;
    question?: string;
    note?: string;
  }

  const initialValues: EssayQuestionValue = {
    point: undefined,
    question_group: undefined,
    question: undefined,
    note: undefined,
  };

  const validate = async (values: EssayQuestionValue) => {
    const errors: FormikErrors<EssayQuestionValue> = {};
    const $ = cheerio.load(values.question ?? "");

    if (!values.question || !$.text()) {
      errors.question = "common_not_empty";
    }

    if (!values.point) {
      errors.point = "common_not_empty";
    }
    return errors;
  };

  const formik = useFormik({
    initialValues,
    validate,
    onSubmit: async (values: EssayQuestionValue) => {
      dispatch(setQuestionLoading(true));
      const submitData: EssayQuestionFormData = {
        idExam,
        question: values?.question,
        numberPoint: values.point ? parseInt(values.point) : undefined,
        idGroupQuestion: values.question_group,
        idExamQuestionPart: idExamQuestionPart ?? undefined,
        questionType: "Essay",
        content: { requiredFile, gradingNote: values.note },
      };

      var res = await createEssayQuestion(submitData);
      dispatch(setQuestionLoading(false));
      if (res.code != 0) {
        errorToast(res.message ?? "");
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
        <div className="body_semibold_14 my-3">{t("enter_question_info")}</div>
        <div className="border rounded-lg p-4">
          <MInput
            placeholder={t("note_when_marking")}
            formik={formik}
            isTextRequire={false}
            h="h-9"
            id="note"
            name="note"
            title={t("note")}
          />
          <div className="mb-5 body_regular_14">{t("note_when_marking")}</div>
          <div className="flex">
            <Switch
              value={requiredFile}
              onChange={(j) => {
                setRequiredFile(j);
              }}
              size="small"
            />
            <span className="ml-2 body_semibold_14">
              {t("request_submit_file")}
            </span>
          </div>
          <div className="body_regular_14">{t("request_user_submit")}</div>
        </div>
      </div>
    </div>
  );
}

export default ExplainQuestion;
