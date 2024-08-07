import { Collapse, Radio, Space, Switch } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";

function Share({
  value,
  setValue,
  push,
  setPush,
  examination,
}: {
  value: any;
  setValue: any;
  push: any;
  setPush: any;
  examination: any;
}) {
  const { t } = useTranslation("exam");
  const common = useTranslation();
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
                {t("share")}
              </div>
              <div className="body_regular_14 text-m_neutral_500">
                {value == "Private" ? t("private") : t("public")}
              </div>
            </div>
          }
        >
          <div className="flex flex-col">
            <Radio.Group
              disabled={!!examination}
              buttonStyle="solid"
              onChange={(v) => {
                setValue(v.target.value);
              }}
              value={value}
            >
              <Space className="w-full" direction="horizontal">
                <Radio className="mr-24 caption_regular_14" value={"Public"}>
                  {t("public")}
                </Radio>
                <Radio className=" caption_regular_14" value={"Private"}>
                  {t("private")}
                </Radio>
              </Space>
            </Radio.Group>
            <p className="mt-3">
              {value == "Private"
                ? t("private_share_intro")
                : t("public_share_intro")}
            </p>
            {value === "Public" && (
              <div className="flex mt-2 items-center">
                <Switch
                  disabled={!!examination}
                  value={push}
                  onChange={(v) => {
                    setPush(v);
                  }}
                  size="small"
                />
                <p className="ml-2">{t("push_exam_bank")}</p>
              </div>
            )}
          </div>
        </Collapse.Panel>
      </Collapse>
    </>
  );
}

export default Share;
