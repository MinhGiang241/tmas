import MInput from "@/app/components/config/MInput";
import Search from "antd/es/input/Search";
import AddIcon from "../../components/icons/add.svg";
import React, { useEffect, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import MButton from "@/app/components/config/MButton";
import { Collapse, CollapseProps, Divider, Spin } from "antd";
import EditBlackIcon from "../../components/icons/edit-black.svg";
import DeleteRedIcon from "../../components/icons/trash-red.svg";
import useSWR from "swr";
import { callApi } from "@/services/api_services/base_api";
import { getExamTest } from "@/services/api_services/exam_api";
import { errorToast } from "@/app/components/toast/customToast";
import PageLoader from "next/dist/client/page-loader";
import LoadingPage from "@/app/loading";
import AddExamTest from "./modals/AddExamTest";

function ExamGroupTab() {
  const { data, error, isLoading } = useSWR("/api/user", (_: any) =>
    loadExamTestList(),
  );

  console.log(data);
  const loadExamTestList = async () => {
    try {
      await getExamTest({ text: "" });
    } catch (e: any) {
      // errorToast(e);
      console.log(e);
    }
  };

  const items: CollapseProps["items"] = [
    {
      key: "1",
      label: "This is panel header 1",
      children: (
        <div className="w-full p-3">
          {...Array.from({ length: 3 }, (v, i) => (
            <div className="w-full bg-m_neutral_500" key={i}>
              {i}
            </div>
          ))}
        </div>
      ),
    },
    {
      key: "2",
      label: "This is panel header 1",
      children: <p>sadaasdas</p>,
    },
    {
      key: "3",
      label: "This is panel header 1",
      children: <p>sadaasdas</p>,
    },
  ];
  const { t } = useTranslation("exam");
  const common = useTranslation();

  const [openAdd, setOpenAdd] = useState<boolean>(false);

  return (
    <div className="w-full ">
      <AddExamTest open={openAdd} onCancel={() => setOpenAdd(false)} />
      <div className="lg:w-full lg:flex">
        <form className="lg:w-2/3">
          <MInput
            className="mt-3"
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
        </form>
        <div className="mt-5 w-full flex justify-end">
          <MButton
            onClick={() => setOpenAdd(true)}
            className="flex items-center"
            type="secondary"
            icon={<AddIcon />}
            text={t("create_test_group")}
          />
        </div>
      </div>
      <div className="h-5" />
      {isLoading ? (
        <div
          className={
            "bg-m_neutral_100 w-full flex justify-center min-h-40 items-center"
          }
        >
          <Spin size="large" />
        </div>
      ) : (
        items.map((v: any, i: any) => (
          <Collapse
            ghost
            expandIconPosition="end"
            className="mb-5 rounded-lg bg-white overflow-hidden "
            key={v.key}
          >
            <Collapse.Panel
              key={v.id ?? ""}
              header={
                <div className="  w-full flex flex-grow justify-between items-center">
                  <div>
                    <div className="body_semibold_14 text-m_neutral_900">
                      dasdasdasd
                    </div>
                    <div className="caption_regular_12 text-m_neutral_600">
                      asdsadasd
                    </div>
                  </div>
                  <div className="flex">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <EditBlackIcon />
                    </button>
                    <div className="w-3" />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <DeleteRedIcon />
                    </button>
                  </div>
                </div>
              }
            >
              <div className="w-full p-3">
                {...Array.from({ length: 3 }, (v, i) => (
                  <div
                    className="px-4 text-wrap flex lg:min-h-[60px] min-h-[52px] items-center w-full bg-m_neutral_100 flex-wrap  mb-4 justify-between"
                    key={i}
                  >
                    <p>{"sdasdas"}</p>
                    <div className="flex body_regular_14">
                      <button className="h-full ">{t("edit")}</button>
                      <button className="h-full mx-2">{t("move")}</button>
                      <button className="h-full text-m_error_500">
                        {t("delete")}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Collapse.Panel>
          </Collapse>
        ))
      )}
    </div>
  );
}

export default ExamGroupTab;
