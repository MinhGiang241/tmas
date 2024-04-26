import BaseModal, { BaseModalProps } from "@/app/components/config/BaseModal";
import MButton from "@/app/components/config/MButton";
import MDropdown from "@/app/components/config/MDropdown";
import MInput from "@/app/components/config/MInput";
import { ExaminationData, RemindEmailData } from "@/data/exam";
import { emailRegex } from "@/services/validation/regex";
import { FormikErrors, useFormik } from "formik";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";

interface Props extends BaseModalProps {
  addInfo?: any;
  examination?: ExaminationData;
  list?: RemindEmailData[];
}

interface FormValues {
  email?: string;
  code?: string;
}

function AddReceiptInfo(props: Props) {
  const initialValues: FormValues = {};
  const validate = async (values: FormValues) => {
    const errors: FormikErrors<FormValues> = {};
    if (!values.email?.trim()) {
      errors.email = "common_not_empty";
    } else if (!emailRegex.test(values.email!.trim())) {
      errors.email = "common_invalid_email";
    } else if (props.list?.some((e) => values.email?.trim() == e.email)) {
      errors.email = "dup_email";
    }

    if (
      props.examination?.accessCodeSettingType === "MultiCode" &&
      props.examination?.sharingSetting == "Private" &&
      !values.code
    ) {
      errors.code = "common_not_empty";
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
        passcode: values.code,
        status: "New",
      };
      props.onOk(email);
      formik.resetForm();
    },
  });
  const { t } = useTranslation("exam");

  return (
    <BaseModal
      {...props}
      onCancel={() => {
        props.onCancel();
        formik.resetForm();
      }}
    >
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await formik.setFieldTouched("email", true);
          formik.handleSubmit();
        }}
        className="w-full"
      >
        <MInput
          namespace="exam"
          touchedNotFormik={true}
          required
          h="h-11"
          formik={formik}
          id="email"
          name="email"
          title={t("receipter_info")}
        />
        {props.examination?.accessCodeSettingType === "MultiCode" &&
          props.examination?.sharingSetting == "Private" && (
            <MDropdown
              touchedNotFormik={true}
              formik={formik}
              options={props.examination?.accessCodeSettings
                ?.filter((r) => !props.list?.some((l) => l.passcode === r.code))
                .map((e) => ({
                  value: e.code,
                  label: e.code,
                  disabled: props.list?.some((r) => r.passcode == e.code),
                }))}
              id="code"
              name="code"
              title={t("corresponding_code")}
            />
          )}
        <div className="flex w-full justify-center mt-4">
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
          <MButton htmlType="submit" text={t("add")} className="w-[132px]" />
        </div>
      </form>
    </BaseModal>
  );
}

export default AddReceiptInfo;
