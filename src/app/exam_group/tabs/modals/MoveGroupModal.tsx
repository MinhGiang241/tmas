import BaseModal, { BaseModalProps } from "@/app/components/config/BaseModal";
import MButton from "@/app/components/config/MButton";
import MDropdown from "@/app/components/config/MDropdown";
import MInput from "@/app/components/config/MInput";
import { errorToast, successToast } from "@/app/components/toast/customToast";
import { ExamGroupData } from "@/data/exam";
import { updateExamGroupTest } from "@/services/api_services/exam_api";
import { FormikErrors, useFormik } from "formik";
import i18next from "i18next";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

interface MoveGroupProps extends BaseModalProps {
  parent?: ExamGroupData;
  now?: ExamGroupData;
  list?: ExamGroupData[];
  loading?: boolean;
}

function MoveGroupModal(props: MoveGroupProps) {
  const { t } = useTranslation("exam");
  const common = useTranslation();

  interface FormValue {
    group_now?: string;
    new_group?: string;
  }

  const initialValues: FormValue = {
    group_now: props.parent?.name,
    new_group: undefined,
  };

  const validate = (values: FormValue) => {
    const errors: FormikErrors<FormValue> = {};
    if (!values.new_group?.trim()) {
      errors.new_group = "common_not_empty";
    }

    return errors;
  };

  const formik = useFormik({
    initialValues,
    validate,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setLoading(true);
      var dataSubmit = {
        id: props.now?.id,
        name: props.now?.name,
        level: props.now?.level,
        idParent: values.new_group,
      };
      var res = await updateExamGroupTest(dataSubmit);

      setLoading(false);
      if (res.code === 0) {
        successToast(t("success_move"));
        formik.resetForm();
        props?.onOk!();
        props?.onCancel();
      } else {
        errorToast(res?.message ?? "");
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
    <BaseModal title={t("move_child_group")} {...props}>
      <div className="text-sm text-m_neutral_500">
        {t("choose_child_group")}
        <span className="ml-1 body_semibold_14 text-m_neutral_900">
          {props.now?.name}
        </span>
        {i18next.language == "en" && (
          <span className="text-sm text-m_neutral_500">{" subcategory"}</span>
        )}
      </div>

      <div className="h-4" />

      <form className="w-full" onSubmit={onSubmit}>
        <MInput
          required
          disable
          id="group_now"
          name="group_now"
          title={t("group_now")}
          formik={formik}
        />

        <div className="h-4" />
        <MDropdown
          options={(props.list ?? [])
            .filter((e: ExamGroupData) => e?.id != props.parent?.id)
            .map((v: ExamGroupData) => ({
              label: v?.name ?? "",
              value: v?.id,
              disabled: v?.id === props.parent?.id,
            }))}
          formik={formik}
          name="new_group"
          id="new_group"
          title={t("new_group")}
          placeholder={t("select_exam_group")}
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

export default MoveGroupModal;
