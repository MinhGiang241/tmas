import { Button } from "antd";
import React from "react";

interface Props {
  type?: "secondary" | "primary";
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
  type = "primary",
  onClick,
}: Props) {
  return (
    <Button
      htmlType={htmlType}
      type="default"
      className={`${
        type == "primary"
          ? `${disabled ? "bg-m_neutral_400" : "bg-m_primary_500 text-white"}`
          : `${
              disabled
                ? "bg-white text-m_neutral_400 border-1 border-m_neutral_400"
                : "bg-white text-m_primary_500 border border-m_primary_500"
            }`
      } h-11  lg:h-12 caption_semibold_14 lg:caption_semibold_16 rounded-lg ${className}`}
      loading={loading || false}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </Button>
  );
}

export default MButton;
