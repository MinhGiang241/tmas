import { Checkbox, Collapse } from "antd";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import type { CheckboxOptionType, CheckboxProps, GetProp } from "antd";
type CheckboxValueType = GetProp<typeof Checkbox.Group, "value">[number];

const CheckboxGroup = Checkbox.Group;
function ResultTest({
  checkedList,
  setCheckedList,
}: {
  checkedList: any[];
  setCheckedList?: any;
}) {
  const { t } = useTranslation("exam");
  const common = useTranslation();

  const plainOptions: CheckboxOptionType[] = [
    { value: "showPoint", label: t("point") },
    { value: "showPercent", label: t("percent_complete") },
    { value: "showPassOrFail", label: t("detail") },
    { value: "showPassOrFailDetail", label: t("pass_fail") },
  ];

  const onChangeCheck: GetProp<typeof Checkbox.Group, "onChange"> = (
    checkedValues,
  ) => {
    setCheckedList(checkedValues);
  };

  return (
    <>
      <Collapse
        defaultActiveKey={["1"]}
        ghost
        expandIconPosition="end"
        className="  rounded-lg bg-white overflow-hidden "
      >
        <Collapse.Panel
          key={"1"}
          header={
            <div className="w-full py-4 flex flex-grow justify-between items-center">
              <div className=" body_semibold_16 text-m_neutral_900 overflow-hidden text-nowrap lg:max-w-4xl md:max-w-lg  text-ellipsis">
                {t("test_result")}
              </div>
              <div className="body_regular_14 text-m_neutral_500">
                {checkedList.length == 0
                  ? ""
                  : checkedList
                      .sort((d: any, r: any) => d - r)
                      .map((i: any) => {
                        const a = plainOptions.find((c: any) => c.value == i);
                        return a?.label;
                      })
                      .join(",")}
              </div>
            </div>
          }
        >
          <div className="flex  w-full items-center">
            <div className=" w-1/2 h-full flex flex-col justify-around">
              <div className="body_regular_14 w-1/2">{t("point")}: </div>
              <div className="h-10" />
              <div className="body_regular_14">{t("result")}:</div>
            </div>
            <div className=" right-0 w-1/2">
              <CheckboxGroup
                value={checkedList}
                rootClassName="flex flex-col"
                onChange={onChangeCheck}
              >
                {plainOptions?.map((a: any, i: number) => (
                  <Checkbox key={i} className="my-1" value={a?.value}>
                    {a?.label}
                  </Checkbox>
                ))}
              </CheckboxGroup>
            </div>
          </div>
        </Collapse.Panel>
      </Collapse>
    </>
  );
}

export default ResultTest;
