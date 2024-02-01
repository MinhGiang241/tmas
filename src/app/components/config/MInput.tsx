"use client";
import { Input } from "antd";
import React, { ReactNode, useState } from "react";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";

interface Props {
  onChange?: (e: React.ChangeEvent<any>) => void;
  onBlur?: (e: React.FocusEvent<any, Element>) => void;
  title?: string;
  required?: Boolean;
  id: string;
  name: string;
  error?: string;
  value?: string;
  className?: string;
  type?: string;
  action?: React.ReactNode;
  touch?: Boolean;
  suffix?: ReactNode;
  prefix?: ReactNode;
  placeholder?: string;
  isPassword?: boolean;
}

function MInput({
  onChange,
  required = false,
  id,
  name,
  title,
  error,
  value,
  className,
  action,
  type,
  touch = false,
  onBlur,
  placeholder,
  suffix,
  prefix,
  isPassword,
}: Props) {
  const [visible, setVisible] = useState(!isPassword);
  return (
    <div className="w-full">
      <div
        className={`flex ${action ? "justify-between" : "justify-start"} mb-1 `}
      >
        <label className="text-sm font-semibold" htmlFor={id}>
          {title} {required && <span className="text-m_red">*</span>}
        </label>
        {action}
      </div>

      <div className="w-full flex flex-col mb-2  ">
        <Input
          prefix={prefix}
          onBlur={onBlur}
          status={error && touch ? `error` : ""}
          type={type ?? visible ? "text" : "password"}
          className={
            `shadow-inner shadow-gray-300 bg-m_neutral_100 h-12 ${className}` ??
            "h-12"
          }
          name={name}
          id={id}
          allowClear
          onChange={onChange}
          value={value}
          placeholder={placeholder}
          suffix={
            suffix ?? isPassword ? (
              <div
                onClick={() => {
                  setVisible(!visible);
                }}
                className="active:opacity-70 cursor-pointer"
              >
                {visible ? (
                  <EyeOutlined className="text-2xl" />
                ) : (
                  <EyeInvisibleOutlined className="text-2xl" />
                )}
              </div>
            ) : undefined
          }
        />
        {error && touch ? <div className="text-m_red">{error}</div> : null}
      </div>
    </div>
  );
}

export default MInput;
