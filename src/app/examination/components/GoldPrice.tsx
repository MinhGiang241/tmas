import MInput from "@/app/components/config/MInput";
import { Collapse, Tooltip } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import NoticeIcon from "@/app/components/icons/blue-notice.svg";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";

function GoldPrice({ formik }: { formik: any }) {
  const { t } = useTranslation("exam");
  const common = useTranslation();
  const setting = useAppSelector((state: RootState) => state.setting);

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
              <div className="flex items-center">
                <div className=" body_semibold_16 text-m_neutral_900 overflow-hidden text-nowrap lg:max-w-4xl md:max-w-lg  text-ellipsis">
                  {t("gold_price")}
                </div>
                <span className="ml-2 ">
                  <Tooltip
                    arrow={false}
                    overlayInnerStyle={{
                      width: "482px",
                      background: "white",
                      color: "black",
                    }}
                    placement="bottom"
                    title={
                      <div className="m-2">
                        <div>{t("gold_tooltip_0")}</div>
                        <div className="mt-2">
                          <span className="caption_semibold_14">
                            {t("notice")}:
                          </span>
                          <span className="ml-1">
                            {t("gold_tooltip_1", {
                              num1:
                                100 -
                                (setting?.compensate?.exam_purchase_rate ?? 0),
                              num2:
                                setting?.compensate?.exam_purchase_rate ?? 0,
                            })}
                          </span>
                        </div>
                        <div>{t("gold_tooltip_2", { num: 100 })}</div>
                        <div className="ml-2">
                          •{" "}
                          <span>
                            {t("gold_tooltip_3", {
                              num:
                                100 -
                                (setting?.compensate?.exam_purchase_rate ?? 0),
                            })}
                          </span>
                        </div>
                        <div className="ml-2">
                          •{" "}
                          <span>
                            {t("gold_tooltip_4", {
                              num: setting?.compensate?.exam_purchase_rate ?? 0,
                            })}
                          </span>
                        </div>
                      </div>
                    }
                  >
                    <NoticeIcon />
                  </Tooltip>
                </span>
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
