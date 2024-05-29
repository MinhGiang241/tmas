/* eslint-disable react-hooks/exhaustive-deps */
import {
  rowEndStyle,
  rowStartStyle,
  rowStyle,
} from "@/app/account/account-info/AccountInfo";
import BaseModal, { BaseModalProps } from "@/app/components/config/BaseModal";
import {
  Condition,
  ExamCompletionState,
  ExamTestResulstData,
  ExaminationData,
  RemindEmailData,
} from "@/data/exam";
import Table, { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import React, {
  HTMLAttributes,
  createRef,
  useEffect,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import EyeIcon from "@/app/components/icons/eye.svg";
import TrashIcon from "@/app/components/icons/trash.svg";
import MButton from "@/app/components/config/MButton";
import MDropdown from "@/app/components/config/MDropdown";
import { SettingData } from "@/data/user";
import { loadConfig } from "@/services/api_services/account_services";
import { useOnMountUnsafe } from "@/services/ui/useOnMountUnsafe";
import {
  getTemplateSendMail,
  getTemplateSendResultMail,
  loadRemindMailList,
  sendRemindEmail,
  sendResultEmail,
} from "@/services/api_services/examination_api";
import MInput from "@/app/components/config/MInput";
import { Pagination, Select, Tooltip } from "antd";
import { getPagingAdminExamTestResult } from "@/services/api_services/result_exam_api";
import { FormattedNumber } from "react-intl";
import { errorToast, successToast } from "@/app/components/toast/customToast";
import _ from "lodash";
import { useRouter } from "next/navigation";
import ContentDetailsModal from "./ContentDetailsModal";
import Link from "next/link";

interface Props extends BaseModalProps {
  examination?: ExaminationData;
}
const dateFormat = "DD/MM/YYYY HH:mm";
function SendExaminationResults(props: Props) {
  const { t } = useTranslation("exam");
  const common = useTranslation();
  const [indexPage, setIndexPage] = useState<number>(1);
  const [recordNum, setRecordNum] = useState<number>(15);
  const [total, setTotal] = useState<number>(0);
  const [search, setSearch] = useState<string | undefined>();
  const [active, setActive] = useState<any>();
  const [config, setConfig] = useState<SettingData | undefined>();
  const [media, setMedia] = useState("email");
  const [template, setTemplate] = useState<string | undefined>();
  const [sendLoading, setSendLoading] = useState<boolean>(false);
  const [openDetail, setOpenDetail] = useState<boolean>(false);
  var linkRef = useRef(null);

  const router = useRouter();

  const getSetting = async () => {
    var res = await loadConfig();
    if (res.code != 0) {
      return;
    }
    setConfig(res.data);
  };
  const getTemplateMail = async () => {
    var res = await getTemplateSendResultMail({
      name: props.examination?.name,
      start_time: props.examination?.validAccessSetting?.validFrom,
      end_time: props.examination?.validAccessSetting?.validTo,
    });
    if (res?.code != 0) {
      return;
    }
    setTemplate(res?.data?.body);
  };

  useOnMountUnsafe(() => {
    getSetting();
  });
  const [newData, setNewData] = useState<TableValue[]>([]);

  const getListResults = async () => {
    var res = await getPagingAdminExamTestResult({
      paging: {
        recordPerPage: 10000000, //recordNum,
        startIndex: 1,
      },
      filters: [
        {
          fieldName: "idExamTest",
          value: props.examination?.id,
          condition: Condition.eq,
        },
        // {
        //   fieldName: "result.completionState",
        //   value: ExamCompletionState.Done,
        //   condition: Condition.eq,
        // },
      ],
    });
    if (res.code != 0) {
      return;
    }
    var data: ExamTestResulstData[] = res.data?.records;
    var news = data?.map<TableValue>((e) => ({
      id: e.id,
      email: e?.candidate?.email,
      name: e?.candidate?.fullName,
      passcode: e?.candidate?.accessCode,
      point: e?.result?.score,
      point_status: e?.result?.passState,
      status: "New",
      time: e?.timeLine?.timeLines?.find((r) => r.eventType === "Start")
        ?.createTime,
      //TODO
      data: e,
    }));

    setNewData(news);
    setTotal(res?.data?.totalOfRecords);
    getEmailList(news);
  };

  useEffect(() => {
    var id: any;
    if (props.open) {
      getTemplateMail();
      getListResults();
      id = setInterval(() => {
        getListResults();
      }, 5000);
    }
    return () => {
      clearInterval(id);
    };
  }, [props.open, props.examination]);

  interface TableValue {
    id?: string;
    name?: string;
    email?: string;
    passcode?: string;
    time?: string;
    point?: number;
    status?: string;
    point_status?: string;
    send_time?: string;
    reason_error?: string;
    content_send?: string;
    data?: ExamTestResulstData;
  }
  const columns: ColumnsType<TableValue> = [
    {
      onHeaderCell: (_) => rowStartStyle,

      title: <div className="w-full flex justify-start">{t("name")}</div>,
      dataIndex: "name",
      key: "name",
      render: (text, data) => (
        <p key={text} className="w-full  min-w-11 break-all caption_regular_14">
          {text}
        </p>
      ),
    },

    {
      onHeaderCell: (_) => rowStyle,
      width: "20%",
      title: (
        <div className="w-full flex justify-start">{t("receipter_info")}</div>
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
      width: !(
        props.examination?.accessCodeSettingType === "MultiCode" &&
        props.examination?.sharingSetting == "Private"
      )
        ? "0%"
        : "20%",
      title: (
        <div
          className={`w-full break-all  ${
            !(
              props.examination?.accessCodeSettingType === "MultiCode" &&
              props.examination?.sharingSetting == "Private"
            )
              ? "hidden"
              : "flex"
          } justify-start`}
        >
          {t("access_code")}
        </div>
      ),
      dataIndex: "passcode",
      key: "passcode",
      render: (text) => (
        <p
          key={text}
          className={` ${
            !(
              props.examination?.accessCodeSettingType === "MultiCode" &&
              props.examination?.sharingSetting == "Private"
            )
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
      width: "20%",
      title: <div className="w-full flex justify-start">{t("join_date")}</div>,
      dataIndex: "time",
      key: "time",
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
      onHeaderCell: (_) => rowStyle,

      title: <div className="w-full flex justify-start">{t("point")}</div>,
      dataIndex: "point",
      key: "point",
      render: (text) => (
        <p
          key={text}
          className="w-full  break-all  flex  min-w-11 justify-start caption_regular_14"
        >
          <FormattedNumber
            value={text ?? 0}
            style="decimal"
            maximumFractionDigits={2}
          />
        </p>
      ),
    },
    {
      onHeaderCell: (_) => rowStyle,
      width: !(
        props.examination?.accessCodeSettingType === "MultiCode" &&
        props.examination?.sharingSetting == "Private"
      )
        ? "10%"
        : "10%",
      title: (
        <div className="w-full flex justify-start">{t("point_status")}</div>
      ),
      dataIndex: "point_status",
      key: "point_status",
      render: (text, data) => (
        <p
          key={text}
          className="w-full  break-all  flex  min-w-11 justify-start caption_regular_14"
        >
          {text == "Pass" ? t("pass") : ""}
        </p>
      ),
    },

    {
      onHeaderCell: (_) => rowStyle,
      width: !(
        props.examination?.accessCodeSettingType === "MultiCode" &&
        props.examination?.sharingSetting == "Private"
      )
        ? "10%"
        : "10%",
      title: <div className="w-full flex justify-start">{t("send_time")}</div>,
      dataIndex: "send_time",
      key: "send_time",
      render: (text) => (
        <p
          key={text}
          className="w-full  break-all  flex  min-w-11 justify-start caption_regular_14"
        >
          {text == "Pending"
            ? t("Pending_2")
            : dayjs(text).format("DD/MM/YYYY HH:mm")}
        </p>
      ),
    },
    {
      onHeaderCell: (_) => rowStyle,
      width: !(
        props.examination?.accessCodeSettingType === "MultiCode" &&
        props.examination?.sharingSetting == "Private"
      )
        ? "11%"
        : "11%",
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
      onHeaderCell: (_) => rowEndStyle,
      title: (
        <div className="w-full  flex justify-center">{common.t("action")}</div>
      ),
      dataIndex: "schema",
      key: "schema",
      render: (action, data) => {
        var ref = createRef<any>();
        return (
          <div className="w-full flex justify-start ">
            <Link
              target="_blank"
              ref={ref}
              href={`/examination/results/${props.examination?.id}/${data?.id}/`}
            />

            <button
              className="ml-2"
              onClick={() => {
                (ref?.current as any).click();
                // router.push(
                //   `/examination/results/${props.examination?.id}/${data?.id}/`,
                // );

                //setActive(data);
                //setOpenDetail(true);
              }}
            >
              <EyeIcon />
            </button>
            {/* {data?.status == "New" && ( */}
            {/*   <button className="ml-2" onClick={async () => {}}> */}
            {/*     <TrashIcon /> */}
            {/*   </button> */}
            {/* )} */}
          </div>
        );
      },
    },
  ];

  const handleSendMail = async (e: any) => {
    setSendLoading(true);
    const res = await sendResultEmail({
      maillist: [
        ...newData
          ?.filter((r) => r.status == "New")
          .map((t) => ({
            email: t.email,
            passcode:
              props.examination?.sharingSetting === "Private" &&
              props.examination?.accessCodeSettingType == "One"
                ? props.examination?.accessCodeSettings![0].code
                : props.examination?.sharingSetting === "Private" &&
                    props.examination?.accessCodeSettingType == "MultiCode"
                  ? t.passcode
                  : undefined,
            ended_at:
              t?.data?.timeLine?.commitTestAt ??
              t?.data?.timeLine?.mustStopDoTestAt,
            // numberPoint: ,
            score: t?.data?.result?.score,
            result_state: t?.data?.result?.passState,
            // require_score?: ;
          })),
      ],
      methods: media,
      examtestId: props.examination?.id,
      body: template,
      name: props.examination?.name,
      start_time: props.examination?.validAccessSetting?.validFrom,
      end_time: props.examination?.validAccessSetting?.validTo,
    });
    console.log("send result email", res);
    setSendLoading(false);
    if (res.code != 0) {
      errorToast(res?.message ?? "");
      return;
    }
    successToast(t("success_send_remind"));
    getEmailList(newData);
  };

  const getEmailList = async (data: TableValue[]) => {
    const res = await loadRemindMailList(props.examination?.id, "HasResult");
    if (res.code != 0) {
      //errorToast(res?.message??"")
      return;
    }
    var cloneData = _.cloneDeep(data);
    var d: RemindEmailData[] = res.data;
    var c = cloneData.map((e) => {
      var i = d?.findIndex((k) => k?.email == e.email);
      if (i < 0) {
        return e;
      }
      var f = _.cloneDeep(e);
      f.status = d[i as number].status;
      f.send_time = d[i as number].sentTime;
      f.content_send = d[i as number].body;
      f.reason_error = d[i as number].errorMessage;
      return f;
    });

    setNewData(c);
  };

  return (
    <BaseModal {...props} width={1027}>
      <ContentDetailsModal
        data={active}
        open={openDetail}
        width={564}
        title={t("detail")}
        onCancel={() => {
          setActive(undefined);
          setOpenDetail(false);
        }}
        onOk={() => {
          setOpenDetail(false);
          setActive(undefined);
        }}
      />
      <div className="w-full">
        <div className="title_bold_24 text-center w-full mt-3">
          {t("send_result_info")}
        </div>
        <MDropdown
          allowClear={false}
          value={media}
          setValue={(name: any, val: any) => {
            setMedia(val);
          }}
          className="dropdown-flex"
          options={["SMS", "Email"]
            .filter((s: any) => {
              return (
                config?.send_method &&
                (config?.send_method as any)[s?.toLowerCase()]
              );
            })
            .map((e: any) => ({
              value: e?.toLowerCase(),
              label: e,
            }))}
          id="media"
          name="media"
          title={t("media")}
          placeholder={t("media")}
        />
        <div className="text-sm font-semibold">{t("send_content")}</div>
        <div
          className="min-h-40 mt-2 border rounded-lg bg-m_neutral_100 p-5"
          dangerouslySetInnerHTML={{ __html: template ?? "" }}
        />

        <div className="mt-2 body_semibold_14 flex items-center justify-between">
          <div>{t("receipt_result_list")}</div>
          <div className="flex items-center w-1/3">
            <MInput
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              isTextRequire={false}
              h="h-9"
              placeholder={t("enter_to_search")}
              id="info"
              name="info"
            />
          </div>
        </div>
        <div className="flex">
          <p className="body_regular-14 mr-3">
            {t("sending")}:
            <span className="body_semibold_14 ml-1">
              {newData.filter((e) => e.status == "Pending").length}/
              {newData.length}
            </span>
          </p>
          <p className="body_regular-14 mr-3">
            {t("sent")}:{" "}
            <span className="body_semibold_14 ">
              {newData.filter((e) => e.status == "Success").length}/
              {newData.length}
            </span>
          </p>
          <p className="body_regular-14 mr-3">
            {t("error")}:
            <span className="body_semibold_14 ml-1">
              {newData.filter((e) => e.status == "Failure").length}/
              {newData.length}
            </span>
          </p>
        </div>
        <div className="max-lg:overflow-scroll">
          <Table
            // locale={{
            //   emptyText: <div className="bg-m_primary_300">HelloWOrld</div>,
            // }}
            className="w-full"
            bordered={false}
            columns={columns}
            dataSource={_.filter(newData, (n: RemindEmailData) => {
              if (search) {
                return (
                  n.email?.toLowerCase().includes(search?.toLowerCase()) ||
                  n.passcode?.toLowerCase().includes(search?.toLowerCase())
                );
              }
              return true;
            })?.splice((indexPage - 1) * recordNum, recordNum)}
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
        <div className="h-4" />
        <div className="w-full flex h-12 items-center  justify-center">
          <span className="body_regular_14 mr-2">{`${
            _.filter(newData, (n: RemindEmailData) => {
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
                setIndexPage(1);
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
        <div className="w-full mt-4 flex justify-center">
          <MButton
            loading={sendLoading}
            onClick={handleSendMail}
            h="h-9"
            className="w-[114px] "
            text={t("send")}
          />
        </div>
      </div>
    </BaseModal>
  );
}

export default SendExaminationResults;
