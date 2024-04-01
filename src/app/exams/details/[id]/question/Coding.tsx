import React, { useEffect, useMemo, useRef, useState } from "react";
import MButton from "@/app/components/config/MButton";
import { useTranslation } from "react-i18next";
import { Collapse, Popover } from "antd";
import DeleteRedIcon from "@/app/components/icons/trash-red.svg";
import EditIcon from "@/app/components/icons/edit-black.svg";
import CopyIcon from "@/app/components/icons/size.svg";
import BaseModal from "@/app/components/config/BaseModal";
import MInput from "@/app/components/config/MInput";
import MTextArea from "@/app/components/config/MTextArea";
import ConfirmModal from "@/app/components/modals/ConfirmModal";
import { useRouter } from "next/navigation";
import {
  createAExamQuestionPart,
  getExamQuestionPartList,
  deleteQuestionPartById,
  deleteQuestionById,
  CopyQuestion,
  updateAExamQuestionPart,
  deleteQuestionPart,
} from "@/services/api_services/question_api";
import { FormattedDate } from "react-intl";

export default function Coding({
  getData,
  examId,
  question,
  index,
  questionGroup,
}: {
  getData: any;
  examId: any;
  question: any;
  index: any;
  questionGroup: any;
}) {
  const [openEditQuestion, setOpenEditQuestion] = useState(false);
  const [openCopyQuestion, setOpenCopyQuestion] = useState<boolean>(false);
  const [openDeleteQuestion, setOpenDeleteQuestion] = useState<boolean>(false);
  const [active, setActive] = useState("");
  //
  // const [data, setData] = useState<any>();
  //
  const router = useRouter();
  const { t } = useTranslation("question");
  // console.log(examId);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const containerRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    setIsOverflowing(
      ((contentRef as any).current?.scrollHeight ?? 0) >
        ((containerRef as any).current?.clientHeight ?? 0) && !expanded,
    );
  }, []);
  return (
    <div>
      {}
      <ConfirmModal
        onOk={() => {}}
        onCancel={() => {
          setOpenCopyQuestion(false);
        }}
        action={t("copy")}
        text={t("confirm_copy")}
        open={openCopyQuestion}
      />
      <ConfirmModal
        onOk={async () => {
          await deleteQuestionById(active);
          setOpenDeleteQuestion(false);
          await getData();
        }}
        onCancel={() => {
          setOpenDeleteQuestion(false);
        }}
        action={t("delete_question")}
        text={t("confirm_delete_question")}
        open={openDeleteQuestion}
      />
      <Collapse
        // key={key}
        ghost
        expandIconPosition="end"
        className="rounded-lg bg-m_question overflow-hidden mb-3"
      >
        <Collapse.Panel
          header={
            <div className="my-3 flex justify-between items-center">
              <div className="flex flex-col">
                <span
                  ref={containerRef}
                  className={`body_semibold_14 ${
                    expanded ? "" : `max-h-9 overflow-hidden  text-ellipsis`
                  }`}
                >
                  Câu {index}:
                  <div
                    ref={contentRef}
                    className="body_regular_14 pl-2"
                    dangerouslySetInnerHTML={{ __html: question?.question }}
                  />
                </span>
                {isOverflowing ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpanded(!expanded);
                    }}
                    className="m-auto mt-1 text-blue-500 "
                  >
                    {expanded ? t("collapse") : t("read_more")}
                  </button>
                ) : null}
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
                        `/exams/details/${examId}/edit?questId=${question.id}`,
                      );
                    }}
                  />
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
                      // getExamQuestionPartList()
                      setOpenDeleteQuestion(true);
                      setActive(question.id);
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
            <div className="body_semibold_14 pr-2">Nhóm câu hỏi: </div>
            <span>{questionGroup?.name}</span>
          </div>
          <div className="flex">
            <div className="body_semibold_14 pr-2">Kiểu câu hỏi: </div>
            <span>{t(question?.questionType)}</span>
          </div>
          <div className="flex">
            <div className="body_semibold_14 pr-2">Điểm: </div>
            <span>{question.numberPoint}</span>
          </div>
          <div className="flex">
            <div className="text-sm pr-2 font-semibold">Ngày tạo: </div>
            <FormattedDate
              value={question?.createdTime}
              day="2-digit"
              month="2-digit"
              year="numeric"
            />
          </div>
        </Collapse.Panel>
      </Collapse>
      {/* {data?.examQuestions?.map((x: any, key: any) => (
            ))} */}
    </div>
  );
}
