"use client";
import MBreadcrumb from "@/app/components/config/MBreadcrumb";
import MButton from "@/app/components/config/MButton";
import HomeLayout from "@/app/layouts/HomeLayout";
import { ExamData, ExamGroupData, QuestionGroupData } from "@/data/exam";
import { getExamById } from "@/services/api_services/examination_api";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { Collapse, Input, Popover, Tooltip } from "antd";
import DeleteRedIcon from "@/app/components/icons/trash-red.svg";
import EditIcon from "@/app/components/icons/edit-black.svg";
import NewIcon from "@/app/components/icons/export.svg";
import MoreIcon from "@/app/components/icons/more-circle.svg";
import CopyIcon from "@/app/components/icons/size.svg";
import BaseModal from "@/app/components/config/BaseModal";
import MInput from "@/app/components/config/MInput";
import MTextArea from "@/app/components/config/MTextArea";
import ConfirmModal from "@/app/components/modals/ConfirmModal";
import Menu from "@/app/components/icons/menu.svg";
import Play from "@/app/components/icons/play-cricle.svg";
import MessageQuestion from "@/app/components/icons/message-question.svg";
import Cup from "@/app/components/icons/cup.svg";
import Time from "@/app/components/icons/timer.svg";
import Document from "@/app/components/icons/document.svg";
import Group from "@/app/components/icons/group.svg";
import {
  createAExamQuestionPart,
  getExamQuestionPartList,
  deleteQuestionPartById,
  deleteQuestionById,
  CopyQuestion,
  updateAExamQuestionPart,
  deleteQuestionPart,
  getQuestionList
} from "@/services/api_services/question_api";
import { errorToast, successToast } from "@/app/components/toast/customToast";
import { APIResults } from "@/data/api_results";
import { FormattedDate } from "react-intl";
import Coding from "./question/Coding";
import Connect from "./question/Connect";
import Explain from "./question/Explain";
import FillBlank from "./question/FillBlank";
import Sql from "./question/Sql";
import TrueFalse from "./question/TrueFalse";
import toast from "react-hot-toast";
import ManyResult from "./question/ManyResult";
import ReactToPrint from "react-to-print";
import { ExamPrint } from "../components/ExamPrint";
import { color } from "@uiw/react-codemirror";
import { RootState } from "@/redux/store";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchDataExamGroup, setquestionGroupLoading } from "@/redux/exam_group/examGroupSlice";
import { getQuestionGroups } from "@/services/api_services/exam_api";
import { UserData } from "@/data/user";

function ExamDetails({ params }: any) {
  const [exam, setExam] = useState<ExamData | undefined>();
  const [arrow, setArrow] = useState("Show");
  // dùng cho phần câu hỏi
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [openEditQuestion, setOpenEditQuestion] = useState(false);
  const [openDeleteQuestion, setOpenDeleteQuestion] = useState<boolean>(false);
  // Dùng cho phần đề thi
  const [deleteExamQuestions, setDeleteExamQuestions] =
    useState<boolean>(false);
  const [openCopyQuestion, setOpenCopyQuestion] = useState<boolean>(false);
  //
  const [data, setData] = useState<any>();
  const [idDelete, setIdDelete] = useState<any>();
  const [idUpdate, setIdUpdate] = useState<any>();
  const [loadDataQuestion, setLoadDataQuestion] = useState<any>(null);
  const [addLoading, setAddLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [list, setList] = useState<ExamData[]>([]);
  //
  const [name, setName] = React.useState<string>("");
  const [nameError, setNameError] = useState<string>("");
  const [note, setNote] = React.useState<string>("");
  const [customName, setCustomName] = useState("");
  const [customNote, setCustomNote] = useState("");
  //
  const [active, setActive] = useState("");
  const router = useRouter();
  const printRef = useRef(null);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleNoteChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNote(event.target.value);
  };

  const user: UserData | undefined = useAppSelector((state: RootState) => state?.user?.user);
  const dispatchGroup = useAppDispatch()
  const questionGroups: ExamGroupData[] | undefined
    = useAppSelector(
      (state: RootState) => state?.examGroup?.list,
    );
  const loadQuestionGroupList = async (init?: boolean) => {
    if (init) {
      dispatchGroup(setquestionGroupLoading(true));
    }

    var dataResults: APIResults = await getQuestionGroups(
      "",
      user?.studio?._id,
    );

    if (dataResults.code != 0) {
      return [];
    } else {
      var data = dataResults?.data as QuestionGroupData[];
      return data;
    }
  };

  useEffect(() => {
    if (user?.studio?._id) {
      dispatchGroup(fetchDataExamGroup(async () => loadQuestionGroupList(true)));
    }


    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
  const { t } = useTranslation("question");
  // const common = useTranslation();
  const loadExamById = async () => {
    var res = await getExamById(params?.id);
    if (res?.code != 0) {
      return;
    }

    if (res.code != 0) {
      errorToast(res?.message ?? "");
      return;
    }
    // console.log(res, "exam");

    setExam(res?.data?.records[0]);
  };

  // console.log("exam", exam);

  useEffect(() => {
    loadExamById();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const mergedArrow = useMemo(() => {
    if (arrow === "Hide") {
      return false;
    }

    if (arrow === "Show") {
      return true;
    }

    return {
      pointAtCenter: true,
    };
  }, [arrow]);

  const action = (
    <div className="flex flex-col px-1">
      <button
        onClick={() => {
          setOpenCopyQuestion(true);
        }}
        className="text-left pb-1"
      >
        Nhân bản
      </button>
      <ReactToPrint
        trigger={() => <button className="text-left pb-1">In</button>}
        content={() => printRef.current}
      />
      {/* <button className="text-left pb-1">In</button> */}
      <button
        onClick={() => {
          setDeleteExamQuestions(true);
        }}
        className="text-left pb-1"
      >
        Xóa
        <ConfirmModal
          onOk={async () => {
            await deleteQuestionPart(params.id);
            setDeleteExamQuestions(false);
            router.push("/exams");
          }}
          onCancel={() => {
            setDeleteExamQuestions(false);
          }}
          action={t("delete")}
          text={t("delete_exam_questions")}
          open={deleteExamQuestions}
        />
      </button>
    </div>
  );

  // const handleUpdate = async () => {
  //   console.log(idUpdate);

  //   const res = await updateAExamQuestionPart({
  //     idExam: params.id,
  //     name: customName,
  //     description: customNote,
  //   })
  //   console.log("res", res);
  //   if (res && res.code !== 0) {
  //     errorToast(res.message || "");
  //     return;
  //   }
  //   getData();
  // }

  const handleNameChangeValid = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setName(value);
  };

  const handleAddPart = async () => {
    setAddLoading(true);
    if (!name) {
      setNameError("Vui lòng nhập tên phần thi.");
      setAddLoading(false);
      return;
    }
    const res: any = await createAExamQuestionPart({
      idExam: params.id,
      name: name,
      description: note,
    });
    // console.log(res);
    setAddLoading(false);
    if (res && res.code !== 0) {
      errorToast(res.message || "");
      return;
    }
    // console.log(res);
    // const newObjectId = res.data;
    successToast(t("success_add_question"));
    // setLoadDataQuestion(res);
    setOpen(false);
    setName("");
    setNote("");
    await getData();
    // const newData = { idExam: newObjectId, name: name, description: note };
    // setData((prevData: any) => {
    //   if (!prevData || !prevData.records) {
    //     return [newData];
    //   } else {
    //     const newRecords = [newData, ...prevData.records];
    //     return { ...prevData, records: newRecords };
    //   }
    // });
  };

  const handleDelete = async () => {
    // console.log(idDelete)
    const res = await deleteQuestionPartById(idDelete);
    if (res && res.code !== 0) {
      errorToast(res.message || "");
      return;
    }
    setOpenDelete(false);
    getData();
  };

  const getData = async () => {
    const res = await getExamQuestionPartList({
      paging: { startIndex: 0, recordPerPage: 100 },
      studioSorters: [{ name: "createdTime", isAsc: true }],
      // truyền idexam thay vì ids
      // ids: [params.id],
      idExams: [params.id]
    });
    const data = res.data;
    console.log(data);
    if (data) {
      setData(data);
    }
  };

  const openEditModal = (id: string) => {
    const partToEdit = data?.records.find((part: any) => part.id === id);
    if (partToEdit) {
      setCustomName(partToEdit.name);
      setCustomNote(partToEdit.description);
      setOpenEdit(true);
    }
  };

  useEffect(() => {
    setLoadDataQuestion([]);
    getData();
  }, []);
  // const filteredData = data.records.filter((x: any) => x.examQuestions.some((y: any) => y.idExamQuestionPart === x.id));
  // const filteredData = data?.records.filter((x: any) => x.examQuestions.some((y: any) => y.idExamQuestionPart === x.id)
  // console.log(filteredData, "filteredData");
  // console.log(exam);

  return (
    <HomeLayout>
      <div className="h-5" />
      {/* Copy phần câu hỏi */}
      <ConfirmModal
        onOk={async () => {
          var res = await CopyQuestion(params.id);
          if (res?.code != 0) {
            errorToast(res.message || "");
            return;
          }
          setOpenCopyQuestion(false);
          router.push(`/exams/${res?.data}`)
        }}
        onCancel={() => {
          setOpenCopyQuestion(false);
        }}
        action={t("copy")}
        text={t("confirm_copy")}
        open={openCopyQuestion}
      />
      {/* Xóa phần câu hỏi */}
      <ConfirmModal
        onOk={() => {
          handleDelete();
        }}
        onCancel={() => {
          setOpenDelete(false);
        }}
        action={t("delete")}
        text={t("confirm_delete")}
        open={openDelete}
      />
      {/* Xóa câu hỏi */}
      <ConfirmModal
        onOk={async () => {
          await deleteQuestionById(active);
          setOpenDeleteQuestion(false);
          getData();
        }}
        onCancel={() => {
          setOpenDeleteQuestion(false);
        }}
        action={t("delete_question")}
        text={t("confirm_delete_question")}
        open={openDeleteQuestion}
      />
      <MBreadcrumb
        items={[
          { text: t("Danh sách đề thi"), href: "/exams" },
          // { text: exam?.name, href: `/exams/details/${exam?.id}` },
          {
            // href: `/exams/details/${exam?.id}/add`,
            text: exam?.name,
            href: "/",
            active: true,
          },
        ]}
      />
      <div className="h-2" />
      <div className="w-full max-lg:px-3 mb-5">
        <div className="body_semibold_20 mt-3 w-full flex  justify-between items-center ">
          <div className="">{exam?.name}</div>
          <div className="flex">
            {/* <MButton
              h="h-11"
              onClick={() => {
                router.push("/");
              }}
              className="flex items-center"
              // icon={<AddIcon />}
              type="secondary"
              // text={common.t("create_new")}
              text={question.t("Lựa chọn khác")}
            /> */}
            <button onClick={() => {
              router.push(
                `/exams/${params.id}`,
              );
            }

            }>
              <EditIcon
              />
            </button>
            {/* <button className="pl-3">
              <MoreIcon />
            </button> */}
            <Popover
              trigger={"click"}
              placement="bottomRight"
              content={action}
              arrow={mergedArrow}
            >
              <button className="pl-3">
                <MoreIcon />
              </button>
            </Popover>
          </div>
        </div>
        <div className="text-sm text-m_neutral_500 pt-1" dangerouslySetInnerHTML={{ __html: exam?.description || "" }} />
        {/* <div className="text-sm text-m_neutral_500 pt-1">
          {exam?.description}
        </div> */}
        <div className="h-[1px] bg-m_neutral_200 mt-10" />
        <div className="flex justify-between items-center mt-6 mb-6">
          <div className="text-sm text-m_neutral_900 flex">
            <Menu className="mr-1" />3 phần
          </div>
          <div className="text-sm text-m_neutral_900 flex">
            <Play className="mr-1" />
            Chuyển phần tự do
          </div>
          <div className="text-sm text-m_neutral_900 flex">
            <MessageQuestion className="mr-1 scale-75" />
            10 câu hỏi
          </div>
          <div className="text-sm text-m_neutral_900 flex">
            <Cup className="mr-1 scale-75" />
            10 điểm
          </div>
          <div className="text-sm text-m_neutral_900 flex">
            <Time className="mr-1" />
            Không giới hạn
          </div>
          <div className="text-sm text-m_neutral_900 flex">
            <Document className="mr-1" />1 câu hỏi/trang
          </div>
          <div className="text-sm text-m_neutral_900 flex">
            <Group className="mr-1" />
            Giữ thứ tự câu hỏi
          </div>
          <MButton
            h="h-11"
            onClick={() => {
              setOpen(true);
            }}
            className="flex items-center"
            type="secondary"
            text={t("add_part")}
          />
          <BaseModal
            width={564}
            onCancel={() => {
              setOpen(false);
            }}
            title={t("add_new")}
            open={open}
          >
            <div className="w-full mb-5">
              <MInput
                id="name"
                name="name"
                title={t("name")}
                required
                // onChange={handleNameChange, handleNameChangeValid}
                onChange={(event) => {
                  handleNameChange(event);
                  handleNameChangeValid(event);
                }}
                value={name}
                placeholder="Nhập nội dung"
                maxLength={255}
                isTextRequire={false}
                className={nameError ? "border-red-300" : ""}
              />
              {nameError && <span className="text-left text-red-500">{nameError}</span>}
            </div>
            <MTextArea
              id="note"
              name="note"
              title={t("note")}
              onChange={handleNoteChange}
              value={note}
              placeholder="Nhập nội dung"
              maxLength={500}
            />
            <div className="w-full flex justify-center mt-7">
              <MButton
                // onClick={onCancel}
                onClick={() => {
                  setOpen(false);
                }}
                className="w-36"
                type="secondary"
                text={t("cancel")}
              />
              <div className="w-5" />
              <MButton
                // loading={loading}
                htmlType="submit"
                className="w-36"
                text={t("update")}
                onClick={handleAddPart}
                loading={addLoading}
              />
            </div>
          </BaseModal>
        </div>
        <div>
          {data &&
            data.records?.map((x: any, key: any) => (
              <Collapse
                key={key}
                ghost
                expandIconPosition="end"
                className="mb-5 rounded-lg bg-white overflow-hidden"
              >
                <Collapse.Panel
                  header={
                    <div className="my-3 flex justify-between items-center">
                      <div>
                        <div className="text-base font-semibold">{x.name}</div>
                        <div className="text-sm text-m_neutral_500">
                          {x.description}
                        </div>
                      </div>
                      <div className="min-w-28  pl-5">
                        <Popover
                          trigger={"click"}
                          placement="bottomRight"
                          content={
                            <div className="flex flex-col px-1 rounded-md">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  router.push(
                                    `/exams/details/${params.id}/add?partId=${x?.id}`,
                                  );
                                }}
                                className="text-left mb-2 pb-1"
                              >
                                Thêm thủ công
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                                className="text-left mb-2 pb-1 "
                              >
                                Thêm từ ngân hàng câu hỏi của tôi
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                                className="text-left mb-2 pb-1 "
                              >
                                Thêm từ ngân hàng câu hỏi của TMAS
                              </button>
                            </div>
                          }
                          arrow={mergedArrow}
                        >
                          <Tooltip
                            placement="bottom"
                            title={"Thêm câu hỏi"}
                            arrow={mergedArrow}
                          >
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                            >
                              <NewIcon />
                            </button>
                          </Tooltip>
                        </Popover>
                        <button
                          className="px-2"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <EditIcon
                            onClick={() => {
                              // setOpenEdit(true);
                              openEditModal(x.id);
                            }}
                          />
                          <BaseModal
                            width={564}
                            onCancel={() => {
                              setOpenEdit(false);
                            }}
                            title={t("edit_add_new")}
                            open={openEdit}
                          >
                            <MInput
                              // formik={formik}
                              id="customName"
                              name="customName"
                              title={t("name")}
                              required
                              placeholder="Nhập nội dung"
                              maxLength={255}
                              value={customName}
                              onChange={(event) => {
                                setCustomName(event.target.value);
                                handleNameChangeValid(event);
                              }}
                              className={`${nameError ? "border-red-300" : ""}`}
                            />
                            {nameError && <div style={{ color: "red" }}>{nameError}</div>}
                            <MTextArea
                              // formik={formik}
                              id="customNote"
                              name="customNote"
                              title={t("note")}
                              placeholder="Nhập nội dung"
                              maxLength={500}
                              value={customNote}
                              onChange={(event) =>
                                setCustomNote(event.target.value)
                              }
                            />
                            <div className="w-full flex justify-center mt-7">
                              <MButton
                                className="w-36"
                                type="secondary"
                                text={t("cancel")}
                                onClick={() => {
                                  setOpenEdit(false);
                                }}
                              />
                              <div className="w-5" />
                              <MButton
                                // loading={loading}
                                htmlType="submit"
                                className={`w-36`}
                                text={t("update")}
                                onClick={async () => {
                                  if (!customName) {
                                    setNameError("Vui lòng nhập tên phần thi.");
                                    return;
                                  }
                                  await updateAExamQuestionPart({
                                    idExam: x.id,
                                    name: customName,
                                    description: customNote,
                                  });
                                  setOpenEdit(false);
                                  getData();
                                  setCustomNote("");
                                  setCustomName("");
                                  successToast(t("success_edit_question"));
                                }}
                              />
                            </div>
                          </BaseModal>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <DeleteRedIcon
                            onClick={() => {
                              setOpenDelete(true);
                              setIdDelete(x.id);
                            }}
                          />
                        </button>
                      </div>
                    </div>
                  }
                  key={""}
                >
                  {x?.examQuestions?.map((e: any, key: any) => {
                    var questionGroup = questionGroups?.find((v: any) => (v.id === e.idGroupQuestion))
                    if (e.questionType == "Coding") {
                      return (
                        <Coding index={key + 1} key={e.id} examId={params.id} question={e} getData={getData} questionGroup={questionGroup} />
                      );
                    }
                    if (e.questionType == "Pairing") {
                      return (
                        <Connect index={key + 1} key={e.id} examId={params.id} question={e} getData={getData} questionGroup={questionGroup} />
                      );
                    }
                    if (e.questionType == "Essay") {
                      return (
                        <Explain index={key + 1} key={e.id} examId={params.id} question={e} getData={getData} questionGroup={questionGroup} />
                      );
                    }
                    if (e.questionType == "FillBlank") {
                      return (
                        <FillBlank index={key + 1} key={e.id} examId={params.id} question={e} getData={getData} questionGroup={questionGroup} />
                      );
                    }
                    if (e.questionType == "MutilAnswer") {
                      return (
                        <ManyResult
                          getData={getData}
                          index={key + 1}
                          key={e.id}
                          examId={params.id}
                          question={e}
                          questionGroup={questionGroup}
                        />
                      );
                    }
                    if (e.questionType == "SQL") {
                      return <Sql index={key + 1} key={e.id} examId={params.id} question={e} getData={getData} questionGroup={questionGroup} />;
                    }
                    if (e.questionType == "YesNoQuestion") {
                      return (
                        <TrueFalse index={key + 1} key={e.id} examId={params.id} question={e} getData={getData} questionGroup={questionGroup} />
                      );
                    }
                    return (
                      <Collapse
                        key={key}
                        ghost
                        expandIconPosition="end"
                        className="mb-3 rounded-lg bg-m_question overflow-hidden"
                      >
                        <Collapse.Panel
                          header={
                            <div className="my-3 flex justify-between items-center">
                              <div className="flex">
                                <span className="body_semibold_14">Câu {key + 1}:<span className="body_regular_14 pl-2" dangerouslySetInnerHTML={{ __html: e?.question }} /></span>
                              </div>
                              <div className="min-w-28 pl-4">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                  }}
                                >
                                  <EditIcon
                                    onClick={() => {
                                      router.push(
                                        `/exams/details/${params.id}/edit?questId=${e?.id}`,
                                      );
                                    }}
                                  />
                                  {/* <BaseModal
                                    width={564}
                                    onCancel={() => {
                                      setOpenEditQuestion(false);
                                    }}
                                    title={t("edit_question")}
                                    open={openEditQuestion}
                                  >
                                    <MInput
                                      // formik={formik}
                                      id="name"
                                      name="name"
                                      title={t("name")}
                                      required
                                    />
                                    <MTextArea
                                      // formik={formik}
                                      id="note"
                                      name="note"
                                      title={t("note")}
                                    />
                                    <div className="w-full flex justify-center mt-7">
                                      <MButton
                                        className="w-36"
                                        type="secondary"
                                        text={t("cancel")}
                                        onClick={() => {
                                          setOpenEditQuestion(false);
                                        }}
                                      />
                                      <div className="w-5" />
                                      <MButton
                                        // loading={loading}
                                        htmlType="submit"
                                        className="w-36"
                                        text={t("update")}
                                      />
                                    </div>
                                  </BaseModal> */}
                                </button>
                                <button
                                  className="px-2"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                  }}
                                >
                                  <CopyIcon
                                    onClick={() => {
                                      setOpenCopyQuestion(true);
                                    }}
                                  />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                  }}
                                >
                                  <DeleteRedIcon
                                    onClick={() => {
                                      setOpenDeleteQuestion(true);
                                      setActive(e.id);
                                      // console.log(e);
                                    }}
                                  />
                                </button>
                              </div>
                            </div>
                          }
                          key={""}
                        >
                          <div className="h-[1px] bg-m_primary_200 mb-3" />
                          <div className="text-m_primary_500 text-sm font-semibold mb-2">
                            Thông tin câu hỏi
                          </div>
                          <div className="flex">
                            <div className="text-sm pr-2 font-semibold">
                              Nhóm câu hỏi:{" "}
                            </div>
                            <span>{questionGroup?.name}</span>
                          </div>
                          <div className="flex">
                            <div className="text-sm pr-2 font-semibold">
                              Kiểu câu hỏi:{" "}
                            </div>
                            <span>{t(e?.questionType)}</span>
                          </div>
                          <div className="flex">
                            <div className="text-sm pr-2 font-semibold">
                              Điểm:{" "}
                            </div>
                            <span>{e.numberPoint}</span>
                          </div>
                          <div className="flex">
                            <div className="text-sm pr-2 font-semibold">
                              Ngày tạo:{" "}
                            </div>
                            <FormattedDate
                              value={e?.createdTime}
                              day="2-digit"
                              month="2-digit"
                              year="numeric"
                            />
                          </div>
                        </Collapse.Panel>
                      </Collapse>
                    );
                  })}
                </Collapse.Panel>
              </Collapse>
            ))}
        </div>
        {/* <ManyResult /> */}
      </div>
      <div className="hidden">
        <ExamPrint exam={data?.records} ref={printRef} name={exam?.name} />
      </div>
    </HomeLayout >
  );
}

export default ExamDetails;
function dispatch(arg0: any) {
  throw new Error("Function not implemented.");
}

