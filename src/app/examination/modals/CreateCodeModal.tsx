import BaseModal, { BaseModalProps } from "@/app/components/config/BaseModal";
import MButton from "@/app/components/config/MButton";
import MTextArea from "@/app/components/config/MTextArea";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import NumberCodeModal from "./NumberCodeModal";

interface Props extends BaseModalProps {}

function CreateCodeModal(props: Props) {
  const { t } = useTranslation("exam");
  const common = useTranslation();

  const [openCreate, setOpenCreate] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");

  useEffect(() => {
    if (props.open == false) {
      setValue("");
    }
  }, [props.open]);

  return (
    <BaseModal title={t("create_code_list")} width={564} {...props}>
      <NumberCodeModal
        onOk={(v: any) => {
          setValue(v);
          setOpenCreate(false);
        }}
        open={openCreate}
        onCancel={() => {
          setOpenCreate(false);
        }}
      />
      <div className="w-full flex text-sm justify-between">
        <div>{t("auto_create_code_intro")}</div>
        <button
          onClick={() => {
            setOpenCreate(true);
          }}
          className="text-m_primary_500  underline underline-offset-4"
        >
          {t("auto_create")}
        </button>
      </div>
      <div className="h-2" />
      <MTextArea
        placeholder={t("one_line_code")}
        onChange={(e: any) => {
          setValue(e.target.value);
        }}
        value={value}
        id="code_list"
        name="code_list"
        title={t("code")}
        line={7}
      />
      <div className="flex w-full justify-center">
        <MButton
          onClick={() => {
            props.onCancel();
          }}
          className="w-[132px]"
          text={common.t("cancel")}
          type="secondary"
        />
        <div className="w-4" />
        <MButton
          text={common.t("save")}
          onClick={() => {
            props.onOk(value);
            props.onCancel();
          }}
          className="w-[132px]"
        />
      </div>
    </BaseModal>
  );
}

export default CreateCodeModal;
