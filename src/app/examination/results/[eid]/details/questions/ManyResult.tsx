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
import Close from "@/app/components/icons/close-circle.svg"
import { useRouter } from "next/navigation";
import { FormattedDate, FormattedTime } from "react-intl";
import {
  deleteQuestionById,
  duplicateQuestion,
} from "@/services/api_services/question_api";
import { errorToast, successToast } from "@/app/components/toast/customToast";
import { APIResults } from "@/data/api_results";
import AddIcon from "@/app/components/icons/add.svg";

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
}: {
  examId?: any;
  question?: any;
  index?: any;
  getData?: any;
  questionGroup?: any;
  tmasQuest?: boolean;
  addExamBank?: Function;
  onChangeCheck?: Function;
  canCheck?: boolean;
}) {

  const router = useRouter();
  const { t } = useTranslation("question");

  const [expanded, setExpanded] = useState<boolean>(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  // console.log("question", question);
  // console.log("questionGroup", questionGroup);


  useEffect(() => {
    setIsOverflowing(
      ((contentRef as any).current?.scrollHeight ?? 0) >
      ((containerRef as any).current?.clientHeight ?? 0) && !expanded,
    );
  }, []);
  return (
    <div>
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
                  className={`body_semibold_14 ${expanded ? "" : `max-h-10 overflow-hidden  text-ellipsis`
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
                  {`${t("quest")} 1`}
                  :
                  {/* <div
                    ref={contentRef}
                    className={`body_regular_14 pl-2 `}
                    dangerouslySetInnerHTML={{ __html: question?.question }}
                  /> */}
                  <div>Nhiều đáp án</div>
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
            <div className="w-full">
              <div className="text-m_primary_500 text-sm font-semibold mb-2">
                {t("result")}
              </div>
              <div>
                <div>
                  {/* {question?.content?.answers?.map((x: any, key: any) =>
                    x.isCorrectAnswer === false ? (
                      <div className="flex" key={key}>
                        <div className="body_semibold_14">{x.label}</div>
                        <div
                          className="body_regular_14 pl-2"
                          dangerouslySetInnerHTML={{ __html: x.text }}
                        />
                      </div>
                    ) : (
                      <div className="flex" key={key}>
                        <div className="body_semibold_14 text-green-500">
                          {x.label}
                        </div>
                        <div
                          className="body_regular_14 pl-2 text-green-500 pr-2"
                          dangerouslySetInnerHTML={{ __html: x.text }}
                        />
                        <Tick />
                      </div>
                    ),
                  )} */}
                  <div className="flex">
                    <Tick />
                    <div className="font-bold pr-2 pl-1">A.</div>
                    <div>2</div>
                  </div>
                  <div className="flex">
                    <Close />
                    <div className="font-bold pr-2 pl-1">B.</div>
                    <div>3</div>
                  </div>
                </div>
              </div>
              <div className="text-m_primary_500 text-sm font-semibold mb-2 mt-2">
                Giải thích đáp án
              </div>
              <div>Vì 1+1=2. Bấm máy tính thì biết</div>
            </div>
          </div>
        </Collapse.Panel>
      </Collapse>
      {/* </Collapse.Panel> */}
    </div>
  );
}
