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
import Image from "next/image";
import { callApi } from "@/services/api_services/base_api";
import {
  deleteExamGroupTest,
  getExamGroupTest,
} from "@/services/api_services/exam_api";
import { errorToast, successToast } from "@/app/components/toast/customToast";
import PageLoader from "next/dist/client/page-loader";
import LoadingPage from "@/app/loading";
import AddExamTest from "./modals/AddExamTest";
import ConfirmModal from "@/app/components/modals/ConfirmModal";
import EditFormModal from "./modals/EditFormModal";
import { PlusOutlined } from "@ant-design/icons";
import MoveGroupModal from "./modals/MoveGroupModal";
import CreateChildGroupModal from "./modals/CreateChildGroupModal";
import { ExamGroupData } from "@/data/exam";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  setExamGroupList,
  setExamGroupLoading,
} from "@/redux/exam_group/examGroupSlice";
import { APIResults } from "@/data/api_results";

function ExamGroupTab({ hidden }: { hidden: boolean }) {
  // const { data, error, isLoading } = useSWR("/api/user", (_: any) =>
  //   loadExamTestList(true),
  // );

  const user = useSelector((state: RootState) => state.user.user);
  useEffect(() => {
    loadExamTestList(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const common = useTranslation();

  const examGroupList = useSelector(
    (state: RootState) => state.examGroup?.list,
  );
  const examGroupLoading = useSelector(
    (state: RootState) => state.examGroup?.loading,
  );

  const dispatch = useDispatch();
  const [search, setSearch] = useState<string>("");

  const loadExamTestList = async (init?: boolean) => {
    if (init) {
      dispatch(setExamGroupLoading(true));
    }
    var dataResults: APIResults = await getExamGroupTest({
      text: search.trim(),
      studioId: user?.studio?._id,
    });
    if (dataResults.code != 0) {
      dispatch(setExamGroupList([]));
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

      dispatch(setExamGroupList(list));

      console.log("levelOne", list);
      console.log("data", dataResults);
    }
  };

  const { t } = useTranslation("exam");

  const [active, setActive] = useState<ExamGroupData | undefined>(undefined);
  const [parent, setParent] = useState<ExamGroupData | undefined>(undefined);

  const [openAdd, setOpenAdd] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [openMove, setOpenMove] = useState<boolean>(false);
  const [openCreateChild, setOpenCreateChild] = useState<boolean>(false);

  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);

  const onCancelAdd = () => {
    setOpenAdd(false);
    setActive(undefined);
  };

  const onCancelEdit = () => {
    setOpenEdit(false);
    setActive(undefined);
  };

  const onCancelMove = () => {
    setOpenMove(false);
    setActive(undefined);
    setParent(undefined);
  };

  const onCancelCreateChild = () => {
    setOpenCreateChild(false);
    setActive(undefined);
  };

  const onCancelDelete = () => {
    setOpenDelete(false);
    setActive(undefined);
  };

  const onOkDelete = async () => {
    try {
      setLoadingDelete(true);
      var res = await deleteExamGroupTest(active, user.studio?._id);
      if (res.code != 0) {
        throw res?.message;
      }

      await loadExamTestList(false);

      successToast(t("success_delete_group"));
      setLoadingDelete(false);
      onCancelDelete();
    } catch (e: any) {
      errorToast(e);
      setActive(undefined);
      setOpenDelete(false);
      setLoadingDelete(false);
    }
  };

  return (
    <div className={`${hidden ? "hidden" : ""} w-full max-lg:px-4 `}>
      <CreateChildGroupModal
        onOk={async () => loadExamTestList(false)}
        parent={active}
        open={openCreateChild}
        onCancel={onCancelCreateChild}
      />
      <MoveGroupModal
        list={examGroupList}
        onOk={async () => loadExamTestList(false)}
        now={active}
        parent={parent}
        open={openMove}
        onCancel={onCancelMove}
      />
      <EditFormModal
        onOk={async () => loadExamTestList(false)}
        data={active}
        open={openEdit}
        onCancel={onCancelEdit}
      />
      <AddExamTest
        onOk={async () => loadExamTestList(false)}
        open={openAdd}
        onCancel={onCancelAdd}
      />

      <ConfirmModal
        onOk={() => onOkDelete()}
        loading={loadingDelete}
        text={t("confirm_delete")}
        action={t("delete")}
        open={openDelete}
        onCancel={onCancelDelete}
      />
      <div className="lg:mt-2 lg:w-full lg:flex lg:justify-center">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            loadExamTestList(true);
          }}
          className="lg:w-3/5"
        >
          <MInput
            onChange={(e: React.ChangeEvent<any>) => {
              setSearch(e.target.value);
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
        </form>
        <div className="max-lg:mt-5  w-full flex justify-end">
          {user?.studio?.role != "Member" ? (
            <MButton
              onClick={() => setOpenAdd(true)}
              className="flex items-center px-5  bg-m_neutral_100"
              type="secondary"
              icon={<AddIcon />}
              text={t("create_test_group")}
            />
          ) : (
            <div />
          )}
        </div>
      </div>
      <div className="h-5" />
      {examGroupLoading ? (
        <div
          className={
            "bg-m_neutral_100 w-full flex justify-center min-h-40 items-center"
          }
        >
          <Spin size="large" />
        </div>
      ) : !examGroupList || examGroupList?.length === 0 ? (
        <div className="w-full flex flex-col items-center justify-center mt-28">
          <div className="  w-[350px] h-[213px]  bg-[url('/images/empty.png')] bg-no-repeat bg-contain " />
          <div className="body_regular_14">{common.t("empty_list")}</div>
        </div>
      ) : (
        examGroupList!.map((v: ExamGroupData, i: any) => (
          <Collapse
            ghost
            expandIconPosition="end"
            className="mb-5  rounded-lg bg-white overflow-hidden "
            key={i}
          >
            <Collapse.Panel
              key={v.id ?? ""}
              header={
                <div className=" h-14 w-full flex flex-grow justify-between items-center">
                  <div>
                    <div className="body_semibold_16 text-m_neutral_900 overflow-hidden text-nowrap lg:max-w-4xl md:max-w-lg max-w-[200px] text-ellipsis">
                      {v.name ?? ""}
                    </div>
                    <div className="body_regular_14 text-m_neutral_600 overflow-hidden text-nowrap lg:max-w-4xl md:max-w-lg max-w-[200px] text-ellipsis ">
                      {v.childs && v.childs.length == 0
                        ? ""
                        : `(${v.childs?.map((i) => i.name)?.join(", ") ?? ""})`}
                    </div>
                  </div>
                  {user?.studio?.role != "Member" ? (
                    <div className="flex">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActive(v);
                          setOpenEdit(true);
                        }}
                      >
                        <EditBlackIcon />
                      </button>
                      <div className="w-3" />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActive(v);
                          setOpenDelete(true);
                        }}
                      >
                        <DeleteRedIcon />
                      </button>
                    </div>
                  ) : (
                    <div />
                  )}
                </div>
              }
            >
              <div className="w-full ">
                {...Array.from(
                  v.childs ?? [],
                  (c: ExamGroupData, i: number) => (
                    <div
                      className="rounded-md px-4 text-wrap flex lg:min-h-[60px] min-h-[52px] items-center w-full bg-m_neutral_100 flex-wrap  mt-4 justify-between"
                      key={c.id}
                    >
                      <p>{c?.name}</p>
                      {user?.studio?.role != "Member" && (
                        <div className="flex body_regular_14">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActive(c);
                              setOpenEdit(true);
                            }}
                            className="h-full "
                          >
                            {t("edit")}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActive(c);
                              setParent(v);
                              setOpenMove(true);
                            }}
                            className="h-full mx-2"
                          >
                            {t("move")}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActive(c);
                              setOpenDelete(true);
                            }}
                            className="h-full text-m_error_500"
                          >
                            {t("delete")}
                          </button>
                        </div>
                      )}
                    </div>
                  ),
                )}
              </div>
              {user?.studio?.role != "Member" ? (
                <div className="w-full px-4 my-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setActive(v);
                      setOpenCreateChild(true);
                    }}
                    className="flex items-center"
                  >
                    <PlusOutlined />
                    <p className="ml-2  underline underline-offset-4 body_regular_14">
                      {t("create_child_group")}
                    </p>
                  </button>
                </div>
              ) : (
                <div className="h-3" />
              )}
            </Collapse.Panel>
          </Collapse>
        ))
      )}
    </div>
  );
}

export default ExamGroupTab;
