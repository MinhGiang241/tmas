import BaseModal from "@/app/components/config/BaseModal";
import MButton from "@/app/components/config/MButton";
import MInput from "@/app/components/config/MInput";
import { errorToast, successToast } from "@/app/components/toast/customToast";
import {
  checkEmailToWorkSpace,
  sendInviteEmailToMember,
} from "@/services/api_services/account_services";
import { emailRegex } from "@/services/validation/regex";
import { Modal, Radio, RadioChangeEvent, Space } from "antd";
import { FormikErrors, useFormik } from "formik";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  open: boolean;
  onCancel: () => void;
  onOk?: () => void;
}

interface SendInviteMailFormValue {
  email?: string;
}

function AddAccount({ open, onCancel, onOk }: Props) {
  const { t } = useTranslation("account");
  const common = useTranslation();
  const [danger, setDanger] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [role, setRole] = useState<string>("Admin");
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingValidateMail, setLoadingValidateMail] =
    useState<boolean>(false);
  const initialValues: SendInviteMailFormValue = {
    email: undefined,
  };

  const validate = async (values: SendInviteMailFormValue) => {
    const errors: FormikErrors<SendInviteMailFormValue> = {};
    setDanger(undefined);
    setSuccess(undefined);
    if (!values.email?.trim()) {
      errors.email = "common_not_empty";
    } else if (!emailRegex.test(values.email)) {
      errors.email = "common_invalid_email";
    } else {
      setLoadingValidateMail(true);
      var check = await checkEmailToWorkSpace({ email: values.email });
      setLoadingValidateMail(false);
      if (check["type"] == "danger") {
        errors.email = check["message"];
      } else if (check["type"] == "warning") {
        setDanger(check["message"]);
      } else {
        // setSuccess(t("allow_add_account"));
      }
    }

    return errors;
  };

  const formik = useFormik({
    initialValues,
    validate,
    onSubmit: async (values: SendInviteMailFormValue) => {
      setLoading(true);
      await sendInviteEmailToMember({ email: values.email!, role })
        .then((v) => {
          setLoading(false);
          onOk!();
          onCancel();
          successToast(v?.message ?? t("add_account_success"));
        })
        .catch((e) => {
          console.log(e);
          setLoading(false);
          errorToast(e);
        });
    },
  });

  const onChangeValue = (e: RadioChangeEvent) => {
    setRole(e.target.value);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    Object.keys(initialValues).map(async (v) => {
      await formik.setFieldTouched(v, true);
    });
    formik.handleSubmit();
  };

  return (
    <BaseModal
      width={755}
      onCancel={onCancel}
      title={t("add_account")}
      open={open}
    >
      <form onSubmit={onSubmit} className="w-full flex flex-col items-start">
        <MInput
          extend={false}
          loadingValidate={loadingValidateMail}
          dangerText={danger}
          successText={success}
          required
          id={t("email")}
          name="email"
          placeholder={t("enter_email")}
          title={t("email")}
          formik={formik}
        />
        {/*
        <p className="caption_semibold_14 mt-[35px] mb-2">{t("role")}</p>
        <Radio.Group
          className="flex flex-col justify-start"
          buttonStyle="solid"
          onChange={onChangeValue}
          value={role}
        >
          <Space direction="vertical" className="flex flex-col items-start">
            <Radio className=" caption_regular_14" value={"Member"}>
              {t("member_role")}
            </Radio>
            <Radio className=" caption_regular_14" value={"Admin"}>
              {t("admin_role")}
            </Radio>
          </Space>
        </Radio.Group>
        */}
        <div className="w-full flex justify-center mt-7">
          <MButton
            onClick={onCancel}
            className="w-36"
            type="secondary"
            text={common.t("cancel")}
          />
          <div className="w-5" />
          <MButton
            disabled={!!danger || !!formik.errors["email"]}
            htmlType="submit"
            loading={loading}
            className="w-36"
            text={t("invite")}
          />
        </div>
      </form>
    </BaseModal>
  );
}

export default AddAccount;
