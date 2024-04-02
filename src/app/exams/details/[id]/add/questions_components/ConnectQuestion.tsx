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
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import cheerio from "cheerio";
import questionSlice, {
  addMoreConnectAnswer,
  addMoreConnectQuestion,
  deleteConnectAnswer,
  deleteConnectQuestion,
  resetConnectAnswer,
  setConnectAnswer,
  setConnectPairing,
  setConnectQuestion,
  setQuestionLoading,
  updateAnswerToQuestion,
  updateCheckConnectPairing,
  updateTextConnectAnswer,
  updateTextConnectQuestion,
} from "@/redux/questions/questionSlice";
import { FormikErrors, useFormik } from "formik";
import { useRouter, useSearchParams } from "next/navigation";
import {
  BaseQuestionFormData,
  ConnectQuestionFormData,
} from "@/data/form_interface";
import {
  createConnectQuestion,
  updateConnectQuestion,
} from "@/services/api_services/question_api";
import { errorToast, successToast } from "@/app/components/toast/customToast";
import { useOnMountUnsafe } from "@/services/ui/useOnMountUnsafe";
import { v4 as uuidv4 } from "uuid";
import { ConnectQuestAns } from "@/data/question";
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

const CheckboxGroup = Checkbox.Group;

function ConnectQuestion({
  questionGroups: examGroups,
  submitRef,
  idExam,
  question,
}: Props) {
  const { t } = useTranslation("exam");
  const common = useTranslation();
  const [loadAs, setLoadAs] = useState<boolean>(false);

  const existedQuest =
    question && question?.questionType === "Pairing"
      ? (question as ConnectQuestionFormData)
      : undefined;
  useOnMountUnsafe(() => {
    console.log("re load");
    if (existedQuest) {
      setPairingScroringMethod(
        existedQuest?.content?.pairingScroringMethod ?? undefined,
      );

      dispatch(setConnectQuestion(existedQuest?.content?.questions ?? []));
      dispatch(setConnectAnswer(existedQuest?.content?.answers ?? []));
      dispatch(setConnectPairing(existedQuest?.content?.pairings ?? []));
      setLoadAs(true);
      console.log("existedQuest", existedQuest);
    } else {
      dispatch(resetConnectAnswer(0));
    }
  });
  const questionList = useAppSelector(
    (state: RootState) => state.question.connectQuestions,
  );
  const answerList = useAppSelector(
    (state: RootState) => state.question.connectAnswers,
  );
  const pairingList = useAppSelector(
    (state: RootState) => state.question.connectPairing,
  );
  const dispatch = useAppDispatch();
  const optionSelect = (examGroups ?? []).map<any>(
    (v: QuestionGroupData, i: number) => ({
      label: v?.name,
      value: v?.id,
    }),
  );
  const router = useRouter();
  const search = useSearchParams();
  const idExamQuestionPart = search.get("partId");
  const [pairingScroringMethod, setPairingScroringMethod] = useState<
    "CorrectAll" | "EachCorrectItem" | undefined
  >("CorrectAll");

  interface ConnectQuestionValue {
    point?: string;
    question_group?: string;
    question?: string;
    explain?: string;
    [key: string]: any;
  }

  const initialValues: ConnectQuestionValue = {
    point: question?.numberPoint?.toString() ?? undefined,
    question_group: question?.idGroupQuestion ?? undefined,
    question: question?.question ?? undefined,
    explain: existedQuest?.content?.explainAnswer ?? undefined,
  };
  const validate = async (values: ConnectQuestionValue) => {
    const errors: FormikErrors<ConnectQuestionValue> = {};
    const $ = cheerio.load(values.question ?? "");

    if (questionList?.length != 0) {
      questionList.map(async (o) => {
        if (!o.content) {
          errors[`ques-${o?.id}`] = "common_not_empty";
        }
      });
    }

    if (answerList?.length != 0) {
      answerList.map(async (o) => {
        if (!o.content) {
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

  const formik = useFormik({
    initialValues,
    validate,
    onSubmit: async (values: ConnectQuestionValue) => {
      if (questionList.length === 0) {
        errorToast(t("at_least_1_question"));
      }
      if (answerList.length === 0) {
        errorToast(t("at_least_1_answer"));
      }

      var s = true;
      for (let d of questionList) {
        if (pairingList.every((s) => s.idQuestion != d.id)) {
          s = false;
        }
      }

      if (!s) {
        errorToast(t("each_quest_has_answer"));
        return;
      }

      dispatch(setQuestionLoading(true));

      const dataSubmit: ConnectQuestionFormData = {
        id: question?.id ?? undefined,
        idExam: question?.idExam ?? idExam,
        numberPoint: values.point ? parseFloat(values.point) : undefined,
        idGroupQuestion: values.question_group,
        question: values?.question,
        questionType: "Pairing",
        idExamQuestionPart:
          question?.idExamQuestionPart ?? idExamQuestionPart ?? undefined,
        content: {
          pairingScroringMethod,
          explainAnswer: values.explain,
          questions: questionList.map((s, i: number) => ({
            ...s,
            label: `${++i}`,
          })),
          answers: answerList.map((s, i: number) => ({
            ...s,
            label: `${String.fromCharCode(65 + i)}`,
          })),
          pairings: pairingList,
        },
      };

      console.log("dataSubmit", dataSubmit);

      var res = question
        ? await updateConnectQuestion(dataSubmit)
        : await createConnectQuestion(dataSubmit);
      dispatch(setQuestionLoading(false));
      if (res.code != 0) {
        errorToast(res.message ?? "");
        return;
      }
      dispatch(resetConnectAnswer(1));
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
        <Radio.Group
          value={pairingScroringMethod}
          buttonStyle="solid"
          onChange={(v) => {
            setPairingScroringMethod(v.target.value);
          }}
        >
          <Space direction="vertical">
            <Radio className=" caption_regular_14" value={"CorrectAll"}>
              {t("connect_count_all")}
            </Radio>
            <Radio className=" caption_regular_14" value={"EachCorrectItem"}>
              {t("connect_count_each")}
            </Radio>
          </Space>
        </Radio.Group>
        <div className="h-3" />
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
        <div className="body_semibold_14 mt-3">
          {t("result0")}
          <span className="text-m_error_500"> *</span>
        </div>
        <div className="mb-3 body_regular_14">{t("many_result_intro")}</div>
        {((loadAs && question) || !question) && (
          <div className="border rounded-lg p-4">
            <div className="w-full flex relative z-10">
              <div className="w-1/2">
                {questionList?.map((s: ConnectQuestAns, i: number) => (
                  <div key={s.id} className="flex items-start mb-2">
                    <p className="min-w-4 mt-2 mr-2 body_semibold_14">
                      {i + 1}.
                    </p>
                    <div className="w-[calc(100%-4rem)]">
                      <EditorHook
                        onBlur={async () => {
                          await formik.setFieldTouched(`ques-${s?.id}`, true);
                          formik.validateForm();
                        }}
                        touch={formik.touched[`ques-${s?.id}`] as any}
                        error={formik.errors[`ques-${s?.id}`] as any}
                        setValue={(name: any, val: any) => {
                          dispatch(
                            updateTextConnectQuestion({ index: i, value: val }),
                          );
                          formik.validateForm();
                        }}
                        value={s.content}
                        isCount={false}
                        isBubble={true}
                        id={`result-${i + 1}`}
                        name={`result-${i + 1}`}
                      />
                    </div>
                    <button
                      onClick={() => {
                        dispatch(deleteConnectQuestion(i));
                      }}
                      className=" text-neutral-500 text-2xl mt-1 ml-2 "
                    >
                      <CloseCircleOutlined />
                    </button>
                  </div>
                ))}
                <div className="w-full flex justify-end ">
                  <button
                    onClick={() => {
                      dispatch(addMoreConnectQuestion(0));
                    }}
                    className="underline body_regular_14 underline-offset-4"
                  >
                    <PlusOutlined /> {t("add_result")}
                  </button>
                  <div className="w-8" />
                </div>
              </div>
              <div className="w-6" />
              <div className="w-1/2">
                {answerList?.map((s: ConnectQuestAns, i: number) => (
                  <div key={s.id} className="flex items-start mb-2">
                    <p className="min-w-4 mt-2 mr-2  body_semibold_14">
                      {String.fromCharCode(65 + i)}.
                    </p>
                    <div className="w-[calc(100%-4rem)]">
                      <EditorHook
                        onBlur={async () => {
                          await formik.setFieldTouched(`ans-${s?.id}`, true);
                          formik.validateForm();
                        }}
                        touch={formik.touched[`ans-${s?.id}`] as any}
                        error={formik.errors[`ans-${s?.id}`] as any}
                        setValue={async (name: any, val: any) => {
                          dispatch(
                            updateTextConnectAnswer({ index: i, value: val }),
                          );
                          await formik.setFieldValue(`result-${s?.id}`, val);
                          formik.validateForm();
                        }}
                        value={s.content}
                        isCount={false}
                        isBubble={true}
                        id={`result-${s?.id}`}
                        name={`result-${s?.id}`}
                      />
                    </div>
                    <button
                      onClick={() => {
                        dispatch(deleteConnectAnswer(i));
                      }}
                      className=" text-neutral-500 text-2xl mt-1 ml-2 "
                    >
                      <CloseCircleOutlined />
                    </button>
                  </div>
                ))}
                <div className="w-full flex justify-end  ">
                  <button
                    onClick={() => {
                      dispatch(addMoreConnectAnswer(0));
                    }}
                    className="underline body_regular_14 underline-offset-4"
                  >
                    <PlusOutlined /> {t("add_result")}
                  </button>
                  <div className="w-8" />
                </div>
              </div>
            </div>
            <div className="body_semibold_14 mt-5">{t("select_result")}</div>
            <div className="body_regular_14 mb-2">
              {t("select_result_intro")}
            </div>
            {questionList?.map((a: ConnectQuestAns, i: number) => (
              <div className="flex" key={a.id}>
                <p className="w-14 body_semibold_14 mr-3 ">{i + 1}.</p>
                <CheckboxGroup
                  value={
                    (pairingList
                      ?.filter((q) => q.idQuestion === a.id)
                      ?.map((s) => s.idAnswer) ?? []) as any
                  }
                  rootClassName="flex items-center "
                  onChange={(va) => {
                    console.log("va", va);
                    console.log("questionList", questionList);
                    console.log("parinng", pairingList);
                  }}
                >
                  {answerList.map((b: ConnectQuestAns, ind: number) => (
                    <>
                      <p className="body_semibold_14 relative z-0">
                        {String.fromCharCode(65 + ind)}.
                      </p>
                      <Checkbox
                        onChange={(val) => {
                          dispatch(
                            updateCheckConnectPairing({
                              check: val.target.checked,
                              idAnswer: b.id,
                              idQuestion: a.id,
                            }),
                          );
                        }}
                        key={b.id}
                        value={b.id}
                      ></Checkbox>
                      <div className="w-2" />
                    </>
                  ))}
                </CheckboxGroup>
              </div>
            ))}
          </div>
        )}
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

export default ConnectQuestion;
