import BaseModal, { BaseModalProps } from "@/app/components/config/BaseModal";
import MButton from "@/app/components/config/MButton";
import MInput from "@/app/components/config/MInput";
import { errorToast, successToast } from "@/app/components/toast/customToast";
import { ExamGroupData } from "@/data/exam";
import { createExamGroupTest } from "@/services/api_services/exam_api";
import { FormikErrors, useFormik } from "formik";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

export interface CreateChildProps extends BaseModalProps {
  parent?: ExamGroupData;
  loading?: boolean;
}

function CreateChildGroupModal(props: CreateChildProps) {
  const { t } = useTranslation("exam");
  const common = useTranslation();

  interface FormValue {
    group_name?: string;
  }

  const initialValues: FormValue = {
    group_name: undefined,
  };

  const validate = (values: FormValue) => {
    const errors: FormikErrors<FormValue> = {};
    if (!values.group_name?.trim()) {
      errors.group_name = "common_not_empty";
    }

    return errors;
  };

  const formik = useFormik({
    initialValues,
    validate,
    onSubmit: async (values: FormValue) => {
      try {
        var submitData = {
          name: values.group_name,
          level: 1,
          idParent: props.parent?.id,
        };

        setLoading(true);
        await createExamGroupTest(submitData);
        setLoading(false);
        formik.resetForm();
        props?.onCancel();
        props?.onOk!();
        successToast(common.t("success_create_new"));
      } catch (e: any) {
        errorToast(e);
        setLoading(false);
      }
    },
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
      open={props.open}
      onCancel={() => {
        formik.resetForm();
        props?.onCancel();
      }}
      title={t("create_child_group")}
    >
      <form onSubmit={onSubmit} className="w-full">
        <MInput
          required
          id="group_name"
          name="group_name"
          title={t("enter_group_name")}
          placeholder={t("enter_content")}
          formik={formik}
        />
        <div className="flex justify-center mt-7 mb-3">
          <MButton
            className="w-36"
            text={common.t("cancel")}
            type="secondary"
            onClick={() => {
              formik.resetForm();
              props?.onCancel();
            }}
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

export default CreateChildGroupModal;
