import MInput from "@/app/components/config/MInput";
import { Checkbox, Collapse, GetProp } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";

function PreventTrick({
  values,
  setValues,
  formik,
}: {
  values?: any;
  setValues?: any;
  formik?: any;
}) {
  const { t } = useTranslation("exam");
  const common = useTranslation();
  const options = [
    { value: "disableCopy", label: t("prevent_copy") },
    { value: "disablePatse", label: t("prevent_paste") },
    { value: "limitExitScreen", label: t("out_screen") },
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
                {t("prevent_trick")}
              </div>
              <div className="body_regular_14 text-wrap max-w-80 text-m_neutral_500">
                {values.length == 0
                  ? ""
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
          <CheckboxGroup
            value={values}
            rootClassName="flex "
            onChange={onChange}
          >
            {options.map((r: any) => (
              <Checkbox
                className="my-1 body_regular_14"
                key={r.value}
                value={r.value}
              >
                {r.label}
              </Checkbox>
            ))}
          </CheckboxGroup>
          {values.some((e: any) => e == "limitExitScreen") ? (
            <>
              <div className="h-3" />
              <MInput
                formik={formik}
                h="h-9"
                id="out_screen"
                name="out_screen"
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
