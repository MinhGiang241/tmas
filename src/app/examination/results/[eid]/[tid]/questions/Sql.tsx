import React, { useEffect, useMemo, useRef, useState } from "react";
import MButton from "@/app/components/config/MButton";
import { useTranslation } from "react-i18next";
import { Button, Checkbox, Collapse, Input, Popover, Table } from "antd";
import Tick from "@/app/components/icons/tick-circle.svg";
import Close from "@/app/components/icons/close-circle.svg";
import { useRouter } from "next/navigation";
import AddIcon from "@/app/components/icons/add.svg";
import CodeMirror from "@uiw/react-codemirror";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { renderExtension } from "@/services/ui/coding_services";
import { CandidateAnswers } from "@/data/exam";
import { SqlAnswerMetadata, SqlCandidateAnswer } from "@/data/question";
import MTable, { TableDataRow } from "@/app/components/config/MTable";
import MTextArea from "@/app/components/config/MTextArea";
import { errorToast } from "@/app/components/toast/customToast";
import { submitCheckingAnswer } from "@/services/api_services/result_exam_api";
import Edit from "@/app/components/icons/edit-black.svg";

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
  answers,
  hidden,
  isComplete,
  idExamTestResult,
  loadAnswer,
}: {
  hidden?: boolean;
  isComplete?: boolean;
  examId?: any;
  question?: any;
  index?: any;
  getData?: any;
  questionGroup?: any;
  tmasQuest?: boolean;
  addExamBank?: Function;
  canCheck?: boolean;
  onChangeCheck?: Function;
  answers?: CandidateAnswers;
  idExamTestResult?: string;
  loadAnswer: Function;
}) {
  const { t } = useTranslation("exam");
  const [expanded, setExpanded] = useState<boolean>(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [comment, setComment] = useState<string | undefined>(
    answers?.anwserScore?.evaluatorComment,
  );
  const [point, setPoint] = useState(
    (answers?.anwserScore?.score ?? 0)?.toString(),
  );

  var candidateAnswer: SqlCandidateAnswer | undefined =
    !answers?.candidateAnswerJson
      ? undefined
      : JSON.parse(answers?.candidateAnswerJson ?? "");

  console.log("candidateAnswer SQL", candidateAnswer);

  useEffect(() => {
    setIsOverflowing(
      ((contentRef as any).current?.scrollHeight ?? 0) >
        ((containerRef as any).current?.clientHeight ?? 0) && !expanded,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Extract the header
  const header =
    candidateAnswer?.stdOutRaw && candidateAnswer?.stdOutRaw?.length != 0
      ? (candidateAnswer?.stdOutRaw as any)[0]
      : [0];
  // Convert to list of objects
  const dataSource = (candidateAnswer?.stdOutRaw ?? []).slice(1).map((row) => {
    let entry: any = {};
    header.forEach((key: string, index: number) => {
      entry[key] = row[index];
    });
    return entry;
  });

  var tableDataRow: TableDataRow[] = (header as any[])?.map<TableDataRow>(
    (e) => ({
      title: e,
      dataIndex: e,
    }),
  );

  // Correct Ansewr

  var metadata: SqlAnswerMetadata = candidateAnswer?.metadata
    ? JSON.parse(candidateAnswer?.metadata ?? "")
    : undefined;

  console.log("metedata sql", metadata);

  const expectedData = metadata?.data?.expectedOutput
    ?.split("\n")
    ?.map((r) => r?.split("  "));

  const headerAns =
    expectedData && expectedData?.length != 0 ? (expectedData as any)[0] : [0];
  const dataSourceAns = (expectedData ?? []).slice(1).map((row) => {
    let entry: any = {};
    headerAns.forEach((key: string, index: number) => {
      entry[key] = row[index];
    });
    return entry;
  });

  var tableDataRowAns: TableDataRow[] = (headerAns as any[])?.map<TableDataRow>(
    (e) => ({
      title: e,
      dataIndex: e,
    }),
  );

  console.log("metadata", metadata);

  const [edit, setEdit] = useState<boolean>(false);
  return (
    !hidden && (
      <div>
        <Collapse
          // key={v?.id}
          defaultActiveKey={["1"]}
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
            key={"1"}
          >
            <div className="h-[1px] bg-m_primary_200 mb-3" />
            {!candidateAnswer?.metadata || !candidateAnswer?.stdOut ? (
              <div className="text-m_warning_600 body_semibold_16">
                {t("empty_answer")}
              </div>
            ) : (
              <>
                <div className="bg-m_neutral_100 p-3 font-semibold text-sm rounded-lg">
                  {"My SQL"}
                </div>
                <CodeMirror
                  readOnly
                  value={candidateAnswer?.querySql}
                  lang={"sql"}
                  theme={dracula}
                  height="300px"
                  extensions={[renderExtension("sql") as any]}
                  onChange={(v) => {}}
                />
                <div className="pt-3">
                  <div className="flex pb-2">
                    <div className="pr-2 font-semibold text-sm">
                      {t("result")}
                    </div>
                    {/* {metadata?.data?.matched ? <Tick /> : <Close />} */}
                  </div>
                  {/* <Table columns={columns} dataSource={data} pagination={false} /> */}
                  <MTable
                    isHidePagination
                    dataRows={tableDataRow}
                    dataSource={dataSource}
                  />
                </div>
                <div className="py-3">
                  <div className="pr-2 font-semibold text-sm pb-2">
                    {t("result0")}
                  </div>
                  <MTable
                    isHidePagination
                    dataRows={tableDataRowAns}
                    dataSource={dataSourceAns}
                  />
                </div>

                <div className="">
                  <div className="text-m_primary_500 text-sm font-semibold mb-2 mt-2">
                    {t("explain_result")}
                  </div>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: question?.content?.explainAnswer ?? "",
                    }}
                  ></div>
                </div>

                {!edit &&
                  !isComplete &&
                  candidateAnswer?.querySql &&
                  candidateAnswer?.stdOut && (
                    <div>
                      <div className="font-semibold pt-2">{t("comment")}</div>
                      <MTextArea
                        value={comment}
                        name="comment"
                        id="comment"
                        onChange={(e) => setComment(e.target.value)}
                        placeholder={t("enter_comment")}
                      />

                      <div className="font-semibold pt-2">
                        {t("match_max", { num: question?.numberPoint })}
                      </div>
                      <div className="flex items-end ">
                        <Input
                          disabled={isComplete}
                          value={point}
                          className="rounded-md h-[50px]"
                          type="number"
                          onChange={(e) => {
                            setPoint(e?.target?.value);
                          }}
                        />
                        <Button
                          disabled={isComplete}
                          onClick={async () => {
                            if (!point?.trim()) {
                              errorToast(t("point_not_empty"));
                              return;
                            }
                            var val = point?.trim()
                              ? parseFloat(point.trim()).toFixed(2)
                              : undefined;
                            setLoading(true);
                            var res = await submitCheckingAnswer({
                              evaluatorComment: comment,
                              score: val ? parseFloat(val ?? 0) : undefined,
                              idExamQuestion: question?.id,
                              idExamTestResult,
                            });
                            setLoading(false);
                            if (res?.code != 0) {
                              errorToast(res?.message ?? "");
                              return;
                            }
                            setPoint(val ? val?.toString() : "");
                            loadAnswer();
                            setEdit(!edit);
                          }}
                          className="ml-4 w-[114px] h-[36px] rounded-md bg-m_primary_500 text-white font-semibold"
                        >
                          {t("save_as")}
                        </Button>
                      </div>
                    </div>
                  )}
                {candidateAnswer?.querySql &&
                  candidateAnswer?.stdOut &&
                  (edit || isComplete) && (
                    <div className="pt-1">
                      <div className="font-semibold py-2">{t("comment")}</div>
                      <MTextArea
                        value={comment}
                        name="comment"
                        id="comment"
                        onChange={(e) => setComment(e.target.value?.trim())}
                        disable
                      />

                      <div className="flex justify-between items-center pt-2">
                        <div className="flex">
                          <div>{t("scored_point")}:</div>
                          <div className="font-semibold pl-1">{point}</div>
                        </div>
                        {!isComplete && (
                          <button onClick={() => setEdit(!edit)}>
                            <Edit />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
              </>
            )}
          </Collapse.Panel>
        </Collapse>
      </div>
    )
  );
}
