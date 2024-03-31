import React, { useEffect, useMemo, useRef, useState } from "react";
import MButton from "@/app/components/config/MButton";
import { useTranslation } from "react-i18next";
import { Collapse, Popover } from "antd";
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
} from "@/services/api_services/question_api";
import { FormattedDate } from "react-intl";

export default function Coding({ examId, question }: { examId: any, question: any }) {
    const [openEditQuestion, setOpenEditQuestion] = useState(false)
    const [openCopyQuestion, setOpenCopyQuestion] = useState<boolean>(false);
    const [openDeleteQuestion, setOpenDeleteQuestion] = useState<boolean>(false);
    const [active, setActive] = useState("");
    //
    const [data, setData] = useState<any>();
    //
    const router = useRouter()
    const { t } = useTranslation('question')

    const getData = async () => {
        const res = await getExamQuestionPartList({
            paging: { startIndex: 0, recordPerPage: 100 },
            // studioSorters: { name: "createdTime", isAsc: true },
            // ids: [params.id]
        });
        const data = res.data.records[0];
        console.log(data);
        if (data) {
            setData(data);
        }
        // if (data && data.records) {
        //   const filteredData = data.records.filter((x: any) => x.examQuestions.some((y: any) => y.idExamQuestionPart === x.id));
        //   console.log(filteredData, "filteredData");
        // }
    };
    useEffect(() => {
        getData();
    }, []);
    return (
        <div>
            <ConfirmModal
                onOk={() => { }}
                onCancel={() => { setOpenCopyQuestion(false) }}
                action={t("copy")}
                text={t("confirm_copy")}
                open={openCopyQuestion}
            />
            <ConfirmModal
                onOk={async () => {
                    await deleteQuestionById(active);
                    setOpenDeleteQuestion(false);
                    getData();
                }}
                onCancel={() => { setOpenDeleteQuestion(false) }}
                action={t("delete_question")}
                text={t("confirm_delete_question")}
                open={openDeleteQuestion}
            />
            {data?.examQuestions?.map((x: any, key: any) => (
                <Collapse
                    key={key}
                    ghost
                    expandIconPosition="end"
                    className="rounded-lg bg-m_question overflow-hidden mb-4"
                >
                    <Collapse.Panel
                        header={
                            <div className="my-3 flex justify-between items-center">
                                <div className="flex">
                                    <span className="body_semibold_14">Câu {key + 1}:<span className="body_regular_14 pl-2" dangerouslySetInnerHTML={{ __html: x?.question }} /></span>
                                </div>
                                <div className="min-w-28 pl-4">
                                    <button onClick={(e) => {
                                        e.stopPropagation()
                                    }}><EditIcon onClick={() => {
                                        router.push(`/exams/details/${examId}/edit?questId=${question.id}`);
                                    }} />
                                    </button>
                                    <button className="px-2" onClick={(e) => {
                                        e.stopPropagation()
                                    }}><CopyIcon onClick={() => {
                                        setOpenCopyQuestion(true)
                                    }} />
                                    </button>
                                    <button onClick={(e) => {
                                        e.stopPropagation()
                                    }}><DeleteRedIcon onClick={() => {
                                        setOpenDeleteQuestion(true)
                                        setActive(x.id);
                                        // getData();
                                    }} />
                                    </button>
                                </div>
                            </div>
                        }
                        key={""}>
                        <div className="h-[1px] bg-m_primary_200 mb-3" />
                        <div className="text-m_primary_500 text-sm font-semibold mb-2">Thông tin câu hỏi</div>
                        <div className="flex">
                            <div className="body_semibold_14 pr-2">Nhóm câu hỏi: </div>
                            <span>Toán học</span>
                        </div>
                        <div className="flex">
                            <div className="body_semibold_14 pr-2">Kiểu câu hỏi: </div>
                            <span>{x?.questionType}</span>
                        </div>
                        <div className="flex">
                            <div className="body_semibold_14 pr-2">Điểm: </div>
                            <span>{x.numberPoint}</span>
                        </div>
                        <div className="flex">
                            <div className="text-sm pr-2 font-semibold">
                                Ngày tạo:{" "}
                            </div>
                            <FormattedDate
                                value={x?.createdTime}
                                day="2-digit"
                                month="2-digit"
                                year="numeric"
                            />
                        </div>
                    </Collapse.Panel>
                </Collapse>
            ))}
        </div >
    )
}
