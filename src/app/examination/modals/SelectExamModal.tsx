import BaseModal, { BaseModalProps } from "@/app/components/config/BaseModal";
import MInput from "@/app/components/config/MInput";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { SearchOutlined } from "@ant-design/icons";
import MDropdown from "@/app/components/config/MDropdown";
import MTreeSelect from "@/app/components/config/MTreeSelect";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { ExamData, ExamGroupData, ExamListDataResult } from "@/data/exam";
import { APIResults } from "@/data/api_results";
import { getExaminationList } from "@/services/api_services/examination_api";
import {
  fetchDataExamGroup,
  setExamGroupLoading,
} from "@/redux/exam_group/examGroupSlice";
import { getExamGroupTest } from "@/services/api_services/exam_api";
import { Divider, Pagination, Select, Spin } from "antd";
import CupIcon from "../../components/icons/cup.svg";
import FolderIcon from "../../components/icons/folder.svg";
import LinkIcon from "../../components/icons/link-2.svg";
import CalendarIcon from "../../components/icons/calendar.svg";
import MessIcon from "../../components/icons/message-question.svg";
import { FormattedDate } from "react-intl";
import MButton from "@/app/components/config/MButton";

interface Props extends BaseModalProps {}

function SelectExamModal(props: Props) {
  const { t } = useTranslation("exam");
  const common = useTranslation();
  const [search, setSearch] = useState<string | undefined>();
  const [valueSearch, setValueSearch] = useState<string | undefined>();
  const [groupId, setGroupId] = useState();
  const [sort, setSort] = useState("time");
  const [loading, setLoading] = useState<boolean>(false);
  const [indexPage, setIndexPage] = useState<number>(1);
  const [recordNum, setRecordNum] = useState<number>(15);
  const [total, setTotal] = useState<number>(0);
  const [list, setList] = useState<ExamData[]>([]);
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: RootState) => state.user.user);
  const examGroup = useAppSelector((state: RootState) => state.examGroup?.list);
  const loadExamList = async (init: boolean) => {
    if (init) {
      setLoading(true);
    }
    const res: APIResults = await getExaminationList({
      "Paging.RecordPerPage": recordNum,
      "Paging.StartIndex": indexPage,
      "FilterByNameOrTag.InValues": search,
      "FilterByNameOrTag.Name": "Name",
      "FilterByExamGroupId.InValues": !groupId ? undefined : groupId,
      "FilterByExamGroupId.Name": "Name",
      "SortByCreateTime.IsAsc": sort == "time" ? false : undefined,
      "SortByName.IsAsc": sort == "name" ? true : undefined,
    });

    console.log("rsss", res);
    if (res?.code != 0) {
      setLoading(false);
      setList([]);
      return;
    }
    var data: ExamListDataResult = res.data;
    setList(data?.records ?? []);
    setTotal(data?.totalOfRecords ?? 0);

    setLoading(false);
  };

  const loadExamGroupList = async (init?: boolean) => {
    if (init) {
      dispatch(setExamGroupLoading(true));
    }

    var dataResults: APIResults = await getExamGroupTest({
      text: "",
      studioId: user?.studio?._id,
    });

    if (dataResults.code != 0) {
      return [];
    } else {
      var data = dataResults?.data as ExamGroupData[];
      var levelOne = data?.filter((v: ExamGroupData) => v.level === 0);
      var levelTwo = data?.filter((v: ExamGroupData) => v.level === 1);

      var list = levelOne.map((e: ExamGroupData) => {
        var childs = levelTwo.filter(
          (ch: ExamGroupData) => ch.idParent === e.id,
        );
        return { ...e, childs };
      });
      return list;
    }
  };

  const optionSelect = (examGroup ?? []).map<any>(
    (v: ExamGroupData, i: number) => ({
      title: v?.name,
      value: v?.id,
      disabled: true,
      isLeaf: false,
      children: [
        ...(v?.childs ?? []).map((e: ExamGroupData, i: number) => ({
          title: e?.name,
          value: e?.id,
        })),
      ],
    }),
  );
  optionSelect.push({
    title: t("all_category"),
    value: "",
  });

  useEffect(() => {
    if (user?.studio?._id) {
      dispatch(fetchDataExamGroup(async () => loadExamGroupList(true)));
      loadExamList(true);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, indexPage, search, recordNum, groupId, sort]);

  return (
    <BaseModal {...props}>
      <div className="w-full flex max-lg:flex-col">
        <form
          className="w-full"
          onSubmit={(e) => {
            e.preventDefault();
            setSearch(valueSearch);
          }}
        >
          <MInput
            value={valueSearch}
            onChange={(e: React.ChangeEvent<any>) => {
              setValueSearch(e.target.value);
            }}
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
        </form>
        <MTreeSelect
          value={groupId}
          setValue={(name: any, e: any) => {
            setGroupId(e);
          }}
          allowClear={false}
          defaultValue=""
          id="category"
          name="category"
          placeholder=""
          h="h-11"
          className="lg:mx-4"
          options={optionSelect}
        />
        <MDropdown
          allowClear={false}
          value={sort}
          setValue={(n: any, value: any) => {
            setSort(value);
            setIndexPage(1);
          }}
          options={[
            { value: "name", label: t("sort_by_name") },
            {
              value: "time",
              label: t("sort_by_time"),
            },
          ]}
          h="h-11"
          className=""
          id="category"
          name="category"
        />
      </div>
      <Divider className="mt-1 mb-6" />
      <div className="w-full">
        {loading ? (
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
          list?.map((v: ExamData, i: number) => {
            var childsList = (examGroup ?? []).reduce(
              (acc: any, va) => [...acc, ...(va?.childs ?? [])],
              [],
            );
            var group = (childsList ?? []).find(
              (g: any) => g?.id === v?.idExamGroup,
            );

            return (
              <div
                className="w-full px-4 border border-m_neutral_200 rounded-lg mb-4"
                key={v?.id}
              >
                <div className="flex justify-between items-center">
                  <div className="my-3  w-full flex flex-grow justify-between items-center">
                    <div>
                      <div className=" body_semibold_16 text-m_neutral_900 overflow-hidden text-nowrap lg:max-w-4xl md:max-w-lg  text-ellipsis">
                        {v?.name}
                      </div>
                      <div className=" w-full my-3 flex max-lg:flex-wrap">
                        <div className="flex">
                          <CupIcon />
                          <span className="body_regular_14 ml-2">
                            {v?.totalPoints} {t("point").toLowerCase()}
                          </span>
                        </div>
                        <div className="flex mx-8 body_regular_14">
                          <CalendarIcon />
                          <span className="ml-2 body_regular_14">
                            <FormattedDate
                              value={v?.createdTime}
                              day="2-digit"
                              month="2-digit"
                              year="numeric"
                            />
                          </span>
                        </div>
                        <div className="flex">
                          <LinkIcon />
                          <span className="ml-2 body_regular_14">{`${v?.numberOfTests} ${t(
                            "examination",
                          ).toLowerCase()}`}</span>
                        </div>
                        <div className="flex mx-8">
                          <MessIcon />
                          <span className="ml-2 body_regular_14">
                            {`${v?.numberOfQuestions} ${t(
                              "question",
                            )?.toLowerCase()}`}
                          </span>
                        </div>
                        <div className="flex">
                          <FolderIcon />
                          <span className="ml-2 body_regular_14">
                            {group?.name ?? ""}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="ml-2">
                    <MButton
                      onClick={() => props.onOk(v?.id)}
                      text={t("select_exam")}
                    />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      {list.length != 0 && (
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
                setIndexPage(1);
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
    </BaseModal>
  );
}

export default SelectExamModal;
