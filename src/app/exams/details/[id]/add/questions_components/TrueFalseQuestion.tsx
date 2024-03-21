import React, { useState } from "react";
import MDropdown from "@/app/components/config/MDropdown";
import MInput from "@/app/components/config/MInput";
import { Checkbox, Radio, Space, Switch } from "antd";
import dynamic from "next/dynamic";
import { useTranslation } from "react-i18next";
import { PlusOutlined, CloseCircleOutlined } from "@ant-design/icons";
import _ from "lodash";
import { ExamGroupData } from "@/data/exam";
import MTreeSelect from "@/app/components/config/MTreeSelect";
const EditorHook = dynamic(
  () => import("@/app/exams/components/react_quill/EditorWithUseQuill"),
  {
    ssr: false,
  },
);

interface Props {
  examGroups?: ExamGroupData[];
}

function TrueFalseQuestion({ examGroups }: Props) {
  const { t } = useTranslation("exam");
  const common = useTranslation();
  const [results, setResults] = useState<number[]>([65, 66]);

  const optionSelect = (examGroups ?? []).map<any>(
    (v: ExamGroupData, i: number) => ({
      title: v?.name,
      value: v?.id,
      disabled: true,
      isLeaf: false,
      children: [
        ...(v?.childs ?? []).map((e: ExamGroupData, i: number) => ({
          title: e?.name,
          value: e?.id,
        })),
      ],
    }),
  );

  return (
    <div className="grid grid-cols-12 gap-4 max-lg:px-5">
      <div className="bg-white rounded-lg lg:col-span-4 col-span-12 p-5 h-fit">
        <MInput h="h-9" name="point" id="point" required title={t("point")} />
        <MTreeSelect
          options={optionSelect}
          h="h-9"
          title={t("question_group")}
          placeholder={t("select_question_group")}
          id="question_group"
          name="question_group"
        />
        <div className="body_semibold_14 mb-2">{t("relocate_result")}</div>
        <Switch />
      </div>
      <div className="bg-white rounded-lg lg:col-span-8 col-span-12 p-5 h-fit">
        <EditorHook
          placeholder={t("enter_content")}
          isCount={false}
          required
          id="question"
          name="question"
          title={t("question")}
        />
        <div className=" mt-4 body_semibold_14">
          {t("result0")} <span className="text-m_error_500"> *</span>
        </div>
        <div className="mb-3 body_regular_14">{t("many_result_intro")}</div>
        <div className="border rounded-lg p-4">
          <Radio.Group
            className="w-full"
            buttonStyle="solid"
            onChange={(v) => {}}
          >
            <Space className="w-full" direction="vertical">
              {results?.map((a: any, i: number) => (
                <div key={i} className="w-full flex items-center mb-4">
                  <Radio value={i} />
                  <div className="body_semibold_14 ml-2 w-5">
                    {String.fromCharCode(65 + i)}.
                  </div>
                  <EditorHook
                    isCount={false}
                    isBubble={true}
                    id={`result-${a}`}
                    name={`result-${a}`}
                  />
                  <button
                    onClick={() => {
                      // var newList = _.cloneDeep(results);
                      // newList.splice(i, 1);
                      // setResults(newList);
                    }}
                    className=" text-neutral-500 text-2xl mt-[8px] ml-2 "
                  >
                    <CloseCircleOutlined />
                  </button>
                </div>
              ))}
            </Space>
          </Radio.Group>
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

export default TrueFalseQuestion;
