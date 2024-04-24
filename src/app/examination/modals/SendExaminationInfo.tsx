import {
  rowEndStyle,
  rowStartStyle,
  rowStyle,
} from "@/app/account/account-info/AccountInfo";
import BaseModal, { BaseModalProps } from "@/app/components/config/BaseModal";
import MInput from "@/app/components/config/MInput";
import { Pagination, Select, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import dynamic from "next/dynamic";
import React, { HTMLAttributes, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import TrashIcon from "@/app/components/icons/trash.svg";
import EyeIcon from "@/app/components/icons/eye.svg";
import PushIcon from "@/app/components/icons/push.svg";
import AddCircleIcon from "@/app/components/icons/add-circle.svg";
import { FormattedDate } from "react-intl";
import dayjs from "dayjs";
import MButton from "@/app/components/config/MButton";
import ContentDetailsModal from "./ContentDetailsModal";
import AddReceiptInfo from "./AddReceiptInfo";
import ImportReceipterList from "./ImportReceipterList";
import MDropdown from "@/app/components/config/MDropdown";
import { useOnMountUnsafe } from "@/services/ui/useOnMountUnsafe";
import {
  deleteRemindMail,
  getTemplateSendMail,
  loadRemindMailList,
  sendRemindEmail,
} from "@/services/api_services/examination_api";
import { errorToast, successToast } from "@/app/components/toast/customToast";
import { ExaminationData, RemindEmailData } from "@/data/exam";
import { functions, method } from "lodash";
import _ from "lodash";

const EditorHook = dynamic(
  () => import("@/app/exams/components/react_quill/EditorWithUseQuill"),
  {
    ssr: false,
  },
);

interface Props extends BaseModalProps {
  examination?: ExaminationData;
}
const dateFormat = "DD/MM/YYYY HH:mm";

function SendExaminationInfo(props: Props) {
  const { t } = useTranslation("exam");
  const common = useTranslation();
  const [indexPage, setIndexPage] = useState<number>(1);
  const [recordNum, setRecordNum] = useState<number>(15);
  const [total, setTotal] = useState<number>(0);
  const [search, setSearch] = useState<string | undefined>();
  const [active, setActive] = useState<any>();
  const [openDetal, setOpenDetail] = useState<boolean>(false);
  const [openAddInfo, setOpenAddInfo] = useState<boolean>(false);
  const [openImport, setOpenImport] = useState<boolean>(false);
  const [template, setTemplate] = useState<string | undefined>();
  const [loadTemplate, setLoadTemplate] = useState<boolean>(false);
  const [emails, setEmails] = useState<RemindEmailData[]>([]);
  useOnMountUnsafe(() => {
    getTemplateMail();
  });
  const getTemplateMail = async () => {
    var res = await getTemplateSendMail();

    console.log("res", res);

    if (res?.code != 0) {
      return;
    }
    setTemplate(res?.data);
    setSendContent(res?.data);
  };

  const columns: ColumnsType<any> = [
    {
      onHeaderCell: (_) => rowStartStyle,
      width: "30%",
      title: (
        <div className="w-full flex justify-start">{t("personal_info")}</div>
      ),
      dataIndex: "email",
      key: "email",
      render: (text, data) => (
        <p key={text} className="w-full  min-w-11 break-all caption_regular_14">
          {text}
        </p>
      ),
    },
    {
      onHeaderCell: (_) => rowStyle,
      width:
        props.examination?.accessCodeSettingType != "MultiCode" &&
        props.examination?.sharingSetting != "Private"
          ? "0%"
          : "20%",
      title: (
        <div
          className={`w-full break-all  ${
            props.examination?.accessCodeSettingType === "MultiCode" &&
            props.examination?.sharingSetting != "Private"
              ? "flex"
              : "hidden"
          } justify-start`}
        >
          {t("approve_code")}
        </div>
      ),
      dataIndex: "passcode",
      key: "passcode",
      render: (text) => (
        <p
          key={text}
          className={` ${
            props.examination?.accessCodeSettingType != "MultiCode" &&
            props.examination?.sharingSetting != "Private"
              ? "hidden"
              : "flex"
          } w-full break-all min-w-11 justify-start caption_regular_14`}
        >
          {text}
        </p>
      ),
    },

    {
      onHeaderCell: (_) => rowStyle,
      width:
        props.examination?.accessCodeSettingType != "MultiCode" &&
        props.examination?.sharingSetting != "Private"
          ? "30%"
          : "20%",
      title: <div className="w-full flex justify-start">{t("status")}</div>,
      dataIndex: "status",
      key: "status",
      render: (text) => (
        <p
          key={text}
          className="w-full  break-all  flex  min-w-11 justify-start caption_regular_14"
        >
          {text == "Pending" ? t("Pending_2") : t(text)}
        </p>
      ),
    },

    {
      onHeaderCell: (_) => rowStyle,
      width:
        props.examination?.accessCodeSettingType != "MultiCode" &&
        props.examination?.sharingSetting != "Private"
          ? "30%"
          : "20%",
      title: <div className="w-full flex justify-start">{t("send_time")}</div>,
      dataIndex: "sentTime",
      key: "sentTime",
      render: (text) => (
        <p
          key={text}
          className="w-full  break-all  flex  min-w-11 justify-start caption_regular_14"
        >
          {text ? dayjs(text).format(dateFormat) : ""}
        </p>
      ),
    },
    {
      onHeaderCell: (_) => rowEndStyle,
      width: "10%",
      title: (
        <div className="w-full  flex justify-center">{common.t("action")}</div>
      ),
      dataIndex: "schema",
      key: "schema",
      render: (action, data) => (
        <div className="w-full flex justify-center ">
          <button
            className="ml-2"
            onClick={() => {
              setActive(data);
              setOpenDetail(true);
            }}
          >
            <EyeIcon />
          </button>

          <button
            className="ml-2"
            onClick={async () => {
              if (data.status == "New") {
                var cloneEmails = _.cloneDeep(emails);
                var indexDelete = cloneEmails.findIndex(
                  (e) => e._id === data._id,
                );
                cloneEmails.splice(indexDelete, 1);
                setEmails([...cloneEmails]);
                successToast(t("success_delete_email"));
                console.log("cloneEmails", cloneEmails);
              } else {
                const res = await deleteRemindMail(data?._id);
                if (res?.code != 0) {
                  return;
                }
                setEmails([]);
                successToast(t("success_delete_email"));
                getEmailList();
              }
              setActive(data);
            }}
          >
            <TrashIcon />
          </button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    var id: any;
    if (props.open) {
      getEmailList();
      id = setInterval(() => {
        getEmailList();
      }, 5000);
    }
    return () => {
      clearInterval(id);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.open, props.examination]);

  const [sendEmailLoading, setSendEmailLoading] = useState<boolean>(false);
  const [sendContent, setSendContent] = useState<string | undefined>();
  const [mailList, setMailList] = useState<RemindEmailData[]>([]);
  const [media, setMedia] = useState("email");

  const getEmailList = async () => {
    const res = await loadRemindMailList(props.examination?.id);
    console.log("res list", res);
    if (res?.code != 0) {
      return;
    }
    setMailList(res?.data);
    setTotal(
      _.filter([...emails, ...mailList], (n: RemindEmailData) => {
        if (search) {
          return (
            n.email?.toLowerCase().includes(search?.toLowerCase()) ||
            n.passcode?.toLowerCase().includes(search?.toLowerCase())
          );
        }
        return true;
      })?.length,
    );
  };

  const sendEmail = async () => {
    setSendEmailLoading(true);
    const res = await sendRemindEmail({
      maillist: [
        ...emails.map((t) => ({
          email: t.email,
          passcode: t.passcode,
        })),
      ],
      methods: media,
      examtestId: props.examination?.id,
      body: sendContent,
    });
    setSendEmailLoading(false);
    if (res.code != 0) {
      errorToast(res?.message ?? "");
      return;
    }
    setEmails([]);
    successToast(t("success_send_remind"));
    getEmailList();
  };
  return (
    <BaseModal {...props} width={1027}>
      <ImportReceipterList
        title={t("import_receipter_list")}
        onCancel={() => {
          setOpenImport(false);
        }}
        onOk={(newEmails: RemindEmailData[]) => {
          setEmails([...newEmails, ...emails]);
          setOpenImport(false);
        }}
        open={openImport}
        width={705}
      />
      <AddReceiptInfo
        examination={props.examination}
        addInfo={(info: RemindEmailData) => {
          setEmails([info, ...emails]);
        }}
        width={564}
        title={t("add_info_receipter")}
        open={openAddInfo}
        onCancel={() => {
          setOpenAddInfo(false);
        }}
        onOk={(value: RemindEmailData) => {
          setEmails([value, ...emails]);
          setOpenAddInfo(false);
        }}
      />
      <ContentDetailsModal
        data={active}
        open={openDetal}
        width={564}
        title={t("detail")}
        onCancel={() => setOpenDetail(false)}
        onOk={() => {
          setOpenDetail(false);
        }}
      />
      <div className="w-full">
        <div className="title_bold_24 text-center w-full mt-3">
          {t("send_exam_info")}
        </div>
        <MDropdown
          allowClear={false}
          value={media}
          setValue={(name: any, val: any) => {
            setMedia(val);
          }}
          className="dropdown-flex"
          options={[
            { value: "email", label: "Email" },
            { value: "sms", label: "SMS" },
          ]}
          id="media"
          name="media"
          title={t("media")}
          placeholder={t("media")}
        />
        <EditorHook
          defaultValue={template}
          value={sendContent}
          setValue={(name: any, val: any) => {
            setSendContent(val);
          }}
          isCount={false}
          id="send_content"
          name="send_content"
          title={t("send_content")}
        />
        <div className="mt-2 body_semibold_14 flex items-center justify-between">
          <div>{t("receipt_info_list")}</div>
          <div className="flex items-center w-1/3">
            <MInput
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setTotal(
                  _.filter([...emails, ...mailList], (n: RemindEmailData) => {
                    if (e.target.value) {
                      return (
                        n.email
                          ?.toLowerCase()
                          .includes(e.target.value?.toLowerCase()) ||
                        n.passcode
                          ?.toLowerCase()
                          .includes(e.target.value?.toLowerCase())
                      );
                    }
                    return true;
                  })?.length,
                );
              }}
              isTextRequire={false}
              h="h-9"
              placeholder={t("enter_to_search")}
              id="info"
              name="info"
            />

            <div className="w-2" />
            <button
              onClick={() => {
                setOpenImport(true);
              }}
            >
              <PushIcon />
            </button>
            <div className="w-2" />
            <button
              onClick={() => {
                setOpenAddInfo(true);
              }}
            >
              <AddCircleIcon />
            </button>
          </div>
        </div>
        <div className="flex">
          <p className="body_regular-14 mr-3">
            {t("sending")}:
            <span className="body_semibold_14 ml-1">
              {mailList.filter((e) => e.status == "Pending").length}/
              {[...emails, ...mailList].length}
            </span>
          </p>
          <p className="body_regular-14 mr-3">
            {t("sent")}:{" "}
            <span className="body_semibold_14 ">
              {mailList.filter((e) => e.status == "Success").length}/
              {[...emails, ...mailList].length}
            </span>
          </p>
          <p className="body_regular-14 mr-3">
            {t("error")}:
            <span className="body_semibold_14 ml-1">
              {mailList.filter((e) => e.status == "Failure").length}/
              {[...emails, ...mailList].length}
            </span>
          </p>
        </div>
        <div className="max-lg:overflow-scroll">
          <Table
            className="w-full"
            bordered={false}
            columns={columns}
            dataSource={_.filter(
              [...emails, ...mailList],
              (n: RemindEmailData) => {
                if (search) {
                  return (
                    n.email?.toLowerCase().includes(search?.toLowerCase()) ||
                    n.passcode?.toLowerCase().includes(search?.toLowerCase())
                  );
                }
                return true;
              },
            )?.splice((indexPage - 1) * recordNum, recordNum)}
            pagination={false}
            rowKey={"id"}
            onRow={(data: any, index: any) =>
              ({
                style: {
                  background: "#FFFFFF",
                  borderRadius: "20px",
                },
              }) as HTMLAttributes<any>
            }
          />
        </div>
        <div className="w-full flex h-12 items-center  justify-center">
          <span className="body_regular_14 mr-2">{`${
            _.filter([...emails, ...mailList], (n: RemindEmailData) => {
              if (search) {
                return (
                  n.email?.toLowerCase().includes(search?.toLowerCase()) ||
                  n.passcode?.toLowerCase().includes(search?.toLowerCase())
                );
              }
              return true;
            })?.length ?? 0
          } ${t("result")}`}</span>
          <Pagination
            i18nIsDynamicList
            pageSize={recordNum}
            onChange={(v) => {
              setIndexPage(v);
            }}
            current={indexPage}
            total={total}
            showSizeChanger={false}
          />
          <div className="hidden ml-2 h-12 lg:flex items-center">
            <Select
              optionRender={(oriOption) => (
                <div className="flex justify-center">{oriOption?.label}</div>
              )}
              rootClassName="m-0 p-0"
              onChange={(v) => {
                setRecordNum(v);
              }}
              defaultValue={15}
              options={[
                ...[15, 25, 30, 50, 100].map((i: number) => ({
                  value: i,
                  label: (
                    <span className=" body_regular_14">{`${i}/${common.t(
                      "page",
                    )}`}</span>
                  ),
                })),
              ]}
              className="select-page min-w-[124px]"
            />
          </div>
        </div>
        <div className="w-full flex justify-center">
          <MButton
            loading={sendEmailLoading}
            onClick={sendEmail}
            h="h-9"
            className="w-[114px] "
            text={t("send")}
          />
        </div>
      </div>
    </BaseModal>
  );
}

export default SendExaminationInfo;
