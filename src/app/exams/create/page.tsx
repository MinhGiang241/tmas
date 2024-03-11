"use client";
import HomeLayout from "@/app/layouts/HomeLayout";
import React, { useEffect, useState } from "react";
import { Breadcrumb, Radio, Space, Switch, Tree, TreeSelect } from "antd";
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
import { ExamData, ExamGroupData } from "@/data/exam";
import { RootState } from "@/redux/store";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { APIResults } from "@/data/api_results";
import {
  fetchDataExamGroup,
  setExamGroupLoading,
} from "@/redux/exam_group/examGroupSlice";
import { getExamGroupTest } from "@/services/api_services/exam_api";
import MTreeSelect from "@/app/components/config/MTreeSelect";
import { ExamFormData } from "@/data/form_interface";
import { auth } from "@/firebase/config";
import {
  createExaminationList,
  createSessionUpload,
  getInfoStudioDocuments,
  updateExam,
} from "@/services/api_services/examination_api";
import { errorToast, successToast } from "@/app/components/toast/customToast";
import TextArea from "antd/es/input/TextArea";
const EditorHook = dynamic(
  () => import("../components/react_quill/EditorWithUseQuill"),
  {
    ssr: false,
  },
);

function CreatePage({ exam }: any) {
  const { t } = useTranslation("exam");
  const common = useTranslation();
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);
  const [uploaded, setUploaded] = useState<any>([]);
  const [audio, setAudio] = useState<any>(exam?.playAudio ?? "OnlyOneTime");
  const [lang, setLang] = useState<any>(exam?.language ?? "Vietnamese");
  const [page, setPage] = useState<any>(
    exam?.examViewQuestionType ?? "SinglePage",
  );
  const [sw, setSw] = useState<boolean>(
    !exam ? false : exam?.examNextQuestion != "FreeByUser" ? true : false,
  );
  const [files, setFiles] = useState([]);
  const [idSession, setIdSession] = useState<string | undefined>();
  useEffect(() => {
    if (exam) {
      setAudio(exam?.playAudio);
      setLang(exam?.language);
      setPage(exam?.examViewQuestionType);
      setSw(exam?.examNextQuestion != "FreeByUser" ? true : false);
      setUploaded(exam?.idDocuments ?? []);
    }
    if (!idSession) {
      createIdSession();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exam]);

  const createIdSession = async () => {
    var res = await createSessionUpload();
    if (res.code != 0) {
      errorToast(res?.message ?? "");
    }
    setIdSession(res?.data);
  };

  interface FormValue {
    test_time?: string;
    exam_group?: string;
    doc_link?: string;
    exam_name?: string;
    describe?: string;
    tag?: string[];
  }
  console.log("exammmm", exam);

  const initialValues: FormValue = {
    test_time: exam?.timeLimitMinutes?.toString(),
    exam_group: exam?.idExamGroup,
    doc_link:
      exam?.externalLinks && exam?.externalLinks?.length != 0
        ? exam?.externalLinks[0]
        : undefined,
    exam_name: exam?.name,
    describe: exam?.description,
    tag: exam?.tags ?? [],
  };

  const validate = (values: FormValue) => {
    const errors: FormikErrors<FormValue> = {};
    if (!values.exam_name?.trim()) {
      errors.exam_name = "common_not_empty";
    }
    if (!values.exam_group?.trim()) {
      errors.exam_group = "common_not_empty";
    }

    return errors;
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validate,
    onSubmit: async (values: FormValue) => {
      setLoading(true);

      var submitDocs = [
        ...uploaded,
        ...files.filter((v: UploadedFile) => !v.error).map((i: any) => i.id),
      ];
      console.log("submitDocs", submitDocs);

      const dataSubmit: ExamFormData = {
        id: exam?.id,
        description: values.describe,
        name: values.exam_name?.trim(),
        externalLinks: values?.doc_link?.trim()
          ? [values.doc_link?.trim()]
          : [],
        tags: values?.tag ?? [],
        examNextQuestion: sw ? "ByOrderQuestion" : "FreeByUser",
        examViewQuestionType: page as "SinglePage" | "MultiplePages",
        timeLimitMinutes: parseInt(values?.test_time ?? "0"),
        playAudio: audio as "OnlyOneTime" | "MultipleTimes",
        studioId: user?.studio?._id,
        language: lang as "Vietnamese" | "English",
        idExamGroup: values?.exam_group,
        idDocuments: submitDocs,
        idSession: idSession,
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
        successToast(common.t("success_update"));
      } else {
        successToast(common.t("success_create_new"));
      }
      setLoading(false);
      router.push("/exams");
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

  return (
    <HomeLayout>
      <div className="h-5" />
      <Breadcrumb
        className="max-lg:ml-5 mb-3"
        separator=">"
        items={[
          {
            title: (
              <Link className="body_regular_14" href={"/exams"}>
                {t("exam_list")}
              </Link>
            ),
          },
          {
            title: (
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
        <div className="my-3 body_semibold_20">{t("create_exam")}</div>
        <div className="flex">
          <MButton
            onClick={() => {
              router.back();
            }}
            type="secondary"
            text={t("reject")}
          />
          <div className="w-4" />
          <MButton
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
        </div>

        <div className="max-lg:mx-5 max-lg:grid-cols-1 max-lg:mb-5 lg:col-span-8 col-span-12 bg-white h-fit rounded-lg p-4">
          {/* <CustomEditor /> */}

          <MTextArea
            defaultValue={exam?.name}
            maxLength={225}
            required
            placeholder={t("enter_exam_name")}
            id="exam_name"
            name="exam_name"
            title={t("exam_name")}
            action={
              <div className="body_regular_14 text-m_neutral_500">
                {`${formik.values["exam_name"]?.length ?? 0}/225`}
              </div>
            }
            formik={formik}
          />

          <MDropdown
            mode="tags"
            placeholder={t("enter_tag")}
            id="tag"
            name="tag"
            title={t("tag")}
            formik={formik}
          />
          {/*
          <MRichText
            id="describe"
            name="describe"
            formik={formik}
            title={t("describe")}
            action={
              <div className="body_regular_14 text-m_neutral_500">
                {"0/500"}
              </div>
            }
          />
          <LexicalEditor />
                    <Editor />
          */}
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
