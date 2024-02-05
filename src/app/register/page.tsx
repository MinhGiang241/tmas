"use client";
import React, { useEffect, useState } from "react";
import AuthLayout from "../layouts/AuthLayout";
import { useTranslation } from "react-i18next";
import LangComponent from "../components/lang/LangComponent";
import { FormikErrors, useFormik } from "formik";
import MInput from "../components/config/MInput";
import ProfileIcon from "../components/icons/profile.svg";
import BuildingIcon from "../components/icons/building.svg";
import PhoneIcon from "../components/icons/phone.svg";
import LockIcon from "../components/icons/lock.svg";
import SmsIcon from "../components/icons/sms.svg";
import MButton from "../components/config/MButton";
import Link from "next/link";
import {
  LoginFormData,
  RegisterFormData,
  RegisterFormValues,
} from "@/data/form_interface";
import { login, registerAccount } from "@/api_service/auth_service";
import { errorToast, successToast } from "../components/toast/customToast";
import { useRouter } from "next/navigation";
import SsoLogin from "../components/sso/SsoLogin";

function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const { t } = useTranslation();
  const initialValues: RegisterFormValues = {
    full_name: undefined,
    phone: undefined,
    company_name: undefined,
    register_email: undefined,
    register_password: undefined,
    re_password: undefined,
  };

  const validate = (values: RegisterFormValues) => {
    const errors: FormikErrors<RegisterFormValues> = {};
    if (!values.full_name) {
      errors.full_name = "enter_required_name";
    }

    if (values.company_name && values.company_name.length < 2) {
      errors.company_name = "company_at_least";
    }
    if (!values.phone) {
      errors.phone = t("enter_required_phone");
    } else if (!/(84|0[3|5|7|8|9])+([0-9]{8})\b/g.test(values.phone)) {
      errors.phone = "invalid_phone";
    }
    if (!values.register_email) {
      errors.register_email = "enter_required_email";
    } else if (
      !/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(
        values.register_email,
      )
    ) {
      errors.register_email = "invalid_email";
    }
    if (!values.register_password) {
      errors.register_password = "enter_required_pass";
    } else if (
      !/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/.test(values.register_password)
    ) {
      errors.register_password = "week_pass";
    }
    if (!values.re_password) {
      errors.re_password = "enter_required_repass";
    } else if (values.re_password.trim() != values?.register_password?.trim()) {
      errors.re_password = "pass_not_same";
    }

    return errors;
  };

  const formik = useFormik<RegisterFormValues>({
    initialValues,
    validate,
    onSubmit: async (values) => {
      setLoading(true);
      // alert(JSON.stringify(value));
      var data: RegisterFormData = {
        full_name: values.full_name,
        company: values.company_name,
        email: values.register_email,
        password: values.register_password,
        phone: values.phone,
      };
      registerAccount(data)
        .then((v) => {
          setLoading(false);
          successToast(t("success_create_account"));
          router.push("/signin");
          console.log(v);
        })
        .catch((e) => {
          errorToast(e);
          setLoading(false);
          console.log(e);
        });
    },
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    Object.keys(initialValues).map(async (v) => {
      console.log("key", v);
      await formik.setFieldTouched(v, true);
    });
    formik.handleSubmit();
  };
  const loginSSO = (sso: string | undefined) => {
    var data: LoginFormData = {
      email: undefined,
      password: undefined,
      sso_token: sso,
      captcha_token: undefined,
      log_type: "sso",
    };
    login(data)
      .then((v) => {
        console.log("sso", v);
        successToast(t("success_login"));
      })
      .catch((e) => {
        errorToast(e);
      });
  };

  return (
    <AuthLayout>
      <div className="mb-4 flex justify-between">
        <p className="text-m_primary_500 title_bold_24">{t("register")}</p>
        <LangComponent />
      </div>
      <form onSubmit={onSubmit}>
        <MInput
          required
          prefix={<ProfileIcon />}
          title={t("full_name")}
          id="full_name"
          name="full_name"
          placeholder={t("enter_full_name")}
          onChange={formik.handleChange}
          error={formik.errors.full_name}
          touch={formik.touched.full_name}
          onBlur={formik.handleBlur}
          value={formik.values.full_name}
          // formik={formik}
        />
        <MInput
          prefix={<BuildingIcon />}
          title={t("company_name")}
          id="company_name"
          name="company_name"
          placeholder={t("enter_company_name")}
          formik={formik}
        />
        <MInput
          required
          prefix={<PhoneIcon />}
          title={t("phone")}
          id="phone"
          name="phone"
          placeholder={t("enter_phone")}
          formik={formik}
        />
        <MInput
          required
          prefix={<SmsIcon />}
          title={t("email")}
          id="register_email"
          name="register_email"
          placeholder={t("enter_email")}
          formik={formik}
        />
        <MInput
          isPassword
          required
          prefix={<LockIcon />}
          title={t("password")}
          id="register_password"
          name="register_password"
          placeholder={t("re_enter_password")}
          formik={formik}
        />
        <MInput
          isPassword
          required
          prefix={<LockIcon />}
          title={t("confirm_password")}
          id="re_password"
          name="re_password"
          placeholder={t("re_enter_password")}
          formik={formik}
        />
        <MButton
          loading={loading}
          className="w-full h-12 mt-2"
          htmlType="submit"
          text={t("register")}
        />
        <SsoLogin login={loginSSO} />
        <div className="w-full flex justify-center mt-5">
          <span className="text-sm mr-1">{t("has_account")}</span>
          <Link href="/signin" className="text-sm font-bold">
            {t("login")}
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}

export default RegisterPage;
