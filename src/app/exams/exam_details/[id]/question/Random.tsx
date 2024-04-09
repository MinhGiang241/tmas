import { Checkbox, Collapse } from "antd";
import React, { useEffect, useRef, useState } from "react";
import DeleteRedIcon from "@/app/components/icons/trash-red.svg";
import EditIcon from "@/app/components/icons/edit-black.svg";
import CopyIcon from "@/app/components/icons/size.svg";
import { useTranslation } from "react-i18next";
import { FormattedDate } from "react-intl";
import { useRouter } from "next/navigation";
import ConfirmModal from "@/app/components/modals/ConfirmModal";
import {
  deleteQuestionById,
  duplicateQuestion,
} from "@/services/api_services/question_api";
import { errorToast, successToast } from "@/app/components/toast/customToast";
import { APIResults } from "@/data/api_results";
import AddIcon from "@/app/components/icons/add.svg";
import MButton from "@/app/components/config/MButton";

function Random({
  getData,
  examId,
  question,
  index,
  questionGroup,
  tmasQuest,
  addExamBank,
  canCheck,
  onChangeCheck,
}: {
  getData?: any;
  examId?: any;
  question?: any;
  index?: any;
  questionGroup?: any;
  tmasQuest?: boolean;
  addExamBank?: Function;
  canCheck?: boolean;
  onChangeCheck?: Function;
}) {
  const router = useRouter();
  const { t } = useTranslation("question");
  const [expanded, setExpanded] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [dupLoading, setDupLoading] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const containerRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    setIsOverflowing(
      ((contentRef as any).current?.scrollHeight ?? 0) >
      ((containerRef as any).current?.clientHeight ?? 0) && !expanded,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [openCopyQuestion, setOpenCopyQuestion] = useState<boolean>(false);
  const [openDeleteQuestion, setOpenDeleteQuestion] = useState<boolean>(false);
  const [active, setActive] = useState("");
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
        key={index}
        ghost
        expandIconPosition="end"
        className="mb-3 rounded-lg bg-m_question overflow-hidden"
      >
        <Collapse.Panel
          header={
            <div className="my-3 flex justify-between items-center">
              <div className="flex">
                <span className="body_semibold_14">
                  {canCheck && (
                    <Checkbox
                      onChange={onChangeCheck as any}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      value={question?.id}
                    />
                  )}{" "}
                  {`${t("quest")} ${index}`}:
                  <span
                    className="body_regular_14 pl-2"
                    dangerouslySetInnerHTML={{ __html: question?.question }}
                  />
                </span>
              </div>
              {tmasQuest ? (
                <MButton
                  className="flex items-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    addExamBank!(e, question);
                  }}
                  h="h-11"
                  type="secondary"
                  icon={<AddIcon />}
                  text={t("add_bank")}
                />
              ) : (
                <div></div>
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
            <span>{question?.numberPoint}</span>
          </div>
          <div className="flex">
            <div className="text-sm pr-2 font-semibold">
              {t("created_date")}:
            </div>
            <FormattedDate
              value={question?.createdTime}
              day="2-digit"
              month="2-digit"
              year="numeric"
            />
          </div>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
}

export default Random;
