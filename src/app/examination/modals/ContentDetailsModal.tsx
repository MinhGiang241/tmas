import BaseModal, { BaseModalProps } from "@/app/components/config/BaseModal";
import MButton from "@/app/components/config/MButton";
import MInput from "@/app/components/config/MInput";
import MTextArea from "@/app/components/config/MTextArea";
import { RemindEmailData } from "@/data/exam";
import React from "react";
import { useTranslation } from "react-i18next";

interface Props extends BaseModalProps {
  data?: {
    content_send?: string;
    reason_error?: string;
  };
}

function ContentDetailsModal(props: Props) {
  const { t } = useTranslation("exam");
  const common = useTranslation();
  console.log("data", props.data);

  return (
    <BaseModal {...props}>
      <label className="text-sm font-semibold mr-auto mb-1">
        {t("content_send")}
      </label>

      <div
        className="h-36 w-full border rounded-lg bg-m_neutral_100 p-2 overflow-scroll break-all mb-5"
        dangerouslySetInnerHTML={{
          __html: props.data?.content_send ?? "",
        }}
      ></div>

      <MTextArea
        disable
        defaultValue={props.data?.reason_error}
        id="reason_error"
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
