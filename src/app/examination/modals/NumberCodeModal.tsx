import BaseModal, { BaseModalProps } from "@/app/components/config/BaseModal";
import MButton from "@/app/components/config/MButton";
import MInput from "@/app/components/config/MInput";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface Props extends BaseModalProps {}

function NumberCodeModal(props: Props) {
  const { t } = useTranslation("exam");
  const common = useTranslation();
  const [value, setValue] = useState<string>("");
  useEffect(() => {
    if (props.open == false) {
      setValue("");
    }
  }, [props.open]);

  return (
    <BaseModal title={t("auto_create")} {...props}>
      <MInput
        id="code_num"
        name="code_num"
        title={t("auto_code_num")}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        onKeyDown={(e) => {
          if (!e.key.match(/[0-9]/g) && e.key != "Backspace") {
            e.preventDefault();
          }
        }}
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
            var createdCode = createCode(parseInt(value));
            props.onOk(createdCode);
            props.onCancel();
          }}
          className="w-[132px]"
        />
      </div>
    </BaseModal>
  );
}

function generateRandomCode(length: number) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomCode = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomCode += characters[randomIndex];
  }
  return randomCode;
}

function createCode(num: number) {
  var code = "";
  for (let i = 0; i < num; i++) {
    if (i != 0) {
      code += "\n";
    }
    code += generateRandomCode(6);
  }
  return code;
}

export default NumberCodeModal;
