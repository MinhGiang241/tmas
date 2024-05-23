import React, { useEffect, useRef } from "react";
import { useQuill } from "react-quilljs";
import BlotFormatter from "quill-blot-formatter";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import NoticeIcon from "@/app/components/icons/notice.svg";
import { FormikErrors } from "formik";
import { Montserrat } from "next/font/google";
import dynamic from "next/dynamic";
import { useTranslation } from "react-i18next";
import { uploadFile } from "@/services/api_services/account_services";
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
  disabled?: boolean;
}

const Editor = ({
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

  const handleImageUpload = (quill: any) => {
    var imageUrl =
      "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg";
    const range = quill.getEditor().getSelection();
    quill.getEditor().insertEmbed(range.index, "image", imageUrl);
  };
  const { t } = useTranslation(np);
  const { quill, quillRef, Quill } = useQuill({
    modules: {
      blotFormatter: {},
      // toolbar:{}
      toolbar: {
        container: [
          // [{ font: [] }],
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
            (insertImageRef?.current as any)?.click();
          },
        },
      },
    },

    theme: isBubble ? "bubble" : "snow",
    placeholder: placeholder,
  });
  const insertImageRef = useRef(null);
  if (Quill && !quill) {
    // const BlotFormatter = require('quill-blot-formatter');
    Quill.register("modules/blotFormatter", BlotFormatter);
  }

  useEffect(() => {
    console.log("quill effect");

    if (quill) {
      //quill.clipboard.dangerouslyPasteHTML(formik?.initialValues[name] ?? "");
      quill?.setContents(
        quill.clipboard.convert(
          formik?.initialValues[name] ?? defaultValue ?? value ?? "",
        ),
      );
      quill.enable(!disabled);
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
        className={`
${disabled ? "bg-m_neutral_100" : ""}
${!isBubble ? "custom-ql-snow " : "custom-ql-bubble border rounded-lg p-2"} ${
          er && touch ? "ql-error" : ""
        }  `}
      >
        <div
          id={id}
          className={`${montserrat.className} `}
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
      <button
        ref={insertImageRef}
        className="hidden"
        onClick={() => {
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
              var results = await uploadFile(formData);
              const url = `${process.env.NEXT_PUBLIC_API_BC}/headless/stream/upload?load=${results}`;

              quill?.clipboard?.dangerouslyPasteHTML(
                (formik?.values[name] ?? value ?? "") + `<image src='${url}'/>`,
              );
              //   (insertImageRef?.current as any)?.click();
              //quill?.insertEmbed(range as any, "image", url);

              // const quillObj = quillRef?.current?.getEditor();
              // const range = quillObj?.getSelection();
              // quillObj.insertEmbed(range, "image", url);
            }
          };
          // const url =
          //   "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg";
          //
          // quill.clipboard.dangerouslyPasteHTML(
          //   (formik?.values[name] ?? "") + `<image src='${url}'/>`,
          // );
          // console.log("content", quill?.getContents());
        }}
      >
        insert
      </button>
    </div>
  );
};

export default Editor;
