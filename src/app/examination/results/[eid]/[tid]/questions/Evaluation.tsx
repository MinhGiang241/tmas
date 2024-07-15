import React, { useEffect, useMemo, useRef, useState } from "react";
import MButton from "@/app/components/config/MButton";
import { useTranslation } from "react-i18next";
import { Checkbox, Collapse } from "antd";
import { useRouter } from "next/navigation";
import { FormattedDate, FormattedTime } from "react-intl";
import AddIcon from "@/app/components/icons/add.svg";
import { CandidateAnswers } from "@/data/exam";
import { EvaluationAnswer, EvaluationCandidateAnswer } from "@/data/question";
import Tick from "@/app/components/icons/tick-circle.svg";
import OutlineTick from "@/app/components/icons/outline-tick.svg";
import Close from "@/app/components/icons/close-circle.svg";

export default function Evaluation({
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
  question?: EvaluationAnswer;
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

  const [expanded, setExpanded] = useState<boolean>(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  console.log("question", question);
  // console.log("questionGroup", questionGroup);
  var candidateAnswer: EvaluationCandidateAnswer | undefined =
    !answers?.candidateAnswerJson
      ? undefined
      : JSON.parse(answers?.candidateAnswerJson ?? "");
  console.log(candidateAnswer, "candidateAnswer");

  useEffect(() => {
    setIsOverflowing(
      ((contentRef as any).current?.scrollHeight ?? 0) >
        ((containerRef as any).current?.clientHeight ?? 0) && !expanded
    );
  }, []);
  return (
    !hidden && (
      <div>
        <Collapse
          defaultActiveKey={["1"]}
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
                    {`${t("quest")} ${index + 1}`}
                    :
                    <div
                      ref={contentRef}
                      className={`body_regular_14 pl-2 `}
                      dangerouslySetInnerHTML={{
                        __html: question?.question || "",
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
              <div className="text-m_primary_500 text-sm font-semibold mb-2">
                {t("result")}
              </div>
              <div className="w-5" />
              <div>
                <div>
                  {question?.content?.answers?.map((x, key: any) => {
                    const ans = candidateAnswer?.answers?.find(
                      (w) => w.label == x?.label
                    );
                    return (
                      <div className="flex" key={key}>
                        {candidateAnswer?.answers?.some(
                          (u) => u.label == x.label
                        ) ? (
                          <OutlineTick className="min-w-5" />
                        ) : (
                          <div className="min-w-5" />
                        )}

                        <div className="body_semibold_14 pl-1">{x.label}</div>
                        <div
                          className="body_regular_14 pl-2 w-40 overflow-hidden text-ellipsis"
                          dangerouslySetInnerHTML={{ __html: x.text ?? "" }}
                        />
                        <div className="">
                          <div>{x?.point} điểm</div>
                        </div>
                        {/* {ans && (
                          <div className="">
                            <div>{ans?.point} điểm</div>
                          </div>
                        )} */}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            {/* </div> */}
          </Collapse.Panel>
        </Collapse>
        {/* </Collapse.Panel> */}
      </div>
    )
  );
}
