/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import NoticeIcon from "@/app/components/icons/notice.svg";
import ReactQuill, { Quill } from "react-quill";
import BlotFormatter from "quill-blot-formatter";
// import "quill/dist/quill.snow.css";
// import "quill/dist/quill.bubble.css";
import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.bubble.css";
import cheerio from "cheerio";
//@ts-ignore
import ImageResize from "quill-image-resize-module-react";
import { uploadFile } from "@/services/api_services/account_services";
import { Montserrat } from "next/font/google";
const montserrat = Montserrat({ subsets: ["latin"] });

Quill.register("modules/blotFormatter", BlotFormatter);
Quill.register("modules/imageResize", ImageResize);

const Font = Quill.import("formats/font"); // <<<< ReactQuill exports it
Font.whitelist = ["montserrat"]; // allow ONLY these fonts and the default
Quill.register(Font, true);

interface Props {
  className?: string;
  title?: string;
  formik?: any;
  required?: boolean;
  action?: React.ReactNode;
  name: string;
  id?: string;
  onChange?: (e: React.ChangeEvent<any>) => void;
  onBlur?: (e: React.FocusEvent<any, Element>) => void;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  touch?: Boolean;
  error?: string;
  value?: string;
  placeholder?: string;
  maxLength?: number;
  extend?: boolean;
  defaultValue?: string;
  namespace?: string;
  isBubble?: boolean;
  isCount?: boolean;
  setValue?: any;
  disabled?: boolean;
}

function Editor({
  disabled = false,
  formik,
  className,
  namespace,
  action,
  title,
  required,
  id,
  name,
  onChange,
  onBlur,
  value,
  error,
  touch,
  setValue,
  maxLength = 50000,
  isBubble = false,
  defaultValue,
  placeholder,
  isCount = true,
  extend = true,
}: Props) {
  const quillRef = useRef();
  var np;
  var er;
  var quill: any;

  if (formik) {
    onChange = formik.handleChange;
    error = formik.errors[name];
    touch = formik.touched[name];
    onBlur = formik.handleBlur;
    value = formik.values[name];
    setValue = formik.setFieldValue;
  }
  if (error?.startsWith("common")) {
    er = error.replace("common_", "");
    np = "common";
  } else {
    er = error;
    np = namespace;
  }

  const { t } = useTranslation(np);

  const modules = useMemo(
    () => ({
      imageResize: {
        parchment: Quill.import("parchment"),
        modules: ["Resize", "DisplaySize"],
      },

      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ color: [] }, { background: [] }],
          [{ script: "sub" }, { script: "super" }],
          ["blockquote", "code-block"],
          [{ list: "ordered" }, { list: "bullet" }],

          [{ indent: "-1" }, { indent: "+1" }, { align: [] }],
          [{ direction: "rtl" }],
          [{ size: ["small", false, "large", "huge"] }],
          ["link", "image", "video"],
          ["clean"],
        ],
        handlers: {
          image: function () {
            const input = document.createElement("input");
            input.setAttribute("type", "file");
            input.setAttribute("accept", "image/*");
            input.click();

            input.onchange = async () => {
              const file = (input.files as any)[0];
              if (/^image\//.test(file.type)) {
                console.log(file);
                const formData = new FormData();
                formData.append("image", file);
                var results = await uploadFile(formData);
                const url = `${process.env.NEXT_PUBLIC_API_BC}/headless/stream/upload?load=${results}`;

                const quillObj = (quillRef?.current as any).getEditor();
                const range = quillObj?.getSelection();
                quillObj.insertEmbed(range, "image", url);
              }
            };
          },
        },
        // handlers: {
        //   image: function () {},
        // },
      },
    }),
    [],
  );

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "link",
    "color",
    "image",
    "background",
    "align",
    "size",
    "font",
  ];

  const [code, setCode] = useState(formik?.values[name]);
  const handleProcedureContentChange = (
    content: any,
    delta: any,
    source: any,
    editor: any,
  ) => {
    //  setValue(content);
    console.log("content", content);
    if (formik) {
      formik.setFieldValue(name, content);
    }
  };

  const [count, setCount] = useState<number>(
    formik?.initialValues[name]?.length ?? 0,
  );

  useEffect(() => {
    if (isCount) {
      setCount(cheerio.load(formik.values[name] ?? "")?.text()?.length);
    }
  }, [formik?.values]);

  useEffect(() => {
    console.log("quill effect");
    // eslint-disable-next-line react-hooks/exhaustive-deps
    quill = (quillRef?.current as any).getEditor();
    if (quill) {
      //quill.clipboard.dangerouslyPasteHTML(formik?.initialValues[name] ?? "");
      quill?.setContents(
        quill.clipboard.convert(
          formik?.initialValues[name] ?? defaultValue ?? value ?? "",
        ),
      );
      quill.enable(!disabled);
      quill.on("text-change", (delta: any, oldContents: any) => {
        if (quill.getLength() > maxLength) {
          quill.deleteText(maxLength, quill.getLength());
        }
        if (setValue) {
          setValue!(name, quill.root.innerHTML);
        }
        // console.log("Text change!");
        // console.log("delta", delta);
        // console.log("Text change!");
        // console.log("text", quill.getText()); // Get text only
        // console.log("content", quill.getContents()); // Get delta contents
        // console.log("rootInner", quill.root.innerHTML); // Get innerHTML using quill
        // console.log("firstChild", quillRef.current.firstChild.innerHTML);
        // let currrentContents = quill.getContents();
        // console.log(currrentContents.diff(oldContents));
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Quill, quillRef, formik?.initialValues[name] ?? defaultValue]);

  return (
    <>
      <div className={`flex ${"justify-between"} ${title && "mb-1"} `}>
        <label className="text-sm font-semibold " htmlFor={id}>
          {title} {required && <span className="text-m_error_500">*</span>}
        </label>
        {action}
        {isCount && (
          <div className="body_regular_14 text-m_neutral_500">{`${count}/${maxLength}`}</div>
        )}
      </div>
      <div className={`relative  ${montserrat.className}`}>
        <ReactQuill
          className={`${disabled ? "bg-m_neutral_100" : ""}
${!isBubble ? "custom-ql-snow " : "custom-ql-bubble border rounded-lg p-2"} ${
            er && touch ? "ql-error" : ""
          } `}
          placeholder={placeholder}
          onBlur={async () => {
            if (formik) {
              await formik.setFieldTouched(name, true);
            }
          }}
          ref={quillRef as any}
          defaultValue={defaultValue}
          theme={isBubble ? "bubble" : "snow"}
          modules={modules}
          formats={formats}
          value={value}
          onChange={handleProcedureContentChange}
        />
      </div>
      {er && touch ? (
        <div
          className={` flex items-start ${!extend && "absolute top-[49px]"}`}
        >
          <div className="min-w-4 mt-[2px]">
            <NoticeIcon />
          </div>
          <div className=" text-m_error_500 body_regular_14 text-pretty">
            {t(er)}
          </div>
        </div>
      ) : null}
      {extend && !(er && touch) && required && <div className="h-[20px]" />}
    </>
  );
}

export default Editor;
