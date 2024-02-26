import BaseModal, { BaseModalProps } from "@/app/components/config/BaseModal";
import MButton from "@/app/components/config/MButton";
import MDropdown from "@/app/components/config/MDropdown";
import MInput from "@/app/components/config/MInput";
import { ExamGroupData } from "@/data/exam";
import React from "react";
import { useTranslation } from "react-i18next";

interface MoveGroupProps extends BaseModalProps {
  parent?: ExamGroupData;
  now?: ExamGroupData;
  list?: ExamGroupData[];
  loading?: boolean;
}

function MoveGroupModal(props: MoveGroupProps) {
  const { t } = useTranslation("exam");
  const common = useTranslation();
  return (
    <BaseModal title={t("move_child_group")} {...props}>
      <div className="text-sm text-m_neutral_500">
        {t("choose_child_group")}
        <span className="ml-1 body_semibold_14 text-m_neutral_900">
          {props.now?.name}
        </span>
      </div>

      <div className="h-4" />

      <form className="w-full">
        <MInput
          required
          disable
          id="group_now"
          name="group_now"
          title={t("group_now")}
        />

        <div className="h-4" />
        <MDropdown
          name="new_group"
          id="new_group"
          title={t("new_group")}
          placeholder={t("select_exam_group")}
        />

        <div className="flex justify-center mt-7 mb-3">
          <MButton
            className="w-36"
            text={common.t("cancel")}
            type="secondary"
            onClick={props.onCancel}
          />
          <div className="w-4" />
          <MButton
            loading={props.loading}
            className="w-36"
            text={common.t("save")}
          />
        </div>
      </form>
    </BaseModal>
  );
}

export default MoveGroupModal;
