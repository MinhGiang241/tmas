"use client";
import HomeLayout from "@/app/layouts/HomeLayout";
import { Breadcrumb } from "antd";
import React from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { usePathname } from "next/navigation";

function CreateExaminationPage() {
  const { t } = useTranslation("exam");
  const common = useTranslation();
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
    </HomeLayout>
  );
}

export default CreateExaminationPage;
