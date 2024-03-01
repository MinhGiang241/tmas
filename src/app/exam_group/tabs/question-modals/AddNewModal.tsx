import BaseModal, { BaseModalProps } from "@/app/components/config/BaseModal";
import MButton from "@/app/components/config/MButton";
import MInput from "@/app/components/config/MInput";
import { errorToast, successToast } from "@/app/components/toast/customToast";
import { QuestionGroupData } from "@/data/exam";
import { RootState } from "@/redux/store";
import {
  createQuestionGroup,
  updateQuestionGroups,
} from "@/services/api_services/exam_api";
import { FormikErrors, useFormik } from "formik";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

interface AddQuestModal extends BaseModalProps {
  isEdit?: boolean;
  data?: QuestionGroupData;
}

function AddNewModal(props: AddQuestModal) {
  const { t } = useTranslation("exam");
  const common = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);

  interface FormValue {
    group_name?: string;
  }

  var initialValues: FormValue = {
    group_name: props.data?.name,
  };
  console.log("initt", props.data);

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
      if (!props.isEdit) {
        var res = await createQuestionGroup({
          name: values.group_name?.trim(),
          studioId: user?.studio?._id,
        });
        setLoading(false);
        if (res?.code != 0) {
          errorToast(res?.message ?? "");
          return;
        }
        successToast(common.t("success_create_new"));
        formik.resetForm();
        props?.onCancel();
        props?.onOk!();
      } else {
        var res = await updateQuestionGroups({
          name: values.group_name?.trim(),
          id: props.data?.id,
          studioId: user?.studio?._id,
        });
        setLoading(false);
        if (res?.code != 0) {
          errorToast(res?.message ?? "");
          return;
        }
        if (props.isEdit) {
          successToast(common.t("success_update"));
        } else {
          successToast(common.t("success_create_new"));
        }
        formik.resetForm();
        props?.onCancel();
        props?.onOk!();
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

  return (
    <BaseModal
      title={props.isEdit ? t("edit_group") : t("create_new_group")}
      open={props.open}
      onOk={props.onOk}
      onCancel={() => {
        formik.resetForm();
        props.onCancel();
      }}
      width={564}
    >
      <form onSubmit={onSubmit} className="w-full">
        <MInput
          required
          placeholder={t("enter_content")}
          id="group_name"
          name="group_name"
          title={t("enter_group_name")}
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
            htmlType="submit"
            loading={loading}
            className="w-36"
            text={common.t("save")}
          />
        </div>
      </form>
    </BaseModal>
  );
}

export default AddNewModal;
