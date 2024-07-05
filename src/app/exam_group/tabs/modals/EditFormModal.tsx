import BaseModal, { BaseModalProps } from "@/app/components/config/BaseModal";
import MButton from "@/app/components/config/MButton";
import MInput from "@/app/components/config/MInput";
import { errorToast, successToast } from "@/app/components/toast/customToast";
import { ExamGroupData } from "@/data/exam";
import { RootState } from "@/redux/store";
import { updateExamGroupTest } from "@/services/api_services/exam_api";
import { FormikErrors, useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

interface EditModalProps extends BaseModalProps {
  data?: ExamGroupData;
}

function EditFormModal(props: EditModalProps) {
  const { t } = useTranslation("exam");
  const common = useTranslation();

  interface FormValue {
    group_name?: string;
  }

  var initialValues: FormValue = {
    group_name: props.data?.name,
  };
  console.log("initt", props.data);
  // alert(JSON.stringify(props.data));

  const validate = (values: FormValue) => {
    const errors: FormikErrors<FormValue> = {};
    if (!values?.group_name?.trim()) {
      errors.group_name = "common_not_empty";
    }

    return errors;
  };
  const user = useSelector((state: RootState) => state?.user?.user);
  const formik = useFormik({
    initialValues,
    validate,
    enableReinitialize: true,
    onSubmit: async (values: FormValue) => {
      setLoading(true);
      var submitData = {
        id: props.data?.id,
        name: values.group_name,
        level: props.data?.level,
        idParent: props.data?.idParent,
        studioId: user?.studio?._id,
      };
      var res = await updateExamGroupTest(submitData);
      setLoading(false);
      if (res?.code === 0) {
        props?.onOk!();
        successToast(res?.message ?? common.t("success_update"));
        formik.resetForm();
        props?.onCancel();
      } else {
        errorToast(res, res?.message ?? "");
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
      width={564}
      title={t("edit_group")}
      open={props.open}
      onCancel={() => {
        formik.resetForm();
        props?.onCancel();
      }}
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

export default EditFormModal;
