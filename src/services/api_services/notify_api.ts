import { callStudioAPI, callApi } from "./base_api";

export const totalUnreadNoti = async () => {
  return await callApi.get(
    `${process.env.NEXT_PUBLIC_API_BC}/apimodel/notify.my_total_unread_notify`,
    {}
  );
};
// list noti
export const myListNotify = async (skip: number, limit: number) => {
  return await callApi.post(
    `${process.env.NEXT_PUBLIC_API_BC}/apimodel/notify.my_list_notify?skip=${skip}&limit=${limit}`,
    {
      params: { skip, limit },
    }
  );
};
// call sau khi get noti
export const getNotiAwait = async (skip: number, limit: number) => {
  return await callApi.post(
    `${process.env.NEXT_PUBLIC_API_BC}/apimodel/notify.toggle_awared`,
    {
      params: { skip, limit },
    }
  );
};
// Đánh dấu đã đọc
export const readNoti = async (id?: string) => {
  return await callApi.post(
    `${process.env.NEXT_PUBLIC_API_BC}/apimodel/notify.toggle`,
    {
      id,
      read: true,
    }
  );
};
// Đánh dấu chưa đọc
export const unReadNoti = async (id?: string) => {
  return await callApi.post(
    `${process.env.NEXT_PUBLIC_API_BC}/apimodel/notify.toggle`,
    {
      id,
      read: false,
    }
  );
};
// Đánh dấu tất cả đã đọc
export const readAllNoti = async () => {
  return await callApi.post(
    `${process.env.NEXT_PUBLIC_API_BC}/apimodel/notify.toggle`,
    {
      all: true,
    }
  );
};
// Xóa thông báo
export const deleteNoti = async (id?: string) => {
  return await callApi.post(
    `${process.env.NEXT_PUBLIC_API_BC}/apimodel/notify.delete_notify`,
    {
      id,
    }
  );
};
// setting config
export interface Settings {
  notify_setting?: NotifySetting;
}

export interface NotifySetting {
  examtest_public?: boolean;
  result_test?: boolean;
  examtest_approved?: boolean;
  examtest_not_approved?: boolean;
  receive_gold?: boolean;
}

export const settingsConfig = async (params: Settings) => {
  return await callApi.post(
    `${process.env.NEXT_PUBLIC_API_BC}/apimodel/user.set_notify_setting`,
    {
      ...params,
    }
  );
};

export const gettingsConfig = async () => {
  return await callApi.get(
    `${process.env.NEXT_PUBLIC_API_BC}/apimodel/notify.get_notify_setting`
  );
};

// tắt thông báo từ kênh
export const turnOffStu = async (
  studioId: string | undefined,
  allowNotifications: boolean
) => {
  return await callApi.post(
    `${process.env.NEXT_PUBLIC_API_BC}/apimodel/notify.toggle_user_notification_settings_by_studio`,
    {
      studioId,
      allowNotifications,
    }
  );
};
