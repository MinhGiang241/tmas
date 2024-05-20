import React, { useEffect, useMemo, useRef, useState } from "react";
import MButton from "@/app/components/config/MButton";
import { useTranslation } from "react-i18next";
import { Checkbox, Collapse, Popover, Table } from "antd";
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
import { FillBlankQuestionFormData } from "@/data/form_interface";
import {
  deleteQuestionById,
  duplicateQuestion,
} from "@/services/api_services/question_api";
import { errorToast, successToast } from "@/app/components/toast/customToast";
import { APIResults } from "@/data/api_results";
import AddIcon from "@/app/components/icons/add.svg";
import Close from "@/app/components/icons/close-circle.svg";
import { CandidateAnswers } from "@/data/exam";
import {
  FillBlankCandidateAnswer,
  FillBlankQuestionData,
} from "@/data/question";
import {
  rowEndStyle,
  rowStartStyle,
  rowStyle,
} from "@/app/account/account-info/AccountInfo";
import { ColumnsType } from "antd/es/table";

export default function FillBlank({
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
  question?: FillBlankQuestionData;
  index?: any;
  getData?: any;
  questionGroup?: any;
  tmasQuest?: boolean;
  addExamBank?: Function;
  canCheck?: boolean;
  onChangeCheck?: Function;
  answers?: CandidateAnswers;
}) {
  const router = useRouter();
  const { t } = useTranslation("exam");
  // console.log("question", question);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  var candidateAnswer: FillBlankCandidateAnswer | undefined =
    !answers?.candidateAnswerJson
      ? undefined
      : JSON.parse(answers?.candidateAnswerJson ?? "");

  const columns: ColumnsType<TableValue> = [
    {
      onHeaderCell: (_) => rowStartStyle,
      title: t("blank"),
      dataIndex: "blank",
      key: "blank",
      render: (text, data, ind) => (
        <p key={text} className="w-full  min-w-11 break-all caption_regular_14">
          {text}
        </p>
      ),
    },
    {
      onHeaderCell: (_) => rowStyle,
      title: t("inputT"),
      dataIndex: "input",
      key: "input",
      render: (text, data, ind) => (
        <div className="flex">
          {text?.map((t: any, i: any) => (
            <div
              key={i}
              className="border flex justify-center mr-1 px-1 rounded-md bg-m_neutral_100"
            >
              {t}
            </div>
          ))}
        </div>
      ),
    },
    {
      onHeaderCell: (_) => rowStyle,
      title: t("outputT"),
      dataIndex: "output",
      key: "output",
      render: (text, data, ind) => (
        <div className="flex">
          {text?.map((t: any, i: any) => (
            <div
              key={i}
              className="border flex justify-center mr-1 px-1 rounded-md bg-m_neutral_100"
            >
              {t}
            </div>
          ))}
        </div>
      ),
    },
    {
      onHeaderCell: (_) => rowEndStyle,
      title: t("result"),
      dataIndex: "result",
      key: "result",
      render: (text, data) => <div>{text ? <Tick /> : <Close />}</div>,
    },
  ];
  interface TableValue {
    blank?: string;
    input?: string[];
    output?: string[];
    result?: boolean;
  }
  const data: TableValue[] =
    candidateAnswer?.anwserItems?.map<TableValue>((y) => {
      var blank = question?.content?.anwserItems?.find(
        (i) => i.label === y.label,
      );
      return {
        blank: blank?.label,
        input: blank?.anwsers,
        output: y?.anwsers,
        result: answers?.anwserScore?.isAnwsered,
      };
    }) ?? [];

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
                    // dangerouslySetInnerHTML={{ __html: question?.content?.formatBlank,}}
                    dangerouslySetInnerHTML={{
                      __html: question?.content?.formatBlank ?? "",
                    }}
                  />
                  <div className="text-sm font-normal">{t("fill_blank")}</div>
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
            </div>
          }
          key={""}
        >
          <div className="h-[1px] bg-m_primary_200 mb-3" />
          <div className="">
            <div>
              <Table columns={columns} dataSource={data} pagination={false} />
              <div className="max-lg:flex-col lg:items-center flex justify-between items-center pt-4">
                <div className="flex">
                  {t("point")}:{" "}
                  <div className="pl-1 font-semibold">
                    {(answers?.anwserScore?.score ?? 0) / 100}/
                    {question?.numberPoint ?? 0}
                  </div>
                </div>
                <div className="flex">
                  {t("method_match")}:{" "}
                  <div className="pl-1 font-semibold">
                    {" "}
                    {question?.content?.fillBlankScoringMethod ==
                    "CorrectAllBlank"
                      ? t("all_match")
                      : t("part_match")}
                  </div>
                </div>
                <div className="flex">
                  {t("sum_blank")}:{" "}
                  <div className="pl-1 font-semibold">
                    {question?.content?.anwserItems?.length}
                  </div>
                </div>
                <div className="flex">
                  {t("true_blank_num")}:{" "}
                  <div className="pl-1 font-semibold">
                    {answers?.anwserScore?.numberQuestionCorrect ?? 0}
                  </div>
                </div>
                <div className="flex">
                  {t("false_blank_num")}:{" "}
                  <div className="pl-1 font-semibold">
                    {(answers?.anwserScore?.totalQuestion ?? 0) -
                      (answers?.anwserScore?.numberQuestionCorrect ?? 0)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
}
