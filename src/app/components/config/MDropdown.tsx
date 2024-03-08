import { Input, Select, SelectProps, Tag } from "antd";
import React, { ReactNode, useEffect, useState } from "react";
import NoticeIcon from "@/app/components/icons/notice.svg";
import CloseEye from "@/app/components/icons/close_eye.svg";
import OpenEye from "@/app/components/icons/open_eye.svg";
import { useTranslation } from "react-i18next";
import { CheckCircleFilled, ExclamationCircleFilled } from "@ant-design/icons";
import { FormikErrors } from "formik";

interface Props {
  onChange?: (e: React.ChangeEvent<any>) => void;
  onBlur?: (e: React.FocusEvent<any, Element>) => void;
  setValue?: any;
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
  options?: { value: any; label: React.ReactNode; disabled?: boolean }[];
  extend?: boolean;
  mode?: "multiple" | "tags";
  h?: string;
}

function MDropdown({
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
  allowClear,
  touch = false,
  onBlur,
  placeholder,
  setValue,
  isPassword,
  options,
  formik,
  maxLength,
  onKeyDown,
  namespace,
  dangerText,
  successText,
  extend = true,
  mode,
  h,
}: Props) {
  var np;
  var er;
  if (formik) {
    onChange = formik.handleChange;
    error = formik.errors[name];
    touch = formik.touched[name];
    onBlur = formik.handleBlur;
    value = formik.values[name];
    setValue = formik.setFieldValue;
  }
  if (error?.startsWith("common")) {
    er = error.replace("common_", "");
    np = "common";
  } else {
    er = error;
    np = namespace;
  }

  const { t } = useTranslation(np);
  const common = useTranslation();
  useEffect(() => {}, [formik]);
  type TagRender = SelectProps["tagRender"];
  const tagRender: TagRender = (props) => {
    const { label, value, closable, onClose } = props;
    const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
      event.preventDefault();
      event.stopPropagation();
    };
    return (
      <Tag
        className="bg-m_primary_100 text-m_primary_900 py-1 rounded-[6px] flex body_regular_14 h-full"
        color={value}
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{ marginRight: 3, color: "black" }}
      >
        {label}
      </Tag>
    );
  };

  return (
    <div className="w-full">
      <div
        className={`flex ${action ? "justify-between" : "justify-start"} mb-1 `}
      >
        <label className="text-sm font-semibold " htmlFor={id}>
          {title} {required && <span className="text-m_error_500">*</span>}
        </label>
        {action}
      </div>

      <div
        className={`relative w-full flex flex-col ${
          extend ? "mb-2" : "mb-[22px]"
        }`}
      >
        <Select
          showSearch={true}
          tagRender={tagRender}
          mode={mode}
          value={value}
          allowClear={allowClear ?? true}
          options={options}
          disabled={disable}
          defaultValue={
            formik?.initialValues[name] ?? formik?.initialValues[name]
          }
          maxLength={maxLength ?? 500}
          onBlur={onBlur}
          status={error && touch ? `error` : ""}
          className={`${successText && touch ? "border-m_success_500" : ""} ${
            dangerText && touch ? "border-m_warning_500" : ""
          } ${disable ? "text-m_neutral_900" : ""} ${
            h ? h : "h-12"
          } rounded-lg ${className}`} //shadow-inner shadow-gray-300 bg-m_neutral_100
          id={id}
          onKeyDown={onKeyDown}
          onChange={(e) => {
            if (setValue) {
              setValue!(name, e);
            }
          }}
          placeholder={placeholder}
        />
        {successText && touch ? (
          <div
            className={`flex items-center  text-m_warning_500 ${
              !extend && "absolute -bottom-[22px]"
            }`}
          >
            <div className="min-w-4">
              <CheckCircleFilled />
            </div>
            <div className=" body_regular_14">
              {common.t(successText ?? "")}
            </div>
          </div>
        ) : null}
        {dangerText && touch ? (
          <div
            className={`flex items-center  text-m_warning_500 ${
              !extend && "absolute -bottom-[22px]"
            }`}
          >
            <div className="min-w-4">
              <ExclamationCircleFilled />
            </div>
            <div className=" body_regular_14">{common.t(dangerText ?? "")}</div>
          </div>
        ) : null}
        {er && touch ? (
          <div
            className={`flex items-center  ${
              !extend && "absolute -bottom-[22px]"
            }`}
          >
            <div className="min-w-4">
              <NoticeIcon />
            </div>
            <div className={`text-m_error_500 body_regular_14`}>{t(er)}</div>
          </div>
        ) : null}
        {extend && !(er && touch) && <div className="h-[20px]" />}
      </div>
    </div>
  );
}

export default MDropdown;
