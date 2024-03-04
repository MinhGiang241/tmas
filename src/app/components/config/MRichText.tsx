import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import i18next from "i18next";

interface Props {
  className?: string;
}

function MRichText({ className }: Props) {
  return (
    <div className={className}>
      <CKEditor
        editor={ClassicEditor}
        data="ALooAlloooo"
        onReady={(editor) => {
          // You can store the "editor" and use when it is needed.
          console.log("Editor is ready to use!", editor);
        }}
        config={{}}
        onChange={(event) => {
          console.log(event);
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
