import BaseModal, { BaseModalProps } from "@/app/components/config/BaseModal";
import MButton from "@/app/components/config/MButton";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import _ from "lodash";
import MInput from "@/app/components/config/MInput";
import MDateTimeSelect from "@/app/components/config/MDateTimeSelect";
import MRangePicker from "@/app/components/config/MRangePicker";
import MTreeSelect from "@/app/components/config/MTreeSelect";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { ExamGroupData } from "@/data/exam";

interface Props extends BaseModalProps {
  loading?: boolean;
  formik: any;
  clearFieldValue: any;
}

function FilterModal(props: Props) {
  const { t } = useTranslation("exam");
  const common = useTranslation();

  const [categories, setCategories] = useState<any[]>([
    { name: "email", isSelect: false },
    { name: "identify_code", isSelect: false },
    { name: "full_name", isSelect: false },
    { name: "group", isSelect: false },
    { name: "phone_number", isSelect: false },
    { name: "test_date", isSelect: false },
  ]);

  return (
    <BaseModal width={612} title={t("filter_by_criteria")} {...props}>
      <div className="flex w-full flex-wrap">
        {categories.map((e: any, i: number) => (
          <button
            onClick={async () => {
              var cloneCategories = _.cloneDeep(categories);
              cloneCategories[i].isSelect = !cloneCategories[i].isSelect;
              console.log("isSelect", cloneCategories[i].isSelect);

              if (!cloneCategories[i].isSelect) {
                console.log("dddddd", e);
                props.clearFieldValue(e.name);
              }
              setCategories(cloneCategories);
            }}
            className={`border-2 border-m_neutral_200 py-2 px-3 mr-3 mb-2 rounded-lg body_semibold_14 text-m_primary_500 ${
              e?.isSelect ? "bg-m_primary_100" : ""
            }`}
            key={i}
          >
            {t(e?.name)}
          </button>
        ))}
      </div>
      <div className="h-2" />
      {categories?.map((a: any, i: number) => {
        if (!a?.isSelect) {
          return null;
        }

        if (a.name == "test_date") {
          return (
            <MRangePicker
              formatter="DD/MM/YYYY"
              title={t("test_date")}
              key={a?.name}
              placeholder={[common.t("start_date"), common.t("end_date")]}
              id="test_date"
              name="test_date"
              formik={props.formik}
            />
          );
        }

        return (
          <MInput
            formik={props.formik}
            key={a?.name}
            id={a?.name}
            name={a?.name}
            title={t(a?.name)}
          />
        );
      })}
      <div className="flex justify-center mt-7 mb-3">
        <MButton
          className="w-36"
          text={common.t("cancel")}
          type="secondary"
          onClick={props.onCancel}
        />
        <div className="w-4" />
        <MButton
          onClick={() => {
            props.onOk!();
          }}
          loading={props?.loading ?? false}
          htmlType="submit"
          className="w-36"
          text={t("filter")}
        />
      </div>
    </BaseModal>
  );
}

export default FilterModal;
