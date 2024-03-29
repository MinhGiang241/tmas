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
import React, { HTMLAttributes, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { PlusOutlined, CloseCircleOutlined } from "@ant-design/icons";
import TrashIcon from "@/app/components/icons/trash.svg";
import EditIcon from "@/app/components/icons/edit.svg";
import Table, { ColumnsType } from "antd/es/table";
import {
  rowEndStyle,
  rowStartStyle,
  rowStyle,
} from "@/app/account/account-info/AccountInfo";
import _, { findIndex } from "lodash";
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
  revertLanguage,
  serverLanguageList,
} from "@/services/ui/coding_services";
import { FormikErrors, useFormik } from "formik";
import cheerio from "cheerio";
import {
  BaseQuestionFormData,
  CodingDataType,
  CodingQuestionFormData,
  ParameterType,
} from "@/data/form_interface";
import { v4 as uuidv4 } from "uuid";
import { setQuestionLoading } from "@/redux/questions/questionSlice";
import {
  createCodingQuestion,
  updateCodingQuestion,
} from "@/services/api_services/question_api";
import { errorToast, successToast } from "@/app/components/toast/customToast";
import { useOnMountUnsafe } from "@/services/ui/useOnMountUnsafe";
import ConfirmModal from "@/app/components/modals/ConfirmModal";
import NoticeIcon from "@/app/components/icons/notice.svg";

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

function CodingQuestion({
  questionGroups: examGroups,
  submitRef,
  idExam,
  question,
}: Props) {
  const { t } = useTranslation("exam");
  const common = useTranslation();

  const existedQuest =
    question && question?.questionType === "Coding"
      ? (question as CodingQuestionFormData)
      : undefined;

  useOnMountUnsafe(() => {
    if (existedQuest) {
      setCheckedLang(
        existedQuest?.content?.codeLanguages?.map((e: string) =>
          revertLanguage(e),
        ),
      );
      setCodingScroringMethod(
        existedQuest?.content?.codingScroringMethod ?? "PassAllTestcase",
      );
      setCode(existedQuest?.content?.codingTemplate?.template ?? undefined);
      var parameters =
        existedQuest?.content?.codingTemplate?.parameterInputs?.map<ParameterType>(
          (q) => ({
            nameParameter: q.nameParameter,
            returnType: q.returnType,
            id: uuidv4(),
          }),
        );
      setParameterList(parameters ?? []);
      var tests = existedQuest?.content?.testcases?.map((t) => ({
        id: uuidv4(),
        name: t.name,
        inputData: t.inputData,
        outputData: t.outputData,
      }));
      setTestcases(tests ?? []);
    }
  });

  const [codingScroringMethod, setCodingScroringMethod] = useState<
    "PassAllTestcase" | "EachTestcase"
  >("PassAllTestcase");
  const [checkedLang, setCheckedLang] = useState<any[]>([
    "php",
    "javascript",
    "java",
    "python",
    "ruby",
    "c#",
  ]);
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
      title: <div className="w-1/3 flex justify-center">{t("testcase")}</div>,
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
              setActive(data);
              setOpenCreateTestCase(true);
            }}
          >
            <EditIcon />
          </button>

          <button
            className="ml-2"
            onClick={() => {
              setActive(data);
              setOpenDelete(true);
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
    [key: string]: any;
  }

  const initialValues: CodingQuestionValue = {
    point: question?.numberPoint?.toString() ?? undefined,
    question_group: question?.idGroupQuestion ?? undefined,
    question: question?.question ?? undefined,
    explain: existedQuest?.content?.codingTemplate?.explainAnswer ?? undefined,
    function_name:
      existedQuest?.content?.codingTemplate?.nameFunction ?? undefined,
    return_type: existedQuest?.content?.codingTemplate?.returnType ?? undefined,
  };
  const validate = async (values: CodingQuestionValue) => {
    const errors: FormikErrors<CodingQuestionValue> = {};
    const $ = cheerio.load(values.question ?? "");

    console.log("validating", parameterList);
    if (parameterList.length != 0) {
      parameterList.map(async (p: ParameterType, i: number) => {
        // await formik.setFieldValue(`param_name_${i + 1}`, p.nameParameter);
        // await formik.setFieldValue(`param_type_${i + 1}`, p.returnType);
        if (!p.nameParameter) {
          errors[`param_name_${p.id}`] = "common_not_empty";
        }
        if (!p.returnType) {
          errors[`param_type_${p.id}`] = "common_not_empty";
        }
      });
    }
    //  /[\\/|"`?<>;!@#$%^&*().,\-\+ ]+/g
    if (!code) {
      errors.code = common.t("not_empty");
    }
    if (!values.question) {
      errors.question = "common_not_empty";
    }
    if (!values.explain) {
      errors.explain = "common_not_empty";
    }
    if (!values.question_group) {
      errors.question_group = "common_not_empty";
    }
    if (!values.function_name) {
      errors.function_name = "common_not_empty";
    } else if (values.function_name?.length < 3) {
      errors.function_name = "func_name_not_less_than_3";
    } else if (values.function_name.match(/[^a-zA-Z0-9-_]/g)) {
      errors.function_name = "func_name_invalid";
    }
    if (!values.return_type) {
      errors.return_type = "common_not_empty";
    }
    if (!values.point) {
      errors.point = "common_not_empty";
    } else if (values.point?.match(/\.\d{3,}/g)) {
      errors.point = "2_digit_behind_dot";
    } else if (values.point?.match(/(.*\.){2,}/g)) {
      errors.point = "invalid_number";
    }
    console.log("error", errors);

    return errors;
  };
  const formik = useFormik({
    initialValues,
    validate,
    onSubmit: async (values: CodingQuestionValue) => {
      if (checkedLang.length === 0) {
        errorToast(t("at_least_1_language"));
        return;
      }
      dispatch(setQuestionLoading(true));
      const submitData: CodingQuestionFormData = {
        id: question?.id,
        idExam: question?.idExam ?? idExam,
        question: values.question,
        idExamQuestionPart:
          question?.idExamQuestionPart ?? idExamQuestionPart ?? undefined,
        idGroupQuestion: values.question_group,
        numberPoint: values.point ? parseFloat(values.point) : undefined,
        questionType: "Coding",
        content: {
          codeLanguages: [
            ...checkedLang.map((la: any) => mapLanguage(la)),
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
      var res = question
        ? await updateCodingQuestion(submitData)
        : await createCodingQuestion(submitData);
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
  const [active, setActive] = useState<TestcaseValue | undefined>();
  const [openDelete, setOpenDelete] = useState<boolean>(false);

  return (
    <div className="grid grid-cols-12 gap-4 max-lg:px-5">
      <ConfirmModal
        text={t("confirm_delete_testcase")}
        open={openDelete}
        onCancel={() => {
          setOpenDelete(false);
        }}
        onOk={() => {
          setTestcases(testcases.filter((e: any) => e.id != active?.id));
          successToast(t("success_delete_testcase"));
          setOpenDelete(false);
          setActive(undefined);
        }}
      />
      <button
        className="hidden"
        onClick={async () => {
          await formik.handleSubmit();
          Object.keys(formik.errors).map(async (v) => {
            await formik.setFieldTouched(v, true);
          });
          console.log("touched", formik.errors);
        }}
        ref={submitRef}
      />
      <CreateTestCaseModal
        testcase={active}
        onOk={(testCase: TestcaseValue, isEdit: boolean) => {
          if (isEdit) {
            var testIndex = testcases.findIndex((e) => e.id === testCase.id);
            var newList = _.cloneDeep(testcases);
            newList[testIndex] = testCase;
            setTestcases(newList);
          } else {
            setTestcases([...testcases, testCase]);
          }
          setActive(undefined);
        }}
        open={openCreateTestcase}
        onCancel={() => {
          setActive(undefined);
          setOpenCreateTestCase(false);
        }}
      />
      <div className="bg-white rounded-lg lg:col-span-4 col-span-12 p-5 h-fit">
        <MInput
          onKeyDown={(e) => {
            if (!e.key.match(/[0-9.]/g) && e.key != "Backspace") {
              e.preventDefault();
            }
          }}
          namespace="exam"
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
          required
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
            {/* <Select */}
            {/*   className="min-w-40" */}
            {/*   placeholder={t("op")} */}
            {/*   options={[ */}
            {/*     common.t("delete"), */}
            {/*     t("hide_testcase"), */}
            {/*     t("normal_testcase"), */}
            {/*   ].map((a: any, i: number) => ({ */}
            {/*     value: i, */}
            {/*     label: a, */}
            {/*   }))} */}
            {/* /> */}
            <div>
              <button
                onClick={() => {
                  setActive(undefined);
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
            required
            namespace="exam"
            maxLength={50}
            formik={formik}
            id="function_name"
            name="function_name"
            title={t("func_name")}
            h="h-9"
          />
          <MDropdown
            required
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
          {parameterList.map((l: ParameterType, i: number) => {
            return (
              <div key={l.id} className=" w-full  flex items-start">
                <div className="w-2/5">
                  <MDropdown
                    touch={formik.touched[`param_type_${l?.id}`] as boolean}
                    error={formik.errors[`param_type_${l?.id}`] as string}
                    onBlur={async (_) => {
                      await formik.setFieldTouched(`param_type_${l?.id}`, true);
                      formik.validateForm();
                    }}
                    h="h-9"
                    id={`pram_type_${l?.id}`}
                    name={`param_type_${l?.id}`}
                    value={l.returnType}
                    setValue={(na: any, val: any) => {
                      var newList = _.cloneDeep(parameterList);
                      newList[i].returnType = val;
                      setParameterList(newList);
                    }}
                    options={serverLanguageList.map((r: CodingDataType) => ({
                      value: r,
                      label: r,
                    }))}
                    className=" h-9"
                  />
                </div>
                <div className="w-3" />
                {/* {formik.errors[`param_name_${i + 1}`]?.toString()} */}
                <div className="w-3/5">
                  <MInput
                    extend
                    isTextRequire={false}
                    onBlur={async (s) => {
                      await formik.setFieldTouched(`param_name_${l?.id}`, true);
                      formik.validateForm();
                    }}
                    error={formik.errors[`param_name_${l?.id}`] as string}
                    touch={formik.touched[`param_name_${l?.id}`] as boolean}
                    value={l.nameParameter}
                    onChange={(val) => {
                      var newList = _.cloneDeep(parameterList);
                      newList[i].nameParameter = val.target.value;
                      setParameterList(newList);
                      formik.validateForm();
                    }}
                    placeholder={`Parameter ${i + 1}`}
                    h="h-9"
                    id={`pram_name_${l?.id}`}
                    name={`param_name-${l?.id}`}
                  />
                </div>

                <button
                  onClick={() => {
                    var newList = _.cloneDeep(parameterList);
                    newList.splice(i, 1);
                    setParameterList(newList);
                    formik.validateForm();
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
              onClick={async () => {
                var sampleCode = genSampleCode({
                  lang,
                  params: parameterList as any,
                  functionName: formik.values?.function_name,
                  returnType: formik.values?.return_type,
                });
                setCode(sampleCode);
                await formik.setFieldTouched("code", true);
                formik.validateForm();
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
                placeholder={common.t("language")}
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
              onBlur={async () => {
                await formik.setFieldTouched("code", true);
                formik.validateForm();
              }}
              value={code}
              lang={lang}
              theme={dracula}
              height="300px"
              extensions={[renderExtension(lang ?? "") as any]}
              onChange={(v) => {
                setCode(v);
                console.log(
                  "errorcode",
                  formik.errors.code,
                  formik.touched.code,
                );

                formik.validateForm();
              }}
            />
          </div>{" "}
          {formik.errors.code && formik.touched.code && (
            <div className={`flex items-center `}>
              <div className="min-w-4">
                <NoticeIcon />
              </div>
              <div className={`text-m_error_500 body_regular_14`}>
                {(formik.errors?.code ?? "") as string}
              </div>
            </div>
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

export default CodingQuestion;
