"use client";
import HomeLayout from "@/app/layouts/HomeLayout";
import { Breadcrumb } from "antd";
import React, { useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { usePathname } from "next/navigation";
import MButton from "@/app/components/config/MButton";
import { useRouter } from "next/navigation";
import Share from "../components/Share";
import ExaminationCode from "../components/ExaminationCode";
import { RightOutlined } from "@ant-design/icons";

function CreateExaminationPage() {
  const { t } = useTranslation("exam");
  const common = useTranslation();
  const pathname = usePathname();
  const router = useRouter();

  const [share, setShare] = useState(0);
  const [code, setCode] = useState(0);

  return (
    <HomeLayout>
      <div className="h-5" />
      <Breadcrumb
        className="max-lg:ml-5 mb-3"
        separator={<RightOutlined />}
        items={[
          {
            title: (
              <Link className="body_regular_14" href={"/examination"}>
                {t("examination_list")}
              </Link>
            ),
          },
          {
            title: (
              <Link
                className={`${
                  pathname.includes("/examination/create")
                    ? "text-m_neutral_900"
                    : ""
                } body_regular_14`}
                href={"/examination/create"}
              >
                {t("create_examination")}
              </Link>
            ),
          },
        ]}
      />
      <div className=" flex max-lg:px-5 w-full justify-between mb-3">
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
            // loading={loading}
            // onClick={onSubmit}
            text={t("save_info")}
          />
        </div>
      </div>

      <div className="max-lg:mx-5  grid grid-cols-12 gap-6">
        <div className="max-lg:grid-cols-1 max-lg:mb-5 lg:col-span-6 col-span-12  h-fit rounded-lg">
          <Share value={share} setValue={setShare} />
          <div className="h-4" />
          <ExaminationCode value={code} setValue={setCode} />
          <div className="h-4" />
        </div>
        <div className="max-lg:grid-cols-1 max-lg:mb-5 p-4 lg:col-span-6 col-span-12 bg-white h-fit rounded-lg"></div>
      </div>
    </HomeLayout>
  );
}

export default CreateExaminationPage;
