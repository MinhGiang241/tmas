"use client";
import { errorToast } from "@/app/components/toast/customToast";
import HomeLayout from "@/app/layouts/HomeLayout";
import { ExamData } from "@/data/exam";
import { getExamById } from "@/services/api_services/examination_api";
import React, { useEffect, useState } from "react";

import CodeMirror from "@uiw/react-codemirror";
import { StreamLanguage } from "@codemirror/language";
import { javascript } from "@codemirror/lang-javascript";
import { useQuill } from "react-quilljs";
import BlotFormatter from "quill-blot-formatter";

import "quill/dist/quill.bubble.css";

import { Montserrat } from "next/font/google";
const montserrat = Montserrat({ subsets: ["latin"] });

function ExamDetails({ params }: any) {
  const [exam, setExam] = useState<ExamData | undefined>();

  const loadExamById = async () => {
    var res = await getExamById(params?.id);
    if (res?.code != 0) {
      return;
    }

    if (res.code != 0) {
      errorToast(res?.message ?? "");
      return;
    }
    setExam(res?.data?.records[0]);
  };

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
  ];
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
  ];

  const { quill, quillRef, Quill } = useQuill({
    modules: { blotFormatter: {} },
    placeholder: "Compose an epic...",
    theme: "bubble",
    formats,
  });

  if (Quill && !quill) {
    Quill.register("modules/blotFormatter", BlotFormatter);
  }

  useEffect(() => {
    loadExamById();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  return (
    <HomeLayout>
      Details
      {/* <CodeMirror */}
      {/*   theme={"dark"} */}
      {/*   value="" */}
      {/*   height="200px" */}
      {/*   extensions={[javascript({ jsx: true })]} */}
      {/* /> */}
      {/* <div */}
      {/*   className={`border rounded-lg bg-white ${montserrat.className}`} */}
      {/*   ref={quillRef} */}
      {/* /> */}
    </HomeLayout>
  );
}

export default ExamDetails;
