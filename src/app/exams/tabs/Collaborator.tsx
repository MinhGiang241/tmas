import { APIResults, APIResultsBC } from "@/data/api_results";
import { ExamData, ExamGroupData } from "@/data/exam";
import {
  fetchDataExamGroup,
  setExamGroupLoading,
} from "@/redux/exam_group/examGroupSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { getExamGroupTest } from "@/services/api_services/exam_api";
import {
  ExaminationVersionState,
  getExaminationVersionList,
} from "@/services/api_services/examination_bc_api";
import { pad, safeParseJson } from "@/utils/utils";
import { ExportOutlined, SearchOutlined } from "@ant-design/icons";
import { Divider, Pagination, Select, Spin } from "antd";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FormattedDate } from "react-intl";
import { useSelector } from "react-redux";
import MButton from "../../components/config/MButton";
import MDropdown from "../../components/config/MDropdown";
import MInput from "../../components/config/MInput";
import AddIcon from "../../components/icons/add.svg";
import CalendarIcon from "../../components/icons/calendar.svg";
import FolderIcon from "../../components/icons/folder.svg";
import MessIcon from "../../components/icons/message-question.svg";

function Collaborator({ hidden }: { hidden: boolean }) {
  const { t } = useTranslation("exam");
  const common = useTranslation();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: RootState) => state.user.user);
  const examGroup = useSelector((state: RootState) => state.examGroup?.list);
  const [loading, setLoading] = useState<boolean>(false);

  const [indexPage, setIndexPage] = useState<number>(1);
  const [recordNum, setRecordNum] = useState<number>(15);

  const [total, setTotal] = useState<number>(0);
  const [list, setList] = useState<ExamData[]>([]);
  const [search, setSearch] = useState();

  const [state, setState] = useState("");

  useEffect(() => {
    if (user?.studio?._id) {
      dispatch(fetchDataExamGroup(async () => loadExamGroupList(true)));
      loadExamList(true);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, indexPage, recordNum, state]);

  const loadExamList = async (init: boolean) => {
    if (init) {
      setLoading(true);
    }
    const res: APIResultsBC = await getExaminationVersionList({
      limit: recordNum,
      skip: (indexPage - 1) * recordNum,
      text: search,
      state: state as ExaminationVersionState,
    });

    if (res?.code != 0) {
      setLoading(false);
      setList([]);
      return;
    }
    setList(res.data || []);
    setTotal(res?.records ?? 0);
    setLoading(false);
  };

  const loadExamGroupList = async (init?: boolean) => {
    if (init) {
      dispatch(setExamGroupLoading(true));
    }

    const dataResults: APIResults = await getExamGroupTest({
      text: "",
      studioId: user?.studio?._id,
    });

    if (dataResults.code != 0) {
      return [];
    } else {
      const data = dataResults?.data as ExamGroupData[];
      const levelOne = data?.filter((v: ExamGroupData) => v.level === 0);
      const levelTwo = data?.filter((v: ExamGroupData) => v.level === 1);

      const list = levelOne.map((e: ExamGroupData) => {
        const childs = levelTwo.filter(
          (ch: ExamGroupData) => ch.idParent === e.id
        );
        return { ...e, childs };
      });
      return list;
    }
  };

  const renderStatus = (state: string) => {
    switch (state) {
      case ExaminationVersionState.Approved:
        return <span className="text-green-500">{t(state)}</span>;
      case ExaminationVersionState.Pending:
        return <span className="text-blue-500">{t(state)}</span>;
      case ExaminationVersionState.Rejected:
        return <span className="text-red-500">{t(state)}</span>;
      default:
        return null;
    }
  };

  const renderExamCode = (exam: any) => {
    if (exam.state !== ExaminationVersionState.Approved) {
      return null;
    }
    if (!exam.exam_code) {
      return null;
    }
    return `${exam.exam_code} - `;
  };

  return (
    <div className={`${hidden ? "hidden" : ""}`}>
      <div className="w-full max-lg:px-3">
        <div className="body_semibold_20 mt-3 w-full flex  justify-between items-center ">
          <div className="">{t("history_push_approve")}</div>
          {/* <MButton
            h="h-11"
            onClick={() => {
              router.push("/exams/create");
            }}
            className="flex items-center"
            icon={<AddIcon />}
            type="secondary"
            text={common.t("create_new")}
          /> */}
        </div>
        <div className="w-full mt-3 flex justify-around max-lg:flex-col items-start gap-4">
          <form
            className="w-full"
            onSubmit={(e) => {
              e.preventDefault();
              setIndexPage(1);
              loadExamList(true);
            }}
          >
            <MInput
              value={search}
              onChange={(e: React.ChangeEvent<any>) => {
                setSearch(e.target.value);
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

          <MDropdown
            allowClear={false}
            value={state}
            setValue={(n: any, value: any) => {
              setState(value);
              setIndexPage(1);
            }}
            options={[
              { value: "", label: t("all_state") },
              ...Object.keys(ExaminationVersionState).map((state) => ({
                value: state,
                label: t(state),
              })),
            ]}
            h="h-11"
            className=""
            id="state"
            name="state"
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
            list.map((v: any, i: number) => {
              const examData = safeParseJson(v?.exam_data);

              const childsList = (examGroup ?? []).reduce(
                (acc: any, va) => [...acc, ...(va?.childs ?? [])],
                []
              );
              const group = (childsList ?? []).find(
                (g: any) => g?.id === examData?.idExamGroup
              );

              return (
                <div
                  key={v.id}
                  className="mb-5 rounded-lg bg-white overflow-hidden p-4"
                >
                  <div className="my-3 w-full flex flex-grow justify-between items-center">
                    <div className="flex-1">
                      <div className="body_semibold_16 text-m_neutral_900 overflow-hidden text-nowrap lg:max-w-4xl md:max-w-lg  text-ellipsis">
                        {renderExamCode(v)}
                        {v?.name} - {pad(v?.version)}
                      </div>
                      <div className="w-full my-3 flex max-lg:flex-wrap gap-8">
                        <div className="flex body_regular_14">
                          <CalendarIcon />
                          <span className="ml-2 body_regular_14">
                            <FormattedDate
                              value={examData?.createdTime}
                              day="2-digit"
                              month="2-digit"
                              year="numeric"
                            />
                          </span>
                        </div>
                        <div className="flex">
                          <MessIcon />
                          <span className="ml-2 body_regular_14">
                            {`${examData?.numberOfQuestions} ${t(
                              "question"
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
                      <div className="w-full flex max-lg:flex-wrap gap-8 my-3">
                        <div className="text-m_neutral_900">
                          <span className="font-semibold">
                            {t("approve_code")}
                          </span>{" "}
                          : {v?.code}
                        </div>
                        <div>{renderStatus(v.state)}</div>
                        {v.state !== ExaminationVersionState.Pending && (
                          <div>
                            <span className="ml-2 body_regular_14">
                              <FormattedDate
                                value={examData?.updatedTime}
                                day="2-digit"
                                month="2-digit"
                                year="numeric"
                              />
                            </span>
                          </div>
                        )}
                      </div>

                      {v.state === ExaminationVersionState.Rejected && (
                        <div className="w-full space-y-1">
                          <div>
                            <span className="font-semibold mr-2">
                              {t("reason")}:
                            </span>
                            <span>{v?.reject_reason_name}</span>
                          </div>
                          <div
                            className="w-full"
                            dangerouslySetInnerHTML={{
                              __html: v.reject_message,
                            }}
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/exams/details/${v?.examId}`);
                        }}
                      >
                        <ExportOutlined className="text-2xl" />
                      </button>
                      <div className="w-3" />
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
              "result"
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
                        "page"
                      )}`}</span>
                    ),
                  })),
                ]}
                className="select-page min-w-[124px]"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Collaborator;
