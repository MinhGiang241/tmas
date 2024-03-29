"use client";
import MBreadcrumb from "@/app/components/config/MBreadcrumb";
import MButton from "@/app/components/config/MButton";
import HomeLayout from "@/app/layouts/HomeLayout";
import { ExamData } from "@/data/exam";
import { getExamById } from "@/services/api_services/examination_api";
import React, { useEffect, useMemo, useState } from "react";
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
import ManyResult from "./question/ManyResult";
import {
  createAExamQuestionPart,
  getExamQuestionPartList,
  deleteQuestionPartById,
  deleteQuestionById,
  CopyQuestion,
  updateAExamQuestionPart,
  deleteQuestionPart
} from '@/services/api_services/question_api';
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
  const [deleteExamQuestions, setDeleteExamQuestions] = useState<boolean>(false);
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
  const [note, setNote] = React.useState<string>("");
  const [customName, setCustomName] = useState("");
  const [customNote, setCustomNote] = useState("");
  //
  const [active, setActive] = useState("");
  const router = useRouter();

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleNoteChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNote(event.target.value);
  };

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
        className="text-left pb-1">Nhân bản

      </button>
      <button className="text-left pb-1">In</button>
      <button
        onClick={() => {
          setDeleteExamQuestions(true);
        }}
        className="text-left pb-1"
      >
        Xóa
        <ConfirmModal
          onOk={async () => {
            await deleteQuestionPart(params.id)
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

  const handleAddPart = async () => {
    setAddLoading(true);
    const res: any = await createAExamQuestionPart({
      idExam: params.id,
      name: name,
      description: note,
    });
    console.log(res);
    setAddLoading(false);
    if (res && res.code !== 0) {
      errorToast(res.message || "");
      return;
    }
    // setLoadDataQuestion(res);
    successToast(t("success_add_question"));
    setOpen(false);
    setName("");
    setNote("");
    getData();
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
    const res = await getExamQuestionPartList({ paging: { startIndex: 0, recordPerPage: 100 }, sorters: [{ name: "Name", isAsc: true }, { name: "updateTime", isAsc: true }] })
    const data = res.data
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


  return (
    <HomeLayout>
      <div className="h-5" />
      {/* Copy phần câu hỏi */}
      <ConfirmModal
        onOk={async () => {
          await CopyQuestion(params.id)
          setOpenCopyQuestion(false);
        }}
        onCancel={() => { setOpenCopyQuestion(false); }}
        action={t("copy")}
        text={t("confirm_copy")}
        open={openCopyQuestion} />
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
        onCancel={() => { setOpenDeleteQuestion(false); }}
        action={t("delete_question")}
        text={t("confirm_delete_question")}
        open={openDeleteQuestion} />
      <MBreadcrumb
        items={[
          { text: t("Danh sách đề thi"), href: "/" },
          // { text: exam?.name, href: `/exams/details/${exam?.id}` },
          {
            // href: `/exams/details/${exam?.id}/add`,
            text: t("Chi tiết đề thi"),
            href: "/",
            active: true,
          },
        ]}
      />
      <div className="h-2" />
      <div className="w-full max-lg:px-3">
        <div className="body_semibold_20 mt-3 w-full flex  justify-between items-center ">
          <div className="">{t(`Chi tiết đề thi`)}</div>
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
            <button>
              <EditIcon />
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
        {/* <div className="text-sm text-m_neutral_500 pt-1">
          Chúng tôi đang tìm kiếm một Fresher digital MKT để tham gia đội ngũ
          của chúng tôi. Ứng viên sẽ được đào tạo và hướng dẫn bởi các chuyên
          gia trong ngành để phát triển các kỹ năng và kiến thức cần thiết để
          trở thành một chuyên gia
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
            <MInput
              id="name"
              name="name"
              title={t("name")}
              required
              onChange={handleNameChange}
              value={name}
              placeholder="Nhập nội dung"
              maxLength={255}
            />
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
          {data?.records?.sort((a: any, b: any) => (b.createdTime?.localeCompare(a?.createdTime)))?.map((x: any, key: any) => (
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
                    <div>
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
                        <Tooltip placement="bottom" title={"Thêm câu hỏi"} arrow={mergedArrow}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            <NewIcon />
                          </button></Tooltip>
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
                            openEditModal(x.id)
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
                            onChange={(event) => setCustomName(event.target.value)}
                          />
                          <MTextArea
                            // formik={formik}
                            id="customNote"
                            name="customNote"
                            title={t("note")}
                            placeholder="Nhập nội dung"
                            maxLength={500}
                            value={customNote}
                            onChange={(event) => setCustomNote(event.target.value)}
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
                              className="w-36"
                              text={t("update")}
                              onClick={async () => {
                                const res = await updateAExamQuestionPart({ idExam: x.id, name: customName, description: customNote });
                                if (res && res.code === 0) {
                                  setOpenEdit(false);
                                  const updatedRecords = [...data.records];
                                  const index = updatedRecords.findIndex(item => item.id === x.id);
                                  if (index !== -1) {
                                    updatedRecords[index] = { ...updatedRecords[index], name: customName, description: customNote };
                                    updatedRecords.unshift(updatedRecords.splice(index, 1)[0]);
                                    setData({ ...data, records: updatedRecords });
                                    setCustomName("");
                                    setCustomNote("");
                                    successToast(t("success_edit_question"));
                                  }
                                }
                                // await updateAExamQuestionPart({ idExam: x.id, name: customName, description: customNote })
                                // setOpenEdit(false);
                                // getData();
                                // setCustomNote("")
                                // setCustomName("")
                                // toast.success('Sửa thành công!');
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
                key={""}>
                {x?.examQuestions?.map((e: any, key: any) => {
                  if (e.questionType == "Coding") {
                    return (
                      <Coding key={e.id} examId={params.id} question={e} />
                    )
                  }
                  if (e.questionType == "Connect") {
                    return (
                      <Connect key={e.id} examId={params.id} question={e} />
                    )
                  }
                  if (e.questionType == "Explain") {
                    return (
                      <Explain key={e.id} examId={params.id} question={e} />
                    )
                  }
                  if (e.questionType == "FillBlank") {
                    return (
                      <FillBlank key={e.id} examId={params.id} question={e} />
                    )
                  }
                  if (e.questionType == "ManyResult") {
                    return (
                      <ManyResult key={e.id} examId={params.id} question={e} />
                    )
                  }
                  if (e.questionType == "Sql") {
                    return (
                      <Sql key={e.id} examId={params.id} question={e} />
                    )
                  }
                  if (e.questionType == "TrueFalse") {
                    return (
                      <TrueFalse key={e.id} examId={params.id} question={e} />
                    )
                  }
                  return (
                    <Collapse
                      key={key}
                      ghost
                      expandIconPosition="end"
                      className="mb-3 rounded-lg bg-m_question overflow-hidden"
                    >
                      <Collapse.Panel
                        header={<div className="my-3 flex justify-between items-center">
                          <div className="flex ">
                            <span className="body_semibold_14">
                              Câu {key + 1}:{" "}
                              <span className="body_regular_14">
                                {e?.question}
                              </span>
                            </span>
                          </div>
                          <div className="min-w-28">
                            <button onClick={(e) => {
                              e.stopPropagation();
                            }}><EditIcon onClick={() => {
                              router.push(`/exams/details/${params.id}/edit?questId=${e?.id}`);
                            }} />
                              <BaseModal
                                width={564}
                                onCancel={() => { setOpenEditQuestion(false); }}
                                title={t("edit_question")}
                                open={openEditQuestion}
                              >
                                <MInput
                                  // formik={formik}
                                  id="name"
                                  name="name"
                                  title={t("name")}
                                  required />
                                <MTextArea
                                  // formik={formik}
                                  id="note"
                                  name="note"
                                  title={t("note")} />
                                <div className="w-full flex justify-center mt-7">
                                  <MButton
                                    className="w-36"
                                    type="secondary"
                                    text={t("cancel")}
                                    onClick={() => { setOpenEditQuestion(false); }} />
                                  <div className="w-5" />
                                  <MButton
                                    // loading={loading}
                                    htmlType="submit"
                                    className="w-36"
                                    text={t("update")} />
                                </div>
                              </BaseModal>
                            </button>
                            <button className="px-2" onClick={(e) => {
                              e.stopPropagation();
                            }}><CopyIcon onClick={() => {
                              setOpenCopyQuestion(true);
                            }} />
                            </button>
                            <button onClick={(e) => {
                              e.stopPropagation();
                            }}><DeleteRedIcon onClick={() => {
                              setOpenDeleteQuestion(true);
                              setActive(e.id);
                              // console.log(e);
                            }} />

                            </button>
                          </div>
                        </div>}
                        key={""}>
                        <div className="h-[1px] bg-m_primary_200 mb-3" />
                        <div className="text-m_primary_500 text-sm font-semibold mb-2">Thông tin câu hỏi</div>
                        <div className="flex">
                          <div className="text-sm pr-2 font-semibold">Nhóm câu hỏi: </div>
                          <span>Toán học</span>
                        </div>
                        <div className="flex">
                          <div className="text-sm pr-2 font-semibold">Kiểu câu hỏi: </div>
                          <span>{e.questionType}</span>
                        </div>
                        <div className="flex">
                          <div className="text-sm pr-2 font-semibold">Điểm: </div>
                          <span>{e.numberPoint}</span>
                        </div>
                        <div className="flex">
                          <div className="text-sm pr-2 font-semibold">Ngày tạo: </div>
                          <FormattedDate
                            value={e?.createdTime}
                            day="2-digit"
                            month="2-digit"
                            year="numeric" />
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
    </HomeLayout>
  );
}

export default ExamDetails;
