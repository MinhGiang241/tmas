import { Modal } from "antd";
import React, { useEffect, useState } from "react";

export interface BaseModalProps {
  open: boolean;
  onCancel: () => void;
  onOk?: () => void;
  title?: string;
  children?: React.ReactNode;
  width?: number;
  key?: any;
  className?: string;
}

function BaseModal({
  key,
  open,
  onCancel,
  onOk,
  children,
  title,
  width,
  className,
}: BaseModalProps) {
  const [keyModal, setKeyModal] = useState<number>(Date.now());

  return (
    <Modal
      key={keyModal}
      destroyOnClose
      className={`rounded-lg overflow-hidden pb-0 ${className}`}
      onCancel={onCancel}
      footer={<div />}
      open={open}
      onOk={onOk}
      width={width}
    >
      <div className="w-full relative rounded-lg ">
        <div className={`w-full px-2 rounded-lg flex flex-col items-center`}>
          {title && <p className="caption_bold_24 my-4">{title}</p>}
          {children}
        </div>
      </div>
    </Modal>
  );
}

export default BaseModal;
