import BaseModal, { BaseModalProps } from "@/app/components/config/BaseModal";
import MButton from "@/app/components/config/MButton";
import MInput from "@/app/components/config/MInput";
import MTextArea from "@/app/components/config/MTextArea";
import { FormikErrors, useFormik } from "formik";
import React from "react";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";

interface Props extends BaseModalProps {
  loading?: boolean;
}

export interface TestcaseValue {
  id?: string;
  name?: string;
  inputData?: string;
  outputData?: string;
}

function CreateTestCaseModal(props: Props) {
  const { t } = useTranslation("exam");
  const validate = (values: TestcaseValue) => {
    const errors: FormikErrors<TestcaseValue> = {};

    if (!values.name?.trim()) {
      errors.name = "common_not_empty";
    }

    return errors;
  };

  const initialValues: TestcaseValue = {
    name: undefined,
    inputData: undefined,
    outputData: undefined,
  };
  const formik = useFormik({
    initialValues,
    validate,
    onSubmit: async (values: TestcaseValue) => {
      values.id = uuidv4();
      props.onOk(values);
      props.onCancel();
      formik.resetForm();
    },
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Object.keys(initialValues).map(async (v) => {
    //   await formik.setFieldTouched(v, true);
    // });
    formik.handleSubmit();
  };

  return (
    <BaseModal
      {...props}
      onCancel={() => {
        formik.resetForm();
        props.onCancel();
      }}
    >
      <form className="w-full" onSubmit={onSubmit}>
        <MInput
          formik={formik}
          title={t("name")}
          id="name"
          name="name"
          required
          placeholder={t("enter_content")}
        />
        <MTextArea
          formik={formik}
          title={t("input")}
          id="inputData"
          name="inputData"
          placeholder={t("enter_content")}
        />
        <MTextArea
          formik={formik}
          title={t("output")}
          id="outputData"
          name="outputData"
          placeholder={t("enter_content")}
        />
        <div className="flex justify-center my-4">
          <MButton
            htmlType="button"
            type="secondary"
            text={t("cancel")}
            className="h-12 w-36 "
            onClick={async () => {
              props.onCancel();
              formik.resetForm();
            }}
          />
          <div className="w-5" />
          <MButton
            htmlType="submit"
            loading={props.loading}
            text={t("create")}
            className="h-12 w-36 bg-m_primary_500 text-white"
          />
        </div>
      </form>
    </BaseModal>
  );
}

export default CreateTestCaseModal;
