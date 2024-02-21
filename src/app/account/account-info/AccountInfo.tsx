import { Button, Divider, Table } from "antd";
import React, { useState, HTMLAttributes, useEffect } from "react";
import { useTranslation } from "react-i18next";
import AddIcon from "../../components/icons/add.svg";
import { ColumnsType } from "antd/es/table";
import TrashIcon from "../../components/icons/trash.svg";
import EditIcon from "../../components/icons/edit.svg";
import RotateIcon from "../../components/icons/rotate.svg";
import { Tooltip } from "antd";
import ConfirmModal from "@/app/components/modals/ConfirmModal";
import AddAccount from "./components/AddAccount";
import EditAcountInfo from "./components/EditAcountInfo";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  deleteInvitedMemberFromWorkSpace,
  deleteMemberFromWorkSpace,
  getInvitaionEmailMember,
  getMemberListInStudio,
  sendInviteEmailToMember,
} from "@/services/api_services/account_services";
import { errorToast, successToast } from "@/app/components/toast/customToast";
import { Spin } from "antd";
import { UserData } from "@/data/user";

interface DataType {
  id?: string;
  full_name?: string;
  email?: string;
  phone_number?: string;
  role?: string;
  action?: boolean;
  language?: string;
}

function AccountInfo() {
  const { t } = useTranslation("account");
  const common = useTranslation();
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [openAdd, setOpenAdd] = useState<boolean>(false);
  var rowStartStyle = {
    style: {
      fontSize: "0.875rem",
      lineHeight: "1.25rem",
      color: "#003953",
      background: "#F4F5F5",
      borderRadius: "10px 0 0 0",
    },
  };

  var rowStyle = {
    style: {
      fontSize: "0.875rem",
      lineHeight: "1.25rem",
      color: "#003953",
      background: "#F4F5F5",
    },
  };
  var rowEndStyle = {
    style: {
      fontSize: "0.875rem",
      lineHeight: "1.25rem",
      color: "#003953",
      background: "#F4F5F5",
      borderRadius: "0 10px 0 0 ",
    },
  };

  const columns: ColumnsType<UserData> = [
    {
      onHeaderCell: (_) => rowStartStyle,
      title: t("full_name"),
      dataIndex: "full_name",
      key: "full_name",
      render: (text) => (
        <p key={text} className="caption_regular_14">
          {text}
        </p>
      ),
    },
    {
      onHeaderCell: (_) => rowStyle,
      title: t("email"),
      dataIndex: "email",
      key: "email",
      render: (text) => (
        <p key={text} className="caption_regular_14">
          {text}
        </p>
      ),
    },
    {
      onHeaderCell: (_) => rowStyle,
      title: t("phone_number"),
      dataIndex: "phone_number",
      key: "phone_number",
      render: (text) => (
        <p key={text} className="caption_regular_14">
          {text}
        </p>
      ),
    },
    {
      onHeaderCell: (_) => rowStyle,
      title: t("role"),
      dataIndex: "role",
      key: "role",
      render: (text) => (
        <p key={text} className="caption_regular_14">
          {t(text?.toLowerCase())}
        </p>
      ),
    },

    {
      onHeaderCell: (_) => rowEndStyle,
      title: t("action"),
      dataIndex: "verified",
      key: "verified",
      render: (action, data) => (
        <div>
          {action ? (
            <button
              onClick={async () => {
                setUpdateKey(Date.now());
                await setActiveMem(data);
                console.log("act", activeMem);

                setOpenEdit(true);
              }}
            >
              <EditIcon />
            </button>
          ) : (
            <Tooltip placement="bottom" title={t("resend_invite_email")}>
              <button onClick={() => resendEmail(data)}>
                <RotateIcon />
              </button>
            </Tooltip>
          )}
          <button
            className="ml-2"
            onClick={() => {
              setActiveMem(data);
              setOpenDelete(true);
            }}
          >
            <TrashIcon />
          </button>
        </div>
      ),
    },
  ];

  const user = useSelector((state: RootState) => state.user);
  const [members, setMembers] = useState<UserData[]>([]);
  const [loadingMem, setLoadingMem] = useState<boolean>(true);
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);
  const [activeMem, setActiveMem] = useState<UserData | undefined>();

  useEffect(() => {
    console.log("use effect");

    loadMembers();
  }, []);

  const resendEmail = async (mem: UserData) => {
    try {
      setLoadingMem(true);
      await sendInviteEmailToMember({ email: mem.email!, role: mem.role! });
      successToast(t("success_send_invite"));
      setLoadingMem(false);
    } catch (e: any) {
      setLoadingMem(false);
      errorToast(e);
    }
  };

  const deleteMember = async (mem?: UserData) => {
    try {
      setLoadingDelete(true);
      console.log("mem", mem);
      if (mem?.verified) {
        await deleteMemberFromWorkSpace({ userId: mem?._id });
      } else {
        await deleteInvitedMemberFromWorkSpace({ email: mem?.email });
      }
      successToast(t("delete_success"));
      setLoadingDelete(false);
      loadMembers();
    } catch (e: any) {
      setLoadingDelete(false);
      errorToast(e);
    }
  };

  const loadMembers = async () => {
    console.log("load");

    try {
      setLoadingMem(true);
      setMembers([]);
      var mem = await getMemberListInStudio();
      var invitedMem = await getInvitaionEmailMember();
      console.log("mem", mem);
      console.log("invitedMem", invitedMem);

      setMembers([...invitedMem, ...mem]);
      setLoadingMem(false);
    } catch (e: any) {
      setLoadingMem(false);
      // errorToast(e);
      setMembers([]);
    }
  };
  const [addKey, setAddKey] = useState<number>(Date.now());
  const [updateKey, setUpdateKey] = useState<number>(Date.now());
  return (
    <>
      <ConfirmModal
        open={openDelete}
        onCancel={() => {
          setActiveMem(undefined);
          setOpenDelete(false);
        }}
        loading={loadingDelete}
        onOk={() => {
          setOpenDelete(false);
          deleteMember(activeMem);
        }}
        action={t("delete")}
        text={t("confirm_delete")}
      />

      <EditAcountInfo
        data={activeMem}
        key={updateKey}
        open={openEdit}
        onCancel={() => {
          setActiveMem(undefined);
          setOpenEdit(false);
        }}
        onOk={() => {
          setOpenEdit(false);
          setActiveMem(undefined);
          loadMembers();
        }}
      />
      <AddAccount
        key={addKey}
        open={openAdd}
        onOk={() => {
          loadMembers();
        }}
        onCancel={() => {
          setOpenAdd(false);
        }}
      />
      <div className="w-full p-5 flex justify-between">
        <div>
          <div className="caption_semibold_20">{t("account_management")}</div>
          <div className="caption_regular_14">
            <span>{t("max_account")}</span>
            {": "}
            <span className="caption_semibold_14">
              {user?.licence?.package?.max_user ?? 1}
            </span>
          </div>
        </div>
        <div>
          <Button
            onClick={() => {
              setAddKey(Date.now());
              setOpenAdd(true);
            }}
            className="border-m_primary_500 border-1 h-11 px-4 rounded-lg text-m_primary_500 caption_semibold_14 flex items-center"
            type="default"
            icon={<AddIcon />}
          >
            {t("add_account")}
          </Button>
        </div>
      </div>
      {/* <Divider className="p-0 my-0 mx-5" /> */}
      <div className="mx-5">
        <Divider className="mt-0" />
        <Table
          loading={loadingMem}
          bordered={false}
          columns={columns}
          dataSource={members.map<UserData>((v) => ({
            ...v,
          }))}
          pagination={false}
          rowKey={"id"}
          onRow={(data, index: any) =>
            ({
              style: {
                background: data.verified ? "#FFFFFF" : "#FFF9E6",
                borderRadius: "20px",
              },
            }) as HTMLAttributes<any>
          }
        />

        <div className="h-12" />
      </div>
    </>
  );
}

export default AccountInfo;
