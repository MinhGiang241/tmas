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
import EditIcon from "@/app/components/icons/edit.svg";
import _, { parseInt } from "lodash";
import {
  BaseQuestionFormData,
  FillBlankQuestionFormData,
} from "@/data/form_interface";
import { setQuestionLoading } from "@/redux/questions/questionSlice";
import {
  createFillBlankQuestion,
  updateFillBlankQuestion,
} from "@/services/api_services/question_api";
import {
  errorToast,
  notifyToast,
  successToast,
} from "@/app/components/toast/customToast";
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
  const idExamQuestionPart = search.get("partId")
    ? search.get("partId")
    : undefined;
  const dispatch = useAppDispatch();

  const [value, setValue] = useState<string | undefined>();
  const [isSave, setIsSave] = useState<boolean>(false);
  const [results, setResults] = useState<
    { touch: false; error: undefined; label: string; text: string }[]
  >([]);
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
      // setResults(
      //   (existedQuest?.content?.anwserItems?.map((e) => ({
      //     label: e.label,
      //     text: e.anwsers?.join(";"),
      //   })) ?? []) as any,
      // );
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
    [key: string]: any;
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

    if (isSave && results?.length != 0) {
      results.map((a: any, i: number) => {
        if (!a.text && !values[`result-${i + 1}`]) {
          errors[`result-${i + 1}`] = "common_not_empty";
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
    console.log("error", errors);
    console.log("touched", formik.touched);
    return errors;
  };

  const formik = useFormik({
    initialValues,
    validate,
    onSubmit: async (values: FillBlankQuestionValue) => {
      if (!isSave) {
        const pattern = /\[%\d+%\]/g;
        const matches = values.question?.match(pattern);
        if (!matches || matches.length === 0) {
          notifyToast(t("at_least_a_blank"));
          return;
        }
        var cloneAns = _.cloneDeep(existedQuest?.content?.anwserItems);
        var newResults = (matches ?? []).map((e: string, i: number) => {
          return {
            label: e.replace(/[^0-9]+/g, ""),
            text:
              cloneAns?.length ?? 0 >= i + 1
                ? cloneAns![i]?.anwsers?.join(";")
                : "", //cloneAns[i].anwsers?.join(";"),
          };
        });
        newResults.sort(
          (a: any, b: any) => parseInt(a?.label) - parseInt(b?.label),
        ),
          setResults(newResults as any);
        let count = 0;
        const replacedText = values.question?.replace(/\[%\d+%\]/g, (s) => {
          console.log("ssss", s);
          var labl = s.replace(/[^0-9]+/g, "");
          return `___${labl}___`;
        });

        setValue(replacedText);
        setIsSave(true);

        return;
      }

      dispatch(setQuestionLoading(true));

      const submitData: FillBlankQuestionFormData = {
        id: question?.id,
        idExam: question?.idExam ?? idExam,
        question: values?.question,
        numberPoint: values.point ? parseFloat(values.point) : undefined,
        idGroupQuestion: values.question_group,
        idExamQuestionPart:
          question?.idExamQuestionPart ?? idExamQuestionPart ?? undefined,
        questionType: "FillBlank",
        content: {
          fillBlankScoringMethod: check,
          explainAnswer: values.explain,
          anwserItems: results.map((e: any) => ({
            label: e?.label,
            anwsers: e?.text?.split(";") ?? [],
          })),

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
      router.push(!idExam ? `/exam_bank` : `/exams/details/${idExam}`);
    },
  });

  return (
    <div className="grid grid-cols-12 gap-4 max-lg:px-5">
      <button
        className="hidden"
        onClick={async () => {
          var newList = _.cloneDeep(results);
          var newListClone = newList.map((v: any, i: number) => {
            return { ...v, touch: true };
          });
          setResults(newListClone);
          console.log("new lit", results, newListClone);

          await formik.validateForm();
          Object.keys(formik.errors).map(async (v) => {
            await formik.setFieldTouched(v, true);
          });
          formik.validateForm();
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
        {isSave && (
          <>
            <div className="w-full flex justify-between">
              <div className="body_semibold_14">
                {t("question")}
                <span className="text-m_error_500"> *</span>
              </div>
              <button
                onClick={() => {
                  setIsSave(false);
                }}
              >
                <EditIcon />
              </button>
            </div>
            <div className="ql-editor">{parse(value ?? "")}</div>
            <div className="body_semibold_14">
              {t("setting_result")} <span className="text-m_error_500"> *</span>
            </div>
            <div className="caption_regular_12">{t("system_lower_upper")}</div>
            <div className="caption_regular_12">{t("system_semi_colon")}</div>
            <div className="p-4 border rounded-lg mt-3">
              {results?.map((d, i: number) => (
                <div key={i} className="flex mb-3 items-center">
                  <p className="pt-2 body_semibold_14 min-w-8">{d.label}</p>

                  <MInput
                    // formik={formik}
                    onBlur={async () => {
                      await formik.setFieldTouched(`result-${i + 1}`);
                    }}
                    touch={
                      (formik.touched[`result-${i + 1}`] as any) || d.touch
                    }
                    error={formik.errors[`result-${i + 1}`] as any}
                    value={d.text}
                    onChange={async (f) => {
                      var newList = _.cloneDeep(results);

                      newList[i] = {
                        ...newList[i],
                        label: newList[i]?.label,
                        text: f.target.value,
                      };

                      setResults(newList);
                      await formik.setFieldValue(
                        `result-${i + 1}`,
                        f.target.value,
                      );

                      await formik.validateForm();
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
        )}
        <div className={`${isSave && "hidden"}`}>
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
        </div>
      </div>
    </div>
  );
}

export default FillBlankQuestion;
