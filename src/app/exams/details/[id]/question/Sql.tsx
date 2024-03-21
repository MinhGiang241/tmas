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

export default function Sql() {
    const [openEditQuestion, setOpenEditQuestion] = useState(false)
    const [openCopyQuestion, setOpenCopyQuestion] = useState<boolean>(false);
    const [openDeleteQuestion, setOpenDeleteQuestion] = useState<boolean>(false);

    const { t } = useTranslation('question')
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
                            <div className="flex ">
                                <span className="body_semibold_14">Câu 3: <span className="body_regular_14">Viết một câu lệnh tạo database</span></span>

                            </div>
                            <div className="min-w-28">
                                <button onClick={(e) => {
                                    e.stopPropagation()
                                }}><EditIcon onClick={() => {
                                    setOpenEditQuestion(true)
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
                                    setOpenDeleteQuestion(true)
                                }} />
                                    <ConfirmModal
                                        onOk={() => { }}
                                        onCancel={() => { setOpenDeleteQuestion(false) }}
                                        action={t("delete_question")}
                                        text={t("confirm_delete_question")}
                                        open={openDeleteQuestion}
                                    />
                                </button>
                            </div>
                        </div>
                    }
                    key={""}>
                    <div className="h-[1px] bg-m_primary_200 mb-3" />
                    {/* <div className="flex"> */}
                    {/* <div className="w-1/2 p-4"> */}
                    <div className="text-m_primary_500 text-sm font-semibold mb-2">Thông tin câu hỏi</div>
                    <div className="flex">
                        <div className="body_semibold_14 pr-2">Nhóm câu hỏi: </div>
                        <span>Toán học</span>
                    </div>
                    <div className="flex">
                        <div className="body_semibold_14 pr-2">Kiểu câu hỏi: </div>
                        <span>SQL</span>
                    </div>
                    <div className="flex">
                        <div className="body_semibold_14 pr-2">Điểm: </div>
                        <span>1</span>
                    </div>
                    <div className="flex">
                        <div className="body_semibold_14 pr-2">Ngày tạo: </div>
                        <span>08/02/2024  20:20:09</span>
                    </div>
                    {/* </div> */}
                    {/* <div className="w-1/2 p-4">
                            <div className="text-m_primary_500 text-sm font-semibold mb-2">Đáp án</div>
                            <div className="flex items-center">
                                <div className="body_semibold_14 pr-2">A:</div><span className="pr-2">6 </span>
                                <Tick />
                            </div>
                        </div> */}
                    {/* </div> */}
                </Collapse.Panel>
            </Collapse>
        </div >
    )
}
