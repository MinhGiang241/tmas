"use client";
import React, { useEffect, useState } from "react";
import AuthLayout from "../layouts/AuthLayout";
import { useTranslation } from "react-i18next";
import LangComponent from "../components/lang/LangComponent";
import MInput from "../components/config/MInput";
import SmsIcon from "../components/icons/sms.svg";
import LockIcon from "../components/icons/lock.svg";
import { FormikErrors, useFormik } from "formik";
import ReCAPTCHA from "react-google-recaptcha";
import MButton from "../components/config/MButton";
import Link from "next/link";
import { emailRegex, passLoginRegex } from "@/services/validation/regex";
import OtpModal from "../components/modals/OtpModal";
import {
  createNewPass,
  sendOtpResetPassword,
} from "@/services/api_services/auth_service";
import { errorToast, successToast } from "../components/toast/customToast";
import { useRouter } from "next/navigation";
import i18next from "i18next";

interface EmailFormValue {
  email?: string;
}

interface ChangePassValue {
  new_password?: string;
  confirm_new_password?: string;
}

enum StateForm {
  ENTER_EMAIL,
  ENTER_PASSWORD,
}

function ResetPasswordPage() {
  const [captcha, setCaptcha] = useState<string | null | undefined>();
  const [submit, setSubmit] = useState<boolean>(false);
  const [sendLoading, setSendLoading] = useState<boolean>(false);
  const [formState, setFormState] = useState<StateForm>(StateForm.ENTER_EMAIL);
  const [open, setOpen] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>("");
  const [email, setEmail] = useState<string | undefined>();
  const [modalKey, setModalKey] = useState<any>(Date.now());
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);

  const router = useRouter();

  const validate = (values: EmailFormValue) => {
    const errors: FormikErrors<EmailFormValue> = {};
    if (!values.email?.trim()) {
      errors.email = "not_empty";
    } else if (!emailRegex.test(values.email)) {
      errors.email = "invalid_email";
    }
    console.log(errors);

    return errors;
  };
  const initialValues: EmailFormValue = {
    email: undefined,
  };

  const { t } = useTranslation();
  const formik = useFormik<EmailFormValue>({
    initialValues,
    validate,
    onSubmit: async (values: EmailFormValue) => {
      setEmail(values.email?.trim());
      setSendLoading(true);
      sendOtpResetPassword({ email: values.email?.trim() ?? "" })
        .then((v) => {
          setSendLoading(false);
          setModalKey(Date.now());
          setOpen(true);
        })
        .catch((e) => {
          setSendLoading(false);
          errorToast(e);
        });

      //setFormState(StateForm.ENTER_PASSWORD);
    },
  });

  const validateChangePass = (values: ChangePassValue) => {
    const errors: FormikErrors<ChangePassValue> = {};
    if (!values.new_password?.trim()) {
      errors.new_password = "not_empty";
    } else if (values.new_password?.trim().length < 4) {
      errors.new_password = "pass_at_least";
    } else if (!passLoginRegex.test(values.new_password)) {
      errors.new_password = "week_pass";
    }

    if (!values.confirm_new_password?.trim()) {
      errors.confirm_new_password = "not_empty";
    } else if (values.new_password != values.confirm_new_password) {
      errors.confirm_new_password = "pass_not_same";
    }
    console.log(errors);

    return errors;
  };

  const initialValuesChangePass: ChangePassValue = {
    new_password: undefined,
    confirm_new_password: undefined,
  };

  const formikChangePass = useFormik<ChangePassValue>({
    initialValues: initialValuesChangePass,
    validate: validateChangePass,
    onSubmit: async (values: ChangePassValue) => {
      setConfirmLoading(true);
      createNewPass({ email, new_pass: values.new_password?.trim() })
        .then((v) => {
          setConfirmLoading(false);
          successToast(v?.message ?? t("success_create_pass"));
          router.push("/signin");
        })
        .catch((e) => {
          setConfirmLoading(false);
          errorToast(e);
        });
    },
  });

  const onSubmitChagePass = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmit(true);
    Object.keys(initialValuesChangePass).map(async (v) => {
      await formikChangePass.setFieldTouched(v, true);
    });
    formikChangePass.handleSubmit();
  };

  const onSubmitSendOtp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmit(true);
    Object.keys(initialValues).map(async (v) => {
      await formik.setFieldTouched(v, true);
    });
    if (captcha) {
      formik.handleSubmit();
    }
  };
  const [captchaKey, setCaptchaKey] = useState<any>(Date.now());
  useEffect(() => {
    setCaptchaKey(Date.now());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18next.language]);

  return (
    <AuthLayout>
      <div className="mb-4 flex justify-between">
        <p className="text-m_primary_500 title_bold_24 ">
          {formState == StateForm.ENTER_EMAIL
            ? t("forgot_pass")
            : t("create_new_pass")}
        </p>
        <LangComponent />
      </div>
      {formState == StateForm.ENTER_EMAIL && (
        <form
          onSubmit={onSubmitSendOtp}
          className="w-full flex-col flex justify-between"
        >
          <div className="mb-4 ">{t("enter_otp_inform")}</div>
          <MInput
            required
            prefix={<SmsIcon />}
            id="email"
            name="email"
            title={t("email")}
            placeholder={t("enter_email")}
            formik={formik}
          />
          <div className="mb-[18px]" />
          <ReCAPTCHA
            key={captchaKey}
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

          <MButton
            loading={sendLoading}
            className="h-12 mt-4"
            text={t("confirm")}
            htmlType="submit"
          />
          <div className="mb-60 w-full flex justify-center mt-5 ">
            <span className="text-sm mr-1">{t("remember_pass")}</span>
            <Link
              href="/signin"
              className="text-sm font-bold cursor-pointer  underline underline-offset-4"
            >
              {t("login")}
            </Link>
          </div>
        </form>
      )}
      {formState == StateForm.ENTER_PASSWORD && (
        <form className="w-full" onSubmit={onSubmitChagePass}>
          <MInput
            maxLength={16}
            required
            isPassword
            name={t("new_password")}
            id={t("new_password")}
            title={t("new_pass")}
            placeholder={t("enter_new_pass")}
            formik={formikChangePass}
            prefix={<LockIcon />}
            onKeyDown={(e) => {
              if (e.which == 32) {
                e.preventDefault();
              }
            }}
          />
          <MInput
            maxLength={16}
            required
            isPassword
            name={t("confirm_new_password")}
            id={t("confirm_new_password")}
            title={t("confirm_new_pass")}
            placeholder={t("re_enter_new_pass")}
            formik={formikChangePass}
            prefix={<LockIcon />}
            onKeyDown={(e) => {
              if (e.which == 32) {
                e.preventDefault();
              }
            }}
          />
          <MButton
            className="mb-60 mt-4 w-full h-12"
            htmlType="submit"
            text={t("confirm")}
          />
        </form>
      )}

      <OtpModal
        onChangeState={() => setFormState(StateForm.ENTER_PASSWORD)}
        key={modalKey}
        email={email}
        onOk={() => {}}
        open={open}
        onCancel={() => {
          setOtp("");
          setOpen(false);
        }}
        otp={otp}
        setOtp={setOtp}
      />
    </AuthLayout>
  );
}

export default ResetPasswordPage;
