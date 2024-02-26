"use client";
import { Modal } from "antd";
import { MuiOtpInput } from "mui-one-time-password-input";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import MButton from "../config/MButton";
import { Spin } from "antd";
import {
  sendOtpResetPassword,
  verifyOtp,
} from "@/services/api_services/auth_service";
import { errorToast } from "../toast/customToast";
import moment from "moment";

interface Props {
  open: boolean;
  onOk: () => void;
  onCancel: () => void;
  setOtp: (otp: string) => void;
  otp?: string;
  email?: string;
  onChangeState: () => void;
}

function OtpModal({
  onChangeState,
  open,
  onOk,
  onCancel,
  otp,
  setOtp,
  email,
}: Props) {
  const [time, setTime] = useState<number>(300);
  const [resendLoading, setResendLoading] = useState<boolean>(false);
  const [sendLoading, setSendLoading] = useState<boolean>(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (!time) return;

    // save intervalId to clear the interval when the
    // component re-renders
    const intervalId = setInterval(() => {
      setTime(time - 1);
    }, 1000);

    // clear interval on re-render to avoid memory leaks
    return () => clearInterval(intervalId);
  }, [time]);

  const resendOtp = async () => {
    setResendLoading(true);
    sendOtpResetPassword({ email })
      .then((v) => {
        setTime(300);
        setResendLoading(false);
      })
      .catch((e) => {
        setResendLoading(false);
        errorToast(e);
      });
  };

  const sendOtp = () => {
    setSendLoading(true);
    verifyOtp({ mailTo: email, otp })
      .then((v) => {
        setSendLoading(false);
        onChangeState();
        onCancel();
      })
      .catch((e) => {
        errorToast(e);
        setSendLoading(false);
      });
  };

  return (
    <Modal
      style={{ borderRadius: "20px" }}
      footer={<div />}
      open={open}
      onOk={(_) => onOk()}
      onCancel={(_) => onCancel()}
    >
      <div className="px-6 py-5 w-full flex flex-col items-center justify-center">
        <p className="title_bold_24 mb-3">{t("otp_verify")}</p>
        <p className=" mb-3 text-wrap text-center">
          {t("send_otp_email")}
          <span className="mx-1 body_semibold_14">{email}.</span>
          {t("please_verify")}
        </p>
        <p className="body_semibold_14 my-2">{t("enter_otp")}</p>
        <MuiOtpInput
          className="lg:w-[436px] h-full"
          TextFieldsProps={{ placeholder: "-" }}
          // style={{}}
          value={otp}
          onChange={(v) => {
            if (/^\d+$/.test(v) || undefined) {
              setOtp(v);
            }
          }}
          onComplete={() => {}}
          length={6}
          autoFocus
          validateChar={(character: string, index: number) => {
            if (index == 0 && character === "") {
              return true;
            }
            return /^\d+$/.test(character);
          }}
        />
        <p className="text-wrap mt-4">
          {t("not_otp")}
          <button
            onClick={() => {
              resendOtp();
            }}
            disabled={resendLoading || time > 0}
            className="mx-1  body_semibold_14 text-m_primary_500 disabled:text-m_primary_200"
          >
            {t("resent")}
          </button>

          {resendLoading ? (
            <Spin />
          ) : (
            <span className="body_semibold_14 text-m_primary_500">
              ({moment.utc(time * 1000).format("mm:ss")})
            </span>
          )}
        </p>

        <MButton
          onClick={() => sendOtp()}
          loading={sendLoading}
          disabled={(otp?.length ?? 0) < 6 || resendLoading}
          className="h-12 mt-3"
          text={t("continue")}
        />
      </div>
    </Modal>
  );
}

export default OtpModal;
