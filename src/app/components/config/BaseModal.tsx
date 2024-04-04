import { Modal } from "antd";
import React, { useEffect, useState } from "react";

export interface BaseModalProps {
  open: boolean;
  onCancel: () => void;
  onOk?: any;
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

  useEffect(() => {
    if (open) {
      setKeyModal(Date.now());
    }
  }, [open]);

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
        } w-full  relative rounded-lg text-m_neutral_900`}
      >
        <div
          className={`w-full ${
            offPadding ? "" : "px-2 rounded-lg"
          }  flex flex-col items-center text-center`}
        >
          {title && <p className="title_bold_24 my-4">{title}</p>}
          {children}
        </div>
      </div>
    </Modal>
  );
}

export default BaseModal;
