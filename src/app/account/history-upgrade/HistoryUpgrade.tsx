import MButton from "@/app/components/config/MButton";
import React, { HTMLAttributes, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { Divider, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import {
  rowEndStyle,
  rowStartStyle,
  rowStyle,
} from "../account-info/AccountInfo";
import { loadHistoryUpgrade } from "@/services/api_services/account_services";
import { LicenceData } from "@/data/user";
import { FormattedNumber } from "react-intl";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";

function HistoryUpgrade() {
  const dateFormat = "DD/MM/YYYY";
  const { t } = useTranslation("account");
  const router = useRouter();
  const [licences, setLicences] = useState<LicenceData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const user = useAppSelector((state: RootState) => state.user.user);

  useEffect(() => {
    loadHistoryBill();
  }, [user]);
  const loadHistoryBill = async () => {
    setLoading(true);
    var res = await loadHistoryUpgrade({ skip: 0, limit: 100 });
    setLoading(false);
    if (res.code != 0) {
      return;
    }
    setLicences(
      res.data
        ?.filter((s: any) => s?.pkg_type != "Individual")
        .sort(
          (a: any, b: any) => b?.active_date?.localeCompare(a?.active_date),
        ),
    );
  };

  const columns: ColumnsType<LicenceData> = [
    {
      onHeaderCell: (_) => rowStartStyle,
      title: <div className="flex justify-start">{t("upgrade_package")}</div>,
      dataIndex: "pkg_name",
      key: "pkg_name",
      render: (text, data) => (
        <p key={text} className="w-full caption_regular_14">
          {text}
        </p>
      ),
    },
    {
      onHeaderCell: (_) => rowStyle,
      title: <div className=" flex justify-start">{t("upgrade_time")}</div>,
      dataIndex: "active_date",
      key: "active_date",
      render: (text, data) => (
        <p key={text} className="w-full caption_regular_14">
          {dayjs(text).format("DD/MM/YYYY HH:mm")}
        </p>
      ),
    },
    {
      onHeaderCell: (_) => rowStyle,
      title: <div className="flex justify-start">{t("deadline")}</div>,
      dataIndex: "expire_date",
      key: "expire_date",
      render: (text, data) => (
        <p key={text} className="w-full caption_regular_14">
          {data?.nonstop
            ? t("no_limit_time")
            : dayjs(text).format("DD/MM/YYYY HH:mm")}
        </p>
      ),
    },
    {
      onHeaderCell: (_) => rowEndStyle,
      title: <div className=" flex justify-start">{t("total_pay")}</div>,
      dataIndex: "price",
      key: "price",
      render: (text, data) => (
        <p key={text} className="w-full caption_regular_14">
          {data?.custom_price ? (
            t("contact")
          ) : (
            <FormattedNumber
              value={text ?? 0}
              style="decimal"
              maximumFractionDigits={2}
            />
          )}
        </p>
      ),
    },
  ];
  return (
    <div className="w-full p-5 flex flex-col">
      <div className="w-full flex justify-between items-start">
        <div>
          <div className="w-full title_semibold_20">{t("history_upgrade")}</div>
          <div className="flex caption_regular_14">
            <span className="text-m_neutral_500 mr-1">
              {t("current_package")}:
            </span>
            <span>
              {user.licences?.enterprise?.pkg_name ??
                user.licences?.individual?.pkg_name}
            </span>
          </div>
          <div className="flex caption_regular_14">
            <span className="text-m_neutral_500 mr-1">{t("deadline")}:</span>
            <span>
              {`${dayjs(
                user?.licences?.enterprise?.active_date ??
                  user?.licences?.individual?.active_date,
              ).format(dateFormat)}
              -
              ${
                user?.licences?.enterprise
                  ? user?.licences?.enterprise?.nonstop
                    ? t("no_limit_time")
                    : dayjs(user?.licences?.enterprise?.expire_date).format(
                        dateFormat,
                      )
                  : user?.licences?.individual?.nonstop
                    ? t("no_limit_time")
                    : dayjs(user?.licences?.enterprise?.expire_date).format(
                        dateFormat,
                      )
              }`}
            </span>
          </div>
        </div>

        <MButton
          onClick={() => {
            router.push("/upgrade");
          }}
          h="h-11"
          text={t("upgrade")}
        />
      </div>
      <Divider className="my-2" />
      <div className="body_semibold_16 my-2">{t("list")}</div>
      <Table
        loading={loading}
        className="w-full"
        bordered={false}
        columns={columns}
        dataSource={licences}
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
  );
}

export default HistoryUpgrade;
