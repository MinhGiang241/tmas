import { Button, Modal } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import { CloseOutlined, ExclamationCircleFilled } from "@ant-design/icons";

interface Props {
  open: boolean;
  onOk: () => void;
  onCancel: () => void;
  data?: any;
  text?: string;
}

function ConfirmModal({ text, open, onOk, onCancel, data }: Props) {
  const { t } = useTranslation();
  return (
    <Modal onCancel={onCancel} footer={<div />} open={open} width={400}>
      <div className="w-full relative">
        <div className="flex justify-center mt-6 mb-4">
          <ExclamationCircleFilled className="text-[5rem] text-m_warning_500" />
        </div>
        <div className="flex flex-col text-center text-wrap">
          <h4 className="body_semibold_20 mb-2 overflow-hidden">
            {t("notify")}
          </h4>
          <p className="overflow-hidden">content</p>
        </div>
        <div className="flex justify-center my-6">
          <Button className="h-12" onClick={() => {}}>
            {t("close")}
          </Button>
          <Button className="h-12" onClick={() => {}}>
            {text || t("close")}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmModal;
