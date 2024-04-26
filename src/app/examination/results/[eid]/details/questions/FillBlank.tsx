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
import Close from "@/app/components/icons/close-circle.svg"

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
}) {
  const [openEditQuestion, setOpenEditQuestion] = useState(false);
  const [openCopyQuestion, setOpenCopyQuestion] = useState<boolean>(false);
  const [openDeleteQuestion, setOpenDeleteQuestion] = useState<boolean>(false);
  const [dupLoading, setDupLoading] = useState(false);
  const [active, setActive] = useState("");
  const router = useRouter();
  const { t } = useTranslation("question");
  const [deleteLoading, setDeleteLoading] = useState(false);
  // console.log("question", question);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const containerRef = useRef(null);
  const contentRef = useRef(null);

  const columns = [
    {
      title: 'Chỗ trống',
      dataIndex: 'empty',
      key: 'empty',
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
      empty: '1',
      input: (
        <div className="flex">
          <div className="border flex justify-center mr-1 px-1">Sơn</div>
        </div>
      ),
      output: (
        <div className="flex">
          <div className="border flex justify-center mr-1 px-1">Sơn</div>
          <div className="border flex justify-center mr-1 px-1">Son</div>
          <div className="border flex justify-center mr-1 px-1">son</div>
        </div>
      ),
      result: (<div><Tick /><Close /></div>)
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
      <ConfirmModal
        loading={dupLoading}
        onOk={async () => {
          setDupLoading(true);
          var res: APIResults = await duplicateQuestion({
            newIdExamQuestionPart: question?.idExamQuestionPart,
            ids: [question?.id],
            idExams: examId ? [examId] : [],
          });
          setDupLoading(false);
          if (res.code != 0) {
            errorToast(res?.message ?? "");
            return;
          }
          successToast(t("sucess_duplicate_question"));
          setOpenCopyQuestion(false);
          router.push(
            `/exams/details/${examId ?? "u"}/edit?questId=${res?.data}`,
          );
          await getData();
        }}
        onCancel={() => {
          setOpenCopyQuestion(false);
        }}
        action={t("copy")}
        text={t("confirm_copy")}
        open={openCopyQuestion}
      />

      <ConfirmModal
        loading={deleteLoading}
        onOk={async () => {
          setDeleteLoading(true);
          var res = await deleteQuestionById(question?.id);
          setDeleteLoading(false);
          if (res.code != 0) {
            errorToast(res?.message ?? "");
            return;
          }
          successToast(t("success_delete_question"));
          setOpenDeleteQuestion(false);
          await getData();
        }}
        onCancel={() => {
          setOpenDeleteQuestion(false);
        }}
        action={t("delete_question")}
        text={t("confirm_delete_question")}
        open={openDeleteQuestion}
      />
      <Collapse
        // key={key}
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
                  {`${t("quest")} 6`}:
                  {/* <div
                    ref={contentRef}
                    className="body_regular_14 pl-2"
                    // dangerouslySetInnerHTML={{ __html: question?.content?.formatBlank,}}
                    dangerouslySetInnerHTML={{ __html: question?.content?.formatBlank }}
                  /> */}
                  <div>Điền vào chỗ trống</div>
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
          <div className="">
            <div>
              <Table columns={columns} dataSource={data} pagination={false} />
              <div className="flex justify-between items-center pt-4">
                <div className="flex">Điểm: <div className="pl-1 font-semibold">1/1</div></div>
                <div className="flex">Cách chấm: <div className="pl-1 font-semibold">Từng phần</div></div>
                <div className="flex">Tổng số chỗ trống: <div className="pl-1 font-semibold">3</div></div>
                <div className="flex">Số chỗ trống đúng: <div className="pl-1 font-semibold">3</div></div>
                <div className="flex">Số chỗ trống sai: <div className="pl-1 font-semibold">3</div></div>
              </div>
            </div>
          </div>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
}
