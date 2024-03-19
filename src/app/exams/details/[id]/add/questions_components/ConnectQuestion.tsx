import React, { useState } from "react";
import MDropdown from "@/app/components/config/MDropdown";
import MInput from "@/app/components/config/MInput";
import { Checkbox, Radio, Space, Switch } from "antd";
import dynamic from "next/dynamic";
import { useTranslation } from "react-i18next";
import { PlusOutlined, CloseCircleOutlined } from "@ant-design/icons";
import _ from "lodash";
const EditorHook = dynamic(
  () => import("@/app/exams/components/react_quill/EditorWithUseQuill"),
  {
    ssr: false,
  },
);

const CheckboxGroup = Checkbox.Group;

function ConnectQuestion() {
  const { t } = useTranslation("exam");
  const common = useTranslation();

  const [numResults, setNumResults] = useState<number[]>([0, 1]);
  const [textResults, setTextResults] = useState<number[]>([0, 1]);

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="bg-white rounded-lg col-span-4 p-5 h-fit">
        <MInput h="h-9" name="point" id="point" required title={t("point")} />
        <Radio.Group buttonStyle="solid" onChange={(v) => {}}>
          <Space direction="vertical">
            <Radio className=" caption_regular_14" value={0}>
              {t("connect_count_all")}
            </Radio>
            <Radio className=" caption_regular_14" value={1}>
              {t("connect_count_each")}
            </Radio>
          </Space>
        </Radio.Group>
        <div className="h-3" />
        <MDropdown
          h="h-9"
          title={t("question_group")}
          placeholder={t("select_question_group")}
          id="question_group"
          name="question_group"
        />
      </div>
      <div className="bg-white rounded-lg col-span-8 p-5 h-fit">
        <EditorHook
          placeholder={t("enter_content")}
          isCount={false}
          required
          id="question"
          name="question"
          title={t("question")}
        />
        <div className="body_semibold_14 mt-3">
          {t("result0")}
          <span className="text-m_error_500"> *</span>
        </div>
        <div className="mb-3 body_regular_14">{t("many_result_intro")}</div>
        <div className="border rounded-lg p-4">
          <div className="w-full flex relative z-10">
            <div className="w-1/2">
              {numResults?.map((s: any, i: number) => (
                <div
                  key={i}
                  className="flex items-center body_semibold_14 mb-2"
                >
                  <p className="min-w-4">{i + 1}.</p>
                  <EditorHook
                    isCount={false}
                    isBubble={true}
                    id={`result-${i + 1}`}
                    name={`result-${i + 1}`}
                  />
                  <button
                    onClick={() => {
                      var newList = _.cloneDeep(numResults);
                      newList.splice(i, 1);
                      setNumResults(newList);
                    }}
                    className=" text-neutral-500 text-2xl mt-[7px] ml-2 "
                  >
                    <CloseCircleOutlined />
                  </button>
                </div>
              ))}
              <div className="w-full flex justify-end">
                <button
                  onClick={() => {
                    setNumResults([...numResults, 1]);
                  }}
                  className="underline body_regular_14 underline-offset-4"
                >
                  <PlusOutlined /> {t("add_result")}
                </button>
                <div className="w-8" />
              </div>
            </div>
            <div className="w-6" />
            <div className="w-1/2">
              {textResults?.map((s: any, i: number) => (
                <div
                  key={i}
                  className="flex items-center body_semibold_14 mb-2"
                >
                  <p className="min-w-4">{String.fromCharCode(65 + i)}.</p>
                  <EditorHook
                    isCount={false}
                    isBubble={true}
                    id={`result-${i + 1}`}
                    name={`result-${i + 1}`}
                  />
                  <button
                    onClick={() => {
                      var newList = _.cloneDeep(textResults);
                      newList.splice(i, 1);
                      setTextResults(newList);
                    }}
                    className=" text-neutral-500 text-2xl mt-[7px] ml-2 "
                  >
                    <CloseCircleOutlined />
                  </button>
                </div>
              ))}
              <div className="w-full flex justify-end  ">
                <button
                  onClick={() => {
                    setTextResults([...textResults, 1]);
                  }}
                  className="underline body_regular_14 underline-offset-4"
                >
                  <PlusOutlined /> {t("add_result")}
                </button>
                <div className="w-8" />
              </div>
            </div>
          </div>
          <div className="body_semibold_14 mt-5">{t("select_result")}</div>
          <div className="body_regular_14 mb-2">{t("select_result_intro")}</div>
          {numResults?.map((a: any, i: number) => (
            <div className="flex" key={i}>
              <p className="w-14 body_semibold_14 mr-3 ">{i + 1}.</p>
              <CheckboxGroup
                // value={checkedResults}
                rootClassName="flex items-center "
                // onChange={onChangeCheckResult}
              >
                {textResults.map((b: any, i: number) => (
                  <>
                    <p className="body_semibold_14 relative z-0">
                      {String.fromCharCode(65 + i)}.
                    </p>
                    <Checkbox key={i} value={i}></Checkbox>
                    <div className="w-2" />
                  </>
                ))}
              </CheckboxGroup>
            </div>
          ))}
        </div>
        <div className="h-4" />
        <EditorHook
          placeholder={t("enter_content")}
          isCount={false}
          id="explain"
          name="explain"
          title={t("explain_result")}
        />
      </div>
    </div>
  );
}

export default ConnectQuestion;
