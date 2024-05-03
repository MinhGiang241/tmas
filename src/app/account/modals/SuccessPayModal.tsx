import BaseModal, { BaseModalProps } from "@/app/components/config/BaseModal";
import React, { ReactNode } from "react";
import {
  CloseOutlined,
  CloseCircleFilled,
  CheckCircleFilled,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import MButton from "@/app/components/config/MButton";

interface Props extends BaseModalProps {
  type: PayModalType;
  content?: ReactNode;
  actionType?: PayActionType;
}

export enum PayModalType {
  SUCCESS,
  ERROR,
}

export enum PayActionType {
  GOLD,
  PACKAGE,
}

function SuccessPayModal(props: Props) {
  const common = useTranslation("");
  const { t } = useTranslation("account");
  return (
    <BaseModal {...props}>
      <div className="px-10 w-full relative z-50">
        <div className="flex justify-center mt-6 mb-4">
          {props.type == PayModalType.SUCCESS && (
            <CheckCircleFilled className="text-[5rem] text-m_success_500" />
          )}
          {props.type == PayModalType.ERROR && (
            <CloseCircleFilled className="text-[5rem] text-m_error_500" />
          )}
        </div>
        <div className="flex flex-col text-center">
          <h4 className="body_semibold_20 mb-2">
            {props.type == PayModalType.SUCCESS
              ? t("pay_success")
              : props.type === PayModalType.ERROR
                ? t("pay_fail")
                : t("notify")}
          </h4>
          {props.content}
        </div>

        <div className="flex justify-center mt-5 mb-3">
          <MButton
            type="secondary"
            text={common.t("close")}
            className="h-12 w-36 "
            onClick={() => {
              props.onCancel();
            }}
          />
          <div className="w-5" />
          <MButton
            text={
              props.type == PayModalType.SUCCESS ? t("homepage") : t("repay")
            }
            className="h-12 w-36 bg-m_primary_500 text-white"
            onClick={() => {
              props.onOk!();
            }}
          />
        </div>
      </div>
    </BaseModal>
  );
}

export default SuccessPayModal;
