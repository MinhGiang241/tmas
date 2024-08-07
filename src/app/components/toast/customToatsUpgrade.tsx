import toast from "react-hot-toast";
import {
  CloseOutlined,
  CloseCircleFilled,
  CheckCircleFilled,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import MButton from "../config/MButton";
import { useTranslation } from "react-i18next";
import React from "react";

export enum ToastType {
  SUCCESS,
  ERROR,
  INFORM,
}

const CustomToast = ({
  type,
  content,
  c,
  namespace,
  text,
  node,
}: {
  type: ToastType;
  content?: string;
  c: any;
  namespace?: string;
  text?: string;
  node?: React.ReactNode;
}) => {
  const { t } = useTranslation("question");

  return (
    <>
      <div
        onMouseOver={() => {
          setTimeout(() => toast.dismiss(c.id), 5000);
        }}
        onClick={() => {
          toast.dismiss(c.id);
        }}
        className={`${
          c.visible ? "animate-enter_overlay" : "animate-leave_overlay"
        } relative w-full h-screen  flex justify-center bg-black/40`}
      >
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
          className={`${
            c.visible ? "animate-enter" : "animate-leave"
          } h-fit mt-40 relative max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 justify-center`}
        >
          <div className="p-5 w-full relative z-50">
            <div className="flex justify-center mt-6 mb-4">
              {type == ToastType.SUCCESS && (
                <CheckCircleFilled className="text-[5rem] text-m_success_500" />
              )}
              {type == ToastType.ERROR && (
                <CloseCircleFilled className="text-[5rem] text-m_error_500" />
              )}
              {type == ToastType.INFORM && (
                <ExclamationCircleFilled className="text-[5rem] text-m_warning_500" />
              )}
            </div>
            <div className="flex flex-col text-center">
              <h4 className="body_semibold_20 mb-2">
                {type == ToastType.SUCCESS
                  ? t("success")
                  : type === ToastType.ERROR
                    ? t("fail")
                    : t("notify")}
              </h4>
              <p>{content}</p>
            </div>
            <>{node}</>
            <div className="flex justify-center my-6">
              <MButton
                className="w-36"
                text={t("finished")}
                onClick={() => {
                  toast.dismiss(c.id);
                }}
              />
            </div>
            <button
              className="absolute right-3 top-3"
              onClick={() => toast.dismiss(c.id)}
            >
              <CloseOutlined />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export const modifyToast = (node: React.ReactNode, type: ToastType) => {
  toast.custom((e) => <CustomToast type={type} node={node} c={e} />);
};

