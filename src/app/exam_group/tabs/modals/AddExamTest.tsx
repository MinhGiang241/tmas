import BaseModal, { BaseModalProps } from "@/app/components/config/BaseModal";
import MInput from "@/app/components/config/MInput";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { PlusOutlined } from "@ant-design/icons";
import MButton from "@/app/components/config/MButton";
import { FormikErrors, useFormik } from "formik";
import { baseOnSubmitFormik } from "@/services/ui/form_services";
import { ExamGroupData } from "@/data/exam";

interface AddExamProps extends BaseModalProps {
  data?: ExamGroupData;
  loading?: boolean;
}

function AddExamTest(props: AddExamProps) {
  const { t } = useTranslation("exam");
  const common = useTranslation();

  const [childs, setChilds] = useState<string[]>([""]);

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
    onSubmit: async () => {
      alert(JSON.stringify(childs.join(",")));
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
      title={t("create_new_group")}
      {...props}
      onCancel={() => {
        setChilds([""]);
        props.onCancel();
      }}
    >
      <form onSubmit={onSubmit} className="w-full">
        <MInput
          required
          title={t("enter_group_name")}
          name="group_name"
          id="group_name"
          placeholder={t("enter_content")}
          className="h-12"
        />
        {childs.map((v: string, i: number) => (
          <>
            <div className="h-2" />
            <MInput
              title={t("name_child_group")}
              name={`group_name_${i}`}
              id={`group_name_${i}`}
              placeholder={t("enter_content")}
              className="h-12"
              onChange={(e) => {
                childs[i] = e.target.value.trim();
                setChilds(childs);
              }}
            />
          </>
        ))}
        <div className="w-full flex justify-end">
          <button
            type="button"
            onClick={() => {
              setChilds([...childs, ""]);
            }}
            className="flex items-center"
          >
            <PlusOutlined />
            <p className="ml-2 underline underline-offset-4 body_regular_14">
              {t("add_child_group")}
            </p>
          </button>
        </div>

        <div className="flex justify-center mt-5 mb-3">
          <MButton
            className="w-36"
            text={common.t("cancel")}
            type="secondary"
            onClick={() => {
              setChilds([""]);
              props.onCancel();
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

export default AddExamTest;
