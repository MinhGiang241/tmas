import MDropdown from "@/app/components/config/MDropdown";
import MInput from "@/app/components/config/MInput";
import {
  Checkbox,
  CheckboxOptionType,
  Divider,
  GetProp,
  Radio,
  Select,
  Space,
} from "antd";
import dynamic from "next/dynamic";
import React, { HTMLAttributes, useState } from "react";
import { useTranslation } from "react-i18next";
import { PlusOutlined, CloseCircleOutlined } from "@ant-design/icons";
import TrashIcon from "@/app/components/icons/trash.svg";
import Table, { ColumnsType } from "antd/es/table";
import {
  rowEndStyle,
  rowStartStyle,
  rowStyle,
} from "@/app/account/account-info/AccountInfo";
import _ from "lodash";
import MButton from "@/app/components/config/MButton";
import CodeMirror from "@uiw/react-codemirror";

import { dracula } from "@uiw/codemirror-theme-dracula";
import { QuestionGroupData } from "@/data/exam";

import { useAppDispatch } from "@/redux/hooks";

import CreateTestCaseModal, { TestcaseValue } from "./CreateTestCaseModal";
import { useRouter, useSearchParams } from "next/navigation";
import {
  genSampleCode,
  mapLanguage,
  renderExtension,
  serverLanguageList,
} from "@/services/ui/coding_services";
import { FormikErrors, useFormik } from "formik";
import cheerio from "cheerio";
import {
  CodingDataType,
  CodingQuestionFormData,
  ParameterType,
} from "@/data/form_interface";
import { v4 as uuidv4 } from "uuid";
import { setQuestionLoading } from "@/redux/questions/questionSlice";
import { createCodingQuestion } from "@/services/api_services/question_api";
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
}

function CodingQuestion({
  questionGroups: examGroups,
  submitRef,
  idExam,
}: Props) {
  const { t } = useTranslation("exam");
  const common = useTranslation();

  const [codingScroringMethod, setCodingScroringMethod] = useState<
    "PassAllTestcase" | "EachTestcase"
  >("PassAllTestcase");
  const [checkedLang, setCheckedLang] = useState<any[]>([]);
  const [parameterList, setParameterList] = useState<ParameterType[]>([
    {
      id: uuidv4(),
      returnType: undefined,
      nameParameter: undefined,
    },
    {
      id: uuidv4(),
      returnType: undefined,
      nameParameter: undefined,
    },
  ]);
  const router = useRouter();
  const search = useSearchParams();
  const idExamQuestionPart = search.get("partId");
  const dispatch = useAppDispatch();

  type CheckboxValueType = GetProp<typeof Checkbox.Group, "value">[number];

  const CheckboxGroup = Checkbox.Group;

  const plainOptions: CheckboxOptionType[] = [
    { value: "php", label: t("php") },
    { value: "javascript", label: t("javascript") },
    { value: "java", label: t("java") },
    { value: "python", label: t("python") },
    { value: "ruby", label: t("ruby") },
    { value: "c#", label: t("c#") },
  ];

  const onChangeCheck: GetProp<typeof Checkbox.Group, "onChange"> = (
    checkedValues,
  ) => {
    setCheckedLang(checkedValues);
  };

  const columns: ColumnsType<any> = [
    {
      onHeaderCell: (_) => rowStartStyle,
      width: "25%",
      title: <div className="w-1/3 flex justify-center">{t("code")}</div>,
      dataIndex: "name",
      key: "name",
      render: (text, data) => (
        <p key={text} className="w-full caption_regular_14">
          {text}
        </p>
      ),
    },
    {
      onHeaderCell: (_) => rowStyle,
      width: "25%",
      title: <div className="w-full flex justify-center">{t("input")}</div>,
      dataIndex: "inputData",
      key: "inputData",
      render: (text) => (
        <p
          key={text}
          className="w-full  flex justify-center caption_regular_14"
        >
          {text}
        </p>
      ),
    },

    {
      onHeaderCell: (_) => rowStyle,
      width: "25%",
      title: <div className="w-full flex justify-center">{t("output")}</div>,
      dataIndex: "outputData",
      key: "outputData",
      render: (text) => (
        <p
          key={text}
          className="w-full  flex justify-center caption_regular_14"
        >
          {text}
        </p>
      ),
    },

    {
      onHeaderCell: (_) => rowEndStyle,
      width: "25%",
      title: (
        <div className="w-full  flex justify-center">{common.t("action")}</div>
      ),
      dataIndex: "schema",
      key: "schema",
      render: (action, data) => (
        <div className="w-full flex justify-center ">
          <button
            className="ml-2"
            onClick={() => {
              setTestcases(testcases.filter((e: any) => e.id != data.id));
            }}
          >
            <TrashIcon />
          </button>
        </div>
      ),
    },
  ];

  const [testcases, setTestcases] = useState<TestcaseValue[]>([]);
  const [code, setCode] = useState<string | undefined>();
  const [lang, setLang] = useState<string | undefined>();

  const optionSelect = (examGroups ?? []).map<any>(
    (v: QuestionGroupData, i: number) => ({
      label: v?.name,
      value: v?.id,
    }),
  );

  const [openCreateTestcase, setOpenCreateTestCase] = useState<boolean>(false);
  interface CodingQuestionValue {
    point?: string;
    question_group?: string;
    question?: string;
    explain?: string;
    function_name?: string;
    return_type?: string;
  }

  const initialValues: CodingQuestionValue = {
    point: undefined,
    question_group: undefined,
    question: undefined,
    explain: undefined,
  };
  const validate = async (values: CodingQuestionValue) => {
    const errors: FormikErrors<CodingQuestionValue> = {};
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
    onSubmit: async (values: CodingQuestionValue) => {
      dispatch(setQuestionLoading(true));
      const submitData: CodingQuestionFormData = {
        idExam,
        question: values.question,
        idExamQuestionPart: idExamQuestionPart ?? undefined,
        idGroupQuestion: values.question_group,
        numberPoint: values.point ? parseInt(values.point) : undefined,
        questionType: "Coding",
        content: {
          codeLanguages: [
            ...plainOptions.map((la: any) => mapLanguage(la?.value ?? "")),
          ] as any,
          testcases: testcases.map((q) => ({
            name: q.name,
            inputData: q.inputData,
            outputData: q.outputData,
          })),
          codingScroringMethod,
          codingTemplate: {
            nameFunction: values.function_name,
            returnType: values.return_type as CodingDataType,
            explainAnswer: values.explain,
            parameterInputs: parameterList?.map((l) => ({
              nameParameter: l.nameParameter,
              returnType: l.returnType,
            })),
            template: code,
          },
        },
      };
      var res = await createCodingQuestion(submitData);
      dispatch(setQuestionLoading(false));
      if (res.code != 0) {
        errorToast(res?.message ?? "");
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
      <CreateTestCaseModal
        onOk={(testCase: TestcaseValue) => {
          setTestcases([...testcases, testCase]);
        }}
        title={t("create_testcase")}
        open={openCreateTestcase}
        onCancel={() => setOpenCreateTestCase(false)}
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
          buttonStyle="solid"
          onChange={(v) => {
            setCodingScroringMethod(v.target.value);
          }}
          value={codingScroringMethod}
        >
          <Space direction="vertical">
            <Radio className=" caption_regular_14" value={"PassAllTestcase"}>
              {t("point_all_question")}
            </Radio>
            <Radio className=" caption_regular_14" value={"EachTestcase"}>
              {t("point_a_question")}
            </Radio>
          </Space>
        </Radio.Group>
        <div className="h-3" />
        <MDropdown
          formik={formik}
          options={optionSelect}
          h="h-9"
          title={t("question_group")}
          placeholder={t("select_question_group")}
          id="question_group"
          name="question_group"
        />

        <div className="body_semibold_14 mb-3">{t("used_language")}</div>
        <CheckboxGroup
          value={checkedLang}
          rootClassName="flex flex-col"
          onChange={onChangeCheck}
        >
          {plainOptions?.map((a: any, i: number) => (
            <Checkbox key={i} className="my-1 body_regular_14" value={a?.value}>
              {a?.label}
            </Checkbox>
          ))}
        </CheckboxGroup>
      </div>
      <div className="bg-white p-5 rounded-lg lg:col-span-8 col-span-12">
        <EditorHook
          formik={formik}
          placeholder={t("enter_content")}
          isCount={false}
          required
          id="question"
          name="question"
          title={t("question")}
        />
        <div className="mt-4 mb-2 w-full flex items-center justify-between">
          <div className="body_semibold_14">
            {t("create_testcase")}
            <span className="text-m_error_500"> *</span>
          </div>

          <div className="flex items-center">
            <Select
              className="min-w-40"
              placeholder={t("op")}
              options={[
                common.t("delete"),
                t("hide_testcase"),
                t("normal_testcase"),
              ].map((a: any, i: number) => ({
                value: i,
                label: a,
              }))}
            />
            <div>
              <button
                onClick={() => {
                  setOpenCreateTestCase(true);
                }}
                className="ml-2 text-m_primary_500 underline body_semibold_14 underline-offset-4"
              >
                <PlusOutlined /> {t("create_testcase")}
              </button>
            </div>
          </div>
        </div>
        <div className="mt-3 w-full border rounded-lg p-4">
          <Table
            className="w-full"
            bordered={false}
            columns={columns}
            dataSource={testcases}
            pagination={false}
            rowKey={"id"}
            onRow={(data: any, index: any) =>
              ({
                style: {
                  background: "#FFFFFF",
                  borderRadius: "20px",
                },
              }) as HTMLAttributes<any>
            }
          />
        </div>

        <div className="body_semibold_14 my-3">{t("sample_code")}</div>
        <div className="w-full border rounded-lg p-4">
          <MInput
            formik={formik}
            id="function_name"
            name="function_name"
            title={t("func_name")}
            h="h-9"
          />
          <MDropdown
            options={serverLanguageList.map((r: CodingDataType) => ({
              value: r,
              label: r,
            }))}
            formik={formik}
            id="return_type"
            name="return_type"
            title={t("return_type")}
            h="h-9"
          />
          <div className="body_regular_14">{t("parameter")}</div>
          {parameterList.map((l: any, i: number) => {
            return (
              <div key={l.id} className=" w-full  flex items-start">
                <Select
                  onChange={(t) => {
                    var newList = _.cloneDeep(parameterList);
                    newList[i].returnType = t;
                    setParameterList(newList);
                  }}
                  options={serverLanguageList.map((r: CodingDataType) => ({
                    value: r,
                    label: r,
                  }))}
                  className="w-2/5 mt-1 h-9"
                />
                <div className="w-3" />
                <MInput
                  onChange={(val) => {
                    var newList = _.cloneDeep(parameterList);
                    newList[i].nameParameter = val.target.value;
                    setParameterList(newList);
                  }}
                  placeholder={`Parameter ${i + 1}`}
                  h="h-9"
                  id={`pram-${i}`}
                  name={`param-${i}`}
                />

                <button
                  onClick={() => {
                    var newList = _.cloneDeep(parameterList);
                    newList.splice(i, 1);
                    setParameterList(newList);
                  }}
                  className="text-neutral-500 text-2xl mt-[8px] ml-2"
                >
                  <CloseCircleOutlined />
                </button>
              </div>
            );
          })}
          <div className="w-full flex justify-end">
            <button
              onClick={() => {
                setParameterList([
                  ...parameterList,
                  {
                    id: uuidv4(),
                    nameParameter: undefined,
                    returnType: undefined,
                  },
                ]);
              }}
              className="ml-2  underline body_regular_14 underline-offset-4"
            >
              <PlusOutlined /> {t("add_parameter")}
            </button>
          </div>
          <div className="mt-3 flex justify-center w-full">
            <MButton
              onClick={() => {
                var sampleCode = genSampleCode({
                  lang,
                  params: parameterList as any,
                  functionName: formik.values?.function_name,
                  returnType: formik.values?.return_type,
                });
                setCode(sampleCode);
              }}
              h="h-11"
              text={t("create_sample_code")}
            />
          </div>
          <Divider />
          <div className="w-full rounded-lg bg-m_neutral_100">
            <div className="w-full p-3 flex">
              <div className="body_semibold_14"> {t("sample_code")}</div>
              <div className="flex-grow" />
              <Select
                onChange={(f) => {
                  setLang(f);
                }}
                className="min-w-28"
                options={checkedLang?.map((a: any, i: number) => {
                  var lan = plainOptions.find((k: any) => k.value == a);
                  return {
                    value: lan?.value,
                    label: lan?.label,
                  };
                })}
              />
            </div>
            <CodeMirror
              value={code}
              lang={lang}
              theme={dracula}
              height="300px"
              extensions={[renderExtension(lang ?? "") as any]}
              onChange={(v) => {
                setCode(v);
              }}
            />
          </div>
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

export default CodingQuestion;
