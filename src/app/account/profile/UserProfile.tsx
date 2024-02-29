"use client";
import MButton from "@/app/components/config/MButton";
import MDropdown from "@/app/components/config/MDropdown";
import MInput from "@/app/components/config/MInput";
import { errorToast, successToast } from "@/app/components/toast/customToast";
import { UserData } from "@/data/user";
import { RootState } from "@/redux/store";
import { setUserData } from "@/redux/user/userSlice";
import { updatePersonalInfo } from "@/services/api_services/account_services";
import { getUserMe } from "@/services/api_services/auth_service";
import { emailRegex, phoneRegex } from "@/services/validation/regex";
import { Divider } from "antd";
import { FormikErrors, useFormik } from "formik";
import i18next from "i18next";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

function UserProfile() {
  const { t } = useTranslation("account");
  const common = useTranslation();
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const initialValues: UserData = {
    account: user?.email,
    email: user?.email,
    full_name: user?.full_name,
    phone_number: user?.phone,
    lang: user?.lang,
  };

  var validate = (values: UserData) => {
    const errors: FormikErrors<UserData> = {};
    if (!values.account) {
      errors.account = "common_not_empty";
    }
    if (!values.full_name) {
      errors.full_name = "common_enter_required_name";
    } else if (values.full_name?.trim().length < 2) {
      errors.full_name = "common_name_at_least";
    }

    if (!values.email) {
      errors.email = "common_not_empty";
    } else if (!emailRegex.test(values.email)) {
      errors.email = "common_invalid_email";
    }

    if (!values.phone_number) {
      errors.phone_number = "common_enter_required_phone";
    } else if (!values.phone_number?.match(phoneRegex)) {
      errors.phone_number = "common_invalid_phone";
    }
    return errors;
  };

  const [loading, setLoading] = useState<boolean>(false);

  const formik = useFormik({
    initialValues,
    validate,
    onSubmit: async (values: UserData) => {
      try {
        setLoading(true);
        var ob = {
          ...values,
          account: values?.account?.trim(),
          full_name: values.full_name?.trim(),
          phone: values.phone_number,
        };
        console.log("newUser", ob);
        var newUser = await updatePersonalInfo(ob);
        successToast(t("success_update_member"));
        var data = await getUserMe();
        dispatch(setUserData(data["user"]));
        setLoading(false);
      } catch (e: any) {
        errorToast(e);
        setLoading(false);
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
    <div className="w-full p-5 flex flex-col">
      <div className="w-full mt-2 title_semibold_20">
        {t("personal_information")}
      </div>
      <Divider className="my-5" />
      <form className="w-full" onSubmit={onSubmit}>
        <div className="w-full lg:flex justify-between">
          <MInput
            required
            name="full_name"
            title={t("full_name")}
            id="full_name"
            formik={formik}
          />
          <div className="w-20" />
          <MInput
            disable
            required
            name="email"
            title={t("email")}
            id="email"
            formik={formik}
          />
        </div>

        <div className=" w-full lg:flex justify-between">
          <MInput
            disable
            required
            name="account"
            title={t("account")}
            id="account"
            formik={formik}
          />
          <div className="w-20" />
          <MInput
            required
            name="phone_number"
            title={t("phone_number")}
            id="phone_number"
            formik={formik}
          />
        </div>

        <div className="w-full lg:flex justify-between">
          <MDropdown
            disable
            allowClear={false}
            options={["en", "vi"].map((v: any, i: number) => ({
              label: common.t(v),
              value: v === "en" ? "en_US" : "vi_VN",
            }))}
            required
            name="lang"
            title={t("language")}
            id="lang"
            value={i18next.language == "en" ? "en_US" : "vi_VN"}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            // formik={formik}
          />
          <div className="w-20" />
          <div className="w-full" />

          <div />
        </div>
        <div className="max-lg:flex justify-center">
          <MButton
            loading={loading}
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
