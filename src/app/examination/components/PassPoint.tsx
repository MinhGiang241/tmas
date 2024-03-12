import MInput from "@/app/components/config/MInput";
import { Collapse } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";

interface Props {
  passPoint?: string;
  setPassPoint?: any;
  informWhenPass?: string;
  setInformWhenPass?: any;
  informWhenFail?: string;
  setInformWhenFail?: any;
}

function PassPoint({
  passPoint,
  setPassPoint,
  informWhenPass,
  informWhenFail,
  setInformWhenFail,
  setInformWhenPass,
}: Props) {
  const { t } = useTranslation("exam");
  const common = useTranslation();

  return (
    <>
      <Collapse
        ghost
        expandIconPosition="end"
        className="rounded-lg bg-white overflow-hidden"
      >
        <Collapse.Panel
          key={"2"}
          header={
            <div className="w-full py-4 flex flex-grow justify-between items-center">
              <div className=" body_semibold_16 text-m_neutral_900 overflow-hidden text-nowrap lg:max-w-4xl md:max-w-lg  text-ellipsis">
                {t("point_setting")}
              </div>
              <div className="body_regular_14 text-wrap max-w-80 text-m_neutral_500">
                {passPoint ? `${passPoint} %` : ""}
              </div>
            </div>
          }
        >
          <MInput
            value={passPoint}
            placeholder={t("enter_pass_point")}
            title={t("pass_point")}
            id="pass_point"
            name="pass_point"
            onChange={(e) => {
              setPassPoint(e.target.value);
            }}
            onKeyDown={(e) => {
              if (!e.key.match(/[0-9]/g) && e.key != "Backspace") {
                e.preventDefault();
              }
            }}
          />
          <MInput
            value={informWhenPass}
            placeholder={t("inform_when_pass")}
            title={t("inform_when_pass")}
            id="inform_when_pass"
            name="inform_when_pass"
            onChange={(e) => {
              setInformWhenPass(e.target.value);
            }}
          />
          <MInput
            value={informWhenFail}
            placeholder={t("inform_when_fail")}
            title={t("inform_when_fail")}
            id="inform_when_fail"
            onChange={(e) => {
              setInformWhenFail(e.target.value);
            }}
            name="inform_when_fail"
          />
        </Collapse.Panel>
      </Collapse>
    </>
  );
}

export default PassPoint;
