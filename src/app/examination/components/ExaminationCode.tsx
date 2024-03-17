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
  formik,
  codeList,
  setCodeList,
}: {
  value: any;
  setValue: any;
  formik: any;
  codeList: any;
  setCodeList: any;
}) {
  const { t } = useTranslation("exam");
  const common = useTranslation();
  const [openCreateCode, setOpenCreateCode] = useState<boolean>(false);
  const [openCodeList, setOpenCodeList] = useState<boolean>(false);
  return (
    <>
      <CodeListModal
        setCodes={setCodeList}
        list={codeList}
        open={openCodeList}
        onCancel={() => {
          setOpenCodeList(false);
        }}
      />
      <CreateCodeModal
        open={openCreateCode}
        onCancel={() => setOpenCreateCode(false)}
        onOk={(v: any) => {
          setCodeList([
            ...codeList,
            ...v
              ?.split("\n")
              .filter((c: any) => c)
              .map((r: any) => ({
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
                {value == "None"
                  ? t("no_have")
                  : value == "One"
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
                <Radio className=" caption_regular_14" value={"None"}>
                  {t("no_have")}
                </Radio>
                <Radio className="mx-20 caption_regular_14" value={"One"}>
                  {t("one_code")}
                </Radio>
                <Radio className=" caption_regular_14" value={"MultiCode"}>
                  {t("code_list")}
                </Radio>
              </Space>
            </Radio.Group>
            <p className="mt-3">
              {value == "None"
                ? t("no_code_intro")
                : value == "One"
                  ? t("one_code_intro")
                  : t("code_list_intro")}
            </p>

            {value == "One" && (
              <>
                <div className="h-3" />
                <MInput
                  required={true}
                  formik={formik}
                  h="h-9"
                  id="one_code"
                  name="one_code"
                  placeholder={t("enter_code")}
                  title={t("code")}
                  namespace="exam"
                />
              </>
            )}

            {value == "MultiCode" && (
              <>
                <div className="flex">
                  {codeList.length != 0 && <div className="mt-2" />}
                  <div className="w-full  flex flex-nowrap items-center  overflow-hidden">
                    {codeList.map((v: any, i: number) => (
                      <div
                        className="p-1 mr-1  border border-m_neutral_200 rounded-md"
                        key={i}
                      >
                        {v?.code}
                      </div>
                    ))}
                    {codeList.length > 0 && (
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
                  <div className="pl-3 flex items-center text-m_primary_500 min-w-24 ">
                    <button
                      onClick={() => setOpenCreateCode(true)}
                      className="underline font-semibold underline-offset-4"
                    >
                      <PlusOutlined /> {t("create_code")}
                    </button>
                  </div>
                </div>
                <MInput
                  required={true}
                  formik={formik}
                  h="h-9"
                  id="turn_per_code"
                  name="turn_per_code"
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
