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
  setConnectQuestion,
  setQuestionLoading,
  updateAnswerToQuestion,
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
    if (existedQuest) {
      console.log("re load");
      setPairingScroringMethod(
        existedQuest?.content?.pairingScroringMethod ?? undefined,
      );
      var answers = existedQuest?.content?.questions
        ?.filter((u) => u.contentAnwser)
        ?.map((w) => ({ ...w, type: "Answ", id: uuidv4() }));

      var checkedQuestions = answers
        ?.filter((u) => u.contentQuestion && u.contentAnwser)
        ?.map((w) => ({ ...w, type: "Quest", id: uuidv4(), idAns: w.id }));

      var unCheckedQuestions = existedQuest?.content?.questions
        ?.filter((u) => u.contentQuestion && !u.contentAnwser)
        ?.map((w) => ({ ...w, type: "Quest", id: uuidv4() }));

      var questions = [
        ...(checkedQuestions ?? []),
        ...(unCheckedQuestions ?? []),
      ];

      dispatch(setConnectQuestion(questions));
      dispatch(setConnectAnswer(answers));
      setLoadAs(true);
      console.log("existedQuest", existedQuest);
    }
  });
  const questionList = useAppSelector(
    (state: RootState) => state.question.connectQuestions,
  );
  const answerList = useAppSelector(
    (state: RootState) => state.question.connectAnswers,
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
    onSubmit: async (values: ConnectQuestionValue) => {
      console.log("answerList", answerList);

      // dispatch(setQuestionLoading(true));
      var ansIds = questionList
        .filter((p: ConnectAnswer) => p.idAns)
        .map((y: ConnectAnswer) => y.idAns);
      console.log("ansIds", ansIds);

      var q = questionList.map((t: ConnectAnswer) => {
        const ans = answerList.find((g: ConnectAnswer) => g.id === t.idAns);
        return {
          labelQuestion: t.labelQuestion,
          labelAnwser: ans?.labelAnwser,
          contentQuestion: t.contentQuestion,
          contentAnwser: ans?.contentAnwser,
        };
      });
      console.log("q", q);
      var a = answerList
        .filter((z: ConnectAnswer) => !ansIds.includes(z.id as any))
        .map((o: ConnectAnswer) => ({
          labelQuestion: undefined,
          labelAnwser: o.labelAnwser,
          contentQuestion: undefined,
          contentAnwser: o?.contentAnwser,
        }));

      console.log("a", a);
      const dataSubmit: ConnectQuestionFormData = {
        id: question?.id ?? undefined,
        idExam,
        numberPoint: values.point ? parseInt(values.point) : undefined,
        idGroupQuestion: values.question_group,
        question: values?.question,
        questionType: "Pairing",
        idExamQuestionPart:
          question?.idExamQuestionPart ?? idExamQuestionPart ?? undefined,
        content: {
          pairingScroringMethod,
          explainAnswer: values.explain,
          questions: [...q, ...a],
        },
      };
      console.log("dataSubmit", dataSubmit);

      return;

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
        <MTreeSelect
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
                {questionList?.map((s: ConnectAnswer, i: number) => (
                  <div
                    key={s.id}
                    className="flex items-center body_semibold_14 mb-2"
                  >
                    <p className="min-w-4">{i + 1}.</p>
                    <EditorHook
                      setValue={(name: any, val: any) => {
                        dispatch(
                          updateTextConnectQuestion({ index: i, value: val }),
                        );
                      }}
                      value={s.contentQuestion}
                      isCount={false}
                      isBubble={true}
                      id={`result-${i + 1}`}
                      name={`result-${i + 1}`}
                    />
                    <button
                      onClick={() => {
                        dispatch(deleteConnectQuestion(i));
                      }}
                      className=" text-neutral-500 text-2xl mt-[7px] ml-2 "
                    >
                      <CloseCircleOutlined />
                    </button>
                  </div>
                ))}
                <div className="w-full flex justify-end">
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
                {answerList?.map((s: ConnectAnswer, i: number) => (
                  <div
                    key={s.id}
                    className="flex items-center body_semibold_14 mb-2"
                  >
                    <p className="min-w-4">{String.fromCharCode(65 + i)}.</p>
                    <EditorHook
                      setValue={(name: any, val: any) => {
                        dispatch(
                          updateTextConnectAnswer({ index: i, value: val }),
                        );
                      }}
                      value={s.contentAnwser}
                      isCount={false}
                      isBubble={true}
                      id={`result-${i + 1}`}
                      name={`result-${i + 1}`}
                    />
                    <button
                      onClick={() => {
                        dispatch(deleteConnectAnswer(i));
                      }}
                      className=" text-neutral-500 text-2xl mt-[7px] ml-2 "
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
            {questionList?.map((a: ConnectAnswer, i: number) => (
              <div className="flex" key={a.id}>
                <p className="w-14 body_semibold_14 mr-3 ">{i + 1}.</p>
                <CheckboxGroup
                  value={
                    (answerList
                      ?.filter((m) => !!m.id && a.idAns === m.id)

                      ?.map((o) => o.id) ?? []) as any
                  }
                  rootClassName="flex items-center "
                  onChange={(va) => {
                    console.log("va", va);
                    console.log("questionList", questionList);
                  }}
                >
                  {answerList.map((b: ConnectAnswer, ind: number) => (
                    <>
                      <p className="body_semibold_14 relative z-0">
                        {String.fromCharCode(65 + ind)}.
                      </p>
                      <Checkbox
                        onChange={(val) => {
                          dispatch(
                            updateAnswerToQuestion({
                              index: i,
                              value: val.target.checked
                                ? val.target.value
                                : undefined,
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
