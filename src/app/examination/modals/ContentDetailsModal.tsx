import BaseModal, { BaseModalProps } from "@/app/components/config/BaseModal";
import MButton from "@/app/components/config/MButton";
import MInput from "@/app/components/config/MInput";
import MTextArea from "@/app/components/config/MTextArea";
import React from "react";
import { useTranslation } from "react-i18next";

interface Props extends BaseModalProps {}

function ContentDetailsModal(props: Props) {
  const { t } = useTranslation("exam");
  const common = useTranslation();
  return (
    <BaseModal {...props}>
      <MTextArea
        id="content_send"
        name="content_send"
        title={t("content_send")}
      />
      <MTextArea
        id="reason_eror"
        name="reason_error"
        title={t("reason_error")}
      />
      <MButton
        onClick={() => {
          props.onCancel();
        }}
        className="w-[132px]"
        text={common.t("close")}
      />
    </BaseModal>
  );
}

export default ContentDetailsModal;
