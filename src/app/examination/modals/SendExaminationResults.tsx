import {
  rowEndStyle,
  rowStartStyle,
  rowStyle,
} from "@/app/account/account-info/AccountInfo";
import BaseModal, { BaseModalProps } from "@/app/components/config/BaseModal";
import { ExaminationData } from "@/data/exam";
import Table, { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import React, { HTMLAttributes, useState } from "react";
import { useTranslation } from "react-i18next";
import EyeIcon from "@/app/components/icons/eye.svg";
import TrashIcon from "@/app/components/icons/trash.svg";
import MButton from "@/app/components/config/MButton";
import MDropdown from "@/app/components/config/MDropdown";
import { SettingData } from "@/data/user";
import { loadConfig } from "@/services/api_services/account_services";
import { useOnMountUnsafe } from "@/services/ui/useOnMountUnsafe";
import { getTemplateSendMail } from "@/services/api_services/examination_api";
import MInput from "@/app/components/config/MInput";
import PushIcon from "@/app/components/icons/push.svg";
import { Pagination, Select, Tooltip } from "antd";
import AddCircleIcon from "@/app/components/icons/add-circle.svg";

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

  const getSetting = async () => {
    var res = await loadConfig();
    if (res.code != 0) {
      return;
    }
    setConfig(res.data);
  };
  const getTemplateMail = async () => {
    var res = await getTemplateSendMail();

    console.log("res", res);

    if (res?.code != 0) {
      return;
    }
    setTemplate(res?.data);
  };

  useOnMountUnsafe(() => {
    getTemplateMail();
    getSetting();
  });

  const columns: ColumnsType<any> = [
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
          {text ? dayjs(text).format(dateFormat) : ""}
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
      render: (action, data) => (
        <div className="w-full flex justify-start ">
          <button
            className="ml-2"
            onClick={() => {
              setActive(data);
            }}
          >
            <EyeIcon />
          </button>

          {data?.status == "New" && (
            <button className="ml-2" onClick={async () => {}}>
              <TrashIcon />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <BaseModal {...props} width={1027}>
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
          <div>{t("receipt_info_list")}</div>
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
            {t("sending")}:<span className="body_semibold_14 ml-1">0/0</span>
          </p>
          <p className="body_regular-14 mr-3">
            {t("sent")}: <span className="body_semibold_14 ">0/0</span>
          </p>
          <p className="body_regular-14 mr-3">
            {t("error")}:<span className="body_semibold_14 ml-1">0/0</span>
          </p>
        </div>
        <div className="max-lg:overflow-scroll">
          <Table
            className="w-full"
            bordered={false}
            columns={columns}
            dataSource={[]}
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
          <span className="body_regular_14 mr-2">{`${0} ${t("result")}`}</span>
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
          <MButton h="h-9" className="w-[114px] " text={t("send")} />
        </div>
      </div>
    </BaseModal>
  );
}

export default SendExaminationResults;
