import { Input } from "antd";
import React, { ReactNode, useEffect, useState } from "react";
import NoticeIcon from "@/app/components/icons/notice.svg";
import CloseEye from "@/app/components/icons/close_eye.svg";
import OpenEye from "@/app/components/icons/open_eye.svg";
import { useTranslation } from "react-i18next";
import { CheckCircleFilled, ExclamationCircleFilled } from "@ant-design/icons";

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
  namespace?: string;
  dangerText?: string;
  successText?: string;
  disable?: boolean;
  allowClear?: boolean;
}

function MInput({
  disable,
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
  namespace,
  dangerText,
  successText,
  allowClear,
}: Props) {
  var np;
  var er;
  if (formik) {
    onChange = formik.handleChange;
    error = formik.errors[name];
    touch = formik.touched[name];
    onBlur = formik.handleBlur;
    value = formik.values[name];
  }
  if (error?.startsWith("common")) {
    er = error.replace("common_", "");
    np = "common";
  } else {
    er = error;
    np = namespace;
  }

  const [visible, setVisible] = useState(!isPassword);
  const { t } = useTranslation(np);
  const common = useTranslation();
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
          autoComplete="off"
          disabled={disable}
          // defaultValue={formik.initialValues[name]}
          maxLength={maxLength ?? 500}
          prefix={prefix}
          onBlur={onBlur}
          status={error && touch ? `error` : ""}
          type={type ?? visible ? "text" : "password"}
          className={`${successText && touch ? "border-m_success_500" : ""} ${
            dangerText && touch ? "border-m_warning_500" : ""
          }  h-12 rounded-lg ${className}`} //shadow-inner shadow-gray-300 bg-m_neutral_100
          name={name}
          id={id}
          allowClear={allowClear ?? true}
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
        {successText && touch ? (
          <div className="flex items-center text-m_success_500">
            <div className="min-w-4">
              <CheckCircleFilled />
            </div>
            <div className=" body_regular_14">
              {common.t(successText ?? "")}
            </div>
          </div>
        ) : null}
        {dangerText && touch ? (
          <div className="flex items-center text-m_warning_500">
            <div className="min-w-4">
              <ExclamationCircleFilled />
            </div>
            <div className=" body_regular_14">{common.t(dangerText ?? "")}</div>
          </div>
        ) : null}
        {er && touch ? (
          <div className="flex items-center">
            <div className="min-w-4">
              <NoticeIcon />
            </div>
            <div className=" text-m_error_500 body_regular_14">{t(er)}</div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default MInput;
