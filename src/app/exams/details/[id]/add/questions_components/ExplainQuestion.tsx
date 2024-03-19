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

function ExplainQuestion() {
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
        <div className="body_semibold_14 my-3">{t("enter_question_info")}</div>
        <div className="border rounded-lg p-4">
          <MInput
            isTextRequire={false}
            h="h-9"
            id="note"
            name="note"
            title={t("note")}
          />
          <div className="mb-5 body_regular_14">{t("note_when_marking")}</div>
          <div className="flex">
            <Switch size="small" />
            <span className="ml-2 body_semibold_14">
              {t("request_submit_file")}
            </span>
          </div>
          <div className="body_regular_14">{t("request_user_submit")}</div>
        </div>
      </div>
    </div>
  );
}

export default ExplainQuestion;
