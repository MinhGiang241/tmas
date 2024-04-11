import BaseModal, { BaseModalProps } from "@/app/components/config/BaseModal";
import MButton from "@/app/components/config/MButton";
import MDropdown from "@/app/components/config/MDropdown";
import MInput from "@/app/components/config/MInput";
import MTreeSelect from "@/app/components/config/MTreeSelect";
import { ExamGroupData, TmasExamData, TmasStudioExamData } from "@/data/exam";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { FormikErrors, FormikValues, useFormik } from "formik";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

interface Props extends BaseModalProps {
  examGroup: ExamGroupData[];
  loading: boolean;
  exam?: TmasStudioExamData;
}

function AddBankTmasExam(props: Props) {
  const { t } = useTranslation("exam");
  const optionSelect = (props.examGroup ?? []).map<any>(
    (v: ExamGroupData, i: number) => ({
      title: v?.name,
      value: v?.id,
      disabled: true,
      isLeaf: false,
      children: [
        ...(v?.childs ?? []).map((e: ExamGroupData, i: number) => ({
          title: e?.name,
          value: e?.id,
        })),
      ],
    }),
  );

  const [loading, setLoading] = useState<boolean>(false);

  interface FormValue {
    group?: string;
    exam_name?: string;
  }

  const initialValues: FormValue = {
    group: undefined,
    exam_name: props.exam?.Name,
  };
  const validate = (values: FormValue) => {
    const errors: FormikErrors<FormValue> = {};
    if (!values.group) {
      errors.group = "common_not_empty";
    }
    if (!values.exam_name) {
      errors.exam_name = "common_not_empty";
    }
    console.log(errors);

    return errors;
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validate,
    onSubmit: async (values: FormValue) => {
      props.onOk!(values.exam_name, values.group);
    },
  });

  return (
    <BaseModal
      {...props}
      onCancel={() => {
        formik.resetForm();
        props.onCancel!();
      }}
      title={t("add_my_exam")}
    >
      <form className="w-full">
        <MTreeSelect
          formik={formik}
          required
          className="tag-big"
          options={optionSelect}
          title={t("select_exam_group")}
          id="group"
          name="group"
        />
        <MInput
          formik={formik}
          title={t("exam_name")}
          required
          id="exam_name"
          name="exam_name"
        />
        <div className="flex justify-center">
          <MButton
            loading={loading}
            type="secondary"
            text={t("cancel")}
            className="h-12 w-36 "
            onClick={() => {
              formik.resetForm();
              props.onCancel();
            }}
          />
          <div className="w-5" />
          <MButton
            loading={props?.loading}
            text={t("save")}
            className="h-12 w-36 bg-m_primary_500 text-white"
            onClick={async () => {
              formik.handleSubmit();
            }}
          />
        </div>
      </form>
    </BaseModal>
  );
}

export default AddBankTmasExam;
