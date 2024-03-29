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
import {
  createMultiAnswerQuestion,
  createTrueFalseQuestion,
  updateTrueFalseQuestion,
} from "@/services/api_services/question_api";
import {
  setMultiAnswer,
  setQuestionLoading,
} from "@/redux/questions/questionSlice";
import { errorToast, successToast } from "@/app/components/toast/customToast";
import { useAppDispatch } from "@/redux/hooks";
import { useOnMountUnsafe } from "@/services/ui/useOnMountUnsafe";
import { v4 as uuidv4 } from "uuid";
import { MultiAnswer } from "@/data/question";
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
  question,
}: Props) {
  const [loadAs, setLoadAs] = useState<boolean>(false);
  const existedQuest =
    question && question?.questionType === "YesNoQuestion"
      ? (question as MultiAnswerQuestionFormData)
      : undefined;
  const { t } = useTranslation("exam");
  const common = useTranslation();
  const [results, setResults] = useState<number[]>([65, 66]);
  const [isChangePosition, setIsChangePosition] = useState<boolean>(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  useOnMountUnsafe(() => {
    if (existedQuest) {
      setIsChangePosition(existedQuest?.content?.isChangePosition ?? false);
      var a =
        existedQuest?.content?.answers &&
        existedQuest?.content?.answers.length != 0
          ? existedQuest?.content?.answers[0]
          : {};
      var b =
        existedQuest?.content?.answers &&
        existedQuest?.content?.answers.length >= 2
          ? existedQuest?.content?.answers[1]
          : {};

      setAResult(a);
      setBResult(b);
      setCorrectAnswer(
        a?.isCorrectAnswer ? 0 : b?.isCorrectAnswer ? 1 : undefined,
      );
      setLoadAs(true);
    }
  });

  const [aResult, setAResult] = useState<MultiAnswer>({
    isCorrectAnswer: false,
    text: undefined,
    label: undefined,
  });
  const [bResult, setBResult] = useState<MultiAnswer>({
    isCorrectAnswer: false,
    text: undefined,
    label: undefined,
  });

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
    point: question?.numberPoint?.toString() ?? undefined,
    question_group: question?.idGroupQuestion ?? undefined,
    question: question?.question ?? undefined,
    explain: existedQuest?.content?.explainAnswer ?? undefined,
    a: undefined,
    b: undefined,
  };

  const validate = async (values: TrueFalseQuestionValue) => {
    const errors: FormikErrors<TrueFalseQuestionValue> = {};
    const $ = cheerio.load(values.question ?? "");

    if (!values.question) {
      errors.question = "common_not_empty";
    }
    if (!aResult.text) {
      errors.a = "common_not_empty";
    }
    if (!bResult.text) {
      errors.b = "common_not_empty";
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
    console.log("error", errors);
    console.log("touched", formik);

    return errors;
  };
  const search = useSearchParams();
  const idExamQuestionPart = search.get("partId");
  const [correctAnswer, setCorrectAnswer] = useState<any>(undefined);

  const formik = useFormik({
    initialValues,
    validate,
    onSubmit: async (values: TrueFalseQuestionValue) => {
      // console.log(aResult);
      // console.log(bResult);
      // return;
      if (!correctAnswer) {
        errorToast(t("at_least_1_true_answer"));
        return;
      }

      dispatch(setQuestionLoading(true));
      const submitData: MultiAnswerQuestionFormData = {
        id: question?.id,
        idExam: question?.idExam ?? idExam,
        idExamQuestionPart:
          question?.idExamQuestionPart ?? idExamQuestionPart ?? undefined,
        idGroupQuestion: values?.question_group,
        question: values?.question,
        questionType: "YesNoQuestion",
        numberPoint: values.point ? parseFloat(values.point) : undefined,
        content: {
          explainAnswer: values.explain,
          isChangePosition,
          answers: [
            {
              text: aResult.text,
              label: "A",
              isCorrectAnswer: correctAnswer === 0 ? true : false,
            },
            {
              text: bResult.text,
              label: "B",
              isCorrectAnswer: correctAnswer === 1 ? true : false,
            },
          ],
        },
      };
      console.log("values", submitData);

      var res = question
        ? await updateTrueFalseQuestion(submitData)
        : await createTrueFalseQuestion(submitData);
      dispatch(setQuestionLoading(false));
      if (res.code != 0) {
        errorToast(res.message ?? "");
        return;
      }
      successToast(
        question ? t("success_update_question") : t("success_add_question"),
      );
      router.push(`/exams/details/${idExam}`);
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
              console.log(v);

              if (v.target.value === 0) {
                setAResult({ ...aResult, isCorrectAnswer: true });
                setBResult({ ...bResult, isCorrectAnswer: false });
              }
              if (v.target.value === 1) {
                setAResult({ ...aResult, isCorrectAnswer: false });
                setBResult({ ...aResult, isCorrectAnswer: true });
              }
            }}
          >
            <Space className="w-full" direction="vertical">
              <div className="w-full flex items-center mb-4">
                <Radio value={0} />
                <div className="body_semibold_14 mr-2 ">A.</div>
                <EditorHook
                  onBlur={async () => {
                    await formik.setFieldTouched("a", true);
                  }}
                  touch={formik.touched.a}
                  error={formik.errors.a}
                  value={aResult?.text}
                  setValue={(na: any, val: any) => {
                    setAResult({
                      ...aResult,
                      text: val,
                      label: cheerio.load(val).text(),
                    });
                    formik.validateForm();
                  }}
                  isCount={false}
                  isBubble={true}
                  id={`a`}
                  name={`b`}
                />
              </div>
              <div className="w-full flex items-center mb-4">
                <Radio value={1} />
                <div className="body_semibold_14 mr-2 ">B.</div>
                <EditorHook
                  onBlur={async () => {
                    await formik.setFieldTouched("b", true);
                  }}
                  touch={formik.touched.b}
                  error={formik.errors.b}
                  value={bResult?.text}
                  setValue={(na: any, val: any) => {
                    setBResult({
                      ...bResult,
                      text: val,
                      label: cheerio.load(val).text(),
                    });
                    formik.validateForm();
                  }}
                  isCount={false}
                  isBubble={true}
                  id={`a`}
                  name={`b`}
                />
                {/* <button */}
                {/*   onClick={() => {}} */}
                {/*   className=" text-neutral-500 text-2xl  ml-2 " */}
                {/* > */}
                {/*   <CloseCircleOutlined /> */}
                {/* </button> */}
              </div>
            </Space>
          </Radio.Group>
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

export default TrueFalseQuestion;
