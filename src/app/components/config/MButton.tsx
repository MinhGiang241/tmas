import { Button } from "antd";
import React from "react";

interface Props {
  disabled?: boolean;
  text?: string;
  className?: string;
  htmlType?: "button" | "submit" | "reset";
  loading?: boolean;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

function MButton({
  disabled,
  loading,
  text,
  className,
  htmlType,
  onClick,
}: Props) {
  return (
    <Button
      htmlType={htmlType}
      className={`bg-m_primary_500 text-white font-semibold text-base rounded-lg disabled:bg-m_neutral_400 ${className}`}
      loading={loading || false}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </Button>
  );
}

export default MButton;
