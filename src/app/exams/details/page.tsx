"use client";
import HomeLayout from "@/app/layouts/HomeLayout";
import React, { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { LanguageSupport, StreamLanguage } from "@codemirror/language";
import { go } from "@codemirror/legacy-modes/mode/go";
import { sql } from "@codemirror/lang-sql";
import { csharp } from "@replit/codemirror-lang-csharp";
import { python } from "@codemirror/lang-python";
import axios from "axios";
import MButton from "@/app/components/config/MButton";
import MInput from "@/app/components/config/MInput";
import { Select } from "antd";
import { loadLanguage, langs } from "@uiw/codemirror-extensions-langs";
import { errorToast } from "@/app/components/toast/customToast";

const renderExtension: (
  lan: string,
) => LanguageSupport | StreamLanguage<unknown> | undefined = (lan: string) => {
  switch (lan) {
    case "javascript":
      return javascript({ jsx: true });
    case "python":
      return langs.python();
    case "java":
      return langs.java();
    case "csharp":
      return langs.csharp();
    case "html":
      return langs.html();
    case "css":
      return langs.css();
    case "lua":
      return langs.lua();
    case "dart":
      return langs.dart();
    case "php":
      return langs.php();
    case "ruby":
      return langs.ruby();
    case "rust":
      return langs.rust();
    default:
      return langs.javascript();
  }
};

export { renderExtension };

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
  const [lang, setLang] = useState<string>("python");
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
          { value: "cpp", label: "C++" },
          { value: "html", label: "HTML" },
          { value: "dart", label: "dart" },
          { value: "php", label: "PHP" },
          { value: "java", label: "Java" },
          { value: "css", label: "CSS" },
        ]}
      />
      <CodeMirror
        value={value}
        lang={lang}
        theme={dracula}
        height="300px"
        onChange={onChange}
        extensions={[renderExtension(lang) as any]}
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
