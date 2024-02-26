import BaseModal, { BaseModalProps } from "@/app/components/config/BaseModal";
import MInput from "@/app/components/config/MInput";
import React from "react";
import { useTranslation } from "react-i18next";
import { PlusOutlined } from "@ant-design/icons";
import MButton from "@/app/components/config/MButton";

interface AddExamProps extends BaseModalProps {}

function AddExamTest(props: AddExamProps) {
  const { t } = useTranslation("exam");
  const common = useTranslation();

  return (
    <BaseModal title={t("create_new_group")} {...props}>
      <form className="w-full">
        <MInput
          title={t("enter_group_name")}
          name="group_name"
          id="group_name"
          placeholder={t("enter_content")}
          className="h-12"
        />
        <div className="h-2" />
        <MInput
          title={t("name_child_group")}
          name="group_name"
          id="group_name"
          placeholder={t("enter_content")}
          className="h-12"
        />
        <div className="w-full flex justify-end">
          <button
            type="button"
            onClick={() => {}}
            className="flex items-center"
          >
            <PlusOutlined />
            <p className="ml-2 underline underline-offset-4 body_regular_14">
              {t("add_child_group")}
            </p>
          </button>
        </div>

        <div className="flex justify-center mt-5 mb-3">
          <MButton
            className="w-36"
            text={common.t("cancel")}
            type="secondary"
            onClick={props.onCancel}
          />
          <div className="w-4" />
          <MButton className="w-36" text={common.t("save")} />
        </div>
      </form>
    </BaseModal>
  );
}

export default AddExamTest;
