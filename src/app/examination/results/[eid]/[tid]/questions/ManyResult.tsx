/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import MButton from "@/app/components/config/MButton";
import { useTranslation } from "react-i18next";
import { Checkbox, Collapse } from "antd";
import Tick from "@/app/components/icons/tick-circle.svg";
import OutlineTick from "@/app/components/icons/outline-tick.svg";
import Close from "@/app/components/icons/close-circle.svg";
import { useRouter } from "next/navigation";

import AddIcon from "@/app/components/icons/add.svg";
import { MultiAnswerQuestionData, MultiCandidateAnswer } from "@/data/question";
import { CandidateAnswers } from "@/data/exam";

export default function ManyResult({
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
}: {
  hidden?: boolean;
  examId?: any;
  question?: MultiAnswerQuestionData;
  index?: any;
  getData?: any;
  questionGroup?: any;
  tmasQuest?: boolean;
  addExamBank?: Function;
  onChangeCheck?: Function;
  canCheck?: boolean;
  answers?: CandidateAnswers;
}) {
  const router = useRouter();
  const { t } = useTranslation("question");
  var candidateAnswer: MultiCandidateAnswer | undefined =
    !answers?.candidateAnswerJson
      ? undefined
      : JSON.parse(answers?.candidateAnswerJson ?? "");

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
    !hidden && (
      <div>
        <Collapse
          // key={key}
          defaultActiveKey={["1"]}
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
                    )}
                    {`${t("question")} ${index + 1}`}:
                    <div
                      ref={contentRef}
                      className={`body_regular_14 pl-2 `}
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
            <div className="flex">
              <div className="w-full">
                <div className="text-m_primary_500 text-sm font-semibold mb-2 pl-6">
                  {t("result")}
                </div>
                <div>
                  <div>
                    {question?.content?.answers?.map((x, key: any) =>
                      !x.isCorrectAnswer ? (
                        <div className="flex" key={key}>
                          {candidateAnswer?.answers?.some(
                            (u) => u.label == x.label,
                          ) ? (
                            <Close className="min-w-5" />
                          ) : (
                            <div className="min-w-5" />
                          )}

                          <div className="body_semibold_14 pl-1">{x.label}</div>
                          <div
                            className="body_regular_14 pl-2"
                            dangerouslySetInnerHTML={{ __html: x.text ?? "" }}
                          />
                        </div>
                      ) : (
                        <div className="flex" key={key}>
                          {candidateAnswer?.answers?.some(
                            (u) => u.label == x.label,
                          ) ? (
                            <Tick className="min-w-5" />
                          ) : (
                            <OutlineTick className="min-w-5" />
                          )}
                          {/* <Tick className="min-w-5" /> */}
                          <div className="body_semibold_14 pl-1">{x.label}</div>
                          <div
                            className="body_regular_14 pl-2 pr-2"
                            dangerouslySetInnerHTML={{ __html: x.text ?? "" }}
                          />
                        </div>
                      ),
                    )}
                  </div>
                </div>
                <div className="pl-6">
                  <div className="text-m_primary_500 text-sm font-semibold mb-2 mt-2">
                    {t("explain_result")}
                  </div>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: question?.content?.explainAnswer ?? "",
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </Collapse.Panel>
        </Collapse>
        {/* </Collapse.Panel> */}
      </div>
    )
  );
}
