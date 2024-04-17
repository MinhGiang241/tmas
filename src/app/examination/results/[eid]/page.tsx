"use client";
import MBreadcrumb from "@/app/components/config/MBreadcrumb";
import HomeLayout from "@/app/layouts/HomeLayout";
import React from "react";
import { useTranslation } from "react-i18next";

function ResultPage({ params }: any) {
  const { t } = useTranslation("exam");
  const common = useTranslation();
  console.log({ params });

  return (
    <HomeLayout>
      <div className="h-3" />
      <MBreadcrumb
        items={[
          { text: t("exam_list"), href: "/exams" },
          {
            href: `/exams/details`,
            text: "sdkaksadjkl",
            active: true,
          },
        ]}
      />
      {params.eid}
    </HomeLayout>
  );
}

export default ResultPage;
