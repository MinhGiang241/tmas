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
import { FormikErrors, useFormik } from "formik";
import cheerio from "cheerio";
import { useRouter, useSearchParams } from "next/navigation";
import {
  BaseQuestionFormData,
  MultiAnswerQuestionFormData,
} from "@/data/form_interface";
import { createMultiAnswerQuestion } from "@/services/api_services/question_api";
import { setQuestionLoading } from "@/redux/questions/questionSlice";
import { errorToast, successToast } from "@/app/components/toast/customToast";
import { useAppDispatch } from "@/redux/hooks";
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

function TrueFalseQuestion({
  questionGroups: examGroups,
  submitRef,
  idExam,
}: Props) {
  const { t } = useTranslation("exam");
  const common = useTranslation();
  const [results, setResults] = useState<number[]>([65, 66]);
  const [isChangePosition, setIsChangePosition] = useState<boolean>(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const optionSelect = (examGroups ?? []).map<any>(
    (v: QuestionGroupData, i: number) => ({
      label: v?.name,
      value: v?.id,
    }),
  );

  interface TrueFalseQuestionValue {
    point?: string;
    question_group?: string;
    question?: string;
    explain?: string;
    a?: string;
    b?: string;
  }

  const initialValues: TrueFalseQuestionValue = {
    point: undefined,
    question_group: undefined,
    question: undefined,
    explain: undefined,
    a: undefined,
    b: undefined,
  };

  const validate = async (values: TrueFalseQuestionValue) => {
    const errors: FormikErrors<TrueFalseQuestionValue> = {};
    const $ = cheerio.load(values.question ?? "");

    if (!values.question || !$.text()) {
      errors.question = "common_not_empty";
    }

    if (!values.point) {
      errors.point = "common_not_empty";
    }

    return errors;
  };
  const search = useSearchParams();
  const idExamQuestionPart = search.get("partId");
  const [correctAnswer, setCorrectAnswer] = useState(undefined);

  const formik = useFormik({
    initialValues,
    validate,
    onSubmit: async (values: TrueFalseQuestionValue) => {
      console.log("values", values);
      const submitData: MultiAnswerQuestionFormData = {
        idExam,
        idExamQuestionPart: idExamQuestionPart ?? undefined,
        idGroupQuestion: values?.question_group,
        question: values?.question,
        questionType: "YesNoQuestion",
        numberPoint: values.point ? parseInt(values.point) : undefined,
        content: {
          explainAnswer: values.explain,
          isChangePosition,
          answers: [
            {
              text: values.a,
              label: values.a,
              isCorrectAnswer: correctAnswer === 0 ? true : false,
            },
            {
              text: values.b,
              label: values.b,
              isCorrectAnswer: correctAnswer === 1 ? true : false,
            },
          ],
        },
      };
      var res = await createMultiAnswerQuestion(submitData);
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
          options={optionSelect}
          formik={formik}
          h="h-9"
          title={t("question_group")}
          placeholder={t("select_question_group")}
          id="question_group"
          name="question_group"
        />
        <div className="body_semibold_14 mb-2">{t("relocate_result")}</div>
        <Switch
          value={isChangePosition}
          onChange={(p) => {
            setIsChangePosition(p);
          }}
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
        <div className=" mt-4 body_semibold_14">
          {t("result0")} <span className="text-m_error_500"> *</span>
        </div>
        <div className="mb-3 body_regular_14">{t("many_result_intro")}</div>
        <div className="border rounded-lg p-4">
          <Radio.Group
            value={correctAnswer}
            className="w-full"
            buttonStyle="solid"
            onChange={(v) => {
              setCorrectAnswer(v.target.value);
            }}
          >
            <Space className="w-full" direction="vertical">
              {results?.map((a: any, i: number) => (
                <div key={i} className="w-full flex items-center mb-4">
                  <Radio value={i} />
                  <div className="body_semibold_14 mr-2 ">
                    {String.fromCharCode(65 + i)}.
                  </div>
                  <EditorHook
                    formik={formik}
                    isCount={false}
                    isBubble={true}
                    id={`${i == 0 ? "a" : "b"}`}
                    name={`${i == 0 ? "a" : "b"}`}
                  />
                  <button
                    onClick={() => {}}
                    className=" text-neutral-500 text-2xl  ml-2 "
                  >
                    <CloseCircleOutlined />
                  </button>
                </div>
              ))}
            </Space>
          </Radio.Group>
        </div>
        <div className="h-4" />
        <EditorHook
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

export default TrueFalseQuestion;
