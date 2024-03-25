import Editor from "@/app/components/config/LexicalEditor";
import MDropdown from "@/app/components/config/MDropdown";
import MInput from "@/app/components/config/MInput";
import { Checkbox, Switch } from "antd";
import dynamic from "next/dynamic";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { PlusOutlined, CloseCircleOutlined } from "@ant-design/icons";
import _ from "lodash";
import { ExamGroupData, QuestionGroupData } from "@/data/exam";
import MTreeSelect from "@/app/components/config/MTreeSelect";
import { MultiAnswerQuestionFormData } from "@/data/form_interface";
import { FormikErrors, useFormik } from "formik";
import { useQuill } from "react-quilljs";
import cheerio from "cheerio";
import EditorCom from "@/app/exams/components/react_quill/Editor";
import ReactQuill from "react-quill";
import "quill/dist/quill.bubble.css";

const EditorHook = dynamic(
  () => import("@/app/exams/components/react_quill/EditorWithUseQuill"),
  {
    ssr: true,
  },
);
const CheckboxGroup = Checkbox.Group;

interface Props {
  questionGroups?: QuestionGroupData[];
  submitRef?: any;
  idExam?: string;
}

function ManyResultsQuestion({
  questionGroups: examGroups,
  submitRef,
  idExam,
}: Props) {
  const { t } = useTranslation("exam");
  const common = useTranslation();
  console.log("re render");

  const [results, setResults] = useState<any[]>([
    { value: undefined },
    { value: undefined },
    { value: undefined },
    { value: undefined },
  ]);

  // var results = [
  //   { value: undefined },
  //   { value: undefined },
  //   { value: undefined },
  //   { value: undefined },
  // ];
  const [checkedResults, setCheckedResults] = useState<number[]>([]);

  const onChangeCheckResult = (v: any) => {
    setCheckedResults(v);
  };

  interface MultiAnswerQuestionValue {
    point?: number;
    question_group?: string;
    question?: string;
    explain?: string;
    items?: { check?: boolean; value?: string }[];
  }

  const optionSelect = (examGroups ?? []).map<any>(
    (v: QuestionGroupData, i: number) => ({
      label: v?.name,
      value: v?.id,
    }),
  );

  const initialValues: MultiAnswerQuestionValue = {
    point: undefined,
    question_group: undefined,
    question: undefined,
    explain: undefined,
    items: [
      { check: false, value: "" },
      { check: false, value: "" },
      { check: false, value: "" },
      { check: false, value: "" },
    ],
  };

  const validate = async (values: MultiAnswerQuestionValue) => {
    const errors: FormikErrors<MultiAnswerQuestionValue> = {};
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
    onSubmit: async (values: MultiAnswerQuestionValue) => {
      console.log(values);
      console.log("result", results);
    },
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Object.keys(initialValues).map(async (v) => {
    //   await formik.setFieldTouched(v, true);
    // });
  };

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
        <div className="body_semibold_14 mb-2">{t("relocate_result")}</div>
        <Switch />
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
          <CheckboxGroup
            value={checkedResults}
            rootClassName="flex flex-col"
            onChange={onChangeCheckResult}
          >
            {(formik.values?.items ?? []).map((a: any, i: number) => (
              <div key={i} className="w-full flex items-center mb-4">
                <Checkbox value={i} />
                <div className="body_semibold_14 ml-2 w-5">
                  {String.fromCharCode(65 + i)}.
                </div>
                {/* <ReactQuill */}
                {/*   theme="bubble" */}
                {/*   modules={modules} */}
                {/*   formats={formats} */}
                {/*   value={a.value} */}
                {/*   onChange={(v) => {}} */}
                {/* /> */}
                <EditorHook
                  key={i}
                  // formik={formik}
                  setValue={(name: any, e: any) => {
                    console.log("results", results);

                    var newList = _.cloneDeep(formik.values?.items ?? []);
                    // newList.splice(i, 1);

                    newList[i].value = e;
                    console.log("newList", newList);
                    formik.setFieldValue("items", newList);
                    // setResults(newList);
                    //setResults(_.cloneDeep(newList));
                  }}
                  isCount={false}
                  isBubble={true}
                  id={`result-${String.fromCharCode(65 + i)}`}
                  name={`result-${String.fromCharCode(65 + i)}`}
                />
                <button
                  onClick={async () => {
                    var newList = _.cloneDeep(formik.values?.items ?? []);
                    newList.splice(i, 1);
                    // setResults(newList);
                    formik.setFieldValue("items", newList);
                    // setResults(_.cloneDeep(newList));
                  }}
                  className=" text-neutral-500 text-2xl mt-[8px] ml-2 "
                >
                  <CloseCircleOutlined />
                </button>
              </div>
            ))}
            <div className="w-full flex justify-end">
              <button
                onClick={async () => {
                  await formik.setFieldValue("items", [
                    ...(formik.values?.items ?? []),
                    { check: false, value: "" },
                  ]);
                  // setResults([...results, { value: "" }]);
                  // results.push({ value: undefined });
                }}
                className="text-m_primary_500 underline body_semibold_14 underline-offset-4"
              >
                <PlusOutlined /> {t("add_result")}
              </button>
            </div>
          </CheckboxGroup>
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
