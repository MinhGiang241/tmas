import { Checkbox, Collapse, GetProp } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";

function RequireInfo({ value, setValue }: { value: any[]; setValue?: any }) {
  const { t } = useTranslation("exam");
  const common = useTranslation();
  const onChange: GetProp<typeof Checkbox.Group, "onChange"> = (
    checkedValues,
  ) => {
    setValue(checkedValues);
  };
  const options = [
    { value: "phoneNumber", label: t("phone_number") },
    { value: "fullName", label: t("full_name") },
    { value: "idGroup", label: t("group") },
    { value: "birthday", label: t("dob") },
    { value: "email", label: t("email") },
    { value: "identifier", label: t("identify_code") },
    { value: "jobPosition", label: t("position_job") },
  ];
  const CheckboxGroup = Checkbox.Group;
  return (
    <>
      <Collapse
        ghost
        expandIconPosition="end"
        className="  rounded-lg bg-white overflow-hidden "
      >
        <Collapse.Panel
          key={"2"}
          header={
            <div className="w-full py-4 flex flex-grow justify-between items-center">
              <div className=" body_semibold_16 text-m_neutral_900 overflow-hidden text-nowrap lg:max-w-4xl md:max-w-lg  text-ellipsis">
                {t("require_info")}
              </div>
              <div className="body_regular_14 text-wrap max-w-80 text-m_neutral_500">
                {value.length == 0
                  ? ""
                  : value
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
            value={value}
            rootClassName="flex "
            onChange={onChange}
          >
            {options.map((r: any) => (
              <Checkbox
                className="body_regular_14 my-1"
                key={r.value}
                value={r.value}
              >
                {r.label}
              </Checkbox>
            ))}
          </CheckboxGroup>
        </Collapse.Panel>
      </Collapse>
    </>
  );
}

export default RequireInfo;
