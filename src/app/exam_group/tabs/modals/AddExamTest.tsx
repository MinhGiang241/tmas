import BaseModal, { BaseModalProps } from "@/app/components/config/BaseModal";
import MInput from "@/app/components/config/MInput";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { PlusOutlined } from "@ant-design/icons";
import MButton from "@/app/components/config/MButton";
import { FormikErrors, useFormik } from "formik";
import { baseOnSubmitFormik } from "@/services/ui/form_services";
import { ExamGroupData } from "@/data/exam";
import toast from "react-hot-toast";
import { errorToast, successToast } from "@/app/components/toast/customToast";
import { createExamGroupTest } from "@/services/api_services/exam_api";

interface AddExamProps extends BaseModalProps {
  data?: ExamGroupData;
  loading?: boolean;
}

function AddExamTest(props: AddExamProps) {
  const { t } = useTranslation("exam");
  const common = useTranslation();

  const [childs, setChilds] = useState<string[]>([""]);
  const [loading, setLoading] = useState<boolean>(false);

  interface FormValue {
    group_name?: string;
  }

  const initialValues: FormValue = {
    group_name: undefined,
  };

  const validate = (values: FormValue) => {
    const errors: FormikErrors<FormValue> = {};

    if (!values?.group_name?.trim()) {
      errors.group_name = "common_not_empty";
    }

    return errors;
  };

  const formik = useFormik({
    initialValues,
    validate,
    onSubmit: async (values: FormValue) => {
      // alert(JSON.stringify(childs.join(",")));
      setLoading(true);
      var submitData = {
        name: values.group_name,
        level: 0,
      };
      var dataCall = await createExamGroupTest(submitData);

      console.log("dataCall", dataCall);
      setLoading(false);
      if (dataCall.code == 0) {
        successToast(common.t("success_create_new"));
        props?.onOk!();
        formik.resetForm();
        props?.onCancel();
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
      width={564}
      title={t("create_new_group")}
      open={props.open}
      onCancel={() => {
        formik.resetForm();
        setChilds([""]);
        props?.onCancel();
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
          formik={formik}
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
              if (childs.length < 5) {
                setChilds([...childs, ""]);
              }
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
              formik.resetForm();

              setChilds([""]);
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

export default AddExamTest;
