import MButton from "@/app/components/config/MButton";
import MInput from "@/app/components/config/MInput";
import React from "react";
import { useTranslation } from "react-i18next";
import { SearchOutlined } from "@ant-design/icons";
import { Dropdown } from "antd";
import MDropdown from "@/app/components/config/MDropdown";

function MyQuestionTab() {
  const { t } = useTranslation("exam");
  const common = useTranslation();
  return (
    <>
      <div className="w-full flex justify-end">
        <MButton h="h-11" text={t("create_question")} />
      </div>
      <div className="w-full flex ">
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
          className="flex w-full"
        >
          <MInput
            onChange={(e: React.ChangeEvent<any>) => {
              // setSearch(e.target.value);
            }}
            className="max-lg:mt-3"
            placeholder={t("search_test_group")}
            h="h-11"
            id="search"
            name="search"
            suffix={
              <button
                type="submit"
                className="bg-m_primary_500 w-11 lg:h-11 h-11 rounded-r-lg text-white"
              >
                <SearchOutlined className="scale-150" />
              </button>
            }
          />
          <MDropdown
            id="question_type"
            name="question_type"
            options={[
              "MutilAnswer",
              "YesNoQuestion",
              "SQL",
              "FillBlank",
              "Pairing",
              "Coding",
              "Essay",
              "",
            ].map((e: string) => ({
              value: e,
              label: !e ? t("Tất cả ") : t(e?.toLowerCase()),
            }))}
          />
        </form>
      </div>
    </>
  );
}

export default MyQuestionTab;
