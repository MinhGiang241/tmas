import React, { useEffect, useMemo, useRef, useState } from "react";
import MButton from "@/app/components/config/MButton";
import { useTranslation } from "react-i18next";
import { Checkbox, Collapse, Popover } from "antd";
import { FormattedDate, FormattedTime } from "react-intl";
import AddIcon from "@/app/components/icons/add.svg";

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
  const { t } = useTranslation("question");
  // console.log(examId);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  // console.log(questionGroup, "questionGroup");
  // console.log(question, "question");

  useEffect(() => {
    setIsOverflowing(
      ((contentRef as any).current?.scrollHeight ?? 0) >
        ((containerRef as any).current?.clientHeight ?? 0) && !expanded
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div>
      <Collapse
        // key={key}
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
                  {`${t("quest")} ${index}`}:
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
            <div className="body_semibold_14 pr-2">{t("quest_group")}: </div>
            <span>{questionGroup?.name}</span>
          </div>
          <div className="flex">
            <div className="body_semibold_14 pr-2">{t("quest_type")}: </div>
            <span>
              {/* {t(question?.questionType)} */}
              Kiểu câu coding
            </span>
          </div>
          <div className="flex">
            <div className="body_semibold_14 pr-2">{t("point")}: </div>
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
      {/* {data?.examQuestions?.map((x: any, key: any) => (
            ))} */}
    </div>
  );
}
