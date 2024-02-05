"use client";
import React, { useEffect, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import MInput from "../components/config/MInput";
import { useTranslation } from "react-i18next";
import LockIcon from "../components/icons/lock.svg";
import SmsIcon from "../components/icons/sms.svg";
import MButton from "../components/config/MButton";
import AuthLayout from "../layouts/AuthLayout";
import Link from "next/link";
import LangComponent from "../components/lang/LangComponent";
import SsoLogin from "../components/sso/SsoLogin";
import { FormikErrors, useFormik } from "formik";
import { LoginFormData, LoginFormValue } from "@/data/form_interface";
import { login } from "@/api_service/auth_service";
import { errorToast, successToast } from "../components/toast/customToast";

function LoginPage() {
  const { t } = useTranslation();

  const [captcha, setCaptcha] = useState<string | null | undefined>();
  const [submit, setSubmit] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  // useEffect(() => {}, [captcha]);
  const initialValues: LoginFormValue = {
    email: undefined,
    password: undefined,
  };
  const validate = (values: LoginFormValue) => {
    const errors: FormikErrors<LoginFormValue> = {};
    if (!values.email) {
      errors.email = "not_empty";
    }
    if (!values.password) {
      errors.password = "not_empty";
    }
    console.log(errors);

    return errors;
  };

  const formik = useFormik({
    initialValues,
    validate,
    onSubmit: async (values: LoginFormValue) => {
      var data: LoginFormData = {
        email: values.email?.trim(),
        password: values.password?.trim(),
        captcha_token: captcha ?? undefined,
        log_type: "mail",
      };
      setLoading(true);

      await login(data)
        .then((v) => {
          console.log("login", v);
          setLoading(false);
          successToast(t("success_login"));
        })
        .catch((e) => {
          console.log("error login", e);
          setLoading(false);
          errorToast(e);
        });
    },
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmit(true);
    Object.keys(initialValues).map(async (v) => {
      await formik.setFieldTouched(v, true);
    });
    if (captcha) {
      formik.handleSubmit();
    }
  };

  const lodinSSO = (sso: string | undefined) => {
    setSubmit(true);
    if (captcha) {
      setLoading(true);
      var data: LoginFormData = {
        email: undefined,
        password: undefined,
        sso_token: sso,
        captcha_token: captcha,
        log_type: "sso",
      };
      login(data)
        .then((v) => {
          console.log("sso", v);
          setLoading(false);
          successToast(t("success_login"));
        })
        .catch((e) => {
          console.log("error", e);

          errorToast(e);
          setLoading(false);
        });
    }
  };
  return (
    <AuthLayout>
      <div className="mb-4 flex justify-between">
        <p className="text-m_primary_500 title_bold_24">{t("login")}</p>
        <LangComponent />
      </div>
      <form onSubmit={onSubmit}>
        <MInput
          prefix={<LockIcon />}
          id="email"
          name="email"
          title={t("email")}
          placeholder={t("enter_email")}
          formik={formik}
        />{" "}
        <MInput
          prefix={<SmsIcon />}
          id="password"
          name="password"
          title={t("password")}
          placeholder={t("enter_password")}
          isPassword
          formik={formik}
        />
        <div className="flex w-full justify-end text-m_primary_500 text-sm font-semibold">
          <button className="pl-auto active:opacity-70">
            {" "}
            {t("forgot_pass")}
          </button>
        </div>
        <MButton
          loading={loading}
          htmlType="submit"
          text={t("login")}
          className="h-12 my-4 w-full"
        />
      </form>
      <div className="h-5" />
      <ReCAPTCHA
        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string}
        onChange={setCaptcha}
        className="m-auto"
      />
      {!captcha && submit && (
        <p className="m-auto text-m_error_500 body_regular_14">
          {t("not_verified")}
        </p>
      )}
      <SsoLogin login={lodinSSO} />
      <div className="w-full flex justify-center mt-5">
        <span className="text-sm mr-1">{t("no_account")}</span>
        <Link href="/register" className="text-sm font-bold">
          {t("register_now")}
        </Link>
      </div>
    </AuthLayout>
  );
}

export default LoginPage;
