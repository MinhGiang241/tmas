import BaseModal, { BaseModalProps } from "@/app/components/config/BaseModal";
import MButton from "@/app/components/config/MButton";
import MDropdown from "@/app/components/config/MDropdown";
import MTreeSelect from "@/app/components/config/MTreeSelect";
import { ExamGroupData, QuestionGroupData } from "@/data/exam";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { FormikErrors, useFormik } from "formik";
import React from "react";
import { useTranslation } from "react-i18next";

interface Props extends BaseModalProps {
  loading?: boolean;
  questionGroups?: QuestionGroupData[];
}

function AddBankModal(props: Props) {
  const { t } = useTranslation("exam");
  var questionGroups = useAppSelector(
    (state: RootState) => state.examGroup.list
  );

  const optionSelect = (props.questionGroups ?? []).map<any>(
    (v: QuestionGroupData, i: number) => ({
      label: v?.name,
      value: v?.id,
    })
  );

  interface FormValue {
    question_group?: string;
  }
  const initialValues: FormValue = {
    question_group: undefined,
  };
  const validate = (values: FormValue) => {
    const errors: FormikErrors<FormValue> = {};
    if (!values.question_group) {
      errors.question_group = "common_not_empty";
    }
    return errors;
  };
  const formik = useFormik({
    initialValues,
    validate,

    onSubmit: async (values: FormValue) => {
      await props!.onOk(values.question_group);
    },
  });

  return (
    <BaseModal
      {...props}
      onCancel={() => {
        formik.resetForm();
        props.onCancel!();
      }}
    >
      <MDropdown
        formik={formik}
        className="dropdown-flex"
        h="h-11"
        title={t("question_group")}
        id="question_group"
        name="question_group"
        options={optionSelect}
      />
      <div className="flex justify-center">
        <MButton
          type="secondary"
          text={t("cancel")}
          className="h-12 w-36 "
          onClick={() => {
            props.onCancel();
          }}
        />
        <div className="w-5" />
        <MButton
          loading={props?.loading}
          text={t("save")}
          className="h-12 w-36 bg-m_primary_500 text-white"
          onClick={() => {
            formik.handleSubmit();
          }}
        />
      </div>
    </BaseModal>
  );
}

export default AddBankModal;
