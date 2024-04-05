import MInput from "@/app/components/config/MInput";
import { useTranslation } from "react-i18next";
import { SearchOutlined } from "@ant-design/icons";
import MDropdown from "@/app/components/config/MDropdown";
import { useState } from "react";
import { Collapse, Pagination, Select, Spin } from "antd";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { ExamGroupData, ExaminationData } from "@/data/exam";
import CopyIcon from "@/app/components/icons/size.svg";
import LinkIcon from "@/app/components/icons/link-2.svg";
import MessIcon from "@/app/components/icons/message-question.svg";
import FolderIcon from "@/app/components/icons/folder.svg";
import CalendarIcon from "@/app/components/icons/calendar.svg";
import CupIcon from "@/app/components/icons/cup.svg";
import AddIcon from "@/app/components/icons/add.svg";

import { FormattedDate } from "react-intl";
import MButton from "@/app/components/config/MButton";

function ExamTmasTab() {
  const { t } = useTranslation("exam");
  const common = useTranslation();
  const [loadingPage, setLoadingPage] = useState<boolean>(false);
  // // const [list, setList] = useState<any[]>([]);
  // const list = useAppSelector((state: RootState) => state.examGroup.list);
  const list = [{}];
  const [indexPage, setIndexPage] = useState<number>(1);
  const [recordNum, setRecordNum] = useState<number>(15);
  const [total, setTotal] = useState<number>(100);
  return (
    <>
      <div className="w-full flex">
        <form className="flex w-full max-lg:flex-col max-lg:mx-5">
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
            className="tag-big"
            popupClassName="hidden"
            id="tags"
            name="tags"
            mode="tags"
          />
          <div className="w-11" />
          <div className="w-full" />
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
      ) : !list || list?.length === 0 ? (
        <div className="w-full flex flex-col items-center justify-center mt-28">
          <div className="  w-[350px] h-[213px]  bg-[url('/images/empty.png')] bg-no-repeat bg-contain " />
          <div className="body_regular_14">{common.t("empty_list")}</div>
        </div>
      ) : (
        <>
          {[{}, {}, {}].map((a: ExaminationData, i: number) => (
            <Collapse
              key={i}
              ghost
              expandIconPosition="end"
              className="mb-3 rounded-lg bg-white overflow-hidden max-lg:mx-5"
            >
              <Collapse.Panel
                key={i + 1}
                header={
                  <div className="w-full p-2 min-h-[100px] flex items-center justify-between rounded-lg bg-white">
                    <div className="flex max-lg:flex-col w-full lg:items-center justify-between">
                      <div className="flex-1 items-start justify-start flex-grow flex flex-col">
                        <div className="body_semibold_16">
                          {"Đề thi tuyển dụng fresher Kế toán"}
                        </div>
                        <div className="h-2" />
                        <div className="w-full justify-start my-1 flex max-lg:flex-wrap">
                          <div className="flex ">
                            <CalendarIcon />
                            <span className="body_regular_14 ml-2">
                              <FormattedDate
                                value={"2024-04-02T09:31:13.300+0000"}
                                day="2-digit"
                                month="2-digit"
                                year="numeric"
                              />
                            </span>
                          </div>
                          <div className="flex mx-8">
                            <MessIcon />
                            <span className="ml-2 body_regular_14">
                              {`${"3"} ${t("question")?.toLowerCase()}`}
                            </span>
                          </div>
                          <div className="flex ml-2">
                            <CupIcon />
                            <span className="mx-4 body_regular_14">
                              {"3 điểm"}
                            </span>
                          </div>

                          <div className="flex">
                            <FolderIcon />
                            <span className="ml-2 body_regular_14">{"1M"}</span>
                          </div>
                        </div>
                      </div>
                      <MButton
                        className="flex items-center max-lg:justify-center max-lg:mt-2"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        h="h-11"
                        type="secondary"
                        icon={<AddIcon />}
                        text={t("add_bank")}
                      />
                    </div>
                  </div>
                }
              >
                <button className="body_semibold_14 text-m_primary_500 mb-2">
                  {"Xem trước 5 câu hỏi"}
                </button>
                {[
                  " Viết chương trình tính tổng 2 số nguyên a,b",
                  "Lệnh GROUP BY không thể sử dụng với các hàm tập hợp",
                  "Miêu tả mẹ em",
                  " Cho hình bát diện đều ABCDEF. Chứng minh rằng các đoạn thẳng AD, BD và CE đôi một vuông góc với nhau và cắt nhau tại trung điểm mỗi đường thẳng",
                ].map((a: any, i: number) => (
                  <div className="mb-1" key={i}>
                    <span className="body_semibold_14">{`Câu hỏi ${
                      i + 1
                    }: `}</span>
                    {a}
                  </div>
                ))}
              </Collapse.Panel>
            </Collapse>
          ))}
        </>
      )}
      <div className="h-9" />
      {(list ?? []).length != 0 && (
        <div className="w-full flex items-center justify-center">
          <span className="body_regular_14 mr-2">{`${total} ${t(
            "result",
          )}`}</span>

          <Pagination
            pageSize={recordNum}
            onChange={(v) => {
              setIndexPage(v);
            }}
            current={indexPage}
            total={total}
            showSizeChanger={false}
          />
          <div className="hidden ml-2 lg:flex items-center">
            <Select
              optionRender={(oriOption) => (
                <div className="flex justify-center">{oriOption?.label}</div>
              )}
              value={recordNum}
              onChange={(v) => {
                setRecordNum(v);
              }}
              options={[
                ...[15, 25, 30, 50, 100].map((i: number) => ({
                  value: i,
                  label: (
                    <span className="pl-3 body_regular_14">{`${i}/${common.t(
                      "page",
                    )}`}</span>
                  ),
                })),
              ]}
              className="select-page min-w-[124px]"
            />
          </div>
        </div>
      )}
    </>
  );
}

export default ExamTmasTab;
