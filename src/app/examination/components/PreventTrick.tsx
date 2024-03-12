import MInput from "@/app/components/config/MInput";
import { Checkbox, Collapse, GetProp } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";

function PreventTrick({
  values,
  setValues,
  numOut,
  setNumOut,
}: {
  values?: any;
  setValues?: any;
  numOut?: any;
  setNumOut?: any;
}) {
  const { t } = useTranslation("exam");
  const common = useTranslation();
  const options = [
    { value: 0, label: t("prevent_copy") },
    { value: 1, label: t("prevent_paste") },
    { value: 2, label: t("out_screen") },
  ];
  const CheckboxGroup = Checkbox.Group;
  const onChange: GetProp<typeof Checkbox.Group, "onChange"> = (
    checkedValues,
  ) => {
    setValues(checkedValues);
  };

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
                {t("prevent_trick")}
              </div>
              <div className="body_regular_14 text-wrap max-w-80 text-m_neutral_500">
                {values.length == 0
                  ? t("no_have")
                  : values
                      .sort((d: any, r: any) => d - r)
                      .map((i: any) => {
                        const a = options.find((c: any) => c.value == i);
                        return a?.label;
                      })
                      .join(",")}
              </div>
            </div>
          }
        >
          <CheckboxGroup rootClassName="flex " onChange={onChange}>
            {options.map((r: any) => (
              <Checkbox
                className="body_regular_14"
                key={r.value}
                value={r.value}
              >
                {r.label}
              </Checkbox>
            ))}
          </CheckboxGroup>
          {values.some((e: any) => e == 2) ? (
            <>
              <div className="h-3" />
              <MInput
                value={numOut}
                onChange={(e: any) => {
                  setNumOut(e.target.value);
                }}
                id="num_out_screen"
                name="num_out_screen"
                title={t("num_out_screen")}
                onKeyDown={(e) => {
                  if (!e.key.match(/[0-9]/g) && e.key != "Backspace") {
                    e.preventDefault();
                  }
                }}
              />
            </>
          ) : null}
        </Collapse.Panel>
      </Collapse>
    </>
  );
}

export default PreventTrick;
