import { Button } from "antd";
import React from "react";

interface Props {
  text?: string;
  className?: string;
  htmlType?: "button" | "submit" | "reset";
  loading?: boolean;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

function MButton({ loading, text, className, htmlType, onClick }: Props) {
  return (
    <Button
      htmlType={htmlType}
      className={`bg-m_primary_500 text-white font-semibold text-base ${className}`}
      loading={loading || false}
      onClick={onClick}
    >
      {text}
    </Button>
  );
}

export default MButton;
