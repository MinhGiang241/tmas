"use client";
import HomeLayout from "@/app/layouts/HomeLayout";
import React, { useState } from "react";
import { Breadcrumb, Radio, Space, Switch } from "antd";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import MButton from "@/app/components/config/MButton";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
// import MRichText from "@/app/components/config/MRichText";
import MTextArea from "@/app/components/config/MTextArea";
import { usePathname, useRouter } from "next/navigation";
import MInput from "@/app/components/config/MInput";
import MDropdown from "@/app/components/config/MDropdown";
import DragDropUpload from "../components/DragDropUpload";
import { FormikErrors, useFormik } from "formik";
import dynamic from "next/dynamic";

const MRichText = dynamic(() => import("@/app/components/config/MRichText"), {
  ssr: false,
});

function CreatePage() {
  const { t } = useTranslation("exam");
  const common = useTranslation();
  const router = useRouter();

  const [audio, setAudio] = useState("1");
  const [lang, setLang] = useState("vi");
  const [page, setPage] = useState("One");
  const [sw, setSw] = useState<boolean>(true);

  interface FormValue {
    test_time?: string;
    exam_group?: string;
    doc_link?: string;
    exam_name?: string;
    describe?: string;
    tag?: [];
  }

  const initialValues: FormValue = {
    test_time: undefined,
    exam_group: undefined,
    doc_link: undefined,
    exam_name: undefined,
    describe: undefined,
    tag: [],
  };
  const validate = (values: FormValue) => {
    const errors: FormikErrors<FormValue> = {};

    return errors;
  };

  const formik = useFormik({
    initialValues,
    validate,
    onSubmit: async (values: FormValue) => {
      console.log("values", values);
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
  return (
    <HomeLayout>
      <div className="h-5" />
      <Breadcrumb
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
      <div className="flex w-full justify-between mb-3">
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
          <MButton onClick={onSubmit} text={common.t("update")} />
        </div>
      </div>
      <div className="w-full grid grid-cols-12 gap-6 min-h-96">
        <div className="max-lg:mx-5 max-lg:grid-cols-1 max-lg:mb-5 p-4 lg:col-span-4 col-span-12 bg-white h-full rounded-lg">
          <MInput
            id="test_time"
            name="test_time"
            title={t("test_time")}
            placeholder={t("enter_time")}
            h="h-9"
            formik={formik}
          />

          <MDropdown
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
              <Radio className=" caption_regular_14" value={"One"}>
                {t("one_question")}
              </Radio>
              <Radio className=" caption_regular_14" value={"All"}>
                {t("all_question")}
              </Radio>
            </Space>
          </Radio.Group>

          <div className="body_semibold_14 my-2">
            {t("change_position_question")}
          </div>
          <Switch
            defaultChecked
            value={sw}
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
              <Radio className=" caption_regular_14" value={"en"}>
                {common.t("vi")}
              </Radio>
              <Radio className=" caption_regular_14" value={"vi"}>
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
              <Radio className=" caption_regular_14" value={"1"}>
                {t("listen_one_time")}
              </Radio>
              <Radio className=" caption_regular_14" value={"2"}>
                {t("listen_many_time")}
              </Radio>
            </Space>
          </Radio.Group>

          <DragDropUpload />

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
            maxLength={225}
            required
            id="exam_name"
            name="exam_name"
            title={t("exam_name")}
            action={
              <div className="body_regular_14 text-m_neutral_500">
                {"0/225"}
              </div>
            }
            formik={formik}
          />
          <MDropdown
            mode="multiple"
            options={[
              { value: "1", label: <div>leee</div> },
              {
                value: "2",
                label: <div>222</div>,
              },
            ]}
            id="tag"
            name="tag"
            title={t("tag")}
            formik={formik}
          />
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
        </div>
      </div>
    </HomeLayout>
  );
}

export default CreatePage;
