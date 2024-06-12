"use client";
import React, { useEffect, useState } from "react";
import HomeLayout from "@/app/layouts/HomeLayout";
import {
  deleteNoti,
  getNotiAwait,
  myListNotify,
  readAllNoti,
  readNoti,
  unReadNoti,
} from "@/services/api_services/notify_api";
import { ListNotification } from "@/data/noti";
import { useRouter } from "next/navigation";
import { Popover } from "antd";

export default function AllNotification() {
  const [getNoti, setGetNoti] = useState<ListNotification>();
  const [, setShow] = useState<string | undefined>();
  const Data = async () => {
    const res = await myListNotify(0, 1000);
    await getNotiAwait(0, 1000);
    if (res) {
      setGetNoti(res?.data);
    }
  };
  const router = useRouter();
  const handleClickAllNotify = () => {
    router.push(`/setting-notify`);
  };

  useEffect(() => {
    void Data();
  }, []);

  useEffect(() => {
    void Data();

    // const intervalId = setInterval(() => {
    //   void Data();
    // }, 5000);

    // return () => clearInterval(intervalId);
  }, []);
  return (
    <HomeLayout>
      <div className="w-full mt-10">
        <div className="noti mx-auto max-w-[934px] bg-white p-3">
          <div className="flex items-center justify-between">
            <div className="mb-4 text-xl font-bold">Thông báo</div>
            <Popover
              className="mx-4 cursor-pointer"
              placement="bottom"
              title={
                <div>
                  <div
                    onClick={async () => {
                      await readAllNoti();
                      await Data();
                    }}
                    className="cursor-pointer p-2 text-sm font-normal hover:bg-[#F4F5F5]"
                  >
                    Đánh dấu tất cả đã đọc
                  </div>
                  {/* <div
                    onClick={() => {
                      router.push("/all-notification");
                    }}
                    className="cursor-pointer p-2 text-sm font-normal hover:bg-[#F4F5F5]"
                  >
                    Xem tất cả
                  </div> */}
                  <div
                    onClick={() => {
                      router.push("/settings-notify");
                    }}
                    className="cursor-pointer p-2 text-sm font-normal hover:bg-[#F4F5F5]"
                  >
                    Cài đặt
                  </div>
                </div>
              }
              trigger={["click"]}
            >
              <div className="flex h-[22px] w-[22px] items-center justify-center rounded-full border hover:border-[2px] hover:bg-slate-300">
                <div className="pb-2">...</div>
              </div>
            </Popover>
          </div>
          <div className="mb-2 text-lg">Mới</div>
          {(getNoti?.unAwared?.length || 0) > 0
            ? getNoti?.unAwared?.map((x, key) => (
                <div
                  onMouseOver={() => {
                    setShow(x?._id);
                  }}
                  onMouseLeave={() => {
                    setShow(undefined);
                  }}
                  key={key}
                  className="mb-3 flex items-center rounded-md bg-[#E2F0F3] p-2"
                >
                  <a
                    onClick={async () => {
                      await readNoti(x?._id);
                      await Data();
                    }}
                    href={x?.url}
                    target="_blank"
                    className="flex w-full items-center justify-between"
                    rel="noreferrer"
                  >
                    <div className="relative mr-2 w-[40px]">
                      {!x?.stu_logo ? (
                        <img src="/tmas.png" alt="#" />
                      ) : (
                        <img
                          className="h-[40px] w-[40px] rounded-full"
                          src={x?.stu_logo}
                        />
                      )}
                      {x?.type === "PublicExam" ? (
                        <img
                          className="absolute bottom-[-5px] right-[-5px] h-[20px] w-[20px] rounded-full"
                          src="/notify/user.png"
                        />
                      ) : x?.type === "TestResults" ? (
                        <img
                          className="absolute bottom-[-5px] right-[-5px] h-[20px] w-[20px] rounded-full"
                          src="/notify/note.png"
                        />
                      ) : x?.type === "ExamApproved" ? (
                        <img
                          className="absolute bottom-[-5px] right-[-5px] h-[20px] w-[20px] rounded-full"
                          src="/notify/v.png"
                        />
                      ) : x?.type === "ExamNotApproved" ? (
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
                    <div className="flex-1">
                      <div className="break-all">
                        <b className="pr-1">{x?.subject}</b>
                        <span className="break-all">{x?.body}</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {x?.timeJoined}
                        &nbsp;
                        {x?.timeJoinedUnit === "minute"
                          ? "phút"
                          : x?.timeJoinedUnit === "month"
                          ? "Tháng"
                          : x?.timeJoinedUnit === "hour"
                          ? "Giờ"
                          : x?.timeJoinedUnit === "second"
                          ? "Giây"
                          : ""}
                        &nbsp; Trước
                      </div>
                    </div>
                    <div>
                      {x?.imageLink ? (
                        <img
                          src={x?.imageLink}
                          className="h-[50px] w-[129px]"
                        />
                      ) : (
                        ""
                      )}
                    </div>
                  </a>
                  <div>
                    <div className="flex items-center justify-center">
                      <Popover
                        placement="bottom"
                        content={
                          <div>
                            <div
                              onClick={async () => {
                                await readNoti(x?._id);
                                await Data();
                              }}
                              className="cursor-pointer p-2 text-sm font-normal hover:bg-[#F4F5F5]"
                            >
                              Đánh dấu đã đọc
                            </div>
                            <div
                              onClick={async () => {
                                await unReadNoti(x?._id);
                                await Data();
                              }}
                              className="cursor-pointer p-2 text-sm font-normal hover:bg-[#F4F5F5]"
                            >
                              Đánh dấu chưa đọc
                            </div>
                            <div
                              onClick={async () => {
                                await deleteNoti(x?._id);
                                await Data();
                              }}
                              className="cursor-pointer p-2 text-sm font-normal hover:bg-[#F4F5F5]"
                            >
                              Xóa thông báo
                            </div>
                          </div>
                        }
                        trigger={["click"]}
                      >
                        <div className="flex h-[22px] w-[22px] items-center justify-center rounded-full border hover:border-[2px] hover:bg-slate-300">
                          <div className="pb-2">...</div>
                        </div>
                      </Popover>
                    </div>
                    {!x?.read ? (
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
          <div className="my-5 h-[1px] w-full bg-[#DFDFE2]" />
          <div className="mb-2 text-lg">Trước đó</div>
          {(getNoti?.awared?.length || 0) > 0
            ? getNoti?.awared?.map((e: any, key: any) => {
                return (
                  <>
                    <div
                      onMouseOver={() => {
                        setShow(e?._id);
                      }}
                      onMouseLeave={() => {
                        setShow(undefined);
                      }}
                      key={key}
                      className={`mb-3 flex cursor-pointer items-center rounded-md p-2 hover:bg-[#F4F5F5] ${
                        !e?.read ? "bg-[#E2F0F3]" : ""
                      }`}
                    >
                      <a
                        onClick={async () => {
                          await readNoti(e?._id);
                          await Data();
                        }}
                        href={e?.url}
                        target="_blank"
                        className="flex w-full items-center justify-between"
                        rel="noreferrer"
                      >
                        <div className="relative mr-2 w-[40px]">
                          {!e?.stu_logo ? (
                            <img src="/tmas.png" alt="#" />
                          ) : (
                            <img
                              className="mr-3 h-[40px] w-[40px] rounded-full"
                              src={e?.stu_logo}
                            />
                          )}
                          {e?.type === "PublicExam" ? (
                            <img
                              className="absolute bottom-[-5px] right-[5px] h-[20px] w-[20px] rounded-full"
                              src="/notify/user.png"
                            />
                          ) : e?.type === "TestResults" ? (
                            <img
                              className="absolute bottom-[-5px] right-[5px] h-[20px] w-[20px] rounded-full"
                              src="/notify/note.png"
                            />
                          ) : e?.type === "ExamApproved" ? (
                            <img
                              className="absolute bottom-[-5px] right-[5px] h-[20px] w-[20px] rounded-full"
                              src="/notify/v.png"
                            />
                          ) : e?.type === "ExamNotApproved" ? (
                            <img
                              className="absolute bottom-[-5px] right-[5px] h-[20px] w-[20px] rounded-full"
                              src="/notify/x.png"
                            />
                          ) : (
                            <img
                              className="absolute bottom-[-5px] right-[5px] h-[20px] w-[20px] rounded-full"
                              src="/notify/dollar.png"
                            />
                          )}
                        </div>
                        <div className="flex flex-1 flex-col">
                          <div className="break-all">
                            <b className="break-words pr-1">{e?.subject}</b>
                            <span className="break-words">{e?.body}</span>
                          </div>
                          <div className="text-sm text-gray-500">
                            {e?.timeJoined}
                            &nbsp;
                            {e?.timeJoinedUnit === "minute"
                              ? "phút"
                              : e?.timeJoinedUnit === "month"
                              ? "Tháng"
                              : e?.timeJoinedUnit === "hour"
                              ? "Giờ"
                              : e?.timeJoinedUnit === "second"
                              ? "Giây"
                              : ""}
                            &nbsp; trước
                          </div>
                        </div>
                        <div>
                          {e?.imageLink ? (
                            <img
                              src={e?.imageLink}
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
                                  await readNoti(e?._id);
                                  await Data();
                                }}
                                className="cursor-pointer p-2 text-sm font-normal hover:bg-[#F4F5F5]"
                              >
                                Đánh dấu đã đọc
                              </div>
                              <div
                                onClick={async () => {
                                  await unReadNoti(e?._id);
                                  await Data();
                                }}
                                className="cursor-pointer p-2 text-sm font-normal hover:bg-[#F4F5F5]"
                              >
                                Đánh dấu chưa đọc
                              </div>
                              <div
                                onClick={async () => {
                                  await deleteNoti(e?._id);
                                  await Data();
                                }}
                                className="cursor-pointer p-2 text-sm font-normal hover:bg-[#F4F5F5]"
                              >
                                Xóa thông báo
                              </div>
                            </div>
                          }
                          trigger={["click"]}
                        >
                          <div className="flex h-[22px] w-[22px] items-center justify-center rounded-full border hover:border-[2px] hover:bg-slate-300">
                            <div className="pb-2">...</div>
                          </div>
                        </Popover>
                      </div>
                      {!e?.read ? (
                        <div className="flex w-10 items-center justify-center">
                          <div className=" h-[10px] w-[10px]  rounded-full bg-[#0B8199]" />
                        </div>
                      ) : (
                        <div className="w-10" />
                      )}
                    </div>
                  </>
                );
              })
            : ""}
        </div>
      </div>
    </HomeLayout>
  );
}
