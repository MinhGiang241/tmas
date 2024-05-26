import React, { useEffect, useMemo, useRef, useState } from "react";
import MButton from "@/app/components/config/MButton";
import { useTranslation } from "react-i18next";
import { Checkbox, Collapse, Popover, Table } from "antd";

import AddIcon from "@/app/components/icons/add.svg";

import Close from "@/app/components/icons/close-circle.svg";
import Tick from "@/app/components/icons/tick-circle.svg";
import CodeMirror from "@uiw/react-codemirror";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { renderExtension } from "@/services/ui/coding_services";
import { CodingCandidateAnswer, CodingQuestionData } from "@/data/question";
import { CandidateAnswers } from "@/data/exam";
import { ColumnsType } from "antd/es/table";
import {
  rowEndStyle,
  rowStartStyle,
  rowStyle,
} from "@/app/account/account-info/AccountInfo";

export default function Coding({
  getData,
  examId,
  question,
  index,
  questionGroup,
  tmasQuest,
  addExamBank,
  canCheck,
  onChangeCheck,
  answers,
}: {
  getData?: any;
  examId?: any;
  question?: CodingQuestionData;
  index?: any;
  questionGroup?: any;
  tmasQuest?: boolean;
  addExamBank?: Function;
  canCheck?: boolean;
  onChangeCheck?: Function;
  answers?: CandidateAnswers;
}) {
  const { t } = useTranslation("exam");
  const common = useTranslation();

  const [expanded, setExpanded] = useState<boolean>(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  var candidateAnswer: CodingCandidateAnswer | undefined =
    !answers?.candidateAnswerJson
      ? undefined
      : JSON.parse(answers?.candidateAnswerJson ?? "");
  interface TableValue {
    testcase?: string;
    input?: string;
    output?: string;
    result?: boolean;
  }
  const columns: ColumnsType<TableValue> = [
    {
      onHeaderCell: (_) => rowStartStyle,
      title: "Testcase",
      dataIndex: "testcase",
      key: "testcase",
      render: (text, data) => (
        <div className=" flex justify-start mr-1 px-1 rounded-md ">{text}</div>
      ),
    },
    {
      onHeaderCell: (_) => rowStyle,
      title: t("inputT"),
      dataIndex: "input",
      key: "input",
      render: (text, data) => (
        <div className=" flex justify-start mr-1 px-1 cursor-pointer text-m_primary_500 underline underline-offset-4">
          LinkTest
        </div>
      ),
    },
    {
      onHeaderCell: (_) => rowStyle,
      title: t("outputT"),
      dataIndex: "output",
      key: "output",
      render: (text, data) => (
        <div className="flex justify-start mr-1 px-1 cursor-pointer text-m_primary_500 underline underline-offset-4">
          LinkTest
        </div>
      ),
    },
    {
      onHeaderCell: (_) => rowEndStyle,
      title: t("result"),
      dataIndex: "result",
      key: "result",
      render: (text, data, ind) => <div>{text ? <Tick /> : <Close />}</div>,
    },
  ];

  const data: TableValue[] =
    question?.content?.testcases?.map<TableValue>((k) => ({
      testcase: k.name,
      input: k.inputData,
      output: k.outputData,
      result: true,
    })) ?? [];

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
        className="rounded-lg bg-m_question overflow-hidden mb-3"
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
                  {/* <div
                    ref={contentRef}
                    className="body_regular_14 pl-2"
                    dangerouslySetInnerHTML={{ __html: question?.question }}
                  /> */}
                  <div className="text-sm font-normal">
                    {t("coding_question")}
                  </div>
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
          <div>
            <Table columns={columns} dataSource={data} pagination={false} />
            <div className="max-lg:flex-col lg:items-center flex justify-between items-center pt-4">
              <div className="flex">
                {t("point")}: <div className="pl-1 font-semibold">1/1</div>
              </div>
              <div className="flex">
                {t("method_match")}:{" "}
                <div className="pl-1 font-semibold">
                  {" "}
                  {question?.content?.codingScroringMethod == "PassAllTestcase"
                    ? t("all_match")
                    : t("part_match")}
                </div>
              </div>
              <div className="flex">
                {t("sum_pair")}: <div className="pl-1 font-semibold">3</div>
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
            <div className="bg-white rounded-t-lg mt-3">
              <div className="pt-3 ml-2 mb-2 body_semibold_14">
                {common.t("language")}: {""}
              </div>
              <CodeMirror
                readOnly={true}
                onBlur={async () => {}}
                value={candidateAnswer?.code}
                // lang={lang}
                theme={dracula}
                height="300px"
                extensions={[renderExtension("javascript") as any]}
                onChange={(v) => {}}
              />
            </div>
          </div>
          <div className="">
            <div className="text-m_primary_500 text-sm font-semibold mb-2 mt-2">
              {t("explain_result")}
            </div>
            <div
              dangerouslySetInnerHTML={{
                __html: question?.content?.codingTemplate?.explainAnswer ?? "",
              }}
            ></div>
          </div>
        </Collapse.Panel>
      </Collapse>
      {/* {data?.examQuestions?.map((x: any, key: any) => (
            ))} */}
    </div>
  );
}
