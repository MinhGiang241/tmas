"use client";
import HomeLayout from "@/app/layouts/HomeLayout";
import React, { useEffect, useState } from "react";
import { Breadcrumb, Input, Radio, Space, Switch, Tooltip } from "antd";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import MButton from "@/app/components/config/MButton";

import MTextArea from "@/app/components/config/MTextArea";
import { usePathname, useRouter } from "next/navigation";
import MInput from "@/app/components/config/MInput";
import MDropdown from "@/app/components/config/MDropdown";
import DragDropUpload, { UploadedFile } from "../components/DragDropUpload";
import { FormikErrors, useFormik } from "formik";
import dynamic from "next/dynamic";
import { ExamGroupData } from "@/data/exam";
import { RootState } from "@/redux/store";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { APIResults } from "@/data/api_results";
import {
  fetchDataExamGroup,
  setExamGroupLoading,
} from "@/redux/exam_group/examGroupSlice";
import { getExamGroupTest } from "@/services/api_services/exam_api";
import MTreeSelect from "@/app/components/config/MTreeSelect";
import { ExamFormData, ExamType, ScoreRank } from "@/data/form_interface";
import { RightOutlined } from "@ant-design/icons";
import NoticeIcon from "@/app/components/icons/blue-notice.svg";
import { CloseCircleOutlined, PlusOutlined } from "@ant-design/icons";

import {
  createExaminationList,
  createSession,
  updateExam,
} from "@/services/api_services/examination_api";
import { errorToast, successToast } from "@/app/components/toast/customToast";
import { getTags } from "@/services/api_services/tag_api";
import { TagData } from "@/data/tag";
import { addMoreAnswer } from "@/redux/questions/questionSlice";
const EditorHook = dynamic(
  () => import("../components/react_quill/EditorWithUseQuill"),
  {
    ssr: false,
  },
);

function CreatePage({ exam, isEdit }: any) {
  const { t } = useTranslation("exam");
  const common = useTranslation();
  const router = useRouter();
  console.log(exam, "aaaaa");

  const [loading, setLoading] = useState<boolean>(false);
  const [uploaded, setUploaded] = useState<any>([]);
  const [audio, setAudio] = useState<any>(exam?.playAudio ?? "OnlyOneTime");
  const [lang, setLang] = useState<any>(exam?.language ?? "Vietnamese");
  const [transfer, setTransfer] = useState<any>("FreeByUser");
  const [page, setPage] = useState<any>(
    exam?.examViewQuestionType ?? "SinglePage",
  );
  const [sw, setSw] = useState<boolean>(
    !exam ? false : exam?.changePositionQuestion ?? false,
  );
  const [files, setFiles] = useState([]);
  const [idSession, setIdSession] = useState<string | undefined>();
  const [selectedButton, setSelectedButton] = useState<ExamType>(
    exam?.id ? exam?.examType : ExamType.Test,
  );

  const handleButtonClick = (buttonType: any) => {
    setSelectedButton(buttonType);
  };

  const [inputFields, setInputFields] = useState<ScoreRank[]>(
    //[{ label: "", fromScore: 0, toScore: undefined }]
    exam?.id ? exam?.scoreRanks : [],
  );

  const handleAddFields = () => {
    const lastField = inputFields[inputFields.length - 1];
    setInputFields([
      ...inputFields,
      {
        label: "",
        fromScore: lastField ? lastField.toScore : 0,
        toScore: undefined,
      },
    ]);
  };

  const handleRemoveFields = (index: any) => {
    const values = [...inputFields];
    values.splice(index, 1);
    setInputFields(values);
  };

  // const handleInputChange = (index: any, event: any) => {
  //   const values = [...inputFields];
  //   const { name, value } = event.target;

  //   if (name === "point_evaluation") {
  //     values[index].label = value;
  //   } else if (name === "from") {
  //     values[index].fromScore = parseInt(value);
  //   } else if (name === "to") {
  //     const newToValue = parseInt(value);
  //     const fromScore = values[index].fromScore ?? 0;
  //     const expectedToScore = fromScore + 1;
  //     if (index > 0 && newToValue !== expectedToScore) {
  //       errorToast("Đơn vị điểm đến phải bằng từ điểm + 1, vui lòng nhập lại.");
  //       return;
  //     } else {
  //       values[index].toScore = newToValue;
  //     }
  //   }

  //   setInputFields(values);
  // };

  const handleInputChange = (index: any, event: any) => {
    const values = [...inputFields];
    const { name, value } = event.target;

    if (name === "point_evaluation") {
      values[index].label = value;
    } else if (name === "from") {
      values[index].fromScore = parseInt(value);
    } else if (name === "to") {
      const newToValue = parseInt(value);
      const fromScore =
        values[index].fromScore ??
        (index === 0 ? 0 : values[index - 1].toScore ?? 0);
      const expectedToScore = fromScore + 1;

      if (index === 0) {
        // Điều kiện cho hàng đầu tiên
        values[index].toScore = newToValue;
      } else {
        // Điều kiện cho các hàng tiếp theo
        if (newToValue !== expectedToScore) {
          errorToast(
            "Đơn vị điểm đến phải bằng từ điểm + 1, vui lòng nhập lại.",
          );
          return;
        } else {
          values[index].toScore = newToValue;
        }
      }
    }

    setInputFields(values);
  };

  // const [totalToScore, setTotalToScore] = useState(0);

  // useEffect(() => {
  //   const total = inputFields?.reduce(
  //     (accumulator, field) => accumulator + (Number(field.toScore) || 0),
  //     0
  //   );
  //   setTotalToScore(total);
  // }, [inputFields]);

  const createSessionId = async () => {
    if (isEdit && exam) {
      var dataSessionId = await createSession(exam?.idSession);
      console.log("dataSessionId edit", dataSessionId);
      console.log("exam idSession", exam?.idSession);

      if (dataSessionId?.code == 0) {
        setIdSession(dataSessionId?.data);
      }
    } else if (!isEdit) {
      var dataSessionId = await createSession();
      console.log("dataSessionId notEdit", dataSessionId);
      if (dataSessionId?.code == 0) {
        setIdSession(dataSessionId?.data);
      }
    }
  };
  // useOnMountUnsafe(createSessionId, [exam]);
  console.log("exam", exam, selectedButton, inputFields);
  useEffect(() => {
    createSessionId();
    if (exam) {
      setAudio(exam?.playAudio);
      setLang(exam?.language);
      setPage(exam?.examViewQuestionType);
      setSw(exam?.changePositionQuestion ?? false);
      setTransfer(exam?.examNextQuestion ?? "FreeByUser");
      setUploaded(exam?.idDocuments ?? []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exam]);

  interface FormValue {
    test_time?: string;
    exam_group?: string;
    doc_link?: string;
    exam_name?: string;
    describe?: string;
    tag?: string[];
  }
  // console.log("exammmm", exam);

  const initialValues: FormValue = {
    test_time: exam?.timeLimitMinutes?.toString(),
    exam_group: exam?.idExamGroup,
    doc_link:
      exam?.externalLinks && exam?.externalLinks?.length != 0
        ? exam?.externalLinks[0]
        : undefined,
    exam_name: exam?.name,
    describe: exam?.description,
    tag: exam?.tags?.map((d: any) => d?.name) ?? [],
  };

  const validate = (values: FormValue) => {
    const errors: FormikErrors<FormValue> = {};
    if (!values.exam_name?.trim()) {
      errors.exam_name = "common_not_empty";
    }
    if (!values.exam_group?.trim()) {
      errors.exam_group = "common_not_empty";
    }
    if (values?.tag && values?.tag?.length > 10) {
      errors.tag = "tag_limit";
    }
    return errors;
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validate,
    onSubmit: async (values: FormValue) => {
      const validateFields =
        selectedButton === ExamType.Survey &&
        inputFields.length > 0 &&
        inputFields.some((x: any) => x?.label.trim() === "");
      if (validateFields) {
        errorToast(
          "Tên hạng là trường bắt buộc, hãy nhập để phân hạng kết quả.",
        );
        return;
      }
      setLoading(true);

      var submitDocs = [
        ...uploaded,
        ...files.filter((v: UploadedFile) => !v.error).map((i: any) => i.id),
      ];
      console.log("submitDocs", submitDocs);
      // var tagUpdate = await createTag(values?.tag ?? []);
      var studio = user.studios?.find((r) => r.ownerId === user.studio?._id);

      const dataSubmit: ExamFormData = {
        id: exam?.id,
        description: values.describe,
        name: values.exam_name?.trim(),
        externalLinks: values?.doc_link?.trim()
          ? [values.doc_link?.trim()]
          : [],
        tags: values.tag ?? [],
        //  idTags: tagUpdate?.data ?? [],
        examNextQuestion: transfer,
        changePositionQuestion: sw,
        examViewQuestionType: page as "SinglePage" | "MultiplePages",
        timeLimitMinutes: values?.test_time
          ? parseInt(values?.test_time)
          : undefined,
        playAudio: audio as "OnlyOneTime" | "MultipleTimes",
        studioId: studio?._id,
        language: lang as "Vietnamese" | "English",
        idExamGroup: values?.exam_group,
        idDocuments: submitDocs,
        idSession: idSession,
        examType: selectedButton,
        scoreRanks: inputFields,
      };

      const results = exam?.id
        ? await updateExam(dataSubmit)
        : await createExaminationList(dataSubmit);
      if (results?.code != 0) {
        errorToast(results?.message ?? "");
        setLoading(false);
        return;
      }
      if (exam?.id) {
        successToast(results?.message ?? common.t("success_update"));
      } else {
        successToast(results?.message ?? common.t("success_create_new"));
      }
      setLoading(false);
      router.push(`/exams/details/${results?.data}`);
    },
  });

  const onSubmit = (e: any) => {
    e.preventDefault();
    Object.keys(initialValues).map(async (v) => {
      await formik.setFieldTouched(v, true);
    });
    formik.handleSubmit();
  };
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: RootState) => state.user.user);

  useEffect(() => {
    if (user?.studio?._id) {
      dispatch(fetchDataExamGroup(async () => loadExamTestList(true)));
    }
    onSearchTags("");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, exam]);

  const loadExamTestList = async (init?: boolean) => {
    if (init) {
      dispatch(setExamGroupLoading(true));
    }

    var dataResults: APIResults = await getExamGroupTest({
      text: "",
      studioId: user?.studio?._id,
    });

    if (dataResults.code != 0) {
      return [];
    } else {
      var data = dataResults?.data as ExamGroupData[];
      var levelOne = data?.filter((v: ExamGroupData) => v.level === 0);
      var levelTwo = data?.filter((v: ExamGroupData) => v.level === 1);

      var list = levelOne.map((e: ExamGroupData) => {
        var childs = levelTwo.filter(
          (ch: ExamGroupData) => ch.idParent === e.id,
        );
        return { ...e, childs };
      });
      console.log("list", list);
      return list;
    }
  };

  const examGroup = useAppSelector((state: RootState) => state.examGroup?.list);

  const optionSelect = (examGroup ?? []).map((v: ExamGroupData, i: number) => ({
    title: <p>{v?.name}</p>,
    value: v?.id,
    disabled: true,
    isLeaf: false,
    children: [
      ...(v?.childs ?? []).map((e: ExamGroupData, i: number) => ({
        title: e?.name,
        value: e?.id,
      })),
    ],
  }));

  const [optionTag, setOptionTag] = useState<any[]>([]);
  const onSearchTags = async (searchKey: any) => {
    console.log("onSearchKey", searchKey);
    const data = await getTags(
      searchKey
        ? {
            "Names.Name": "Name",
            "Names.InValues": searchKey,
            "Paging.StartIndex": 0,
            "Paging.RecordPerPage": 100,
          }
        : { "Paging.StartIndex": 0, "Paging.RecordPerPage": 100 },
    );
    if (data?.code != 0) {
      return [];
    }
    console.log("dataTag", data);

    var op = (data?.data?.records ?? []).map((e: TagData) => ({
      value: e?.name,
      label: e.name,
    }));
    setOptionTag(op);
  };

  return (
    <HomeLayout>
      <div className="h-5" />

      <Breadcrumb
        className="max-lg:ml-5 mb-3"
        separator={<RightOutlined />}
        items={[
          {
            title: (
              <Link className="body_regular_14" href={"/exams"}>
                {t("exam_list")}
              </Link>
            ),
          },
          {
            title: exam ? (
              <button className="text-m_neutral_900 body_regular_14">
                {common.t("edit")}
              </button>
            ) : (
              <Link
                className={`${
                  pathname.includes("/exams/create") ? "text-m_neutral_900" : ""
                } body_regular_14`}
                href={"/exams/create"}
              >
                {t("create_exam")}
              </Link>
            ),
          },
        ]}
      />
      <div className="flex max-lg:px-5 w-full justify-between mb-3">
        <div className="my-3 body_semibold_20">
          {exam ? common.t("edit") : t("create_exam")}
        </div>
        <div className="flex">
          <MButton
            h="h-11"
            onClick={() => {
              router.back();
            }}
            type="secondary"
            text={t("reject")}
          />
          <div className="w-4" />
          <MButton
            h="h-11"
            loading={loading}
            onClick={onSubmit}
            text={exam ? common.t("update") : t("save_info")}
          />
        </div>
      </div>
      <div className="w-full grid grid-cols-12 gap-6 min-h-96">
        <div className="max-lg:mx-5 max-lg:grid-cols-1 max-lg:mb-5 p-4 lg:col-span-4 col-span-12 bg-white h-fit rounded-lg">
          <MInput
            onKeyDown={(e) => {
              if (!e.key.match(/[0-9]/g) && e.key != "Backspace") {
                e.preventDefault();
              }
            }}
            id="test_time"
            name="test_time"
            title={t("test_time")}
            placeholder={t("enter_time")}
            h="h-9"
            formik={formik}
          />

          <MTreeSelect
            options={optionSelect}
            required
            id="exam_group"
            name="exam_group"
            title={t("exam_group")}
            className="h-9"
            placeholder={t("select_exam_group")}
            formik={formik}
          />
          <div className="body_semibold_14 mb-2">{t("display_setting")}</div>

          <Radio.Group
            buttonStyle="solid"
            onChange={(v) => {
              setPage(v.target.value);
            }}
            value={page}
          >
            <Space direction="vertical">
              <Radio className=" caption_regular_14" value={"SinglePage"}>
                {t("one_question")}
              </Radio>
              <Radio className=" caption_regular_14" value={"MultiplePages"}>
                {t("all_question")}
              </Radio>
            </Space>
          </Radio.Group>

          <div className="body_semibold_14 my-2">
            {t("change_position_question")}
          </div>
          <Switch
            checked={sw}
            onChange={(v) => {
              setSw(v);
            }}
          />

          <div className="body_semibold_14 mb-2 mt-3">{t("transfer_past")}</div>
          <Radio.Group
            buttonStyle="solid"
            onChange={(v) => {
              setTransfer(v.target.value);
            }}
            value={transfer}
          >
            <Space direction="vertical">
              <Radio className=" caption_regular_14" value={"FreeByUser"}>
                {t("transfer_free")}
              </Radio>
              <Radio className=" caption_regular_14" value={"ByOrderQuestion"}>
                {t("transfer_turn")}
              </Radio>
            </Space>
          </Radio.Group>

          <div className="body_semibold_14 mb-2 mt-3">
            {common.t("language")}
          </div>
          <Radio.Group
            buttonStyle="solid"
            onChange={(v) => {
              setLang(v.target.value);
            }}
            value={lang}
          >
            <Space direction="vertical">
              <Radio className=" caption_regular_14" value={"Vietnamese"}>
                {common.t("vi")}
              </Radio>
              <Radio className=" caption_regular_14" value={"English"}>
                {common.t("en")}
              </Radio>
            </Space>
          </Radio.Group>

          <div className="body_semibold_14 mb-2 mt-3">
            {t("audio_question")}
          </div>
          <Radio.Group
            buttonStyle="solid"
            onChange={(v) => {
              setAudio(v.target.value);
            }}
            value={audio}
          >
            <Space direction="vertical">
              <Radio className=" caption_regular_14" value={"OnlyOneTime"}>
                {t("listen_one_time")}
              </Radio>
              <Radio className=" caption_regular_14" value={"MultipleTimes"}>
                {t("listen_many_time")}
              </Radio>
            </Space>
          </Radio.Group>

          <DragDropUpload
            idSession={idSession}
            uploaded={uploaded}
            setUploaded={setUploaded}
            files={files}
            setFiles={setFiles}
          />

          <div className="h-4" />
          <MInput
            h="h-9"
            id="doc_link"
            name="doc_link"
            title={t("doc_link")}
            placeholder={t("paste_link")}
            formik={formik}
          />
          <div className="h-4" />

          {selectedButton === ExamType.Survey ? (
            <div>
              <div className="text-sm font-semibold pb-1">
                {t("specific_6")}
              </div>
              <div className="caption_regular_14">{t("servey_9")}</div>
              <div className="caption_regular_14 font-semibold py-2">
                {t("total_point")}: {exam?.totalPoints}
                {/* {totalToScore} */}
              </div>
              {inputFields?.map((inputField, index) => (
                <div className="flex items-center pb-2" key={index}>
                  <MInput
                    placeholder="Tên hạng"
                    h="h-9"
                    id={`point_evaluation_${index}`}
                    name="point_evaluation"
                    value={inputField.label}
                    onChange={(event) => handleInputChange(index, event)}
                    // required
                    isTextRequire={false}
                  />
                  <div className="w-8" />
                  <Input
                    disabled
                    placeholder="Từ điểm"
                    className="h-9 w-[10rem] border-[0.5px] rounded-md hover:border-cyan-600"
                    id={`from_${index}`}
                    name="from"
                    type="number"
                    value={inputField.fromScore}
                    onChange={(event) => handleInputChange(index, event)}
                  />
                  <Input
                    placeholder="Đến điểm"
                    className="h-9 w-[10rem] border-[0.5px] rounded-md hover:border-cyan-600"
                    id={`to_${index}`}
                    name="to"
                    type="number"
                    value={inputField.toScore}
                    onChange={(event) => handleInputChange(index, event)}
                  />
                  <button
                    onClick={() => {
                      handleRemoveFields(index);
                    }}
                    className="text-neutral-500 text-2xl mt-[6px] ml-2"
                  >
                    <CloseCircleOutlined />
                  </button>
                </div>
              ))}
              <div className="w-full flex justify-end pt-2">
                <div className="w-full flex justify-end pt-2">
                  <button
                    onClick={handleAddFields}
                    className="underline body_regular_14 underline-offset-4 text-[#4D7EFF]"
                  >
                    <PlusOutlined /> {t("add_ranks")}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
        <div className="max-lg:mx-5 max-lg:grid-cols-1 max-lg:mb-5 lg:col-span-8 col-span-12 bg-white h-fit rounded-lg p-4">
          {/* <Cus etomEditor /> */}

          <MTextArea
            defaultValue={exam?.name}
            maxLength={255}
            required
            placeholder={t("enter_exam_name")}
            id="exam_name"
            name="exam_name"
            title={t("exam_name")}
            action={
              <div className="body_regular_14 text-m_neutral_500">
                {`${formik.values["exam_name"]?.length ?? 0}/255`}
              </div>
            }
            formik={formik}
          />

          <div className="p-3 border-m_neutral_200 border rounded-lg mb-3 flex flex-col items-start">
            <div className="body_semibold_14">{t("exam_form")} *</div>
            <div className="body_regular_14 ml-3">{t("exam_form_1")}</div>
            <div className="body_regular_14 ml-3">{t("exam_form_2")}</div>
            <div className="body_semibold_14 flex ml-3 w-full mt-3">
              <button
                // className={`w-1/2 flex justify-center items-center py-2 border relative`}
                className={`w-1/2 flex justify-center items-center py-2 border relative ${
                  selectedButton === ExamType.Test
                    ? "bg-sky-300 text-black"
                    : "bg-white text-black"
                }`}
                onClick={() => handleButtonClick(ExamType.Test)}
              >
                <span>{t("specific")}</span>
                <Tooltip
                  className="absolute right-2 body_regular_14"
                  arrow={false}
                  overlayInnerStyle={{
                    width: "482px",
                    background: "white",
                    color: "black",
                  }}
                  placement="bottom"
                  title={
                    <>
                      <div className="body_semibold_14">{t("specific_1")}</div>
                      <div>{t("specific_2")}</div>
                      <div>{t("specific_3")}</div>
                      <div className="ml-2">• {t("yesnoquestion")}</div>
                      <div className="ml-2">• {t("multianswer")}</div>
                      <div className="ml-2">• {t("coding")}</div>
                      <div className="ml-2">• {t("SQL")}</div>
                      <div className="ml-2">• {t("fillblank")}</div>
                      <div className="ml-2">• {t("pairing")}</div>
                      <div className="ml-2">• {t("essay")}</div>
                      <div>{t("specific_4")}</div>
                      <div>{t("specific_5")}</div>
                    </>
                  }
                >
                  <NoticeIcon />
                </Tooltip>
              </button>
              <button
                // className={`w-1/2 flex justify-center items-center py-2 relative border`}
                className={`w-1/2 flex justify-center items-center py-2 border relative ${
                  selectedButton === ExamType.Survey
                    ? "bg-sky-300 text-black"
                    : "bg-white text-black"
                }`}
                onClick={() => handleButtonClick(ExamType.Survey)}
              >
                <span>{t("servey")}</span>
                <Tooltip
                  className="absolute right-2 body_regular_14"
                  arrow={false}
                  overlayInnerStyle={{
                    width: "482px",
                    background: "white",
                    color: "black",
                  }}
                  placement="bottom"
                  title={
                    <>
                      <div className="body_semibold_14">{t("servey")}</div>
                      <div>{t("servey_1")}</div>
                      <div>{t("servey_2")}</div>
                      <div>{t("servey_3")}</div>
                      <div>{t("servey_4")}</div>
                      <div>{t("servey_5")}</div>
                      <div className="ml-2">• {t("servey_6")}</div>
                      <div className="ml-2">• {t("servey_7")}</div>
                      <div>{t("servey_8")}</div>
                    </>
                  }
                >
                  <NoticeIcon />
                </Tooltip>
              </button>
            </div>
          </div>
          <MDropdown
            namespace="exam"
            onSearch={onSearchTags}
            options={optionTag}
            mode="tags"
            placeholder={t("enter_tag")}
            id="tag"
            name="tag"
            title={t("tag")}
            formik={formik}
          />
          <EditorHook
            defaultValue={exam?.description}
            id="describe"
            name="describe"
            formik={formik}
            title={t("describe")}
            maxLength={500}
          />
        </div>
      </div>
    </HomeLayout>
  );
}

export default CreatePage;
