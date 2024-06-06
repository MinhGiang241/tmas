import React, { useState } from "react";
import { useTranslation } from "react-i18next";

function ExaminationListTable() {
  const { t } = useTranslation("exam");
  const [search, setSearch] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [indexPage, setIndexPage] = useState<number>(1);
  const [recordNum, setRecordNum] = useState<number>(15);
  const [total, setTotal] = useState<number>(0);

  return (
    <>
      <div className="w-full body_semibold_20 mb-4">
        {t("examination_list")}
      </div>
    </>
  );
}

export default ExaminationListTable;
