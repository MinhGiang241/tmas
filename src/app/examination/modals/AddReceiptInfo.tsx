import BaseModal, { BaseModalProps } from "@/app/components/config/BaseModal";
import MButton from "@/app/components/config/MButton";
import MDropdown from "@/app/components/config/MDropdown";
import MInput from "@/app/components/config/MInput";
import { ExaminationData, RemindEmailData } from "@/data/exam";
import { emailRegex } from "@/services/validation/regex";
import { FormikErrors, useFormik } from "formik";
import React from "react";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";

interface Props extends BaseModalProps {
  addInfo?: any;
  examination?: ExaminationData;
}

interface FormValues {
  email?: string;
  code?: string;
}

function AddReceiptInfo(props: Props) {
  const initialValues: FormValues = {};
  const validate = (values: FormValues) => {
    const errors: FormikErrors<FormValues> = {};
    if (!values.email?.trim()) {
      errors.email = "common_not_empty";
    } else if (!emailRegex.test(values.email!.trim())) {
      errors.email = "common_invalid_email";
    }
    return errors;
  };
  const formik = useFormik({
    initialValues,
    validate,
    onSubmit: async (values: FormValues) => {
      var email: RemindEmailData = {
        _id: uuidv4(),
        email: values.email,
        code: values.code,
        status: "New",
      };
      props.onOk(email);
      formik.resetForm();
    },
  });
  const { t } = useTranslation("exam");
  return (
    <BaseModal {...props}>
      <MInput
        required
        h="h-11"
        formik={formik}
        id="email"
        name="email"
        title={t("receipter_info")}
      />
      <MDropdown
        formik={formik}
        options={props.examination?.accessCodeSettings?.map((e) => ({
          value: e.code,
          label: e.code,
        }))}
        id="code"
        name="code"
        title={t("corresponding_code")}
      />
      <div className="flex w-full justify-center">
        <MButton
          onClick={() => {
            formik.resetForm();
            props.onCancel();
          }}
          className="w-[132px]"
          text={t("cancel")}
          type="secondary"
        />
        <div className="w-4" />
        <MButton
          onClick={() => {
            formik.handleSubmit();
          }}
          text={t("add")}
          className="w-[132px]"
        />
      </div>
    </BaseModal>
  );
}

export default AddReceiptInfo;
