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
import NewIcon from "@/app/components/icons/export.svg";
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
import { CandidateAnswers } from "@/data/exam";
import { ConnectCandidateAnswer, ConnectQuestionData } from "@/data/question";

export default function Connect({
  examId,
  question,
  index,
  getData,
  questionGroup,
  tmasQuest,
  addExamBank,
  canCheck,
  onChangeCheck,
  answers,
}: {
  answers?: CandidateAnswers;
  examId?: any;
  question?: ConnectQuestionData;
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

  const [deleteLoading, setDeleteLoading] = useState(false);
  const [dupLoading, setDupLoading] = useState(false);
  const router = useRouter();
  const { t } = useTranslation("exam");

  const [expanded, setExpanded] = useState<boolean>(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const containerRef = useRef(null);
  const contentRef = useRef(null);

  var candidateAnswer: ConnectCandidateAnswer | undefined =
    !answers?.candidateAnswerJson
      ? undefined
      : JSON.parse(answers?.candidateAnswerJson ?? "");

  useEffect(() => {
    setIsOverflowing(
      ((contentRef as any).current?.scrollHeight ?? 0) >
        ((containerRef as any).current?.clientHeight ?? 0) && !expanded,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div>
      <Collapse
        key={question?.id}
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
                      onChange={onChangeCheck as any}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      value={question?.id}
                    />
                  )}{" "}
                  {`${t("question")} ${index + 1}`}:
                  <div
                    ref={contentRef}
                    className="body_regular_14 pl-2"
                    dangerouslySetInnerHTML={{
                      __html: question?.question ?? "",
                    }}
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
          <div className="flex">
            <div className="flex w-1/2 flex-col">
              {question?.content?.questions?.map((e) => (
                <div key={e.id} className=" pl-10 flex">
                  <div className="font-semibold pr-1">{e?.label}.</div>
                  <div
                    dangerouslySetInnerHTML={{ __html: e.content ?? "" }}
                  ></div>
                </div>
              ))}
            </div>
            <div className="flex w-1/2 flex-col">
              {question?.content?.answers?.map((e) => (
                <div key={e.id} className=" pl-10 flex">
                  <div className="font-semibold pr-1">{e?.label}.</div>
                  <div
                    dangerouslySetInnerHTML={{ __html: e.content ?? "" }}
                  ></div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex">
            <div className="w-1/2 p-4">
              <div className="text-m_primary_500 text-sm font-semibold mb-2 pl-6">
                {t("answer")}
              </div>
              {candidateAnswer?.anwserPairings?.map((k, j) => {
                var q = question?.content?.questions?.find(
                  (t) => t.id == k.idQuestion,
                );
                var a = question?.content?.answers?.find(
                  (t) => t.id == k.idAnswer,
                );

                return (
                  <div key={j} className="flex">
                    {question?.content?.pairings?.some(
                      (g) =>
                        g.idAnswer == k.idAnswer &&
                        g.idQuestion == k.idQuestion,
                    ) ? (
                      <Tick />
                    ) : (
                      <div className="w-5" />
                    )}
                    <div className="pr-1 pl-1">{q?.label}-</div>
                    <div>{a?.label}</div>
                  </div>
                );
              })}
            </div>
            <div className="w-1/2 p-4">
              <div className="text-m_primary_500 text-sm font-semibold mb-2">
                {t("result")}
              </div>
              {question?.content?.pairings?.map((p, ii) => {
                var q = question?.content?.questions?.find(
                  (t) => t.id == p.idQuestion,
                );
                var a = question?.content?.answers?.find(
                  (t) => t.id == p.idAnswer,
                );

                return (
                  <div key={ii}>
                    {q?.label}-{a?.label}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="max-lg:flex-col flex justify-between lg:items-center">
            <div className="flex">
              {t("point")}:{" "}
              <div className="pl-1 font-semibold">
                {(answers?.anwserScore?.score ?? 0) / 100}/
                {question?.numberPoint ?? 0}
              </div>
            </div>
            <div className="flex">
              {t("method_match")}:
              <div className="pl-1 font-semibold">
                {question?.content?.pairingScroringMethod == "CorrectAll"
                  ? t("all_match")
                  : t("part_match")}
              </div>
            </div>
            <div className="flex">
              {t("sum_pair")}:{" "}
              <div className="pl-1 font-semibold">
                {answers?.anwserScore?.totalQuestion ?? 0}
              </div>
            </div>
            <div className="flex">
              {t("num_true_pair")}:{" "}
              <div className="pl-1 font-semibold">
                {answers?.anwserScore?.numberQuestionCorrect ?? 0}
              </div>
            </div>
            <div className="flex">
              {t("num_false_pair")}:{" "}
              <div className="pl-1 font-semibold">
                {(answers?.anwserScore?.totalQuestion ?? 0) -
                  (answers?.anwserScore?.numberQuestionCorrect ?? 0)}
              </div>
            </div>
          </div>
        </Collapse.Panel>
      </Collapse>
      {/* </Collapse.Panel> */}
    </div>
  );
}
