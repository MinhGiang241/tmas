import React from "react";
import BaseModal from "../config/BaseModal";
import { ColorPicker } from "antd";

interface Props {
  onCancel: () => void;
  onChange?: () => void;
  onOk?: () => void;
  open: boolean;
}

function ColorPickerModal({ onOk, onChange, open, onCancel }: Props) {
  return (
    <BaseModal open={open} onCancel={onCancel} onOk={onOk}>
      <ColorPicker />
    </BaseModal>
  );
}

export default ColorPickerModal;
