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
import { getUserMe, login } from "@/services/api_services/auth_service";
import { errorToast, successToast } from "../components/toast/customToast";
import { signInWithPopup, signInWithRedirect } from "firebase/auth";
import { auth, facebookProvider, googleProvider } from "@/firebase/config";
import { useRouter } from "next/navigation";
import { emailRegex } from "@/services/validation/regex";
import i18next from "i18next";
import { Button, Divider } from "antd";

import FacebookIcon from "../components/icons/facebook.svg";
import GoogleIcon from "../components/icons/google.svg";

function LoginPage() {
  const { t, i18n } = useTranslation();
  const [captcha, setCaptcha] = useState<string | null | undefined>();
  const [submit, setSubmit] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [gLoading, setGLoading] = useState<boolean>(false);
  const [fLoading, setFLoading] = useState<boolean>(false);
  const router = useRouter();
  // useEffect(() => {}, [captcha]);
  const initialValues: LoginFormValue = {
    email: undefined,
    password: undefined,
  };
  const validate = (values: LoginFormValue) => {
    const errors: FormikErrors<LoginFormValue> = {};
    if (!values.email?.trim()) {
      errors.email = "not_empty";
    } else if (!emailRegex.test(values.email)) {
      errors.email = "invalid_email";
    }

    if (!values.password?.trim()) {
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
          router.push("/");
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

  const signInGoogle = async () => {
    setSubmit(true);
    if (captcha) {
      try {
        var data = await signInWithPopup(auth, googleProvider);
        if (data) {
          // setGLoading(true);
          loginSSO((data?.user as any)["accessToken"]);
        }
      } catch (e: any) {
        // errorToast(e);
        setGLoading(false);
      }
      // signInWithPopup(auth, googleProvider)
      //   .then((data: any) => {
      //   })
      //   .catch((e) => {});
    }
  };
  const signInFacebook = () => {
    setSubmit(true);
    if (captcha) {
      // signInWithRedirect(auth, facebookProvider)
      signInWithPopup(auth, facebookProvider)
        .then((data) => {
          setFLoading(true);
          loginSSO((data?.user as any)["accessToken"]);
        })
        .catch((e) => {
          console.log(e);
          setFLoading(false);
        });
    }
  };

  const loginSSO = (sso: string | undefined) => {
    if (captcha) {
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
          setGLoading(false);
          setFLoading(false);
          successToast(t("success_login"));
          router.push("/");
        })
        .catch((e) => {
          console.log("error", e);

          errorToast(e);
          setGLoading(false);
          setFLoading(false);
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
          prefix={<SmsIcon />}
          id="email"
          name="email"
          title={t("email")}
          placeholder={t("enter_email")}
          formik={formik}
        />{" "}
        <MInput
          prefix={<LockIcon />}
          id="password"
          name="password"
          title={t("password")}
          placeholder={t("enter_password")}
          isPassword
          formik={formik}
        />
        <div className="flex w-full justify-end text-m_primary_500 caption_semibold_14">
          <Link href={"/reset-password"} className="pl-auto active:opacity-70">
            {" "}
            {t("forgot_pass")}
          </Link>
        </div>
        <div className="h-5" />
        <div className="w-full flex flex-col justify-center items-center">
          <ReCAPTCHA
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string}
            onChange={setCaptcha}
            className="m-auto"
            hl={i18next.language ?? "vi"}
          />
          {!captcha && submit && (
            <p className="m-auto text-m_error_500 body_regular_14">
              {t("not_verified")}
            </p>
          )}
        </div>
        <MButton
          loading={loading}
          htmlType="submit"
          text={t("login")}
          className="h-12 my-4 w-full"
        />
      </form>

      <SsoLogin
        signInGoogle={signInGoogle}
        signInFacebook={signInFacebook}
        isLogin
        gLoading={gLoading}
        fLoading={fLoading}
      />

      <div className="w-full flex justify-center mt-5 ">
        <span className="text-sm mr-1">{t("no_account")}</span>
        <Link
          href="/register"
          className="text-sm font-bold cursor-pointer underline underline-offset-4"
        >
          {t("register_now")}
        </Link>
      </div>
    </AuthLayout>
  );
}

export default LoginPage;
