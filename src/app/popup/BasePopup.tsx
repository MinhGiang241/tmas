"use client";
import { Modal } from "antd";
import React from "react";
import {
  WarningFilled,
  ExclamationCircleFilled,
  QuestionCircleFilled,
  CloseCircleFilled,
  CheckCircleFilled,
} from "@ant-design/icons";
import MButton from "../components/config/MButton";
import { useTranslation } from "react-i18next";

interface Props {
  type: "info" | "success" | "warning" | "danger";
  open: boolean;
  onCancel: () => void;
  onOk: () => void;
  loading?: boolean;
  msg?: string | undefined | null;
}

function BasePopup({ msg, type, open, onCancel, onOk, loading }: Props) {
  const { t } = useTranslation();
  return (
    <Modal
      className="rounded-lg overflow-hidden pb-0"
      onCancel={onCancel}
      footer={<div />}
      open={open}
      width={400}
    >
      <div className="w-full relative rounded-lg ">
        <div className="flex justify-center mt-6 mb-4">
          {type == "info" && (
            <QuestionCircleFilled className="text-[5rem] text-blue-400" />
          )}
          {type == "success" && (
            <CheckCircleFilled className="text-[5rem] text-m_success_500" />
          )}

          {type == "danger" && (
            <CloseCircleFilled className="text-[5rem] text-m_error_500" />
          )}
          {type == "warning" && (
            <WarningFilled className="text-[5rem] text-m_warning_500" />
          )}
        </div>
        <div className="flex flex-col text-center text-wrap">
          <h4 className="body_semibold_20 mb-2 overflow-hidden">
            {type == "info" && t("notify")}
            {type == "success" && t("success")}
            {type == "warning" && t("warning")}
            {type == "danger" && t("danger")}
          </h4>
          <div className="overflow-hidden">{msg}</div>
        </div>
        <div className="flex justify-center my-6">
          <MButton
            type="secondary"
            text={t("cancel")}
            className="h-12 w-36 "
            onClick={() => {
              onCancel();
            }}
          />
          <div className="w-5" />
          <MButton
            loading={loading}
            text={t("complete")}
            className="h-12 w-36 bg-m_primary_500 text-white"
            onClick={async () => {
              onOk();
              onCancel();
            }}
          />
        </div>
      </div>
    </Modal>
  );
}

export default BasePopup;
