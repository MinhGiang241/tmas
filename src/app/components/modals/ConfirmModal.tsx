import { Button, Modal } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import { CloseOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import MButton from "../config/MButton";

interface Props {
  open: boolean;
  onOk: () => void;
  onCancel: () => void;
  data?: any;
  text?: string;
  action?: string;
  loading?: boolean;
}

function ConfirmModal({
  loading = false,
  text,
  open,
  onOk,
  onCancel,
  data,
  action,
}: Props) {
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
          <ExclamationCircleFilled className="text-[5rem] text-m_warning_500" />
        </div>
        <div className="flex flex-col text-center text-wrap">
          <h4 className="body_semibold_20 mb-2 overflow-hidden">
            {t("notify")}
          </h4>
          <p className="overflow-hidden">{text}</p>
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
            text={action}
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

export default ConfirmModal;
