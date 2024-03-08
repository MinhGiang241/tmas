import MInput from "@/app/components/config/MInput";
import React, { useEffect, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import MButton from "@/app/components/config/MButton";
import AddIcon from "../../components/icons/add.svg";
import EditBlackIcon from "../../components/icons/edit-black.svg";
import DeleteRedIcon from "../../components/icons/trash-red.svg";
import { Collapse, Spin } from "antd";
import AddNewModal from "./question-modals/AddNewModal";
import ConfirmModal from "@/app/components/modals/ConfirmModal";
import { QuestionGroupData } from "@/data/exam";
import {
  deleteQuestionGroup,
  getQuestionGroups,
} from "@/services/api_services/exam_api";
import { errorToast, successToast } from "@/app/components/toast/customToast";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  setquestionGroupList,
  setquestionGroupLoading,
} from "@/redux/exam_group/examGroupSlice";

function QuestionGroup({ hidden }: { hidden: boolean }) {
  const user = useSelector((state: RootState) => state.user.user);
  useEffect(() => {
    loadingQuestions(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadingQuestions = async (init: boolean) => {
    if (init) {
      dispatch(setquestionGroupLoading(true));
    }

    var res = await getQuestionGroups(search, user?.studio?._id);
    if (res.code != 0) {
      dispatch(setquestionGroupList([]));
      errorToast(res.message ?? "");
      return;
    }

    dispatch(setquestionGroupList(res.data ?? []));
    console.log("res=", res);
  };

  const data = useSelector((state: RootState) => state.examGroup?.questions);
  const loading = useSelector((state: RootState) => state.examGroup?.loading);
  const dispatch = useDispatch();

  // const [data, setData] = useState<QuestionGroupData[]>([]);
  // const [loading, setLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  const { t } = useTranslation("exam");
  const common = useTranslation();
  const [search, setSearch] = useState<string>("");
  const [openAdd, setOpenAdd] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [active, setActive] = useState<QuestionGroupData | undefined>();

  const onDeleteQuestion = async () => {
    setDeleteLoading(true);
    const res = await deleteQuestionGroup(active, user?.studio?._id);
    setDeleteLoading(false);
    if (res.code != 0) {
      errorToast(res?.message ?? "");
      return;
    }
    successToast(t("success_delete_group"));
    setActive(undefined);
    setOpenDelete(false);
    loadingQuestions(false);
  };

  if (hidden) {
    return <div />;
  }

  return (
    <div className={`${hidden ? "hidden" : ""} w-full max-lg:px-4 `}>
      <ConfirmModal
        loading={deleteLoading}
        text={t("confirm_delete")}
        action={t("delete")}
        open={openDelete}
        onCancel={() => {
          setActive(undefined);
          setOpenDelete(false);
        }}
        onOk={() => onDeleteQuestion()}
      />
      <AddNewModal
        data={active}
        isEdit={isEdit}
        open={openAdd}
        onCancel={() => {
          setActive(undefined);
          setOpenAdd(false);
        }}
        onOk={() => {
          loadingQuestions(false);
          setOpenAdd(false);
        }}
      />
      <div className="lg:mt-2 lg:w-full lg:flex lg:justify-center">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            loadingQuestions(true);
          }}
          className="lg:w-3/5"
        >
          <MInput
            onChange={(e: React.ChangeEvent<any>) => {
              setSearch(e.target.value);
            }}
            className="max-lg:mt-3"
            placeholder={t("search_exam_group")}
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
          {user?.studio?.role != "Member" && (
            <MButton
              onClick={() => {
                setIsEdit(false);
                setOpenAdd(true);
              }}
              className="flex items-center px-5 bg-m_neutral_100"
              type="secondary"
              icon={<AddIcon />}
              text={t("create_exam_group")}
            />
          )}
        </div>
      </div>
      <div className="h-5" />
      {loading ? (
        <div
          className={
            "bg-m_neutral_100 w-full flex justify-center min-h-40 items-center"
          }
        >
          <Spin size="large" />
        </div>
      ) : !data || data.length == 0 ? (
        <div className="w-full flex flex-col items-center justify-center mt-28">
          <div className="  w-[350px] h-[213px]  bg-[url('/images/empty.png')] bg-no-repeat bg-contain " />
          <div className="body_regular_14">{common.t("empty_list")}</div>
        </div>
      ) : (
        data.map((v: QuestionGroupData) => (
          <div
            key={v.id}
            className="mb-4 px-6 rounded-lg bg-white h-16 w-full flex flex-grow justify-between items-center"
          >
            <div>
              <div className="body_semibold_16 text-m_neutral_900 overflow-hidden text-nowrap lg:max-w-4xl md:max-w-lg max-w-[200px] text-ellipsis">
                {v.name}
              </div>
            </div>
            {user?.studio?.role != "Member" && (
              <div className="flex">
                <button
                  onClick={(_) => {
                    setIsEdit(true);
                    setActive(v);
                    setOpenAdd(true);
                  }}
                >
                  <EditBlackIcon />
                </button>
                <div className="w-3" />
                <button
                  onClick={(_) => {
                    setActive(v);
                    setOpenDelete(true);
                  }}
                >
                  <DeleteRedIcon />
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default QuestionGroup;
