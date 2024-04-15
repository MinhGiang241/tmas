import Editor from "@/app/components/config/LexicalEditor";
import MDropdown from "@/app/components/config/MDropdown";
import MInput from "@/app/components/config/MInput";
import { Checkbox, Switch } from "antd";
import dynamic from "next/dynamic";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { PlusOutlined, CloseCircleOutlined } from "@ant-design/icons";
import _, { parseInt } from "lodash";
import { ExamGroupData, QuestionGroupData } from "@/data/exam";
import MTreeSelect from "@/app/components/config/MTreeSelect";
import {
  BaseQuestionFormData,
  MultiAnswerQuestionFormData,
} from "@/data/form_interface";
import { FormikErrors, useFormik } from "formik";
import { useQuill } from "react-quilljs";
import cheerio from "cheerio";
import EditorCom from "@/app/exams/components/react_quill/Editor";
import ReactQuill from "react-quill";
import "quill/dist/quill.bubble.css";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { v4 as uuidv4 } from "uuid";
import {
  addMoreAnswer,
  deleteMultiAnswer,
  resetMultiAnswer,
  setMultiAnswer,
  setQuestionLoading,
  updateCheckCorrectAnswer,
  updateTextMultiAnswer,
} from "@/redux/questions/questionSlice";
import {
  createMultiAnswerQuestion,
  updateMultiAnswerQuestion,
} from "@/services/api_services/question_api";
import { errorToast, successToast } from "@/app/components/toast/customToast";
import { useRouter, useSearchParams } from "next/navigation";
import { useOnMountUnsafe } from "@/services/ui/useOnMountUnsafe";
import { MultiAnswer } from "@/data/question";

const EditorHook = dynamic(
  () => import("@/app/exams/components/react_quill/EditorWithUseQuill"),
  {
    ssr: false,
  },
);
const CheckboxGroup = Checkbox.Group;

interface Props {
  questionGroups?: QuestionGroupData[];
  submitRef?: any;
  idExam?: string;
  question?: BaseQuestionFormData;
}

function ManyResultsQuestion({
  questionGroups: examGroups,
  submitRef,
  idExam,
  question,
}: Props) {
  const { t } = useTranslation("exam");
  const common = useTranslation();
  const answers = useAppSelector(
    (state: RootState) => state.question.multiAnswerQuestions,
  );
  const [loadAs, setLoadAs] = useState<boolean>(false);
  const existedQuest =
    question && question?.questionType === "MutilAnswer"
      ? (question as MultiAnswerQuestionFormData)
      : undefined;
  console.log("existedQuest", existedQuest);

  useOnMountUnsafe(() => {
    if (existedQuest) {
      setIsChangePosition(existedQuest?.content?.isChangePosition ?? false);
      var as = (existedQuest?.content?.answers ?? []).map((w) => ({
        ...w,
        id: uuidv4(),
      }));
      dispatch(setMultiAnswer(as));
      setLoadAs(true);
    } else {
      dispatch(resetMultiAnswer(0));
      setLoadAs(true);
    }
  });
  const [checkedResults, setCheckedResults] = useState<number[]>([]);

  const [isChangePosition, setIsChangePosition] = useState<boolean>(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const onChangeCheckResult = (v: any) => {
    setCheckedResults(v);
  };

  interface MultiAnswerQuestionValue {
    point?: string;
    question_group?: string;
    question?: string;
    explain?: string;
    [key: string]: any;
  }

  const optionSelect = (examGroups ?? []).map<any>(
    (v: QuestionGroupData, i: number) => ({
      label: v?.name,
      value: v?.id,
    }),
  );

  const initialValues: MultiAnswerQuestionValue = {
    point: question?.numberPoint?.toString() ?? undefined,
    question_group: question?.idGroupQuestion ?? undefined,
    question: question?.question ?? undefined,
    explain: existedQuest?.content?.explainAnswer ?? undefined,
  };

  const validate = async (values: MultiAnswerQuestionValue) => {
    const errors: FormikErrors<MultiAnswerQuestionValue> = {};
    const $ = cheerio.load(values.question ?? "");

    if (answers?.length != 0) {
      answers.map(async (o) => {
        if (!o.text) {
          errors[`ans-${o?.id}`] = "common_not_empty";
        }
      });
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
  const search = useSearchParams();
  const idExamQuestionPart =
    search.get("partId") != null ? search.get("partId") : undefined;

  const formik = useFormik({
    initialValues,
    validate,
    onSubmit: async (values: MultiAnswerQuestionValue) => {
      if (answers.length === 0) {
        errorToast(t("at_least_1_answer"));
        return;
      }
      if (answers.every((r) => !r.isCorrectAnswer)) {
        errorToast(t("at_least_1_true_answer"));
        return;
      }
      dispatch(setQuestionLoading(true));
      var submitData: MultiAnswerQuestionFormData = {
        id: question?.id ?? undefined,
        idExam: question?.idExam ?? idExam,
        idExamQuestionPart:
          question?.idExamQuestionPart ?? idExamQuestionPart ?? undefined,
        idGroupQuestion: values?.question_group,
        question: values?.question,
        questionType: "MutilAnswer",
        numberPoint: values.point ? parseFloat(values.point) : undefined,
        content: {
          explainAnswer: values.explain,
          isChangePosition,
          answers: answers.map((l: MultiAnswer, i: number) => ({
            text: l.text,
            label: `${String.fromCharCode(65 + i)}`,
            isCorrectAnswer: l.isCorrectAnswer,
          })),
        },
      };
      // console.log("sss", submitData);
      // return;
      var res = question
        ? await updateMultiAnswerQuestion(submitData)
        : await createMultiAnswerQuestion(submitData);
      dispatch(setQuestionLoading(false));
      if (res.code != 0) {
        errorToast(res.message ?? "");
        return;
      }
      dispatch(resetMultiAnswer(1));
      question
        ? successToast(t("success_update_question"))
        : successToast(t("success_add_question"));
      router.push(!idExam ? `/exam_bank` : `/exams/details/${idExam}`);
    },
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    Object.keys(initialValues).map(async (v) => {
      await formik.setFieldTouched(v, true);
    });
  };

  return (
    <div className="grid grid-cols-12 gap-4 max-lg:px-5">
      <button
        className="hidden"
        onClick={async () => {
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
          {loadAs && (
            <CheckboxGroup
              defaultValue={answers
                .filter((s) => s.isCorrectAnswer)
                .map((r) => r.id as string)}
              rootClassName="flex flex-col"
              onChange={onChangeCheckResult}
            >
              {answers.map((a: MultiAnswer, i: number) => (
                <div key={a.id} className="w-full flex items-start mb-4">
                  {/* {a.isCorrectAnswer?.toString()} */}
                  <Checkbox
                    className="mt-2"
                    checked={a.isCorrectAnswer ?? false}
                    value={a.id}
                    onChange={(b) => {
                      console.log(b);
                      dispatch(
                        updateCheckCorrectAnswer({
                          index: i,
                          value: b.target.checked,
                        }),
                      );
                    }}
                  />

                  <div className="mt-2 body_semibold_14 mx-2 w-5">
                    {String.fromCharCode(65 + i)}.
                  </div>
                  <div className="flex flex-grow lg:max-w-[596px] sm:max-w-lg max-w-sm">
                    <EditorHook
                      onBlur={async () => {
                        await formik.setFieldTouched(`ans-${a?.id}`, true);
                        formik.validateForm();
                      }}
                      touch={formik.touched[`ans-${a?.id}`] as any}
                      error={formik.errors[`ans-${a?.id}`] as any}
                      value={a.text}
                      setValue={async (name: any, e: any) => {
                        await dispatch(
                          updateTextMultiAnswer({ index: i, value: e }),
                        );
                        formik.validateForm();
                      }}
                      isCount={false}
                      isBubble={true}
                      id={`result-${String.fromCharCode(65 + i)}`}
                      name={`result-${String.fromCharCode(65 + i)}`}
                    />
                  </div>
                  <button
                    onClick={async () => {
                      dispatch(deleteMultiAnswer(i));
                    }}
                    className=" text-neutral-500 text-2xl mt-[6px] ml-2 "
                  >
                    <CloseCircleOutlined />
                  </button>
                </div>
              ))}
              <div className="w-full flex justify-end">
                <button
                  onClick={async () => {
                    dispatch(addMoreAnswer("1"));
                  }}
                  className=" underline body_regular_14 underline-offset-4"
                >
                  <PlusOutlined /> {t("add_result")}
                </button>
              </div>
            </CheckboxGroup>
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

export default ManyResultsQuestion;
