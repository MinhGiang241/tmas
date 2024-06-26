import { t } from "i18next";
import dynamic from "next/dynamic";
import React from "react";
const EditorHook = dynamic(
  () => import("@/app/exams/components/react_quill/EditorWithUseQuill"),
  {
    ssr: false,
  }
);
export default function ManagementSkills() {
  return (
    <>
      <div>
        <EditorHook
          //   formik={formik}
          //   placeholder={t("Câu hỏi")}
          isCount={false}
          required
          id="question"
          name="question"
          title={t("Câu hỏi")}
        />
      </div>
      <div>câu hỏi đánh giá kỹ năng quản lý</div>
    </>
  );
}
