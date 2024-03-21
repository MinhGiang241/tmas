"use client";
import HomeLayout from "@/app/layouts/HomeLayout";
import React, { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { StreamLanguage } from "@codemirror/language";
import { go } from "@codemirror/legacy-modes/mode/go";
import { sql } from "@codemirror/lang-sql";
import { csharp } from "@replit/codemirror-lang-csharp";
import { python } from "@codemirror/lang-python";
import axios from "axios";
import MButton from "@/app/components/config/MButton";
import MInput from "@/app/components/config/MInput";
import { Select } from "antd";

function DetailsPage() {
  const executeCode = async () => {
    var resultsAPI = await axios.post("/api/code/python", { code: value });
    console.log("result", resultsAPI);
    if (resultsAPI?.data?.code != 0) {
      setReSults([...results, resultsAPI?.data?.message?.traceback]);
    } else {
      setReSults([...results, ...resultsAPI.data?.data]);
    }
    // setReSults([...results, resultsAPI.data]);
  };

  const [value, setValue] = React.useState();
  const [results, setReSults] = useState<string[]>([]);
  const [lang, setLang] = useState<string | undefined>("python");
  const onChange = React.useCallback((val: any, viewUpdate: any) => {
    console.log("val:", val);
    setValue(val);
  }, []);
  return (
    <HomeLayout>
      <Select
        value={lang}
        className="my-4 min-w-28"
        onChange={(v) => {
          setLang(v);
        }}
        options={[
          { value: "javascript", label: "javascript" },
          { value: "csharp", label: "C#" },
          { value: "python", label: "python" },
          { value: "go", label: "go" },
        ]}
      />
      <CodeMirror
        value={value}
        lang="javascript"
        theme={dracula}
        height="300px"
        onChange={onChange}
        extensions={[
          lang == "python"
            ? python()
            : lang == "csharp"
              ? csharp()
              : javascript({ jsx: true }),
        ]}
      />

      <MButton
        onClick={() => {
          executeCode();
        }}
        text="run code"
      />
      <div className="flex justify-between">
        <div>Kết quả</div>{" "}
        <MButton onClick={() => setReSults([])} type="secondary" text="clear" />{" "}
      </div>
      <div className="border rounded-lg p-4 min-h-40">
        {results?.map((d: any, i: number) => <div key={i}>{d}</div>)}
      </div>
      {}
    </HomeLayout>
  );
}

export default DetailsPage;
