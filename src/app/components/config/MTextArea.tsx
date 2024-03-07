import TextArea from "antd/es/input/TextArea";
import React, { ReactNode } from "react";
import { CheckCircleFilled, ExclamationCircleFilled } from "@ant-design/icons";
import NoticeIcon from "@/app/components/icons/notice.svg";
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
  onKeyDown?: React.KeyboardEventHandler<HTMLTextAreaElement>;
  namespace?: string;
  dangerText?: string;
  successText?: string;
  disable?: boolean;
  allowClear?: boolean;
  h?: string;
  loadingValidate?: boolean;
  extend?: boolean;
  defaultValue?: string;
}

function MTextArea({
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
  allowClear = true,
  h,
  loadingValidate,
  defaultValue,
  extend = true,
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
  const { t } = useTranslation(np);
  const common = useTranslation();

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
        className={`w-full flex flex-col ${
          extend ? "mb-0" : "mb-[22px]"
        } relative`}
      >
        <TextArea
          style={{ borderColor: er && touch && "#EA3434" }}
          id={id}
          allowClear={allowClear}
          onKeyDown={onKeyDown}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disable}
          defaultValue={defaultValue}
          maxLength={maxLength}
          autoSize={{ minRows: 4, maxRows: 4 }}
          onBlur={onBlur}
          className={`${disable ? "text-m_neutral_900" : ""} ${
            successText && touch ? "border-m_success_500" : ""
          } ${dangerText && touch ? "border-m_warning_500" : ""}  ${
            h ? h : ``
          } rounded-lg ${suffix ? "pr-0" : ""} ${className}`}
        />
        {successText && touch ? (
          <div
            className={`flex items-start text-m_success_500 ${
              !extend && "absolute  top-[49px]"
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
            className={`flex items-start  text-m_warning_500 ${
              !extend && "absolute top-[49px]"
            }`}
          >
            <div className="min-w-4">
              <ExclamationCircleFilled />
            </div>
            <div className=" body_regular_14 text-nowrap lg:max-w-2xl overflow-hidden text-ellipsis">
              {common.t(dangerText ?? "")}
            </div>
          </div>
        ) : null}

        {er && touch ? (
          <div
            className={` flex items-start  ${!extend && "absolute top-[49px]"}`}
          >
            <div className="min-w-4 mt-[2px]">
              <NoticeIcon />
            </div>
            <div className=" text-m_error_500 body_regular_14 text-pretty">
              {t(er)}
            </div>
          </div>
        ) : (
          <div />
        )}
        {extend && !(er && touch) && <div className="h-[20px]" />}
      </div>
    </div>
  );
}

export default MTextArea;
