import MButton from "@/app/components/config/MButton";
import MDropdown from "@/app/components/config/MDropdown";
import MInput from "@/app/components/config/MInput";
import { Radio, Space } from "antd";
import dynamic from "next/dynamic";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import "react-quill/dist/quill.core.css";
import parse from "html-react-parser";
const EditorHook = dynamic(
  () => import("@/app/exams/components/react_quill/EditorWithUseQuill"),
  {
    ssr: false,
  },
);

function FillBlankQuestion() {
  const { t } = useTranslation("exam");
  const common = useTranslation();

  const [value, setValue] = useState<string | undefined>();
  const [isSave, setIsSave] = useState<boolean>(false);
  const [results, setResults] = useState<any>([]);

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="bg-white rounded-lg col-span-4 p-5 h-fit">
        <MInput h="h-9" name="point" id="point" required title={t("point")} />
        <Radio.Group buttonStyle="solid" onChange={(v) => {}}>
          <Space direction="vertical">
            <Radio className=" caption_regular_14" value={0}>
              {t("all_fill_count")}
            </Radio>
            <Radio className=" caption_regular_14" value={1}>
              {t("each_fill_count")}
            </Radio>
          </Space>
        </Radio.Group>
        <div className="h-4" />
        <MDropdown
          h="h-9"
          title={t("question_group")}
          placeholder={t("select_question_group")}
          id="question_group"
          name="question_group"
        />
      </div>
      <div className="bg-white rounded-lg col-span-8 p-5 h-fit">
        {isSave ? (
          <>
            <div className="body_semibold_14">
              {t("question")}
              <span className="text-m_error_500"> *</span>
            </div>
            <div className="ql-editor">{parse(value ?? "")}</div>
            <div className="body_semibold_14">
              {t("setting_result")} <span className="text-m_error_500"> *</span>
            </div>
            <div className="caption_regular_12">{t("system_lower_upper")}</div>
            <div className="caption_regular_12">{t("system_semi_colon")}</div>
            <div className="p-4 border rounded-lg mt-3">
              {results?.map((d: any, i: number) => (
                <div key={i} className="flex mb-3 items-center">
                  <div className="body_semibold_14 min-w-8">{i + 1}</div>
                  <EditorHook
                    isCount={false}
                    isBubble={true}
                    id={`result-${i + 1}`}
                    name={`result-${i + 1}`}
                  />
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <EditorHook
              value={value}
              setValue={(field: string, v: string) => {
                const pattern = /_{3,}/g;
                const matches = v.match(pattern);
                setResults(matches);
                let count = 0;
                const replacedText = v.replace(
                  /_{3,}/g,
                  () => `__${++count}__`,
                );
                setValue(replacedText);
              }}
              action={
                <MButton
                  onClick={() => setIsSave(true)}
                  h="h-9"
                  text={t("save_and_setting_result")}
                />
              }
              placeholder={t("enter_content")}
              isCount={false}
              required
              id="question"
              name="question"
              title={t("question")}
            />
            <div className="mt-2 body_regular_14">
              {t("fill_instruct")}{" "}
              <span className="text-[#4D7EFF]"> {t("blank_name")}. </span>
              {t("blank_name_only")}
            </div>
            <div className="my-2 body_regular_14">{t("example_fill")}</div>
            <div className="body_regular_14">
              {t("example_fill_sentence_1")}
              <span className="text-[#4D7EFF]"> {t("_1")}</span>
            </div>
            <div className="body_regular_14">
              <span className="text-[#4D7EFF]"> {t("_2")} </span>
              {t("example_fill_sentence_2")}
            </div>

            <div className="h-4" />
            <EditorHook
              placeholder={t("enter_content")}
              isCount={false}
              id="explain"
              name="explain"
              title={t("explain_result")}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default FillBlankQuestion;
