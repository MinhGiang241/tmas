import React, { ReactNode, useRef } from "react";
import { DatePicker } from "antd";
import { useTranslation } from "react-i18next";
import { CheckCircleFilled, ExclamationCircleFilled } from "@ant-design/icons";
import NoticeIcon from "@/app/components/icons/notice.svg";
import CalendarIcon from "@/app/components/icons/calendar-black.svg";
import dayjs from "dayjs";
import MInput from "./MInput";

interface Props {
  onChange?: (e: React.ChangeEvent<any>) => void;
  onBlur?: (e: React.FocusEvent<any, Element>) => void;
  setValue?: any;
  title?: string;
  required?: Boolean;
  id: string;
  name: string;
  error?: string;
  value?: any;
  className?: string;
  type?: string;
  action?: React.ReactNode;
  touch?: Boolean;
  suffix?: ReactNode;
  prefix?: ReactNode;
  placeholder?: [string, string];
  formik?: any;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  namespace?: string;
  dangerText?: string;
  successText?: string;
  disable?: boolean;
  allowClear?: boolean;
  extend?: boolean;
  h?: string;
  defaultValue?: string;
  fetching?: boolean;
  onOk?: any;
  formatter?: string;
}

function MRangePicker({
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
  formatter = "DD/MM/YYYY HH:mm",
  formik,
  onKeyDown,
  namespace,
  dangerText,
  successText,
  extend = true,
  h,
  defaultValue,
  fetching = false,
  onOk,
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
  const { RangePicker } = DatePicker;
  const ref = useRef(null);

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
        {/* <MInput */}
        {/*   id={id} */}
        {/*   name={name} */}
        {/*   disable */}
        {/*   onClick={() => { */}
        {/*     (ref.current as any).focus(); */}
        {/*   }} */}
        {/* /> */}
        <RangePicker
          ref={ref}
          onBlur={onBlur}
          id={id}
          onKeyDown={onKeyDown}
          disabled={disable}
          allowClear={allowClear ?? true}
          defaultValue={defaultValue ?? formik?.initialValues[name]}
          suffixIcon={<CalendarIcon />}
          placeholder={placeholder}
          format={[formatter]}
          showSecond={false}
          status={error && touch ? `error` : ""}
          onChange={(value: any, dateString: any) => {
            console.log(dateString);

            if (setValue) {
              setValue!(name, dateString);
            }
          }}
          onOk={onOk}
          className={`${successText && touch ? "border-m_success_500" : ""} ${
            dangerText && touch ? "border-m_warning_500" : ""
          } ${disable ? "text-m_neutral_900" : ""} ${
            h ? h : "h-12"
          } rounded-lg ${className} w-full body_regular_14`} //shadow-inner shadow-gray-300 bg-m_neutral_100
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

export default MRangePicker;
