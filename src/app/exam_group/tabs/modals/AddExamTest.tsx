import BaseModal, { BaseModalProps } from "@/app/components/config/BaseModal";
import MInput from "@/app/components/config/MInput";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { PlusOutlined } from "@ant-design/icons";
import MButton from "@/app/components/config/MButton";
import { FormikErrors, useFormik } from "formik";
import { ExamGroupData, Hashtag } from "@/data/exam";
import { errorToast, successToast } from "@/app/components/toast/customToast";
import {
  createChildsGroup,
  createExamGroupTest,
  getSuggestValueHastag,
} from "@/services/api_services/exam_api";
import MSearchInput from "@/app/components/config/MSearchInput";

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

      if (dataCall.code != 0) {
        errorToast(dataCall?.message ?? "");
        setLoading(false);
        return;
      }

      var dataChild = childs
        .filter((i: any) => i)
        .map((e: any) => ({
          name: e?.trim(),
        }));
      if (dataChild.length != 0) {
        var dataSubmit = {
          items: dataChild,
          action: "Add",
          level: 1,
          idParent: dataCall.data,
        };

        var submit = await createChildsGroup(dataSubmit);

        if (submit.code != 0) {
          errorToast(submit?.message ?? "");
          setLoading(false);
          return;
        }
      }

      setLoading(false);
      setChilds([""]);
      successToast(common.t("success_create_new"));
      props?.onOk!();
      formik.resetForm();
      props?.onCancel();
    },
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    Object.keys(initialValues).map(async (v) => {
      await formik.setFieldTouched(v, true);
    });
    formik.handleSubmit();
  };
  const [itemSearch, setItemSearch] = useState<string[]>([]);
  const onSearchText = async (v: string) => {
    try {
      var data = await getSuggestValueHastag(v);
      if (data) {
        setItemSearch([...data.map((e: Hashtag) => e.name)]);
      }
    } catch (e: any) {
      console.log(e);
    }
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
        {/* <MInput
          required
          title={t("enter_group_name")}
          name="group_name"
          id="group_name"
          placeholder={t("enter_content")}
          className="h-12"
          formik={formik}
        />
        */}

        <MSearchInput
          itemsSearch={itemSearch}
          onSearch={(v) => onSearchText(v)}
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
