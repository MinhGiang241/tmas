import BaseModal, { BaseModalProps } from "@/app/components/config/BaseModal";
import MButton from "@/app/components/config/MButton";
import MInput from "@/app/components/config/MInput";
import { ExamGroupData } from "@/data/exam";
import { FormikErrors, useFormik } from "formik";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

interface EditModalProps extends BaseModalProps {
  data?: ExamGroupData;
}

function EditFormModal(props: EditModalProps) {
  const { t } = useTranslation("exam");
  const common = useTranslation();

  interface FormValue {
    group_name?: string;
  }

  const initialValues: FormValue = {};

  const validate = (values: FormValue) => {
    const errors: FormikErrors<FormValue> = {};

    return errors;
  };

  const formik = useFormik({
    initialValues,
    validate,
    onSubmit: async () => {},
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    Object.keys(initialValues).map(async (v) => {
      await formik.setFieldTouched(v, true);
    });
    formik.handleSubmit();
  };

  const [loading, setLoading] = useState<boolean>(false);

  return (
    <BaseModal
      width={564}
      title={t("edit_group")}
      open={props.open}
      onCancel={props.onCancel}
    >
      <form onSubmit={onSubmit} className="w-full">
        <MInput
          required
          id="group_name"
          name="group_name"
          title={t("enter_group_name")}
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
            loading={loading}
            htmlType="submit"
            className="w-36"
            text={common.t("save")}
          />
        </div>
      </form>
    </BaseModal>
  );
}

export default EditFormModal;
