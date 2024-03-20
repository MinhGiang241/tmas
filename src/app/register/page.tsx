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
import { login, registerAccount } from "@/services/api_services/auth_service";
import { errorToast, successToast } from "../components/toast/customToast";
import { useRouter, useSearchParams } from "next/navigation";
import SsoLogin from "../components/sso/SsoLogin";
import { signInWithPopup } from "firebase/auth";
import { auth, facebookProvider, googleProvider } from "@/firebase/config";
import {
  emailRegex,
  passLoginRegex,
  phoneRegex,
} from "@/services/validation/regex";
import { Spin } from "antd";
import LoadingPage from "../loading";
import { useOnMountUnsafe } from "@/services/ui/useOnMountUnsafe";

function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [gLoading, setGLoading] = useState<boolean>(false);
  const [fLoading, setFLoading] = useState<boolean>(false);
  const { t } = useTranslation();

  var search = useSearchParams();
  const invitationId = search.get("invitationId");
  const emailParams = search.get("email");

  const initialValues: RegisterFormValues = {
    invitationId: invitationId ?? undefined,
    full_name: undefined,
    phone: undefined,
    company_name: undefined,
    register_email: emailParams ?? undefined,
    register_password: undefined,
    re_password: undefined,
  };

  const validate = (values: RegisterFormValues) => {
    const errors: FormikErrors<RegisterFormValues> = {};
    if (!values.full_name?.trim()) {
      errors.full_name = "enter_required_name";
    } else if (values.full_name?.trim().length < 2) {
      errors.full_name = "name_at_least";
    }

    if (
      values.company_name?.trim() &&
      values.company_name?.trim()?.length < 2
    ) {
      errors.company_name = "company_at_least";
    }
    if (!values.phone?.trim()) {
      errors.phone = "enter_required_phone";
    } else if (!values.phone.match(phoneRegex)) {
      errors.phone = "invalid_phone";
    }
    if (!values.register_email?.trim()) {
      errors.register_email = "enter_required_email";
    } else if (!emailRegex.test(values.register_email)) {
      errors.register_email = "invalid_email";
    }
    if (!values.register_password?.trim()) {
      errors.register_password = "enter_required_pass";
    } else if (values.register_password?.trim().length < 4) {
      errors.register_password = "pass_at_least";
    } else if (!passLoginRegex.test(values.register_password)) {
      errors.register_password = "week_pass";
    }
    if (!values.re_password?.trim()) {
      errors.re_password = "enter_required_repass";
    } else if (values.re_password != values?.register_password) {
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
        invitationId: values.invitationId ?? invitationId ?? undefined,
        full_name: values.full_name?.trim(),
        company: values.company_name?.trim(),
        email: values.register_email?.trim(),
        password: values.register_password?.trim(),
        phone: values.phone?.trim(),
      };
      registerAccount(data)
        .then((v) => {
          setLoading(false);

          if (invitationId && emailParams) {
            successToast(t("success_create_account_via_mail"));
          } else {
            successToast(t("success_create_account"));
          }

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
  const registerSSO = (ssoToken: string | undefined) => {
    var data: RegisterFormData = {
      invitationId: undefined,
      email: undefined,
      password: undefined,
      sso_token: ssoToken,
      captcha_token: undefined,
      reg_type: "sso",
    };
    registerAccount(data)
      .then((v) => {
        console.log("sso", v);
        localStorage.removeItem("access_token");
        localStorage.setItem("access_token", v?.access_token);
        setFLoading(false);
        setGLoading(false);

        successToast(t("success_create_account"));
        router.push("/");
      })
      .catch((e) => {
        errorToast(e);
        setFLoading(false);
        setGLoading(false);
      });
  };

  const signInGoogle = () => {
    signInWithPopup(auth, googleProvider)
      .then((data: any) => {
        setGLoading(true);
        registerSSO((data?.user as any)["accessToken"]);
        console.log("googleauth", data);
      })
      .catch((e) => {
        // errorToast(e);
        setGLoading(false);
      });
  };
  const signInFacebook = () => {
    signInWithPopup(auth, facebookProvider)
      .then((data) => {
        setFLoading(true);
        registerSSO((data?.user as any)["accessToken"]);
        console.log("facebook auth", data);
      })
      .catch((e) => {
        // errorToast(e);
        setFLoading(false);
      });
  };
  const [initLoading, setInitLoading] = useState<boolean>(true);
  useOnMountUnsafe(() => {
    if (!invitationId) {
      setInitLoading(!initLoading);
    }
  });

  return (
    <>
      {
        <AuthLayout>
          <div className="mb-4 flex justify-between">
            <p className="text-m_primary_500 title_bold_24">{t("register")}</p>
            <LangComponent />
          </div>
          <form onSubmit={onSubmit}>
            <MInput
              required
              maxLength={50}
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
              disable={!!invitationId && !!emailParams}
              required
              prefix={<SmsIcon />}
              title={t("email")}
              id="register_email"
              name="register_email"
              placeholder={t("enter_email")}
              formik={formik}
            />
            <MInput
              extend
              maxLength={16}
              isPassword
              required
              prefix={<LockIcon />}
              title={t("password")}
              id="register_password"
              name="register_password"
              placeholder={t("enter_password")}
              formik={formik}
              onKeyDown={(e) => {
                if (e.which == 32) {
                  e.preventDefault();
                }
              }}
            />
            <MInput
              maxLength={16}
              isPassword
              required
              prefix={<LockIcon />}
              title={t("confirm_password")}
              id="re_password"
              name="re_password"
              placeholder={t("re_enter_password")}
              formik={formik}
              onKeyDown={(e) => {
                if (e.which == 32) {
                  e.preventDefault();
                }
              }}
            />
            <MButton
              loading={loading}
              className="w-full h-12 mt-2"
              htmlType="submit"
              text={t("register")}
            />
            <SsoLogin
              gLoading={gLoading}
              fLoading={fLoading}
              signInFacebook={signInFacebook}
              signInGoogle={signInGoogle}
            />
            <div className="w-full flex justify-center mt-5 ">
              <span className="text-sm mr-1">{t("has_account")}</span>
              <Link
                href="/signin"
                className="text-sm font-bold cursor-pointer underline underline-offset-4"
              >
                {t("login")}
              </Link>
            </div>
          </form>
        </AuthLayout>
      }
    </>
  );
}

export default RegisterPage;
