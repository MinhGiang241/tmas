"use client";
import HomeLayout from "@/app/layouts/HomeLayout";
import React, { useState } from "react";
import { Breadcrumb } from "antd";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import MButton from "@/app/components/config/MButton";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

function CreatePage() {
  const { t } = useTranslation("exam");
  const common = useTranslation();

  return (
    <HomeLayout>
      <div className="h-5" />
      <Breadcrumb
        separator=">"
        items={[
          {
            title: <Link href={"/exams"}>{t("exam_list")}</Link>,
          },
          {
            title: <Link href={"/exams/create"}> {t("create_exam")}</Link>,
          },
        ]}
      />
      <div className="flex w-full justify-between mb-3">
        <div className="my-3 body_semibold_20">{t("create_exam")}</div>
        <div className="flex">
          <MButton type="secondary" text={t("reject")} />
          <div className="w-4" />
          <MButton text={common.t("update")} />
        </div>
      </div>
      <div className="w-full grid grid-cols-12 gap-6 min-h-96">
        <div className="col-span-4 bg-white h-full rounded-lg"></div>
        <div className=" col-span-8 bg-white h-full rounded-lg">
          <CKEditor
            editor={ClassicEditor}
            data="<p>Hello from CKEditor&nbsp;5!</p>"
            onReady={(editor) => {
              // You can store the "editor" and use when it is needed.
              console.log("Editor is ready to use!", editor);
            }}
            onChange={(event) => {
              console.log(event);
            }}
            onBlur={(event, editor) => {
              console.log("Blur.", editor);
            }}
            onFocus={(event, editor) => {
              console.log("Focus.", editor);
            }}
          />{" "}
        </div>
      </div>
    </HomeLayout>
  );
}

export default CreatePage;
