"use client";
import MBreadcrumb from "@/app/components/config/MBreadcrumb";
import MButton from "@/app/components/config/MButton";
import { errorToast } from "@/app/components/toast/customToast";
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

function ExamDetails({ params }: any) {
  const [exam, setExam] = useState<ExamData | undefined>();
  const [arrow, setArrow] = useState('Show');
  const [open, setOpen] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [openEditQuestion, setOpenEditQuestion] = useState(false)
  const [openCopyQuestion, setOpenCopyQuestion] = useState<boolean>(false);
  const [openDeleteQuestion, setOpenDeleteQuestion] = useState<boolean>(false);

  const { t } = useTranslation('question')
  const common = useTranslation();
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
    if (arrow === 'Hide') {
      return false;
    }

    if (arrow === 'Show') {
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
      <button className="text-left pb-1">Xóa</button>
    </div>
  );

  const actionAddNew = (
    <div className="flex flex-col px-1">
      <button onClick={(e) => {
        e.stopPropagation()
      }} className="text-left mb-2 pb-1 border-b">Thêm thủ công</button>
      <button onClick={(e) => {
        e.stopPropagation()
      }} className="text-left mb-2 pb-1 border-b">Thêm từ ngân hàng câu hỏi của tôi</button>
      <button onClick={(e) => {
        e.stopPropagation()
      }} className="text-left mb-2 pb-1 border-b">Thêm từ ngân hàng câu hỏi của TMAS</button>
    </div>
  );

  const { TextArea } = Input;
  return (
    <HomeLayout>
      <MBreadcrumb
        items={[
          { text: t("Danh sách đề thi"), href: "/" },
          // { text: exam?.name, href: `/exams/details/${exam?.id}` },
          {
            // href: `/exams/details/${exam?.id}/add`,
            text: t("Tuyển Fresher digital MKT"), href: "/", active: true,
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
            <button><EditIcon /></button>
            {/* <button className="pl-3">
              <MoreIcon />
            </button> */}
            <Popover placement="bottomRight" content={action} arrow={mergedArrow}>
              <button className="pl-3"><MoreIcon /></button>
            </Popover>
          </div>
        </div>
        <div className="text-sm text-m_neutral_500 pt-1">Chúng tôi đang tìm kiếm một Fresher digital MKT để tham gia đội ngũ của chúng tôi. Ứng viên sẽ được đào tạo và hướng dẫn bởi các chuyên gia trong ngành để phát triển các kỹ năng và kiến thức cần thiết để trở thành một chuyên gia</div>
        <div className="h-[1px] bg-m_neutral_200 mt-10" />
        <div className="flex justify-between items-center mt-6 mb-6">
          <div className="text-sm text-m_neutral_900 flex"><Menu className="mr-1" />3 phần</div>
          <div className="text-sm text-m_neutral_900 flex"><Play className="mr-1" />Chuyển phần tự do</div>
          <div className="text-sm text-m_neutral_900 flex"><MessageQuestion className="mr-1" />10 câu hỏi</div>
          <div className="text-sm text-m_neutral_900 flex"><Cup className="mr-1" />10 điểm</div>
          <div className="text-sm text-m_neutral_900 flex"><Time className="mr-1" />Không giới hạn</div>
          <div className="text-sm text-m_neutral_900 flex"><Document className="mr-1" />1 câu hỏi/trang</div>
          <div className="text-sm text-m_neutral_900 flex"><Group className="mr-1" />Giữ thứ tự câu hỏi</div>
          <MButton
            h="h-11"
            onClick={() => {
              setOpen(true)
            }}

            className="flex items-center"
            // icon={<AddIcon />}
            type="secondary"
            // text={common.t("create_new")}
            text={t("Thêm phần")}
          />
          <BaseModal
            width={564}
            onCancel={() => { setOpen(false) }}
            title={t("add_new")}
            open={open}
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
              />
            </div>
          </BaseModal>
        </div>
        <Collapse
          // key={v?.id}
          ghost
          expandIconPosition="end"
          className="mb-5  rounded-lg bg-white overflow-hidden"
        >
          <Collapse.Panel
            header={
              <div className="my-3 flex justify-between items-center">
                <div>
                  <div className="text-base font-semibold">Phần tổng hợp</div>
                  <div className="text-sm text-m_neutral_500">Câu dễ làm trước, khó làm sau</div>
                </div>
                <div>
                  <Popover placement="bottomRight" content={actionAddNew} arrow={mergedArrow}>
                    <button onClick={(e) => {
                      e.stopPropagation()
                    }}><NewIcon /></button>
                  </Popover>
                  <button className="px-2" onClick={(e) => {
                    e.stopPropagation()
                  }}>
                    <EditIcon onClick={() => {
                      setOpenEdit(true)
                    }} />
                    <BaseModal
                      width={564}
                      onCancel={() => { setOpenEdit(false) }}
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
                          onClick={() => { setOpenEdit(false) }}
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
                  <button onClick={(e) => {
                    e.stopPropagation()
                  }}>
                    <DeleteRedIcon onClick={() => {
                      setOpenDelete(true)
                    }} />
                    <ConfirmModal
                      onOk={() => { }}
                      onCancel={() => { setOpenDelete(false) }}
                      action={t("delete")}
                      text={t("confirm_delete")}
                      open={openDelete}
                    />
                  </button>
                </div>
              </div>
            }
            key={""}>
            {/* <Collapse
              // key={v?.id}
              ghost
              expandIconPosition="end"
              className="mb-5  rounded-lg bg-m_question overflow-hidden"
            >
              <Collapse.Panel
                header={
                  <div className="my-3 flex justify-between items-center">
                    <div>
                      <div className="text-base font-semibold">Phần hình học</div>
                      <div className="text-sm text-m_neutral_500">Câu dễ làm trước, khó làm sau 1</div>
                    </div>
                    <div>
                      <button onClick={(e) => {
                        e.stopPropagation()
                      }}><EditIcon onClick={() => {
                        setOpenEditQuestion(true)
                      }} />
                        <BaseModal
                          width={564}
                          onCancel={() => { setOpenEditQuestion(false) }}
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
                              onClick={() => { setOpenEditQuestion(false) }}
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
                      <button className="px-2" onClick={(e) => {
                        e.stopPropagation()
                      }}><CopyIcon onClick={() => {
                        setOpenCopyQuestion(true)
                      }} />
                        <ConfirmModal
                          onOk={() => { }}
                          onCancel={() => { setOpenCopyQuestion(false) }}
                          action={t("copy")}
                          text={t("confirm_copy")}
                          open={openCopyQuestion}
                        />
                      </button>
                      <button onClick={(e) => {
                        e.stopPropagation()
                      }}><DeleteRedIcon onClick={() => {
                        setOpenDeleteQuestion(true)
                      }} />
                        <ConfirmModal
                          onOk={() => { }}
                          onCancel={() => { setOpenDeleteQuestion(false) }}
                          action={t("delete_question")}
                          text={t("confirm_delete_question")}
                          open={openDeleteQuestion}
                        />
                      </button>
                    </div>
                  </div>
                }
                key={""}>
                <span>
                  <span>Câu hỏi 1: </span>
                  Cho hình bát diện đều ABCDEF. Chứng minh rằng các đoạn thẳng AD, BD và CE đôi một vuông góc với nhau và cắt nhau tại trung điểm mỗi đường thẳng
                </span>
                <div className="h-[1px] bg-m_primary_200 mt-10 mb-3" />
                <div className="text-m_primary_500 text-sm font-semibold mb-2">Thông tin câu hỏi</div>
                <div>Nhóm câu hỏi: <span>Toán học</span></div>
              </Collapse.Panel>
            </Collapse> */}
          </Collapse.Panel>
        </Collapse>
        <Explain />
        <ManyResult />
      </div>
    </HomeLayout>
  );
}

export default ExamDetails;
