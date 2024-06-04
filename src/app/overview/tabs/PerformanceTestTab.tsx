import { Divider } from "antd";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import ExamListTable from "../components/ExamListTable";
import ExaminationListTable from "../components/ExaminationListTable";

function PerformanceTestTab() {
  const router = useRouter();
  const { t } = useTranslation("exam");
  const common = useTranslation();
  const [active, setActive] = useState("0");
  return (
    <div className="p-5 bg-white w-full rounded-lg flex flex-col items-center mt-2">
      <div className="flex border border-m_neutral_200 rounded-lg p-1">
        <button
          onClick={() => {
            setActive("0");
          }}
          className={`p-[10px] rounded-lg body_semibold_14 ${
            active == "0"
              ? "bg-m_primary_100 text-m_primary_500"
              : "text-m_neutral_400"
          }`}
        >
          {t("exam_list")}
        </button>
        <button
          onClick={() => {
            setActive("1");
          }}
          className={`p-[10px] rounded-lg body_semibold_14 ${
            active == "1"
              ? "bg-m_primary_100 text-m_primary_500"
              : "text-m_neutral_400"
          }`}
        >
          {t("examination_list")}
        </button>
      </div>
      <Divider className="my-5" />
      {/* Danh sách đề thi */}
      {active == "0" ? <ExamListTable /> : <ExaminationListTable />}
    </div>
  );
}

export default PerformanceTestTab;
