import { Input, Radio } from "antd";
import React, { createRef, useEffect, useState } from "react";
import { CloseCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

interface EvaluationUploadQuestionProps {
  fields?: { id: number; name: string; points: number; idIcon: string }[];
  onFieldsChange?: (fields: any) => void; // Callback function prop
}

export default function EvaluationUploadQuestion({
  fields = [],
  onFieldsChange = () => {},
}: EvaluationUploadQuestionProps) {
  const { t } = useTranslation("exam");

  const addField = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const newField = { id: fields.length + 1, name: "", points: 0, idIcon: "" };
    onFieldsChange([...fields, newField]);
  };

  const removeField = (id: number) => {
    const updatedFields = fields.filter((field) => field.id !== id);
    onFieldsChange(updatedFields);
  };

  return (
    <div>
      <Radio.Group className="w-full">
        {fields.map((field, index) => {
          var ref = createRef();
          return (
            <div key={index} className="flex items-center justify-between pt-2">
              <Radio className="font-semibold" value={field.id}>
                {index + 1}.
              </Radio>
              <Input
                className="rounded-md h-9 w-[50%]"
                placeholder={t("Tên nhãn lựa chọn")}
                value={field.name}
                onChange={(e) =>
                  onFieldsChange(
                    fields.map((f) =>
                      f.id === field.id ? { ...f, name: e.target.value } : f
                    )
                  )
                }
              />
              <Input
                className="rounded-md h-9 w-[15%]"
                type="number"
                placeholder={t("Điểm lựa chọn")}
                value={field.points}
                onChange={(e) =>
                  onFieldsChange(
                    fields.map((f) =>
                      f.id === field.id
                        ? { ...f, points: parseFloat(e.target.value) || 0 }
                        : f
                    )
                  )
                }
              />
              <input
                value={field.idIcon}
                ref={ref as any}
                accept=".svg,.jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*"
                type="file"
                className="w-28 h-14"
                placeholder={t("Hình ảnh")}
              />
              <button
                onClick={() => removeField(field.id)}
                className="text-neutral-500 text-2xl mt-[6px] ml-2"
              >
                <CloseCircleOutlined />
              </button>
            </div>
          );
        })}
      </Radio.Group>
      <div className="w-full flex justify-end pt-2">
        <button
          onClick={addField}
          className="underline body_regular_14 underline-offset-4"
        >
          <PlusOutlined /> {t("add_result")}
        </button>
      </div>
    </div>
  );
}
