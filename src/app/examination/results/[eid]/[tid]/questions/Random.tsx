import { Checkbox, Collapse } from "antd";
import React, { useEffect, useRef, useState } from "react";
import DeleteRedIcon from "@/app/components/icons/trash-red.svg";
import EditIcon from "@/app/components/icons/edit-black.svg";
import CopyIcon from "@/app/components/icons/size.svg";
import { useTranslation } from "react-i18next";
import { FormattedDate, FormattedTime } from "react-intl";
import { useRouter } from "next/navigation";
import ConfirmModal from "@/app/components/modals/ConfirmModal";
import {
  deleteQuestionById,
  duplicateQuestion,
} from "@/services/api_services/question_api";
import { errorToast, successToast } from "@/app/components/toast/customToast";
import { APIResults } from "@/data/api_results";
import AddIcon from "@/app/components/icons/add.svg";
import MButton from "@/app/components/config/MButton";
import { RandomQuestionData } from "@/data/question";

function Random({
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
  question?: RandomQuestionData;
  index?: any;
  questionGroup?: any;
  tmasQuest?: boolean;
  addExamBank?: Function;
  canCheck?: boolean;
  onChangeCheck?: Function;
}) {
  const router = useRouter();
  const { t } = useTranslation("question");
  const [expanded, setExpanded] = useState<boolean>(false);

  const [isOverflowing, setIsOverflowing] = useState(false);
  const containerRef = useRef(null);
  const contentRef = useRef(null);

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
        key={question?.id}
        ghost
        expandIconPosition="end"
        className="mb-3 rounded-lg bg-m_question overflow-hidden"
      >
        <Collapse.Panel
          header={
            <div className="my-3 flex justify-between items-center">
              <div className="flex">
                <span className="body_semibold_14">
                  {canCheck && (
                    <Checkbox
                      onChange={onChangeCheck as any}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      value={question?.id}
                    />
                  )}{" "}
                  {`${t("question")} 8`}:
                  <span
                    className="body_regular_14 pl-2"
                    dangerouslySetInnerHTML={{
                      __html: question?.question ?? "",
                    }}
                  />
                </span>
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
        </Collapse.Panel>
      </Collapse>
    </div>
  );
}

export default Random;
