import MButton from "@/app/components/config/MButton";
import MDropdown from "@/app/components/config/MDropdown";
import MInput from "@/app/components/config/MInput";
import dynamic from "next/dynamic";
import React from "react";
import { useTranslation } from "react-i18next";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";

const EditorHook = dynamic(
  () => import("@/app/exams/components/react_quill/EditorWithUseQuill"),
  {
    ssr: false,
  },
);

function SqlQuestion() {
  const { t } = useTranslation("exam");
  const common = useTranslation();

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="bg-white rounded-lg col-span-4 p-5 h-fit">
        <MInput h="h-9" name="point" id="point" required title={t("point")} />
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
        <div className="w-full items-center my-3 flex">
          <div className="body_semibold_14">
            {t("schema")}
            <span className="text-m_error_500"> *</span>
          </div>
          <div className="flex-1" />
          <MButton h="h-11" className="min-w-28" text={t("test")} />
        </div>

        <div className="border rounded-lg p-4">
          <div className="bg-m_neutral_100 rounded-lg">
            <div className="p-4 flex body_semibold_14 ">{t("mysql")}</div>
            <CodeMirror
              theme={"dark"}
              height="300px"
              extensions={[javascript({ jsx: true })]}
              onChange={(v) => {}}
            />
          </div>
        </div>

        <div className="body_semibold_14 mt-4">{t("expected_output")}</div>
        <div className="body_regular_14 mb-3">{t("expected_output_intro")}</div>
        <div className="border rounded-lg p-4">
          <div className="bg-m_neutral_100 rounded-lg">
            <div className="p-4 flex body_semibold_14 ">{t("mysql")}</div>
            <CodeMirror
              theme={"dark"}
              height="300px"
              extensions={[javascript({ jsx: true })]}
              onChange={(v) => {}}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SqlQuestion;