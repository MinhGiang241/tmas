import BaseModal, { BaseModalProps } from "@/app/components/config/BaseModal";
import MButton from "@/app/components/config/MButton";
import MDropdown from "@/app/components/config/MDropdown";
import MInput from "@/app/components/config/MInput";
import React from "react";
import { useTranslation } from "react-i18next";

interface Props extends BaseModalProps {}

function AddReceiptInfo(props: Props) {
  const { t } = useTranslation("exam");
  return (
    <BaseModal {...props}>
      <MInput
        id="receipter_info"
        name="receipter_info"
        title={t("receipter_info")}
      />
      <MDropdown
        id="corresponding_code"
        name="corresponding_code"
        title={t("receipter_info")}
      />
      <div className="flex w-full justify-center">
        <MButton
          onClick={() => {
            props.onCancel();
          }}
          className="w-[132px]"
          text={t("cancel")}
          type="secondary"
        />
        <div className="w-4" />
        <MButton
          text={t("add")}
          onClick={() => {
            props.onCancel();
          }}
          className="w-[132px]"
        />
      </div>
    </BaseModal>
  );
}

export default AddReceiptInfo;
