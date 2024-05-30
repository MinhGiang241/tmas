import BaseModal from "@/app/components/config/BaseModal";
import MButton from "@/app/components/config/MButton";
import MDropdown from "@/app/components/config/MDropdown";
import MInput from "@/app/components/config/MInput";
import { errorToast, successToast } from "@/app/components/toast/customToast";
import { UserData } from "@/data/user";
import { updateRoleMember } from "@/services/api_services/account_services";
import { Form, FormikErrors, useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  open: boolean;
  onCancel: () => void;
  onOk?: () => void;
  data?: UserData;
}

function EditAcountInfo({ open, onCancel, onOk, data }: Props) {
  const [loading, setLoading] = useState<boolean>(false);
  const { t } = useTranslation("account");
  const common = useTranslation();
  var initialValues: UserData = {
    email: data?.email,
    full_name: data?.full_name,
    phone_number: data?.phone,
    role: data?.role,
  };

  const validate = (values: UserData) => {
    const errors: FormikErrors<UserData> = {};

    return errors;
  };

  const formik = useFormik({
    initialValues,
    validate,
    onSubmit: async (values: UserData) => {
      try {
        setLoading(true);
        await updateRoleMember({ userId: data?._id!, role: values.role! });
        successToast(t("success_update_member"));
        setLoading(false);
        onOk!();
      } catch (e: any) {
        setLoading(false);
        errorToast(e);
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
      onOk={onOk}
      open={open}
      onCancel={onCancel}
      width={564}
      title={t("update_account")}
    >
      <form
        // onSubmit={(e) => baseOnSubmitFormik(e, initialValues, formik)}
        onSubmit={onSubmit}
        className="w-full"
      >
        <MInput
          disable
          formik={formik}
          id="full_name"
          name="full_name"
          title={t("full_name")}
          required
        />
        <div className="h-2" />
        <MInput
          disable
          formik={formik}
          id="email"
          name="email"
          title={t("email")}
          required
        />
        <div className="h-2" />
        <MInput
          disable
          formik={formik}
          id="phone_number"
          name="phone_number"
          title={t("phone_number")}
          required
        />
        <div className="h-2" />
        {/* <MInput formik={formik} id="role" name="role" title={t("role")} /> */}
        <MDropdown
          className="w-full dropdown-flex"
          allowClear={false}
          options={["Admin", "Owner"].map((e: any, i) => ({
            value: e,
            disabled: e == "Owner",
            label: t(e.toLowerCase()),
          }))}
          formik={formik}
          id="role"
          name="role"
          title={t("role")}
        />
        <div className="w-full flex justify-center mt-7">
          <MButton
            onClick={onCancel}
            className="w-36"
            type="secondary"
            text={common.t("cancel")}
          />
          <div className="w-5" />
          <MButton
            loading={loading}
            htmlType="submit"
            className="w-36"
            text={common.t("update")}
          />
        </div>
      </form>
    </BaseModal>
  );
}

export default EditAcountInfo;
