"use client";
import React from "react";
import HomeLayout from "../layouts/HomeLayout";
import MButton from "../components/config/MButton";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import AddIcon from "../components/icons/add.svg";
import MInput from "../components/config/MInput";
import MDropdown from "../components/config/MDropdown";
import { Divider, Pagination, Select, Switch } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import EditBlackIcon from "../components/icons/edit-black.svg";
import DeleteRedIcon from "../components/icons/trash-red.svg";
import CopyIcon from "../components/icons/export.svg";
import FolderIcon from "../components/icons/folder.svg";
import LinkIcon from "../components/icons/link-2.svg";
import CalendarIcon from "../components/icons/calendar.svg";
import MessIcon from "../components/icons/message-question.svg";
import { TreeSelect } from "primereact/treeselect";

function ExaminationPage() {
  const router = useRouter();
  const { t } = useTranslation("exam");
  const common = useTranslation();
  return (
    <HomeLayout>
      <div className="h-4" />
      <div className="w-full max-lg:px-3">
        <div className="body_semibold_20 mt-3 w-full flex  justify-between items-center ">
          <div className="">{t("examination_list")}</div>
          <MButton
            onClick={() => {
              router.push("/examination/create");
            }}
            className="flex items-center"
            icon={<AddIcon />}
            type="secondary"
            text={common.t("create_new")}
          />
        </div>
        <div className="w-full mt-3 flex justify-around max-lg:flex-col items-start">
          <MInput
            onChange={(e: React.ChangeEvent<any>) => {}}
            className=""
            placeholder={t("enter_key_search")}
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
            id="category"
            name="category"
            placeholder=""
            h="h-11"
            className="lg:mx-4"
          />
          <MDropdown h="h-11" className="" id="category" name="category" />
        </div>
        <Divider className="mt-1 mb-6" />

        {Array.from({ length: 3 }).map((v: any, i: number) => (
          <div
            key={i}
            className="w-full p-3 min-h-[100px] mb-4 flex items-center justify-between rounded-lg bg-white"
          >
            <div className="flex w-full items-center justify-between">
              <div className="flex-1 items-start justify-start flex-grow flex flex-col">
                <div className="flex items-center ">
                  <div className="ml-1 mr-3 rounded-[50%] w-3 h-3 bg-m_success_500" />
                  <div className="body_semibold_16">{"Thi chuyên môn IT"}</div>
                </div>
                <div className="w-full justify-start my-3 flex max-lg:flex-wrap">
                  <div className="flex ">
                    <CalendarIcon />
                    <span className="ml-2">23/01/2024</span>
                  </div>
                  <div className="flex">
                    <span className="mx-4">00:00 - 08/02/2024</span>
                  </div>
                  <div className="flex">
                    <LinkIcon />

                    <span className="ml-2">https://demolinktest.com</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center ">
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
                  <CopyIcon />
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
              <div className="mx-4">
                <Switch size="small" />
              </div>
              <MButton text={t("result")} h="h-9" className="w-[114px]" />
            </div>
          </div>
        ))}
        <div className="w-full flex lg:justify-between justify-center">
          <div className="hidden lg:flex items-center">
            <span className="body_regular_14 mr-2">{`136 ${t("result")}`}</span>
            <Select
              defaultValue={"1"}
              options={[
                {
                  value: "1",
                  label: (
                    <span className="body_regular_14">{`${15}/${common.t(
                      "page",
                    )}`}</span>
                  ),
                },
              ]}
              className="min-w-[124px]"
            />
          </div>
          <Pagination defaultCurrent={1} total={50} showSizeChanger={false} />
        </div>
      </div>
    </HomeLayout>
  );
}

export default ExaminationPage;
