"use client";
import { ListNotification } from "@/data/noti";
import {
  deleteNoti,
  getNotiAwait,
  myListNotify,
  readAllNoti,
  readNoti,
  totalUnreadNoti,
  unReadNoti,
} from "@/services/api_services/notify_api";
import React, { useEffect, useState } from "react";
import BellIcon from "@/app/components/icons/notification.svg";
import { Popover } from "antd";
import { useRouter } from "next/navigation";

export default function Notification() {
  const [getNoti, setGetNoti] = useState<ListNotification>();
  const [totalNum, setTotalNum] = useState<number>();
  const [, setShow] = useState<string | undefined>();
  const router = useRouter();

  const dataNotify = async () => {
    const res = await myListNotify(0, 15);
    // await getNotiAwait(0, 1000);
    if (res) {
      setGetNoti(res?.data);
      console.log(res?.data);
    }
  };

  const totalUnread = async () => {
    const res = await totalUnreadNoti();
    if (res) {
      setTotalNum(res?.data);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      void totalUnread();
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <Popover
      className="mx-4"
      placement="bottom"
      title={
        <div className="flex justify-between items-center">
          <div className="text-xl font-semibold">Thông báo</div>
          <Popover
            className="mx-4 cursor-pointer"
            placement="bottom"
            title={
              <div>
                <div
                  onClick={async () => {
                    await readAllNoti();
                    await dataNotify();
                  }}
                  className="cursor-pointer p-2 text-sm font-normal hover:bg-[#F4F5F5]"
                >
                  Đánh dấu tất cả đã đọc
                </div>
                <div
                  onClick={() => {
                    router.push("/all-notification");
                  }}
                  className="cursor-pointer p-2 text-sm font-normal hover:bg-[#F4F5F5]"
                >
                  Xem tất cả
                </div>
                <div
                  onClick={() => {
                    router.push("/account?tab=5");
                  }}
                  className="cursor-pointer p-2 text-sm font-normal hover:bg-[#F4F5F5]"
                >
                  Cài đặt
                </div>
              </div>
            }
            trigger={["click"]}
          >
            <div className="flex h-[22px] w-[22px] items-center justify-center rounded-full border hover:border-[2px] hover:bg-slate-300 ml-1">
              <div className="pb-2">...</div>
            </div>
          </Popover>
        </div>
      }
      content={
        <div className="h-[700px] w-[600px] overflow-y-scroll">
          {(getNoti?.unAwared?.length || 0) > 0 ? (
            <div className="mb-2 mt-4 text-sm font-semibold">Mới</div>
          ) : (
            ""
          )}

          {(getNoti?.unAwared?.length || 0) > 0
            ? getNoti?.unAwared?.map((key: any, index) => (
                <>
                  <div
                    onMouseOver={() => {
                      setShow(key?._id);
                    }}
                    onMouseLeave={() => {
                      setShow(undefined);
                    }}
                    key={index}
                  >
                    <div
                      className={`mb-2 flex cursor-pointer items-center justify-between rounded-md p-2 hover:bg-[#F4F5F5] ${
                        !key?.read ? "bg-[#E2F0F3]" : ""
                      }`}
                    >
                      <a
                        onClick={async () => {
                          await readNoti(key?._id);
                          await dataNotify();
                        }}
                        href={key?.url}
                        target="_blank"
                        key={key?._id}
                        className="flex w-full items-center justify-between text-[#0D1939]"
                        rel="noreferrer"
                      >
                        <div className="relative mr-2 w-[40px]">
                          {!key?.stu_logo ? (
                            <img src="/tmas.png" alt="#" />
                          ) : (
                            <img
                              className="h-[40px] w-[40px] rounded-full"
                              src={key?.stu_logo}
                            />
                          )}
                          {key?.type === "PublicExam" ? (
                            <img
                              className="absolute bottom-[-5px] right-[-5px] h-[20px] w-[20px] rounded-full"
                              src="/notify/user.png"
                            />
                          ) : key?.type === "TestResults" ? (
                            <img
                              className="absolute bottom-[-5px] right-[-5px] h-[20px] w-[20px] rounded-full"
                              src="/notify/note.png"
                            />
                          ) : key?.type === "ExamApproved" ? (
                            <img
                              className="absolute bottom-[-5px] right-[-5px] h-[20px] w-[20px] rounded-full"
                              src="/notify/v.png"
                            />
                          ) : key?.type === "ExamNotApproved" ? (
                            <img
                              className="absolute bottom-[-5px] right-[-5px] h-[20px] w-[20px] rounded-full"
                              src="/notify/x.png"
                            />
                          ) : (
                            <img
                              className="absolute bottom-[-5px] right-[-5px] h-[20px] w-[20px] rounded-full"
                              src="/notify/dollar.png"
                            />
                          )}
                        </div>
                        <div className="flex flex-1 flex-col">
                          <div className="">
                            <b className="pr-1">{key?.subject}</b>
                            <span className="">{key?.body}</span>
                          </div>
                          <div className="text-sm text-gray-500">
                            {key?.timeJoined}
                            &nbsp;
                            {key?.timeJoinedUnit === "minute"
                              ? "phút"
                              : key?.timeJoinedUnit === "month"
                              ? "Tháng"
                              : key?.timeJoinedUnit === "hour"
                              ? "Giờ"
                              : key?.timeJoinedUnit === "second"
                              ? "Giây"
                              : ""}
                            &nbsp; trước
                          </div>
                        </div>
                        <div>
                          {key?.imageLink ? (
                            <img
                              src={key?.imageLink}
                              className="h-[50px] w-[129px]"
                            />
                          ) : (
                            ""
                          )}
                        </div>
                      </a>
                      <div className="flex items-center justify-center">
                        <Popover
                          placement="bottom"
                          content={
                            <div>
                              <div
                                onClick={async () => {
                                  await readNoti(key?._id);
                                  await dataNotify();
                                }}
                                className="cursor-pointer p-2 text-sm font-normal hover:bg-[#F4F5F5]"
                              >
                                Đánh dấu đã đọc
                              </div>
                              <div
                                onClick={async () => {
                                  await unReadNoti(key?._id);
                                  await dataNotify();
                                }}
                                className="cursor-pointer p-2 text-sm font-normal hover:bg-[#F4F5F5]"
                              >
                                Đánh dấu chưa đọc
                              </div>
                              <div
                                onClick={async () => {
                                  await deleteNoti(key?._id);
                                  await dataNotify();
                                }}
                                className="cursor-pointer p-2 text-sm font-normal hover:bg-[#F4F5F5]"
                              >
                                Xóa thông báo
                              </div>
                            </div>
                          }
                          trigger={["click"]}
                        >
                          <div className="flex h-[22px] w-[22px] items-center justify-center rounded-full border hover:border-[2px] hover:bg-slate-300 ml-1">
                            <div className="pb-2">...</div>
                          </div>
                        </Popover>
                      </div>
                      {!key?.read ? (
                        <div className="flex w-10 items-center justify-center">
                          <div className=" h-[10px] w-[10px] rounded-full bg-[#0B8199]" />
                        </div>
                      ) : (
                        <div className="w-10" />
                      )}
                    </div>
                  </div>
                </>
              ))
            : ""}
          <div className="my-5 h-[1px] w-full bg-[#DFDFE2]" />
          {(getNoti?.awared?.length || 0) > 0 ? (
            <div className="mb-2 mt-4 text-sm font-semibold">Trước</div>
          ) : (
            ""
          )}

          {(getNoti?.awared?.length || 0) > 0
            ? getNoti?.awared?.map((key: any, index) => (
                <div
                  key={index}
                  onMouseOver={() => {
                    setShow(key?._id);
                  }}
                  onMouseLeave={() => {
                    setShow(undefined);
                  }}
                >
                  <div
                    className={`mb-2 flex cursor-pointer items-center justify-between rounded-md p-2 hover:bg-[#F4F5F5] ${
                      !key?.read ? "bg-[#E2F0F3]" : ""
                    }`}
                  >
                    <a
                      onClick={async () => {
                        await readNoti(key?._id);
                        await dataNotify();
                      }}
                      href={key?.url}
                      target="_blank"
                      key={key?._id}
                      className="flex w-full items-center justify-between text-[#0D1939]"
                      rel="noreferrer"
                    >
                      <div className="relative mr-2 w-[40px]">
                        {!key?.stu_logo ? (
                          <img src="/tmas.png" alt="#" />
                        ) : (
                          <img
                            className="h-[40px] w-[40px] rounded-full"
                            src={key?.stu_logo}
                          />
                        )}
                        {key?.type === "PublicExam" ? (
                          <img
                            className="absolute bottom-[-5px] right-[-5px] h-[20px] w-[20px] rounded-full"
                            src="/notify/user.png"
                          />
                        ) : key?.type === "TestResults" ? (
                          <img
                            className="absolute bottom-[-5px] right-[-5px] h-[20px] w-[20px] rounded-full"
                            src="/notify/note.png"
                          />
                        ) : key?.type === "ExamApproved" ? (
                          <img
                            className="absolute bottom-[-5px] right-[-5px] h-[20px] w-[20px] rounded-full"
                            src="/notify/v.png"
                          />
                        ) : key?.type === "ExamNotApproved" ? (
                          <img
                            className="absolute bottom-[-5px] right-[-5px] h-[20px] w-[20px] rounded-full"
                            src="/notify/x.png"
                          />
                        ) : (
                          <img
                            className="absolute bottom-[-5px] right-[-5px] h-[20px] w-[20px] rounded-full"
                            src="/notify/dollar.png"
                          />
                        )}
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div>
                          <b className="pr-1">{key?.subject}</b>
                          <span>{key?.body}</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {key?.timeJoined}
                          &nbsp;
                          {key?.timeJoinedUnit === "minute"
                            ? "phút"
                            : key?.timeJoinedUnit === "month"
                            ? "Tháng"
                            : key?.timeJoinedUnit === "hour"
                            ? "Giờ"
                            : key?.timeJoinedUnit === "second"
                            ? "Giây"
                            : ""}
                          &nbsp; trước
                        </div>
                      </div>
                      <div>
                        {key?.imageLink ? (
                          <img
                            src={key?.imageLink}
                            className="h-[50px] w-[129px]"
                          />
                        ) : (
                          ""
                        )}
                      </div>
                    </a>
                    <div className="flex items-center justify-center">
                      <Popover
                        placement="bottom"
                        content={
                          <div>
                            {key?.read ? (
                              <div
                                onClick={async () => {
                                  await unReadNoti(key?._id);
                                  await dataNotify();
                                }}
                                className="cursor-pointer p-2 text-sm font-normal hover:bg-[#F4F5F5]"
                              >
                                Đánh dấu chưa đọc
                              </div>
                            ) : (
                              <div
                                onClick={async () => {
                                  await readNoti(key?._id);
                                  await dataNotify();
                                }}
                                className="cursor-pointer p-2 text-sm font-normal hover:bg-[#F4F5F5]"
                              >
                                Đánh dấu đã đọc
                              </div>
                            )}
                            <div
                              onClick={async () => {
                                await deleteNoti(key?._id);
                                await dataNotify();
                              }}
                              className="cursor-pointer p-2 text-sm font-normal hover:bg-[#F4F5F5]"
                            >
                              Xóa thông báo
                            </div>
                          </div>
                        }
                        trigger={["click"]}
                      >
                        <div className="flex h-[22px] w-[22px] items-center justify-center rounded-full border hover:border-[2px] hover:bg-slate-300 ml-1">
                          <div className="pb-2">...</div>
                        </div>
                      </Popover>
                    </div>
                    {!key?.read ? (
                      <div className="flex w-10 items-center justify-center">
                        <div className=" h-[10px] w-[10px]  rounded-full bg-[#0B8199]" />
                      </div>
                    ) : (
                      <div className="w-10" />
                    )}
                  </div>
                </div>
              ))
            : ""}
        </div>
      }
      trigger={["click"]}
    >
      <div
        onClick={async () => {
          await totalUnread();
          await dataNotify();
          await getNotiAwait(0, 1000);
        }}
        className="cursor-pointer"
      >
        {totalNum === 0 ? (
          <BellIcon />
        ) : (
          <div className="relative">
            <BellIcon />
            {totalNum && (
              <div className="absolute right-[-5px] top-[-3px] h-[15px] w-[15px] rounded-full bg-[#EA3434] text-xs text-white flex justify-center items-center">
                {totalNum as any}
              </div>
            )}
          </div>
        )}
      </div>
    </Popover>
  );
}
