import MDropdown from "@/app/components/config/MDropdown";
import MInput from "@/app/components/config/MInput";
import MTreeSelect from "@/app/components/config/MTreeSelect";
import { ExamGroupData } from "@/data/exam";
import React from "react";
import { useTranslation } from "react-i18next";

interface Props {
  examGroups?: ExamGroupData[];
}

function RandomQuestion({ examGroups }: Props) {
  const { t } = useTranslation("exam");
  const common = useTranslation();
  const optionSelect = (examGroups ?? []).map<any>(
    (v: ExamGroupData, i: number) => ({
      title: v?.name,
      value: v?.id,
      disabled: true,
      isLeaf: false,
      children: [
        ...(v?.childs ?? []).map((e: ExamGroupData, i: number) => ({
          title: e?.name,
          value: e?.id,
        })),
      ],
    }),
  );

  return (
    <div className="grid grid-cols-12 gap-4 max-lg:px-5">
      <div className="bg-white rounded-lg lg:col-span-4 col-span-12 p-5 h-fit">
        <MInput h="h-9" name="point" id="point" required title={t("point")} />
        <MTreeSelect
          options={optionSelect}
          h="h-9"
          title={t("question_group")}
          placeholder={t("select_question_group")}
          id="question_group"
          name="question_group"
        />
      </div>
      <div className="bg-white rounded-lg lg:col-span-8 col-span-12 p-5 h-fit">
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
