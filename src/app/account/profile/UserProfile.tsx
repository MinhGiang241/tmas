"use client";
import MButton from "@/app/components/config/MButton";
import MDropdown from "@/app/components/config/MDropdown";
import MInput from "@/app/components/config/MInput";
import { UserData } from "@/data/user";
import { RootState } from "@/redux/store";
import { emailRegex } from "@/services/validation/regex";
import { Divider } from "antd";
import { FormikErrors, useFormik } from "formik";
import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

function UserProfile() {
  const { t } = useTranslation("account");
  const common = useTranslation();
  const user = useSelector((state: RootState) => state.user);

  const initialValues: UserData = {
    account: user?.email,
    email: user?.email,
    full_name: user?.full_name,
    phone_number: user?.phone_number,
    lang: user?.lang,
  };

  var validate = (values: UserData) => {
    const errors: FormikErrors<UserData> = {};
    if (!values.account) {
      errors.account = "common_not_empty";
    }
    if (!values.full_name) {
      errors.full_name = "common_not_empty";
    }

    if (!values.email) {
      errors.email = "common_not_empty";
    } else if (!emailRegex.test(values.email)) {
      errors.email = "common_invalid_email";
    }
    return errors;
  };

  const formik = useFormik({
    initialValues,
    validate,
    onSubmit: async () => {},
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    Object.keys(initialValues).map(async (v) => {
      await formik.setFieldTouched(v, true);
    });

    formik.handleSubmit();
  };

  return (
    <div className="w-full p-5 flex flex-col">
      <div className="w-full mt-2 title_semibold_20">
        {t("personal_information")}
      </div>
      <Divider className="my-5" />
      <form className="w-full" onSubmit={onSubmit}>
        <div className="w-full flex justify-between">
          <MInput
            required
            name="full_name"
            title={t("full_name")}
            id="full_name"
            formik={formik}
          />
          <div className="w-20" />
          <MInput
            required
            name="email"
            title={t("email")}
            id="email"
            formik={formik}
          />
        </div>

        <div className="my-3 w-full flex justify-between">
          <MInput
            required
            name="account"
            title={t("account")}
            id="account"
            formik={formik}
          />
          <div className="w-20" />
          <MInput
            name="phone_number"
            title={t("phone_number")}
            id="phone_number"
            formik={formik}
          />
        </div>

        <div className="w-full flex justify-between">
          <MDropdown
            allowClear={false}
            options={["en", "vi"].map((v: any, i: number) => ({
              label: common.t(v),
              value: v === "en" ? "en_US" : "vi_VN",
            }))}
            required
            name="lang"
            title={t("language")}
            id="lang"
            formik={formik}
          />
          <div className="w-20" />
          <div className="w-full" />

          <div />
        </div>
        <div>
          <MButton
            htmlType="submit"
            className="mt-4 w-36"
            text={common.t("update")}
          />
        </div>
      </form>
    </div>
  );
}

export default UserProfile;
