import toast from "react-hot-toast";
import {
  CloseOutlined,
  CloseCircleFilled,
  CheckCircleFilled,
} from "@ant-design/icons";
import MButton from "../config/MButton";
import { useTranslation } from "react-i18next";

enum ToastType {
  SUCCESS,
  ERROR,
}

const SuccessToast = ({
  type,
  content,
  c,
}: {
  type: ToastType;
  content: string;
  c: any;
}) => {
  const { t } = useTranslation();
  return (
    <div
      className={`${
        c.visible ? "animate-enter" : "animate-leave"
      } max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 justify-center`}
    >
      <div className="px-10 w-full relative">
        <div className="flex justify-center mt-6 mb-4">
          {type == ToastType.SUCCESS && (
            <CheckCircleFilled className="text-[5rem] text-m_success_500" />
          )}
          {type == ToastType.ERROR && (
            <CloseCircleFilled className="text-[5rem] text-m_error_500" />
          )}
        </div>
        <div className="flex flex-col text-center text-wrap">
          <h4 className="body_semibold_20 mb-2 overflow-hidden">
            {type == ToastType.SUCCESS ? t("success") : t("fail")}
          </h4>
          <p className="overflow-hidden">{content}</p>
        </div>
        <div className="flex justify-center my-6">
          <MButton
            className="h-12"
            text={t("close")}
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
  );
};

export const successToast = (content: string) => {
  toast.custom((e) => (
    <SuccessToast type={ToastType.SUCCESS} content={content} c={e} />
  ));
};

export const errorToast = (content: string) => {
  toast.custom((e) => (
    <SuccessToast type={ToastType.ERROR} content={content} c={e} />
  ));
};
