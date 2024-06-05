import React from "react";
import { FormattedNumber } from "react-intl";
import UpIcon from "@/app/components/icons/up.svg";
import DownIcon from "@/app/components/icons/down.svg";

interface Props {
  up?: boolean;
  num: number;
}

function UpDownTrend({ up, num }: Props) {
  return (
    <>
      <div
        className={`${
          up ? "bg-m_success_50" : "bg-m_error_100"
        } rounded-full w-7 h-7 flex justify-center items-center mx-4`}
      >
        {up ? <UpIcon /> : <DownIcon />}
      </div>
      <div
        className={`${
          up ? "text-m_success_500" : "text-m_error_500"
        } body_semibold_14`}
      >
        <FormattedNumber
          value={num}
          style="decimal"
          maximumFractionDigits={2}
        />
      </div>
    </>
  );
}

export default UpDownTrend;
