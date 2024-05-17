import React, { useEffect, useMemo, useRef, useState } from "react";
import MButton from "@/app/components/config/MButton";
import { useTranslation } from "react-i18next";
import { Button, Checkbox, Collapse, Popover } from "antd";
import DeleteRedIcon from "@/app/components/icons/trash-red.svg";
import EditIcon from "@/app/components/icons/edit-black.svg";
import CopyIcon from "@/app/components/icons/size.svg";
import BaseModal from "@/app/components/config/BaseModal";
import MInput from "@/app/components/config/MInput";
import MTextArea from "@/app/components/config/MTextArea";
import ConfirmModal from "@/app/components/modals/ConfirmModal";
import {
  ExamQuestionPartById,
  deleteQuestionById,
  duplicateQuestion,
} from "@/services/api_services/question_api";
import { useRouter } from "next/navigation";
import { FormattedDate, FormattedTime } from "react-intl";
import { errorToast, successToast } from "@/app/components/toast/customToast";
import { APIResults } from "@/data/api_results";
import AddIcon from "@/app/components/icons/add.svg";
import Edit from "@/app/components/icons/edit-black.svg";
import { Input } from "antd";
import {
  EssayCandidateAnswer,
  EssayQuestionData,
  MultiCandidateAnswer,
} from "@/data/question";
import { CandidateAnswers } from "@/data/exam";

export default function Explain({
  index,
  examId,
  question,
  getData,
  questionGroup,
  tmasQuest,
  addExamBank,
  canCheck,
  onChangeCheck,
  answers,
}: {
  examId?: any;
  question?: EssayQuestionData;
  index?: any;
  getData?: any;
  questionGroup?: any;
  tmasQuest?: boolean;
  addExamBank?: Function;
  canCheck?: boolean;
  onChangeCheck?: Function;
  answers?: CandidateAnswers;
}) {
  const [openEditQuestion, setOpenEditQuestion] = useState(false);
  const [openCopyQuestion, setOpenCopyQuestion] = useState<boolean>(false);
  const [openDeleteQuestion, setOpenDeleteQuestion] = useState<boolean>(false);

  const { t } = useTranslation("exam");

  const router = useRouter();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [dupLoading, setDupLoading] = useState(false);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const { TextArea } = Input;
  const [edit, setEdit] = useState<boolean>(false);
  //
  const [comment, setComment] = useState("");
  const [point, setPoint] = useState("");
  var candidateAnswer: EssayCandidateAnswer | undefined =
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
      {/* {data?.examQuestions?.map((x: any, key: any) => ( */}
      <Collapse
        // key={key}
        ghost
        expandIconPosition="end"
        className="mb-3 rounded-lg bg-m_question overflow-hidden"
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
          <div
            dangerouslySetInnerHTML={{
              __html: candidateAnswer?.anwserHtml ?? "",
            }}
          ></div>
          {!edit && (
            <div>
              <div className="font-semibold pt-2">{t("comment")}</div>
              <TextArea
                value={comment}
                className="rounded-md"
                rows={4}
                placeholder={t("enter_comment")}
                onChange={(e) => setComment(e.target.value)}
              />
              <div className="font-semibold pt-2">
                {t("match_max", { num: question?.numberPoint })}
              </div>
              <div className="flex items-end ">
                <Input
                  value={point}
                  className="rounded-md h-[50px]"
                  type="number"
                  onChange={(e) => setPoint(e.target.value)}
                />
                <Button
                  onClick={() => setEdit(!edit)}
                  className="ml-4 w-[114px] h-[36px] rounded-md bg-m_primary_500 text-white font-semibold"
                >
                  {t("save_as")}
                </Button>
              </div>
            </div>
          )}
          {edit && (
            <div className="pt-1">
              <div className="font-semibold py-2">{t("comment")}</div>
              <TextArea
                className="rounded-md"
                rows={4}
                disabled
                value={comment}
              />
              <div className="flex justify-between items-center pt-2">
                <div className="flex">
                  <div>{t("scored_point")}:</div>
                  <div className="font-semibold pl-1">{point}</div>
                </div>
                <Edit onClick={() => setEdit(!edit)} />
              </div>
            </div>
          )}
        </Collapse.Panel>
      </Collapse>
    </div>
  );
}
