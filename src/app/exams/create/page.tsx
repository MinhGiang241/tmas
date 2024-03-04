"use client";
import HomeLayout from "@/app/layouts/HomeLayout";
import React, { useState } from "react";
import { Breadcrumb } from "antd";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import MButton from "@/app/components/config/MButton";
import CustomEditor from "@/app/components/config/CustomCkEditor";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import MRichText from "@/app/components/config/MRichText";

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
        <div className=" col-span-8 bg-white h-full rounded-lg p-4">
          {/* <CustomEditor /> */}
          <MRichText />
        </div>
      </div>
    </HomeLayout>
  );
}

export default CreatePage;
