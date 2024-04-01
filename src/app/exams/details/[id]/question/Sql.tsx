import React, { useMemo, useState } from "react";
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
import Tick from "@/app/components/icons/tick-circle.svg";
import { useRouter } from "next/navigation";
import { FormattedDate } from "react-intl";
import { deleteQuestionById } from "@/services/api_services/question_api";

export default function Sql({ examId, question, index, getData, questionGroup }: { examId: any, question: any, index: any, getData: any, questionGroup: any }) {
    const [openEditQuestion, setOpenEditQuestion] = useState(false)
    const [openCopyQuestion, setOpenCopyQuestion] = useState<boolean>(false);
    const [openDeleteQuestion, setOpenDeleteQuestion] = useState<boolean>(false);
    const [active, setActive] = useState("");
    const router = useRouter()
    const { t } = useTranslation('question')
    return (
        <div>
            <ConfirmModal
                onOk={async () => {
                    await deleteQuestionById(active);
                    setOpenDeleteQuestion(false);
                    await getData();
                }}
                onCancel={() => { setOpenDeleteQuestion(false) }}
                action={t("delete_question")}
                text={t("confirm_delete_question")}
                open={openDeleteQuestion}
            />
            <Collapse
                // key={v?.id}
                ghost
                expandIconPosition="end"
                className="rounded-lg bg-m_question overflow-hidden mb-4"
            >
                <Collapse.Panel
                    header={
                        <div className="my-3 flex justify-between items-center">
                            <div className="flex">
                                <span className="body_semibold_14">Câu {index}:<span className="body_regular_14 pl-2" dangerouslySetInnerHTML={{ __html: question?.question }} /></span>
                            </div>
                            <div className="min-w-28 pl-4">
                                <button onClick={(e) => {
                                    e.stopPropagation()
                                }}><EditIcon onClick={() => {
                                    router.push(`/exams/details/${examId}/edit?questId=${question.id}`);
                                }} />
                                    <BaseModal
                                        width={564}
                                        onCancel={() => { setOpenEditQuestion(false) }}
                                        title={t("edit_question")}
                                        open={openEditQuestion}
                                    >
                                        <MInput
                                            // formik={formik}
                                            id="name"
                                            name="name"
                                            title={t("name")}
                                            required
                                        />
                                        <MTextArea
                                            // formik={formik}
                                            id="note"
                                            name="note"
                                            title={t("note")}
                                        />
                                        <div className="w-full flex justify-center mt-7">
                                            <MButton
                                                className="w-36"
                                                type="secondary"
                                                text={t("cancel")}
                                                onClick={() => { setOpenEditQuestion(false) }}
                                            />
                                            <div className="w-5" />
                                            <MButton
                                                // loading={loading}
                                                htmlType="submit"
                                                className="w-36"
                                                text={t("update")}
                                            />
                                        </div>
                                    </BaseModal>
                                </button>
                                <button className="px-2" onClick={(e) => {
                                    e.stopPropagation()
                                }}><CopyIcon onClick={() => {
                                    setOpenCopyQuestion(true)
                                }} />
                                    <ConfirmModal
                                        onOk={() => { }}
                                        onCancel={() => { setOpenCopyQuestion(false) }}
                                        action={t("copy")}
                                        text={t("confirm_copy")}
                                        open={openCopyQuestion}
                                    />
                                </button>
                                <button onClick={(e) => {
                                    e.stopPropagation()
                                }}><DeleteRedIcon onClick={() => {
                                    setOpenDeleteQuestion(true);
                                    setActive(question.id);
                                }} />
                                </button>
                            </div>
                        </div>
                    }
                    key={""}>
                    <div className="h-[1px] bg-m_primary_200 mb-3" />
                    <div className="text-m_primary_500 text-sm font-semibold mb-2">
                        Thông tin câu hỏi
                    </div>
                    <div className="flex">
                        <div className="text-sm pr-2 font-semibold">
                            Nhóm câu hỏi:{" "}
                        </div>
                        <span>{questionGroup?.name}</span>
                    </div>
                    <div className="flex">
                        <div className="text-sm pr-2 font-semibold">
                            Kiểu câu hỏi:{" "}
                        </div>
                        <span>{t(question?.questionType)}</span>
                    </div>
                    <div className="flex">
                        <div className="text-sm pr-2 font-semibold">
                            Điểm:{" "}
                        </div>
                        <span>{question.numberPoint}</span>
                    </div>
                    <div className="flex">
                        <div className="text-sm pr-2 font-semibold">
                            Ngày tạo:{" "}
                        </div>
                        <FormattedDate
                            value={question?.createdTime}
                            day="2-digit"
                            month="2-digit"
                            year="numeric"
                        />
                    </div>
                </Collapse.Panel>
            </Collapse>
        </div >
    )
}
