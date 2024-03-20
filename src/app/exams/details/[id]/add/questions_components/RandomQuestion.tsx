import MDropdown from "@/app/components/config/MDropdown";
import MInput from "@/app/components/config/MInput";
import React from "react";
import { useTranslation } from "react-i18next";

function RandomQuestion() {
  const { t } = useTranslation("exam");
  const common = useTranslation();
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="bg-white rounded-lg col-span-4 p-5 h-fit">
        <MInput h="h-9" name="point" id="point" required title={t("point")} />
        <MDropdown
          h="h-9"
          title={t("question_group")}
          placeholder={t("select_question_group")}
          id="question_group"
          name="question_group"
        />
      </div>
      <div className="bg-white rounded-lg col-span-8 p-5 h-fit">
        <div className="body_semibold_14">
          {t("question")}
          <span className="text-m_error_500"> *</span>
        </div>
        <div className="mt-2 border rounded-lg p-3">
          <p className="body_regular_14">
            {t("group_random_quest")}
            <span className="text-[#4D7EFF]"> {t("tên nhóm câu hỏi")}</span>
          </p>
        </div>
        <div className="mt-4 body_semibold_14">{t("guide")}</div>

        <div className="mt-2 border rounded-lg p-3 body_regular_14">
          {t("guide_intro")}
        </div>
      </div>
    </div>
  );
}

export default RandomQuestion;
