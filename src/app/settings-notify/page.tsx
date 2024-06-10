"use client";
import React, { useEffect, useState } from "react";
import HomeLayout from "@/app/layouts/HomeLayout";
import {
  NotifySetting,
  gettingsConfig,
  settingsConfig,
} from "@/services/api_services/notify_api";
import { Switch } from "antd";

interface UserInfo {
  notify_setting: {
    examtest_approved: boolean;
    examtest_not_approved: boolean;
    examtest_public: boolean;
    receive_gold: boolean;
    result_test: boolean;
  };
}

export default function SettingNotify() {
  const [userSettingNotify, setUserSettingNotify] = useState<
    UserInfo | undefined
  >();

  const getDataSettings = async () => {
    const res = await gettingsConfig();
    setNotiSetting(res?.data as NotifySetting);
  };

  const [notiSetting, setNotiSetting] = useState<NotifySetting>({
    examtest_approved: !!userSettingNotify?.notify_setting?.examtest_approved,
    examtest_not_approved:
      !!userSettingNotify?.notify_setting?.examtest_not_approved,
    examtest_public: !!userSettingNotify?.notify_setting?.examtest_public,
    receive_gold: !!userSettingNotify?.notify_setting?.receive_gold,
    result_test: !!userSettingNotify?.notify_setting?.result_test,
  });

  useEffect(() => {}, []);

  useEffect(() => {
    void getDataSettings();
  }, []);
  return (
    <HomeLayout>
      <div className="w-full pt-10">
        <div className="mx-auto max-w-[934px] rounded-md bg-white p-6 shadow-md">
          <h1 className="mb-4 text-xl font-semibold">Cài đặt thông báo</h1>
          <p className="mb-6">Chọn loại thông báo muốn nhận</p>
          <hr />

          <div className="flex items-center py-4">
            <Switch
              checked={notiSetting?.examtest_approved}
              defaultChecked={
                userSettingNotify?.notify_setting?.examtest_approved
              }
              onChange={async (e: any) => {
                const submitNoti = {
                  ...notiSetting,
                  examtest_approved: e,
                };
                try {
                  await settingsConfig({ notify_setting: submitNoti });
                  setNotiSetting(submitNoti);
                } catch (e: any) {}
              }}
            />

            <div className="ml-4">
              <div className="font-medium text-gray-700">
                Kênh theo dõi public đợt thi mới
              </div>
              <div className="text-sm text-gray-500">
                Nhận thông báo khi các kênh bạn đăng ký có đợt thi mới
              </div>
            </div>
          </div>
          <div className="flex items-center py-4">
            <Switch
              checked={notiSetting?.examtest_not_approved}
              defaultChecked={
                userSettingNotify?.notify_setting?.examtest_not_approved
              }
              onChange={async (e: any) => {
                const submitNoti = {
                  ...notiSetting,
                  examtest_not_approved: e,
                };
                try {
                  await settingsConfig({ notify_setting: submitNoti });
                  setNotiSetting(submitNoti);
                } catch (e: any) {}
              }}
            />
            <div className="ml-4">
              <div className="font-medium text-gray-700">
                Thông báo kết quả chấm thi
              </div>
              <div className="text-sm text-gray-500">
                Nhận thông báo khi có kết quả chấm thi
              </div>
            </div>
          </div>
          <div className="flex items-center py-4">
            <Switch
              defaultChecked={
                userSettingNotify?.notify_setting?.examtest_public
              }
              checked={notiSetting?.examtest_public}
              onChange={async (e: any) => {
                const submitNoti = {
                  ...notiSetting,
                  examtest_public: e,
                };
                try {
                  await settingsConfig({ notify_setting: submitNoti });
                  setNotiSetting(submitNoti);
                } catch (e: any) {}
              }}
            />
            <div className="ml-4">
              <div className="font-medium text-gray-700">
                Đợt thi được duyệt lên chợ
              </div>
              <div className="text-sm text-gray-500">
                Nhận thông báo khi đợt thi được duyệt lên chợ
              </div>
            </div>
          </div>
          <div className="flex items-center py-4">
            <Switch
              defaultChecked={userSettingNotify?.notify_setting?.receive_gold}
              checked={notiSetting?.receive_gold}
              onChange={async (e: any) => {
                const submitNoti = {
                  ...notiSetting,
                  receive_gold: e,
                };
                try {
                  await settingsConfig({ notify_setting: submitNoti });
                  setNotiSetting(submitNoti);
                } catch (e: any) {}
              }}
            />
            <div className="ml-4">
              <div className="font-medium text-gray-700">
                Đợt thi không được duyệt lên chợ
              </div>
              <div className="text-sm text-gray-500">
                Nhận thông báo khi đợt thi không được duyệt lên chợ
              </div>
            </div>
          </div>
          <div className="flex items-center py-4">
            <Switch
              defaultChecked={userSettingNotify?.notify_setting?.result_test}
              checked={notiSetting?.result_test}
              onChange={async (e: any) => {
                const submitNoti = {
                  ...notiSetting,
                  result_test: e,
                };
                try {
                  await settingsConfig({ notify_setting: submitNoti });
                  setNotiSetting(submitNoti);
                } catch (e: any) {}
              }}
            />
            <div className="ml-4">
              <div className="font-medium text-gray-700">
                Thông báo nhận gold
              </div>
              <div className="text-sm text-gray-500">
                Nhận thông báo khi nhận gold
              </div>
            </div>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
}
