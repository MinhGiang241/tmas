import MInput from "@/app/components/config/MInput";
import { Collapse, Radio, Space } from "antd";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { PlusOutlined } from "@ant-design/icons";
import CreateCodeModal from "../modals/CreateCodeModal";
import CodeListModal from "../modals/CodeListModal";
import { v4 as uuidv4 } from "uuid";

export interface ExaminationCode {
  code?: string;
  createdDate?: string;
  id?: string;
}

function ExaminationCodePage({
  value,
  setValue,
}: {
  value: any;
  setValue: any;
}) {
  const { t } = useTranslation("exam");
  const common = useTranslation();
  const [openCreateCode, setOpenCreateCode] = useState<boolean>(false);
  const [openCodeList, setOpenCodeList] = useState<boolean>(false);
  const [codes, setCodes] = useState<string[]>([]);
  return (
    <>
      <CodeListModal
        setCodes={setCodes}
        list={codes}
        open={openCodeList}
        onCancel={() => {
          setOpenCodeList(false);
        }}
      />
      <CreateCodeModal
        open={openCreateCode}
        onCancel={() => setOpenCreateCode(false)}
        onOk={(v: any) => {
          setCodes([
            ...codes,
            ...v
              ?.split("\n")
              .filter((c: any) => c)
              .map((r) => ({
                code: r,
                createdDate: Date.now(),
                id: uuidv4(),
              })),
          ]);
        }}
      />

      <Collapse
        ghost
        expandIconPosition="end"
        className="  rounded-lg bg-white overflow-hidden "
      >
        <Collapse.Panel
          key={"1"}
          header={
            <div className="w-full py-4 flex flex-grow justify-between items-center">
              <div className=" body_semibold_16 text-m_neutral_900 overflow-hidden text-nowrap lg:max-w-4xl md:max-w-lg  text-ellipsis">
                {t("examination_code")}
              </div>
              <div className="body_regular_14 text-m_neutral_500">
                {value == 0
                  ? t("no_have")
                  : value == 1
                    ? t("one_code")
                    : t("code_list")}
              </div>
            </div>
          }
        >
          <div className="flex flex-col">
            <Radio.Group
              buttonStyle="solid"
              onChange={(v) => {
                setValue(v.target.value);
              }}
              value={value}
            >
              <Space className="w-full" direction="horizontal">
                <Radio className=" caption_regular_14" value={0}>
                  {t("no_have")}
                </Radio>
                <Radio className="mx-20 caption_regular_14" value={1}>
                  {t("one_code")}
                </Radio>
                <Radio className=" caption_regular_14" value={2}>
                  {t("code_list")}
                </Radio>
              </Space>
            </Radio.Group>
            <p className="mt-3">
              {value == 0
                ? t("no_code_intro")
                : value == 1
                  ? t("one_code_intro")
                  : t("code_list_intro")}
            </p>

            {value == 1 && (
              <>
                <div className="h-3" />
                <MInput
                  h="h-9"
                  id="code"
                  name="code"
                  placeholder={t("enter_code")}
                  title={t("code")}
                />
              </>
            )}

            {value == 2 && (
              <>
                {codes.length != 0 && <div className="mt-2" />}
                <div className="w-full flex flex-wrap">
                  {codes.map((v: any, i: number) => (
                    <div
                      className="p-1 mb-1 mr-1 border border-m_neutral_200 rounded-md"
                      key={i}
                    >
                      {v?.code}
                    </div>
                  ))}
                  {codes.length > 0 && (
                    <button
                      onClick={() => {
                        setOpenCodeList(true);
                      }}
                      className="ml-2 text-m_primary_500 underline-offset-4 underline"
                    >
                      {common.t("all")}
                    </button>
                  )}
                </div>
                <div className="text-m_primary_500 my-2">
                  <button
                    onClick={() => setOpenCreateCode(true)}
                    className="underline font-semibold underline-offset-4"
                  >
                    <PlusOutlined /> {t("create_code")}
                  </button>
                </div>
                <MInput
                  defaultValue="0"
                  h="h-9"
                  id="turn"
                  name="turn"
                  placeholder={t("turn_per_code")}
                  title={t("turn_per_code")}
                />
              </>
            )}
          </div>
        </Collapse.Panel>
      </Collapse>
    </>
  );
}

export default ExaminationCodePage;
