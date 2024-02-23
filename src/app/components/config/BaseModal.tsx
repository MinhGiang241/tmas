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
  centered?: boolean;
  offPadding?: boolean;
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
  centered,
  offPadding,
}: BaseModalProps) {
  const [keyModal, setKeyModal] = useState<number>(Date.now());

  return (
    <Modal
      style={{ padding: 0 }}
      centered={centered}
      key={keyModal}
      destroyOnClose
      className={` rounded-lg  ${className}`}
      onCancel={onCancel}
      footer={<div />}
      open={open}
      onOk={onOk}
      width={width}
    >
      <div
        className={` ${
          offPadding ? "" : "px-6 py-5"
        } w-full relative rounded-lg `}
      >
        <div className={`w-full px-2 rounded-lg flex flex-col items-center`}>
          {title && <p className="caption_bold_24 my-4">{title}</p>}
          {children}
        </div>
      </div>
    </Modal>
  );
}

export default BaseModal;
