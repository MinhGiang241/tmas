import MButton from "@/app/components/config/MButton";
import MInput from "@/app/components/config/MInput";
import { BaseQuestionFormData } from "@/data/form_interface";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { SearchOutlined } from "@ant-design/icons";
import MDropdown from "@/app/components/config/MDropdown";
import { Spin } from "antd";

function QuestionTmasTab() {
  const { t } = useTranslation("exam");
  const common = useTranslation();

  const [loadingPage, setLoadingPage] = useState<boolean>(false);
  const [questionList, setQuestionList] = useState<BaseQuestionFormData>([]);

  return (
    <>
      <div className="w-full flex justify-end max-lg:pr-5">
        <MButton h="h-11" text={t("create_question")} />
      </div>
      <div className="w-full flex ">
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
          className="flex w-full max-lg:flex-col max-lg:mx-5"
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
          <div className="w-11" />
          <MDropdown
            h="h-11"
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
          <div className="w-11" />
          <MDropdown h="h-11" id="category" name="category" options={[]} />
          <div className="w-11" />
          <MDropdown
            h="h-11"
            id="category"
            name="category"
            options={["recently_create", "A-Z"].map((e) => ({
              value: e,
              label: t(e),
            }))}
          />
        </form>
      </div>
      {loadingPage ? (
        <div
          className={
            "bg-m_neutral_100 w-full flex justify-center min-h-40 items-center"
          }
        >
          <Spin size="large" />
        </div>
      ) : !questionList || questionList?.length === 0 ? (
        <div className="w-full flex flex-col items-center justify-center mt-28">
          <div className="  w-[350px] h-[213px]  bg-[url('/images/empty.png')] bg-no-repeat bg-contain " />
          <div className="body_regular_14">{common.t("empty_list")}</div>
        </div>
      ) : (
        <div className="flex flex-col p-5 rounded-lg bg-white max-lg:mx-5"></div>
      )}
    </>
  );
}

export default QuestionTmasTab;
