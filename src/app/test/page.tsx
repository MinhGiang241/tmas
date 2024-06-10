"use client";
import HomeLayout from "@/app/layouts/HomeLayout";
import React, { useEffect, useState } from "react";
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
import { laguageOptions, renderExtension } from "@/services/ui/coding_services";

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
  useEffect(() => {
    window.addEventListener("message", (event: MessageEvent<any>) => {
      console.log('addEvent Noti', event);
    });

    navigator.serviceWorker.addEventListener("message", (event) => {
      console.log('addEvent Noti 2', event);
    });
  }, [])
  return (
    <HomeLayout>
      <Select
        value={lang}
        className="my-4 min-w-28"
        onChange={(v) => {
          setLang(v);
        }}
        options={laguageOptions}
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
      { }
    </HomeLayout>
  );
}

export default DetailsPage;
