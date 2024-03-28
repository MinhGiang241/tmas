import MButton from "@/app/components/config/MButton";
import MDropdown from "@/app/components/config/MDropdown";
import MInput from "@/app/components/config/MInput";
import { Radio, Space } from "antd";
import dynamic from "next/dynamic";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import "react-quill/dist/quill.core.css";
import parse from "html-react-parser";
import { ExamGroupData, QuestionGroupData } from "@/data/exam";
import cheerio from "cheerio";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { FormikErrors, useFormik } from "formik";
import _ from "lodash";
import {
  BaseQuestionFormData,
  FillBlankQuestionFormData,
} from "@/data/form_interface";
import { setQuestionLoading } from "@/redux/questions/questionSlice";
import {
  createFillBlankQuestion,
  updateFillBlankQuestion,
} from "@/services/api_services/question_api";
import { errorToast, successToast } from "@/app/components/toast/customToast";
import { useOnMountUnsafe } from "@/services/ui/useOnMountUnsafe";
const EditorHook = dynamic(
  () => import("@/app/exams/components/react_quill/EditorWithUseQuill"),
  {
    ssr: false,
  },
);

interface Props {
  questionGroups?: ExamGroupData[];
  submitRef?: any;
  idExam?: string;
  question?: BaseQuestionFormData;
}

function FillBlankQuestion({
  questionGroups: examGroups,
  submitRef,
  idExam,
  question,
}: Props) {
  const { t } = useTranslation("exam");
  const common = useTranslation();
  const router = useRouter();
  const search = useSearchParams();
  const idExamQuestionPart = search.get("partId");
  const dispatch = useAppDispatch();

  const [value, setValue] = useState<string | undefined>();
  const [isSave, setIsSave] = useState<boolean>(false);
  const [results, setResults] = useState<any>([]);
  const [check, setCheck] = useState<"CorrectAllBlank" | "EachCorrectBlank">(
    "CorrectAllBlank",
  );

  const existedQuest =
    question && question?.questionType === "FillBlank"
      ? (question as FillBlankQuestionFormData)
      : undefined;

  useOnMountUnsafe(() => {
    if (existedQuest) {
      setCheck(
        existedQuest?.content?.fillBlankScoringMethod ?? "CorrectAllBlank",
      );
      setResults(
        (existedQuest?.content?.anwserItems &&
        existedQuest?.content?.anwserItems.length >= 0
          ? existedQuest?.content?.anwserItems[0].anwsers
          : []) as any,
      );
    }
  });

  const optionSelect = (examGroups ?? []).map<any>(
    (v: QuestionGroupData, i: number) => ({
      label: v?.name,
      value: v?.id,
    }),
  );

  interface FillBlankQuestionValue {
    point?: string;
    question_group?: string;
    question?: string;
    explain?: string;
  }

  const initialValues: FillBlankQuestionValue = {
    point: question?.numberPoint?.toString() ?? undefined,
    question_group: question?.idGroupQuestion ?? undefined,
    question: question?.question ?? undefined,
    explain: existedQuest?.content?.explainAnswer ?? undefined,
  };

  const validate = async (values: FillBlankQuestionValue) => {
    const errors: FormikErrors<FillBlankQuestionValue> = {};
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
    onSubmit: async (values: FillBlankQuestionValue) => {
      if (!isSave) {
        const pattern = /_{3,}/g;
        const matches = values.question?.match(pattern);
        var newResults = (matches ?? []).map((o: string, i: number) => {
          return results[i];
        });

        setResults(newResults);
        let count = 0;
        const replacedText = values.question?.replace(
          /_{3,}/g,
          () => `__${++count}__`,
        );

        setValue(replacedText);
        setIsSave(true);
        return;
      }

      dispatch(setQuestionLoading(true));
      const submitData: FillBlankQuestionFormData = {
        id: question?.id,
        idExam: question?.idExam ?? idExam,
        question: values?.question,
        numberPoint: values.point ? parseInt(values.point) : undefined,
        idGroupQuestion: values.question_group,
        idExamQuestionPart:
          question?.idExamQuestionPart ?? idExamQuestionPart ?? undefined,
        questionType: "FillBlank",
        content: {
          fillBlankScoringMethod: check,
          explainAnswer: values.explain,
          anwserItems: [{ label: "label", anwsers: results }],
          formatBlank: value,
        },
      };

      var res = question
        ? await updateFillBlankQuestion(submitData)
        : await createFillBlankQuestion(submitData);
      dispatch(setQuestionLoading(false));
      if (res.code != 0) {
        errorToast(res?.message ?? "");
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
          // if (isSave) {
          //   formik.handleSubmit();
          // }
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
          value={check}
          buttonStyle="solid"
          onChange={(v) => {
            setCheck(v.target.value);
          }}
        >
          <Space direction="vertical">
            <Radio className=" caption_regular_14" value={"CorrectAllBlank"}>
              {t("all_fill_count")}
            </Radio>
            <Radio className=" caption_regular_14" value={"EachCorrectBlank"}>
              {t("each_fill_count")}
            </Radio>
          </Space>
        </Radio.Group>
        <div className="h-4" />
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
        {isSave ? (
          <>
            <div className="body_semibold_14">
              {t("question")}
              <span className="text-m_error_500"> *</span>
            </div>
            <div className="ql-editor">{parse(value ?? "")}</div>
            <div className="body_semibold_14">
              {t("setting_result")} <span className="text-m_error_500"> *</span>
            </div>
            <div className="caption_regular_12">{t("system_lower_upper")}</div>
            <div className="caption_regular_12">{t("system_semi_colon")}</div>
            <div className="p-4 border rounded-lg mt-3">
              {results?.map((d: any, i: number) => (
                <div key={i} className="flex mb-3 items-center">
                  <p className="pt-2 body_semibold_14 min-w-8">{i + 1}</p>

                  <MInput
                    value={d}
                    onChange={(d) => {
                      var newList = _.cloneDeep(results);
                      newList[i] = d.target.value;
                      setResults(newList);
                    }}
                    isTextRequire={false}
                    extend={true}
                    h="h-9"
                    id={`result-${i + 1}`}
                    name={`result-${i + 1}`}
                  />
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <EditorHook
              formik={formik}
              action={
                <MButton
                  onClick={() => {
                    formik.handleSubmit();
                  }}
                  h="h-9"
                  text={t("save_and_setting_result")}
                />
              }
              placeholder={t("enter_content")}
              isCount={false}
              required
              id="question"
              name="question"
              title={t("question")}
            />
            <div className="mt-2 body_regular_14">
              {t("fill_instruct")}{" "}
              <span className="text-[#4D7EFF]"> {t("blank_name")}. </span>
              {t("blank_name_only")}
            </div>
            <div className="my-2 body_regular_14">{t("example_fill")}</div>
            <div className="body_regular_14">
              {t("example_fill_sentence_1")}
              <span className="text-[#4D7EFF]"> {t("_1")}</span>
            </div>
            <div className="body_regular_14">
              <span className="text-[#4D7EFF]"> {t("_2")} </span>
              {t("example_fill_sentence_2")}
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
          </>
        )}
      </div>
    </div>
  );
}

export default FillBlankQuestion;
