import React, { useEffect } from "react";
import { useQuill } from "react-quilljs";
import BlotFormatter from "quill-blot-formatter";
import "quill/dist/quill.snow.css";
import { FormikErrors } from "formik";

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
  setValue?: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined,
  ) => Promise<FormikErrors<any>> | Promise<void>;
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
  defaultValue,
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

  const { quill, quillRef, Quill } = useQuill({
    modules: { blotFormatter: {} },
  });

  if (Quill && !quill) {
    // const BlotFormatter = require('quill-blot-formatter');
    Quill.register("modules/blotFormatter", BlotFormatter);
  }

  useEffect(() => {
    if (quill) {
      quill.clipboard.dangerouslyPasteHTML(formik.initialValues[name] ?? "");
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
  }, [quill, Quill, quillRef]);

  return (
    <div className={"w-full"}>
      <div className={`flex ${"justify-between"} mb-1 `}>
        <label className="text-sm font-semibold " htmlFor={id}>
          {title} {required && <span className="text-m_error_500">*</span>}
        </label>
        <div className="body_regular_14 text-m_neutral_500">{`${
          (quill?.getLength() ?? 0) - 1
        }/${maxLength}`}</div>
      </div>
      <div ref={quillRef} />
    </div>
  );
};

export default Editor;