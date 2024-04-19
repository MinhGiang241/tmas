import { Divider } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";

function Gold() {
  const { t } = useTranslation("account");
  const common = useTranslation();
  return (
    <div className="w-full p-5 flex flex-col">
      <div className="w-full title_semibold_20">{t("gold_manage")}</div>
      <div className="caption_regular_14">
        <span>{t("current_gold")}</span>
      </div>
      <Divider className="my-5" />
    </div>
  );
}

export default Gold;
