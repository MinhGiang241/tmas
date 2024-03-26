import React, { useEffect } from "react";
import { useQuill } from "react-quilljs";
import BlotFormatter from "quill-blot-formatter";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import NoticeIcon from "@/app/components/icons/notice.svg";
import { FormikErrors } from "formik";
import { Montserrat } from "next/font/google";
import dynamic from "next/dynamic";
import { useTranslation } from "react-i18next";
const montserrat = Montserrat({ subsets: ["latin"] });

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
}

const Editor = ({
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
  maxLength = 500,
  isBubble = false,
  defaultValue,
  placeholder,
  isCount = true,
  extend = true,
}: Props) => {
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

  const { quill, quillRef, Quill } = useQuill({
    modules: {
      blotFormatter: {},
    },
    theme: isBubble ? "bubble" : "snow",
    placeholder: placeholder,
  });

  if (Quill && !quill) {
    // const BlotFormatter = require('quill-blot-formatter');
    Quill.register("modules/blotFormatter", BlotFormatter);
  }

  useEffect(() => {
    console.log("quill effect");

    if (quill) {
      //quill.clipboard.dangerouslyPasteHTML(formik?.initialValues[name] ?? "");
      quill?.setContents(
        quill.clipboard.convert(formik?.initialValues[name] ?? ""),
      );
      quill.on("text-change", (delta, oldContents) => {
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
  }, [quill, Quill, quillRef, formik?.initialValues[name] ?? defaultValue]);

  return (
    <div className={"w-full"}>
      <div className={`flex ${"justify-between"} ${title && "mb-1"} `}>
        <label className="text-sm font-semibold " htmlFor={id}>
          {title} {required && <span className="text-m_error_500">*</span>}
        </label>
        {action}
        {isCount && (
          <div className="body_regular_14 text-m_neutral_500">{`${
            (quill?.getLength() ?? 0) - 1
          }/${maxLength}`}</div>
        )}
      </div>
      <div
        className={`${
          !isBubble
            ? "custom-ql-snow "
            : "custom-ql-bubble border rounded-lg p-2"
        } ${er && touch ? "ql-error" : ""}  `}
      >
        <div
          id={id}
          className={`${montserrat.className}`}
          ref={quillRef}
          onBlur={async () => {
            if (formik) {
              await formik.setFieldTouched(name, true);
            }
          }}
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
    </div>
  );
};

export default Editor;
