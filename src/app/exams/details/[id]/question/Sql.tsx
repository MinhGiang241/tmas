import React, { useEffect, useMemo, useRef, useState } from "react";
import MButton from "@/app/components/config/MButton";
import { useTranslation } from "react-i18next";
import { Checkbox, Collapse, Popover } from "antd";
import DeleteRedIcon from "@/app/components/icons/trash-red.svg";
import EditIcon from "@/app/components/icons/edit-black.svg";
import CopyIcon from "@/app/components/icons/size.svg";
import BaseModal from "@/app/components/config/BaseModal";
import MInput from "@/app/components/config/MInput";
import MTextArea from "@/app/components/config/MTextArea";
import ConfirmModal from "@/app/components/modals/ConfirmModal";
import Tick from "@/app/components/icons/tick-circle.svg";
import { useRouter } from "next/navigation";
import { FormattedDate, FormattedTime } from "react-intl";
import {
  deleteQuestionById,
  duplicateQuestion,
} from "@/services/api_services/question_api";
import { errorToast, successToast } from "@/app/components/toast/customToast";
import { APIResults } from "@/data/api_results";
import AddIcon from "@/app/components/icons/add.svg";

export default function Sql({
  examId,
  question,
  index,
  getData,
  questionGroup,
  tmasQuest,
  addExamBank,
  canCheck,
  onChangeCheck,
  isExist,
  deleteExamBank,
  addText,
  deleteText,
  isBank = true,
}: {
  addText?: string;
  deleteText?: string;
  isBank?: boolean;
  isExist?: boolean;
  deleteExamBank?: Function;
  examId?: any;
  question?: any;
  index?: any;
  getData?: any;
  questionGroup?: any;
  tmasQuest?: boolean;
  addExamBank?: Function;
  canCheck?: boolean;
  onChangeCheck?: Function;
}) {
  const [openEditQuestion, setOpenEditQuestion] = useState(false);
  const [openCopyQuestion, setOpenCopyQuestion] = useState<boolean>(false);
  const [openDeleteQuestion, setOpenDeleteQuestion] = useState<boolean>(false);

  const router = useRouter();
  const { t } = useTranslation("question");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [dupLoading, setDupLoading] = useState(false);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const containerRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    setIsOverflowing(
      ((contentRef as any).current?.scrollHeight ?? 0) + 1 >
        ((containerRef as any).current?.clientHeight ?? 0) && !expanded,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <ConfirmModal
        loading={dupLoading}
        onOk={async () => {
          setDupLoading(true);
          var res: APIResults = await duplicateQuestion({
            newIdExamQuestionPart: question?.idExamQuestionPart,
            ids: [question?.id],
            idExams: examId ? [examId] : [],
          });
          setDupLoading(false);
          if (res.code != 0) {
            errorToast(res?.message ?? "");
            return;
          }
          successToast(t("sucess_duplicate_question"));
          setOpenCopyQuestion(false);
          router.push(
            `/exams/details/${examId ?? "u"}/edit?questId=${res?.data}`,
          );
          await getData();
        }}
        onCancel={() => {
          setOpenCopyQuestion(false);
        }}
        action={t("copy")}
        text={t("confirm_copy")}
        open={openCopyQuestion}
      />

      <ConfirmModal
        loading={deleteLoading}
        onOk={async () => {
          setDeleteLoading(true);
          var res = await deleteQuestionById(question?.id);
          setDeleteLoading(false);
          if (res.code != 0) {
            errorToast(res?.message ?? "");
            return;
          }
          successToast(t("success_delete_question"));

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
        // key={v?.id}
        ghost
        expandIconPosition="end"
        className="rounded-lg bg-m_question overflow-hidden mb-4"
      >
        <Collapse.Panel
          header={
            <div className="my-3 flex justify-between items-center">
              <div className="flex flex-col">
                <span
                  ref={containerRef}
                  className={`body_semibold_14 ${
                    expanded ? "" : `max-h-10 overflow-hidden  text-ellipsis`
                  }`}
                >
                  {canCheck && (
                    <Checkbox
                      className="mr-3"
                      onChange={onChangeCheck as any}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      value={question?.id}
                    />
                  )}{" "}
                  {`${t("question")} ${index}`}:
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
              {tmasQuest ? (
                isExist ? (
                  <MButton
                    type="error"
                    className="flex items-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteExamBank!(e, question);
                    }}
                    h="h-11"
                    icon={<DeleteRedIcon />}
                    text={deleteText ?? t("delete_bank")}
                  />
                ) : (
                  <MButton
                    className="flex items-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      addExamBank!(e, question);
                    }}
                    h="h-11"
                    type="secondary"
                    icon={<AddIcon />}
                    text={addText ?? t("add_bank")}
                  />
                )
              ) : (
                <div className="min-w-28 pl-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(
                        `/exams/details/${examId ?? "u"}/edit?questId=${
                          question.id
                        }&isBank=${isBank ? "true" : "false"}`,
                      );
                    }}
                  >
                    <EditIcon />
                  </button>
                  <button
                    className="px-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenCopyQuestion(true);
                    }}
                  >
                    <CopyIcon />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenDeleteQuestion(true);
                    }}
                  >
                    <DeleteRedIcon />
                  </button>
                </div>
              )}
            </div>
          }
          key={""}
        >
          <div className="h-[1px] bg-m_primary_200 mb-3" />
          <div className="text-m_primary_500 text-sm font-semibold mb-2">
            {t("quest_info")}
          </div>
          <div className="flex">
            <div className="text-sm pr-2 font-semibold">
              {t("quest_group")}:
            </div>
            <span>{questionGroup?.name}</span>
          </div>
          <div className="flex">
            <div className="text-sm pr-2 font-semibold">{t("quest_type")}:</div>
            <span>{t(question?.questionType)}</span>
          </div>
          <div className="flex">
            <div className="text-sm pr-2 font-semibold">{t("point")}: </div>
            <span>{question.numberPoint}</span>
          </div>
          <div className="flex">
            <div className="text-sm pr-2 font-semibold">
              {t("created_date")}:{" "}
            </div>
            <FormattedDate
              value={question?.createdTime}
              day="2-digit"
              month="2-digit"
              year="numeric"
            />
            <div className="w-2" />
            <FormattedTime
              value={question?.createdTime}
              hour="2-digit"
              minute="2-digit"
              second="2-digit"
            />
          </div>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
}
