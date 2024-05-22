import MInput from "@/app/components/config/MInput";
import { Collapse } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";

function GoldPrice({ formik }: { formik: any }) {
  const { t } = useTranslation("exam");
  const common = useTranslation();

  return (
    <>
      <Collapse
        ghost
        expandIconPosition="end"
        className="  rounded-lg bg-white overflow-hidden "
        defaultActiveKey={["1"]}
      >
        <Collapse.Panel
          key="1"
          header={
            <div className="w-full py-4 flex flex-grow justify-between items-center">
              <div className=" body_semibold_16 text-m_neutral_900 overflow-hidden text-nowrap lg:max-w-4xl md:max-w-lg  text-ellipsis">
                {t("gold_price")}
              </div>
              <div className="body_regular_14 text-m_neutral_500">
                {formik.values["gold_price"] ?? ""}
              </div>
            </div>
          }
        >
          <MInput
            onKeyDown={(e) => {
              if (!e.key.match(/[0-9]/g) && e.key != "Backspace") {
                e.preventDefault();
              }
            }}
            title={t("gold_price")}
            h="h-9"
            formik={formik}
            id="gold_price"
            name="gold_price"
          />
        </Collapse.Panel>
      </Collapse>
    </>
  );
}

export default GoldPrice;
