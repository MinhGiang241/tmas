"use client";
import React from "react";
import HomeLayout from "../layouts/HomeLayout";
import MInput from "../components/config/MInput";
import { SearchOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import MDropdown from "../components/config/MDropdown";
import { Collapse, Divider, Pagination, Select } from "antd";
import EditBlackIcon from "../components/icons/edit-black.svg";
import DeleteRedIcon from "../components/icons/trash-red.svg";
import CopyIcon from "../components/icons/export.svg";
import CupIcon from "../components/icons/cup.svg";
import FolderIcon from "../components/icons/folder.svg";
import LinkIcon from "../components/icons/link-2.svg";
import CalendarIcon from "../components/icons/calendar.svg";
import MessIcon from "../components/icons/message-question.svg";
import MButton from "../components/config/MButton";
import AddIcon from "../components/icons/add.svg";
import SizeIcon from "../components/icons/size.svg";
import { RightOutlined, LeftOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

function ExamsPage() {
  const { t } = useTranslation("exam");
  const common = useTranslation();

  const itemRender = (
    index: number,
    type: "page" | "next" | "prev" | "jump-prev" | "jump-next",
    originalElement: React.ReactNode,
  ) => {
    if (type === "next") {
      return (
        <div>
          <RightOutlined />
        </div>
      );
    }
    if (type === "prev") {
      return (
        <div>
          <LeftOutlined />
        </div>
      );
    }
    if (type === "page") {
      return (
        <div className={`bg-m_gray text-black border border-m_gray rounded-sm`}>
          <p>{index}</p>
        </div>
      );
    }
    return originalElement;
  };

  const router = useRouter();

  return (
    <HomeLayout>
      <div className="h-4" />
      <div className="w-full max-lg:px-3">
        <div className="body_semibold_20 mt-3 w-full flex  justify-between items-center ">
          <div className="">{t("exam_list")}</div>
          <MButton
            onClick={() => {
              router.push("/exams/create");
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
            id="category"
            name="category"
            placeholder=""
            h="h-11"
            className="lg:mx-4"
          />
          <MDropdown h="h-11" className="" id="category" name="category" />
        </div>
        <Divider className="mt-1 mb-6" />
        <div className="w-full">
          <Collapse
            ghost
            expandIconPosition="end"
            className="mb-5  rounded-lg bg-white overflow-hidden "
          >
            <Collapse.Panel
              key={"saddas"}
              header={
                <div className="my-3  w-full flex flex-grow justify-between items-center">
                  <div>
                    <div className=" body_semibold_16 text-m_neutral_900 overflow-hidden text-nowrap lg:max-w-4xl md:max-w-lg  text-ellipsis">
                      Đề thi tuyển dụng fresher kế toán
                    </div>
                    <div className="w-full my-3 flex max-lg:flex-wrap">
                      <div className="flex">
                        <CupIcon />
                        <span className="ml-2">0 điểm</span>
                      </div>
                      <div className="flex mx-8">
                        <CalendarIcon />
                        <span className="ml-2">23/01/2024</span>
                      </div>
                      <div className="flex">
                        <LinkIcon />
                        <span className="ml-2">2 đợt thi</span>
                      </div>
                      <div className="flex mx-8">
                        <MessIcon />
                        <span className="ml-2">0 câu hỏi</span>
                      </div>
                      <div className="flex">
                        <FolderIcon />
                        <span className="ml-2">Kế toán</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex ">
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
                </div>
              }
            >
              {...Array.from({ length: 2 }).map((v: any, i: number) => (
                <div
                  className="rounded-md px-4 text-wrap flex lg:min-h-[60px] min-h-[52px] items-center w-full bg-m_neutral_100 flex-wrap  my-4 justify-between"
                  key={i}
                >
                  <div>
                    <p className="body_semibold_14">
                      {"Đợt tuyển dụng đầu năm"}
                    </p>
                    <div className="flex">
                      <p className="underline underline-offset-4">
                        https://tmas.vn/t/cEhfdyuerka
                      </p>
                      <SizeIcon />
                    </div>
                  </div>

                  <div className="flex body_regular_14">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="h-full "
                    >
                      {t("setting")}
                    </button>
                    <div className="w-2" />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="h-full mx-2"
                    >
                      {t("result")}
                    </button>
                  </div>
                </div>
              ))}
            </Collapse.Panel>
          </Collapse>
        </div>
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

export default ExamsPage;
