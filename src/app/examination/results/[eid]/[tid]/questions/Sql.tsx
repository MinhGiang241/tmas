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
import {
  deleteQuestionById,
  duplicateQuestion,
} from "@/services/api_services/question_api";
import { errorToast, successToast } from "@/app/components/toast/customToast";
import { APIResults } from "@/data/api_results";
import AddIcon from "@/app/components/icons/add.svg";
import CodeMirror from "@uiw/react-codemirror";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { renderExtension } from "@/services/ui/coding_services";
import { Label } from "recharts";
import { CandidateAnswers } from "@/data/exam";

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
}: {
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
}) {
  const [openEditQuestion, setOpenEditQuestion] = useState(false);
  const [openCopyQuestion, setOpenCopyQuestion] = useState<boolean>(false);
  const [openDeleteQuestion, setOpenDeleteQuestion] = useState<boolean>(false);

  const router = useRouter();
  const { t } = useTranslation("exam");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [dupLoading, setDupLoading] = useState(false);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const containerRef = useRef(null);
  const contentRef = useRef(null);

  var candidateAnswer: any | undefined = !answers?.candidateAnswerJson
    ? undefined
    : JSON.parse(answers?.candidateAnswerJson ?? "");

  console.log("candidateAnswer sql", candidateAnswer);
  console.log("sql ans", answers);
  console.log("que sql", question);

  const columns = [
    {
      title: "Cột 1",
      dataIndex: "Testcase1",
      key: "Testcase1",
    },
    {
      title: "Cột 2",
      dataIndex: "Testcase2",
      key: "Testcase2",
    },
    {
      title: "Cột 3",
      dataIndex: "Testcase3",
      key: "Testcase3",
    },
    {
      title: "Cột 4",
      dataIndex: "Testcase4",
      key: "Testcase4",
    },
  ];

  const data = [
    {
      key: "1",
      Testcase1: "abc",
      Testcase2: "abc",
      Testcase3: <div>2024-05-12 18:05:30</div>,
      Testcase4: "10",
    },
  ];

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
        // key={v?.id}
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
          key={""}
        >
          <div className="h-[1px] bg-m_primary_200 mb-3" />
          <div className="bg-m_neutral_100 p-3 font-semibold text-sm rounded-lg">
            {"my SQl"}
          </div>
          <CodeMirror
            onBlur={async () => {}}
            // value={code}
            // lang={lang}
            theme={dracula}
            height="300px"
            extensions={[renderExtension("SQL") as any]}
            onChange={(v) => {}}
          />
          <div className="pt-3">
            <div className="flex pb-2">
              <div className="pr-2 font-semibold text-sm">{t("result")}</div>
              <Tick />
            </div>
            <Table columns={columns} dataSource={data} pagination={false} />
          </div>
          <div className="py-3">
            <div className="pr-2 font-semibold text-sm pb-2">
              {t("result0")}
            </div>
            <Table columns={columns} dataSource={data} pagination={false} />
          </div>
          <div>
            <div className="text-m_primary_500 text-sm font-semibold my-2">
              {t("explain_result")}
            </div>
            <div dangerouslySetInnerHTML={{ __html: "" }} />
          </div>
          {/* <div className="text-m_primary_500 text-sm font-semibold mb-2">
            {t("quest_info")}
          </div> */}
          {/* <div className="flex">
            <div className="text-sm pr-2 font-semibold">
              {t("quest_group")}:
            </div>
            <span>{questionGroup?.name}</span>
          </div>
          <div className="flex">
            <div className="text-sm pr-2 font-semibold">{t("quest_type")}:</div>
            <span>{t(question?.questionType)}</span>
          </div>
          <div className="flex">
            <div className="text-sm pr-2 font-semibold">{t("point")}: </div>
            <span>{question?.numberPoint}</span>
          </div>
          <div className="flex">
            <div className="text-sm pr-2 font-semibold">
              {t("created_date")}:{" "}
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
          </div> */}
        </Collapse.Panel>
      </Collapse>
    </div>
  );
}
