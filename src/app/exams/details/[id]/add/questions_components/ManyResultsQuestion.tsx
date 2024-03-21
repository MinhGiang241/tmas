import Editor from "@/app/components/config/LexicalEditor";
import MDropdown from "@/app/components/config/MDropdown";
import MInput from "@/app/components/config/MInput";
import { Checkbox, Switch } from "antd";
import dynamic from "next/dynamic";
import React, { useState } from "react";
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

const CheckboxGroup = Checkbox.Group;

interface Props {
  examGroups?: ExamGroupData[];
}

function ManyResultsQuestion({ examGroups }: Props) {
  const { t } = useTranslation("exam");
  const common = useTranslation();

  const [results, setResults] = useState<number[]>([65, 66, 67, 68]);
  const [checkedResults, setCheckedResults] = useState<number[]>([]);

  const onChangeCheckResult = (v: any) => {
    setCheckedResults(v);
  };

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
    <div className="grid grid-cols-12 gap-4">
      <div className="bg-white rounded-lg col-span-4 p-5 h-fit">
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
      <div className="bg-white rounded-lg col-span-8 p-5 h-fit">
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
          <CheckboxGroup
            value={checkedResults}
            rootClassName="flex flex-col"
            onChange={onChangeCheckResult}
          >
            {results?.map((a: number, i: number) => (
              <div key={i} className="w-full flex items-center mb-4">
                <Checkbox value={i} />
                <div className="body_semibold_14 ml-2 w-5">
                  {String.fromCharCode(65 + i)}.
                </div>
                <EditorHook
                  isCount={false}
                  isBubble={true}
                  id={`result-${65 + i}`}
                  name={`result-${65 + i}`}
                />
                <button
                  onClick={() => {
                    var newList = _.cloneDeep(results);
                    newList.splice(i, 1);
                    setResults(newList);
                  }}
                  className=" text-neutral-500 text-2xl mt-[8px] ml-2 "
                >
                  <CloseCircleOutlined />
                </button>
              </div>
            ))}
            <div className="w-full flex justify-end">
              <button
                onClick={() => {
                  setResults([...results, 1]);
                }}
                className="text-m_primary_500 underline body_semibold_14 underline-offset-4"
              >
                <PlusOutlined /> {t("add_result")}
              </button>
            </div>
          </CheckboxGroup>
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

export default ManyResultsQuestion;
