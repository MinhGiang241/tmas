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
import { getExamGroupTest } from "@/services/api_services/exam_api";
import { errorToast } from "@/app/components/toast/customToast";
import PageLoader from "next/dist/client/page-loader";
import LoadingPage from "@/app/loading";
import AddExamTest from "./modals/AddExamTest";
import ConfirmModal from "@/app/components/modals/ConfirmModal";
import EditFormModal from "./modals/EditFormModal";
import { PlusOutlined } from "@ant-design/icons";
import MoveGroupModal from "./modals/MoveGroupModal";
import CreateChildGroupModal from "./modals/CreateChildGroupModal";
import { ExamGroupData } from "@/data/exam";

function ExamGroupTab() {
  const { data, error, isLoading } = useSWR("/api/user", (_: any) =>
    loadExamTestList(),
  );

  console.log(data);
  const loadExamTestList = async () => {
    try {
      await getExamGroupTest({ text: "" });
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

  return (
    <div className="w-full max-lg:px-4 ">
      <CreateChildGroupModal
        parent={active}
        open={openCreateChild}
        onCancel={onCancelCreateChild}
      />
      <MoveGroupModal
        now={active}
        parent={parent}
        open={openMove}
        onCancel={onCancelMove}
      />
      <EditFormModal data={active} open={openEdit} onCancel={onCancelEdit} />
      <AddExamTest open={openAdd} onCancel={onCancelAdd} />

      <ConfirmModal
        loading={loadingDelete}
        text={t("confirm_delete")}
        action={t("delete")}
        open={openDelete}
        onCancel={onCancelDelete}
        onOk={() => {}}
      />
      <div className="lg:mt-2 lg:w-full lg:flex lg:justify-center">
        <form className="lg:w-2/3">
          <MInput
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
        <div className="max-lg:mt-5 w-full flex justify-end">
          <MButton
            onClick={() => setOpenAdd(true)}
            className="flex items-center bg-m_neutral_100"
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
      ) : data ? (
        <div />
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
                </div>
              }
            >
              <div className="w-full ">
                {...Array.from({ length: 3 }, (c: any, i: number) => (
                  <div
                    className="px-4 text-wrap flex lg:min-h-[60px] min-h-[52px] items-center w-full bg-m_neutral_100 flex-wrap  mt-4 justify-between"
                    key={i}
                  >
                    <p>{"sdasdas"}</p>
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
                  </div>
                ))}
              </div>
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
            </Collapse.Panel>
          </Collapse>
        ))
      )}
    </div>
  );
}

export default ExamGroupTab;
