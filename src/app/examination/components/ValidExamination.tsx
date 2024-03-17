import MDropdown from "@/app/components/config/MDropdown";
import { Collapse, DatePicker, DatePickerProps } from "antd";
import { RangePickerProps } from "antd/es/date-picker";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import CalendarIcon from "@/app/components/icons/calendar-black.svg";
import MDateTimeSelect from "@/app/components/config/MDateTimeSelect";

interface Props {
  startTime?: string;
  setStartTime?: any;
  endTime?: string;
  setEndTime?: any;
  formik?: any;
}

function ValidExamination({
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  formik,
}: Props) {
  const [value, setValue] = useState<number>(0);
  const { t } = useTranslation("exam");
  const common = useTranslation();

  const onChangeStart = (
    value: DatePickerProps["value"] | RangePickerProps["value"],
    dateString: [string, string] | string,
  ) => {
    setStartTime(dateString);
  };

  const onChangeEnd = (
    value: DatePickerProps["value"] | RangePickerProps["value"],
    dateString: [string, string] | string,
  ) => {
    setEndTime(dateString);
  };

  const onOkStart = (
    value: DatePickerProps["value"] | RangePickerProps["value"],
  ) => {};
  const onOkEnd = (
    value: DatePickerProps["value"] | RangePickerProps["value"],
  ) => {};

  const dateFormat = "DD/MM/YYYY HH:mm";

  return (
    <>
      <Collapse
        ghost
        expandIconPosition="end"
        className="  rounded-lg bg-white overflow-hidden "
      >
        <Collapse.Panel
          key={"saddas"}
          header={
            <div className="w-full py-4 flex flex-grow justify-between items-center">
              <div className=" body_semibold_16 text-m_neutral_900 overflow-hidden text-nowrap lg:max-w-4xl md:max-w-lg  text-ellipsis">
                {t("valid_examination")}
              </div>
              <div className="body_regular_14 text-m_neutral_500">
                {!formik.values["start_time"] && !formik.values["end_time"]
                  ? t("no_limit")
                  : `${startTime ?? ""} - ${endTime ?? ""}`}
              </div>
            </div>
          }
        >
          <div className="flex flex-col w-full">
            <div className="body_regular_14 text-m_neutral_500">
              {t("not_select_time")}
            </div>
            <div className="w-full mt-3 flex justify-between">
              <MDateTimeSelect
                placeholder={t("start_time")}
                h="h-9"
                id="start_time"
                name="start_time"
                formik={formik}
                value={startTime ? dayjs(startTime, dateFormat) : undefined}
              />
              <div className="w-8" />
              <MDateTimeSelect
                placeholder={t("end_time")}
                h="h-9"
                id="end_time"
                name="end_time"
                formik={formik}
                value={startTime ? dayjs(startTime, dateFormat) : undefined}
              />
            </div>
            {/*
            <div className="w-full mt-3 flex justify-between">
              <DatePicker
                suffixIcon={<CalendarIcon />}
                value={startTime ? dayjs(startTime, dateFormat) : undefined}
                placeholder={t("start_time")}
                format={["DD/MM/YYYY HH:mm"]}
                showSecond={false}
                showTime
                onChange={onChangeStart}
                onOk={onOkStart}
                className="h-9 rounded-lg w-full"
              />
              <div className="w-8" />
              <DatePicker
                suffixIcon={<CalendarIcon />}
                value={endTime ? dayjs(endTime, dateFormat) : undefined}
                placeholder={t("end_time")}
                format={["DD/MM/YYYY HH:mm"]}
                showSecond={false}
                showTime
                onChange={onChangeEnd}
                onOk={onOkEnd}
                className="h-9 rounded-lg w-full"
              /> 
            </div>
 <div className="h-3" />
            */}

            <MDropdown
              formik={formik}
              h="h-9"
              popupClassName="hidden"
              id="ips"
              name="ips"
              title={t("allow_ip_test")}
              mode="tags"
            />
          </div>
        </Collapse.Panel>
      </Collapse>
    </>
  );
}

export default ValidExamination;
