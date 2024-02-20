import { Modal } from "antd";
import React from "react";

interface Props {
  open: boolean;
  onCancel: () => void;
  onOk?: () => void;
  title?: string;
  children?: React.ReactNode;
  width?: number;
  key?: any;
}

function BaseModal({
  key,
  open,
  onCancel,
  onOk,
  children,
  title,
  width,
}: Props) {
  return (
    <Modal
      key={key}
      destroyOnClose
      className="rounded-lg overflow-hidden pb-0"
      onCancel={onCancel}
      footer={<div />}
      open={open}
      onOk={onOk}
      width={width}
    >
      <div className="w-full relative rounded-lg text-m_primary_900">
        <div className="w-full px-2 rounded-lg flex flex-col items-center">
          <p className="caption_bold_24 my-4">{title}</p>
          {children}
        </div>
      </div>
    </Modal>
  );
}

export default BaseModal;
