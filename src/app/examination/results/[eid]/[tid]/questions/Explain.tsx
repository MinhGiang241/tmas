import React, { useEffect, useMemo, useRef, useState } from "react";
import MButton from "@/app/components/config/MButton";
import { useTranslation } from "react-i18next";
import { Button, Checkbox, Collapse, Popover } from "antd";
import MTextArea from "@/app/components/config/MTextArea";
import { useRouter } from "next/navigation";
import { errorToast, successToast } from "@/app/components/toast/customToast";
import AddIcon from "@/app/components/icons/add.svg";
import Edit from "@/app/components/icons/edit-black.svg";
import { Input } from "antd";
import { EssayCandidateAnswer, EssayQuestionData } from "@/data/question";
import { CandidateAnswers } from "@/data/exam";
import { submitCheckingAnswer } from "@/services/api_services/result_exam_api";
import { parseInt } from "lodash";
import Link from "next/link";

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
  idExamTestResult,
  isComplete,
  loadAnswer,
  hidden,
}: {
  hidden?: boolean;
  isComplete?: boolean;
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
  idExamTestResult?: string;
  loadAnswer: Function;
}) {
  const { t } = useTranslation("exam");

  const [expanded, setExpanded] = useState<boolean>(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const [edit, setEdit] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [comment, setComment] = useState<string | undefined>(
    answers?.anwserScore?.evaluatorComment,
  );
  const [point, setPoint] = useState(
    (answers?.anwserScore?.score ?? 0)?.toString(),
  );
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
  function isFloat(n: any) {
    return n === +n && n !== (n | 0);
  }

  return (
    !hidden && (
      <div>
        {answers?.anwserScore?.evaluatorComment}
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
            {!(
              candidateAnswer?.anwserHtml ||
              (candidateAnswer?.idFiles &&
                candidateAnswer?.idFiles?.length != 0)
            ) && (
              <div className="text-m_warning_600 body_semibold_16">
                {t("empty_answer")}
              </div>
            )}
            <div
              dangerouslySetInnerHTML={{
                __html: candidateAnswer?.anwserHtml ?? "",
              }}
            ></div>
            {candidateAnswer?.idFiles?.map((s, i) => (
              <Link
                className="text-m_primary_500 underline underline-offset-4"
                key={s}
                href={`${process.env.NEXT_PUBLIC_API_STU}/api/studio/Document/download/${s}`}
              >
                File
              </Link>
            ))}
            {!edit &&
              !isComplete &&
              (candidateAnswer?.anwserHtml ||
                (candidateAnswer?.idFiles &&
                  candidateAnswer?.idFiles?.length != 0)) && (
                <div>
                  <div className="font-semibold pt-2">{t("comment")}</div>
                  <MTextArea
                    value={comment}
                    name="comment"
                    id="comment"
                    onChange={(e) => setComment(e.target.value?.trim())}
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
                        setPoint(e?.target?.value?.trim());
                      }}
                    />
                    <Button
                      disabled={isComplete}
                      onClick={async () => {
                        var val = isFloat(point?.trim())
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
            {(candidateAnswer?.anwserHtml ||
              (candidateAnswer?.idFiles &&
                candidateAnswer?.idFiles?.length != 0)) &&
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
          </Collapse.Panel>
        </Collapse>
      </div>
    )
  );
}
