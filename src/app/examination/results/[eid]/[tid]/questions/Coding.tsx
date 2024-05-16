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
import { useRouter } from "next/navigation";
import {
  createAExamQuestionPart,
  getExamQuestionPartList,
  deleteQuestionPartById,
  deleteQuestionById,
  CopyQuestion,
  updateAExamQuestionPart,
  deleteQuestionPart,
  duplicateQuestion,
} from "@/services/api_services/question_api";
import { FormattedDate, FormattedTime } from "react-intl";
import { errorToast, successToast } from "@/app/components/toast/customToast";
import { APIResults } from "@/data/api_results";
import AddIcon from "@/app/components/icons/add.svg";
import dayjs from "dayjs";
import { title } from "process";
import { result } from "lodash";
import Close from "@/app/components/icons/close-circle.svg"
import Tick from "@/app/components/icons/tick-circle.svg";
import CodeMirror from "@uiw/react-codemirror";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { renderExtension } from "@/services/ui/coding_services";

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
  const columns = [
    {
      title: 'Testcase',
      dataIndex: 'Testcase',
      key: 'Testcase',
    },
    {
      title: 'Đầu vào',
      dataIndex: 'input',
      key: 'input',
    },
    {
      title: 'Đầu ra',
      dataIndex: 'output',
      key: 'output',
    },
    {
      title: 'Kết quả',
      dataIndex: 'result',
      key: 'result',
    },
  ];

  const data = [
    {
      key: '1',
      Testcase: 'Testcase1',
      input: (<a href="/">Linktext</a>),
      output: (<a href="/">Linktext</a>),
      result: (<div><Close /><Tick /></div>)
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
                  )}{" "}
                  {`${t("question")} 5`}:
                  {/* <div
                    ref={contentRef}
                    className="body_regular_14 pl-2"
                    dangerouslySetInnerHTML={{ __html: question?.question }}
                  /> */}
                  <div className="text-sm font-normal">Câu hỏi coding</div>
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
            <div className="flex justify-between items-center pt-4">
              <div className="flex">Điểm: <div className="pl-1 font-semibold">1/1</div></div>
              <div className="flex">Cách chấm: <div className="pl-1 font-semibold">Toàn bộ</div></div>
              <div className="flex">Tổng số cặp: <div className="pl-1 font-semibold">3</div></div>
              <div className="flex">Số cặp ghép đúng: <div className="pl-1 font-semibold">3</div></div>
              <div className="flex">Số cặp ghép đúng: <div className="pl-1 font-semibold">3</div></div>
            </div>
            <CodeMirror
              onBlur={async () => {

              }}
              // value={code}
              // lang={lang}
              theme={dracula}
              height="300px"
              extensions={[renderExtension("javascript") as any]}
              onChange={(v) => {

              }}
            />
          </div>
        </Collapse.Panel>
      </Collapse>
      {/* {data?.examQuestions?.map((x: any, key: any) => (
            ))} */}
    </div>
  );
}
