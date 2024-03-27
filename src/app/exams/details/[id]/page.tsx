"use client";
import MBreadcrumb from "@/app/components/config/MBreadcrumb";
import MButton from "@/app/components/config/MButton";
import HomeLayout from "@/app/layouts/HomeLayout";
import { ExamData } from "@/data/exam";
import { getExamById } from "@/services/api_services/examination_api";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { Collapse, Input, Popover } from "antd";
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
import Explain from "./question/Explain";
import ManyResult from "./question/ManyResult";
import { createAExamQuestionPart, getExamQuestionPartList, deleteQuestionPartById } from '@/services/api_services/question_api';
import { deleteExamination } from "@/services/api_services/examination_api";
import { errorToast, successToast } from "@/app/components/toast/customToast";
import { APIResults } from "@/data/api_results";


function ExamDetails({ params }: any) {
  const [exam, setExam] = useState<ExamData | undefined>();
  const [arrow, setArrow] = useState("Show");
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [deleteExamQuestions, setDeleteExamQuestions] = useState<boolean>(false);
  const [openEditQuestion, setOpenEditQuestion] = useState(false);
  const [openCopyQuestion, setOpenCopyQuestion] = useState<boolean>(false);
  const [openDeleteQuestion, setOpenDeleteQuestion] = useState<boolean>(false);
  //
  const [data, setData] = useState<any>()
  const [idDelete, setIdDelete] = useState<any>()
  const [loadDataQuestion, setLoadDataQuestion] = useState<any>(null)
  const [addLoading, setAddLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [list, setList] = useState<ExamData[]>([]);
  // 
  const [name, setName] = React.useState<string>('');
  const [note, setNote] = React.useState<string>('');
  // 
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
      <button className="text-left pb-1">Nhân bản</button>
      <button className="text-left pb-1">In</button>
      <button
        onClick={() => {
          setDeleteExamQuestions(true)
        }}
        className="text-left pb-1">Xóa
        <ConfirmModal
          onOk={() => { handleDeleteExam() }}
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

  const actionAddNew = (
    <div className="flex flex-col px-1">
      <button
        onClick={(e) => {
          e.stopPropagation();
          router.push(`/exams/details/${params.id}/add?partId=`);
        }}
        className="text-left mb-2 pb-1 border-b"
      >
        Thêm thủ công
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="text-left mb-2 pb-1 border-b"
      >
        Thêm từ ngân hàng câu hỏi của tôi
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="text-left mb-2 pb-1 border-b"
      >
        Thêm từ ngân hàng câu hỏi của TMAS
      </button>
    </div>
  );

  // const { TextArea } = Input;
  // xóa phần
  const handleDeleteExam = async () => {

    router.push("/exams");
    // loadExamList(false);
    successToast(t("delete_success"));
  };
  //
  const handleAddPart = async () => {
    setAddLoading(true)
    const res: any = await createAExamQuestionPart({ name: name, description: note });
    setAddLoading(false)
    if (res && res.code !== 0) {
      errorToast(res.message || "");
      return;
    }
    // console.log(res, "res");

    getData()
    setLoadDataQuestion(res)
    setOpen(false)
  };

  const handleDelete = async () => {
    // console.log(idDelete)
    const res = await deleteQuestionPartById(idDelete)
    if (res && res.code !== 0) {
      errorToast(res.message || "");
      return;
    }
    setOpenDelete(false);
    getData()
  }

  const getData = async () => {
    const res = await getExamQuestionPartList({ paging: { startIndex: 0, recordPerPage: 100 }, sorters: [{ name: "Name", isAsc: true }] })
    const data = res.data
    if (data) {
      setData(data)
    }
  }

  useEffect(() => {
    setLoadDataQuestion([]);
    getData()
  }, []);

  return (
    <HomeLayout>
      <MBreadcrumb
        items={[
          { text: t("Danh sách đề thi"), href: "/" },
          // { text: exam?.name, href: `/exams/details/${exam?.id}` },
          {
            // href: `/exams/details/${exam?.id}/add`,
            text: t("Tuyển Fresher digital MKT"),
            href: "/",
            active: true,
          },
        ]}
      />
      <div className="h-2" />
      <div className="w-full max-lg:px-3">
        <div className="body_semibold_20 mt-3 w-full flex  justify-between items-center ">
          <div className="">{t("Tuyển Fresher digital MKT")}</div>
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
        <div className="text-sm text-m_neutral_500 pt-1">
          Chúng tôi đang tìm kiếm một Fresher digital MKT để tham gia đội ngũ
          của chúng tôi. Ứng viên sẽ được đào tạo và hướng dẫn bởi các chuyên
          gia trong ngành để phát triển các kỹ năng và kiến thức cần thiết để
          trở thành một chuyên gia
        </div>
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
            <MessageQuestion className="mr-1" />
            10 câu hỏi
          </div>
          <div className="text-sm text-m_neutral_900 flex">
            <Cup className="mr-1" />
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
            // icon={<AddIcon />}
            type="secondary"
            // text={common.t("create_new")}
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
            />
            <MTextArea
              id="note"
              name="note"
              title={t("note")}
              onChange={handleNoteChange}
              value={note}
            />
            <div className="w-full flex justify-center mt-7">
              <MButton
                // onClick={onCancel}
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
          {data?.records?.map((x: any, key: any) => (
            <Collapse key={key} ghost expandIconPosition="end" className="mb-5 rounded-lg bg-white overflow-hidden">
              <Collapse.Panel
                header={
                  < div className="my-3 flex justify-between items-center">
                    <div>
                      <div className="text-base font-semibold">{x.name}</div>
                      <div className="text-sm text-m_neutral_500">
                        {x.description}
                      </div>
                    </div>
                    <div>
                      <Popover
                        placement="bottomRight"
                        content={
                          <div className="flex flex-col px-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/exams/details/${params.id}/add?partId=${x?.id}`);
                              }}
                              className="text-left mb-2 pb-1 border-b"
                            >
                              Thêm thủ công
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                              className="text-left mb-2 pb-1 border-b"
                            >
                              Thêm từ ngân hàng câu hỏi của tôi
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                              className="text-left mb-2 pb-1 border-b"
                            >
                              Thêm từ ngân hàng câu hỏi của TMAS
                            </button>
                          </div>
                        }
                        arrow={mergedArrow}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <NewIcon />
                        </button>
                      </Popover>
                      <button
                        className="px-2"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <EditIcon
                          onClick={() => {
                            setOpenEdit(true);
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
                                setOpenEdit(false);
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
                            setIdDelete(x.id)
                          }}
                        />
                        <ConfirmModal
                          onOk={() => {
                            handleDelete()
                          }}
                          onCancel={() => {
                            setOpenDelete(false);
                          }}
                          action={t("delete")}
                          text={t("confirm_delete")}
                          open={openDelete}
                        />
                      </button>
                    </div>
                  </div>
                }
                key={""}>
                <Explain examId={params.id} />
              </Collapse.Panel>
            </Collapse>
          ))}
        </div>
        {/* <ManyResult /> */}
      </div>
    </HomeLayout >
  );
}

export default ExamDetails;
