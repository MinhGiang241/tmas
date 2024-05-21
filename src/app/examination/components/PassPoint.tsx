import MInput from "@/app/components/config/MInput";
import { Collapse } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";

interface Props {
  formik: any;
}

function PassPoint({ formik }: Props) {
  const { t } = useTranslation("exam");
  const common = useTranslation();

  return (
    <>
      <Collapse
        defaultActiveKey={["1"]}
        ghost
        expandIconPosition="end"
        className="rounded-lg bg-white overflow-hidden"
      >
        <Collapse.Panel
          key={"1"}
          header={
            <div className="w-full py-4 flex flex-grow justify-between items-center">
              <div className=" body_semibold_16 text-m_neutral_900 overflow-hidden text-nowrap lg:max-w-4xl md:max-w-lg  text-ellipsis">
                {t("point_setting")}
              </div>
              <div className=" body_regular_14 text-wrap max-w-80 text-m_neutral_500">
                {formik.values["pass_point"]
                  ? `${formik.values["pass_point"]} %`
                  : ""}
              </div>
            </div>
          }
        >
          <MInput
            formik={formik}
            h="h-9"
            placeholder={t("enter_pass_point")}
            title={t("pass_point")}
            id="pass_point"
            name="pass_point"
            onKeyDown={(e) => {
              if (!e.key.match(/[0-9]/g) && e.key != "Backspace") {
                e.preventDefault();
              }
            }}
          />
          <MInput
            formik={formik}
            h="h-9"
            placeholder={t("inform_when_pass")}
            title={t("inform_when_pass")}
            id="inform_pass"
            name="inform_pass"
          />
          <MInput
            formik={formik}
            h="h-9"
            placeholder={t("inform_when_fail")}
            title={t("inform_when_fail")}
            id="inform_fail"
            name="inform_fail"
          />
        </Collapse.Panel>
      </Collapse>
    </>
  );
}

export default PassPoint;
