import React, { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import NoticeIcon from "@/app/components/icons/notice.svg";
import ReactQuill, { Quill } from "react-quill";
import BlotFormatter from "quill-blot-formatter";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import cheerio from "cheerio";

Quill.register("modules/blotFormatter", BlotFormatter);

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
                const res = (formData: any) => {}; // upload data into server or aws or cloudinary
                const url =
                  "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg";

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

  const [code, setCode] = useState("hellllo");
  const handleProcedureContentChange = (
    content: any,
    delta: any,
    source: any,
    editor: any,
  ) => {
    //  setValue(content);
    console.log(code);
  };

  return (
    <>
      <div className={`flex ${"justify-between"} ${title && "mb-1"} `}>
        <label className="text-sm font-semibold " htmlFor={id}>
          {title} {required && <span className="text-m_error_500">*</span>}
        </label>
        {action}
        {isCount && (
          <div className="body_regular_14 text-m_neutral_500">{`${
            (cheerio?.load(formik?.values[name] ?? "sdasdas")?.length ?? 0) - 1
          }/${maxLength}`}</div>
        )}
      </div>

      <ReactQuill
        className={`${disabled ? "bg-m_neutral_100" : ""}
${!isBubble ? "custom-ql-snow " : "custom-ql-bubble border rounded-lg p-2"} ${
          er && touch ? "ql-error" : ""
        } `}
        ref={quillRef as any}
        defaultValue={defaultValue}
        theme="snow"
        modules={modules}
        formats={formats}
        value={value}
        onChange={handleProcedureContentChange}
      />
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
