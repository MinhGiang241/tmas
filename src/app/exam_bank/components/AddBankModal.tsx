import BaseModal, { BaseModalProps } from "@/app/components/config/BaseModal";
import MButton from "@/app/components/config/MButton";
import MDropdown from "@/app/components/config/MDropdown";
import { QuestionGroupData } from "@/data/exam";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import React from "react";
import { useTranslation } from "react-i18next";

interface Props extends BaseModalProps {
  loading?: boolean;
}

function AddBankModal(props: Props) {
  const { t } = useTranslation("exam");
  const questionGroups = useAppSelector(
    (state: RootState) => state?.examGroup?.questions,
  );
  const optionSelect = (questionGroups ?? []).map<any>(
    (v: QuestionGroupData, i: number) => ({
      label: v?.name,
      value: v?.id,
    }),
  );
  optionSelect.push({
    label: t("all_category"),
    value: "",
  });

  return (
    <BaseModal {...props}>
      <MDropdown
        className="dropdown-flex"
        h="h-11"
        title={t("question_group")}
        id="question_group"
        name="question_group"
        options={optionSelect}
      />
      <div className="flex justify-center">
        <MButton
          type="secondary"
          text={t("cancel")}
          className="h-12 w-36 "
          onClick={() => {
            props.onCancel();
          }}
        />
        <div className="w-5" />
        <MButton
          loading={props?.loading}
          text={t("save")}
          className="h-12 w-36 bg-m_primary_500 text-white"
          onClick={async () => {
            props.onOk();
          }}
        />
      </div>
    </BaseModal>
  );
}

export default AddBankModal;
