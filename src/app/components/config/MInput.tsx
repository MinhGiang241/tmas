import { Input } from "antd";
import React, { ReactNode, useEffect, useState } from "react";
import NoticeIcon from "@/app/components/icons/notice.svg";
import CloseEye from "@/app/components/icons/close_eye.svg";
import OpenEye from "@/app/components/icons/open_eye.svg";
import { useTranslation } from "react-i18next";

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
  formik?: any;
  maxLength?: number;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
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
  formik,
  maxLength,
  onKeyDown,
}: Props) {
  const [visible, setVisible] = useState(!isPassword);
  const { t } = useTranslation();
  if (formik) {
    onChange = formik.handleChange;
    error = formik.errors[name];
    touch = formik.touched[name];
    onBlur = formik.handleBlur;
    value = formik.values[name];
  }
  useEffect(() => {}, [formik]);
  return (
    <div className="w-full">
      <div
        className={`flex ${action ? "justify-between" : "justify-start"} mb-1 `}
      >
        <label
          className="text-sm font-semibold text-m_primary_900"
          htmlFor={id}
        >
          {title} {required && <span className="text-m_error_500">*</span>}
        </label>
        {action}
      </div>

      <div className="w-full flex flex-col mb-2  ">
        <Input
          maxLength={maxLength ?? 500}
          prefix={prefix}
          onBlur={onBlur}
          status={error && touch ? `error` : ""}
          type={type ?? visible ? "text" : "password"}
          className={`shadow-inner shadow-gray-300 bg-m_neutral_100 h-12 rounded-lg ${className}`}
          name={name}
          id={id}
          allowClear
          onKeyDown={onKeyDown}
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
                {visible ? <OpenEye style={{ color: "red" }} /> : <CloseEye />}
              </div>
            ) : undefined
          }
        />
        {error && touch ? (
          <div className="flex items-center">
            <div className="min-w-4">
              <NoticeIcon />
            </div>
            <div className=" text-m_error_500 body_regular_14">{t(error)}</div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default MInput;
