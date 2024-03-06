import React, { useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import i18next from "i18next";
import { FormikErrors } from "formik";
import { callApi } from "@/services/api_services/base_api";
import axios from "axios";

import { CKBox, CKBoxImageEdit } from "@ckeditor/ckeditor5-ckbox";
import {
  UploadAdapter,
  FileLoader,
} from "@ckeditor/ckeditor5-upload/src/filerepository";
import type { Editor, EditorConfig } from "@ckeditor/ckeditor5-core";

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

function MRichText({
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
  defaultValue,
}: Props) {
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

  const uploadPlugin = (editor: any) => {
    editor.plugins.get("FileRepository").createUploadAdapter = (
      loader: any,
    ) => {
      return uploadAdapter(loader);
    };
  };

  function uploadAdapter(loader: FileLoader): UploadAdapter {
    return {
      upload: () => {
        return new Promise(async (resolve, reject) => {
          try {
            const file = await loader.file;
            const response = await axios.request({
              method: "POST",
              url: `${process.env.NEXT_PUBLIC_API_BC}/headless/stream/upload`,
              data: {
                files: file,
              },
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });
            resolve({
              default: `${process.env.NEXT_PUBLIC_API_BC}/headless/stream/upload?load=${response.data}`,
            });
          } catch (error) {
            reject("Hello");
          }
        });
      },
      abort: () => {},
    };
  }
  const editorConfiguration: EditorConfig = {
    // extraPlugins: [uploadPlugin],
    toolbar: {
      items: [
        "heading",
        "|",
        "bold",
        "italic",
        "link",
        "strikethrough",
        "subscript",
        "superscript",
        "code",
        "bulletedList",
        "numberedList",
        "todoList",
        "|",
        "outdent",
        "indent",
        "|",
        "imageUpload",
        "blockQuote",
        "insertTable",
        "mediaEmbed",
        "undo",
        "redo",
      ],
      shouldNotGroupWhenFull: false,
    },
  };

  /*
  const uploadAdapter = (loader: any) => {
    return {
      upload: () => {
        return new Promise((resolve, reject) => {
          const body = new FormData();
          loader.file.then(async (file: any) => {
            body.append("uploadImg", file);

            var results = await callApi.upload(
              `${process.env.NEXT_PUBLIC_API_BC}/headless/stream/upload`,
              body,
            );
            if (results?.code != 0) {
              reject(results.message);
            }

            resolve({
              default: `${process.env.NEXT_PUBLIC_API_BC}/headless/stream/upload?load=${results?.data}`,
            });
          });
        });
      },
    };
  };
  */

  return (
    <div className={"w-full"}>
      <div
        className={`flex ${action ? "justify-between" : "justify-start"} mb-1 `}
      >
        <label className="text-sm font-semibold " htmlFor={id}>
          {title} {required && <span className="text-m_error_500">*</span>}
        </label>
        {action}
      </div>
      <CKEditor
        editor={ClassicEditor}
        data={defaultValue}
        onReady={(editor) => {
          // You can store the "editor" and use when it is needed.
          console.log("Editor is ready to use!", editor);
        }}
        config={editorConfiguration}
        onChange={async (event, editor) => {
          console.log("event", event);
          console.log("editor", editor.getData());
          console.log("value", value);
          if (setValue) {
            setValue!(name, editor.getData());
          }
        }}
        onBlur={(event, editor) => {
          console.log("Blur.", editor);
        }}
        onFocus={(event, editor) => {
          console.log("Focus.", editor);
        }}
      />
    </div>
  );
}

export default MRichText;
