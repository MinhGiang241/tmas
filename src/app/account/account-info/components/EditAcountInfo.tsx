import BaseModal from "@/app/components/config/BaseModal";
import MButton from "@/app/components/config/MButton";
import MInput from "@/app/components/config/MInput";
import { Modal } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";

interface Props {
  open: boolean;
  onCancel: () => void;
  onOk?: () => void;
  data?: any;
}

function EditAcountInfo({ open, onCancel, onOk, data }: Props) {
  const { t } = useTranslation("account");
  const common = useTranslation();
  return (
    <BaseModal
      onOk={onOk}
      open={open}
      onCancel={onCancel}
      width={564}
      title={t("update_account")}
    >
      <form className="w-full">
        <MInput
          id="full_name"
          name="full_name"
          title={t("full_name")}
          required
        />
        <div className="h-2" />
        <MInput id="email" name="email" title={t("email")} required />
        <div className="h-2" />
        <MInput
          id="phone_number"
          name="phone_number"
          title={t("phone_number")}
          required
        />
        <div className="h-2" />
        <MInput id="role" name="role" title={t("role")} />
        <div className="w-full flex justify-center mt-7">
          <MButton
            onClick={onCancel}
            className="w-36"
            type="secondary"
            text={common.t("cancel")}
          />
          <div className="w-5" />
          <MButton className="w-36" text={common.t("update")} />
        </div>
      </form>
    </BaseModal>
  );
}

export default EditAcountInfo;
