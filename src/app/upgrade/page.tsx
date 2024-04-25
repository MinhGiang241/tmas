"use client";
import React, { useEffect, useState } from "react";
import HomeLayout from "../layouts/HomeLayout";
import Tick from "@/app/components/icons/tick-circle.svg";
import ConfirmModal from "../components/modals/ConfirmModal";
import { successToast } from "../components/toast/customToast";
import { useRouter } from "next/navigation";
import { loadPackage } from "@/services/api_services/upgrade";

export default function Upgrage() {
  const [data, setData] = useState<any>();
  // const router = useRouter();

  const load = async () => {
    const res = await loadPackage()
    if (res) {
      setData(res?.data)
      console.log("res", res?.data);
    }
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <HomeLayout>
      {/* <ConfirmModal
                text={"Gửi yêu cầu báo giá thành công"}
                // action={t("delete")}
                open={open}
                onCancel={() => { setOpen(false) }}
                onOk={() => ("")}
            /> */}
      <div className="h-2" />
      <div className="w-full max-lg:px-3 mb-5">
        <div className="body_semibold_20 mt-3 w-full flex justify-between items-center">
          <div>Nâng cấp gói dịch vụ</div>
        </div>
        <div className="pt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* <div className="max-md:col-span-1 md:col-span-2 lg:col-span-1 border boder-m_neutral_200 rounded-xl bg-white p-6 gap-6">
            <div className="body_bold_16">Free</div>
            <div className="flex items-center">
              <div className="body_semibold_20 pr-1 title_regular_20">
                0 VNĐ
              </div>
              <div className="text-m_neutral_500 body_regular_14">/Tháng</div>
            </div>
            <div className="py-5 w-full">
              <div className="flex">
                <Tick className="w-7" />
                <div className="body_regular_14 text-m_neutral_900">
                  Mở khoá toàn bộ tính năng
                </div>
              </div>
              <div className="flex py-2">
                <Tick className="w-7" />
                <div className="body_regular_14 text-m_neutral_900">
                  Tạo đề thi online dễ dàng
                </div>
              </div>
              <div className="flex py-2 ">
                <Tick className="w-7" />
                <div className="body_regular_14 text-m_neutral_900">
                  Tổ chức nhiều đợt thi cùng lúc
                </div>
              </div>
              <div className="flex py-2 ">
                <Tick className="w-7" />
                <div className="body_regular_14 text-m_neutral_900">
                  300+ đề thi mẫu
                </div>
              </div>
              <div className="flex py-2 ">
                <Tick className="w-7" />
                <div className="body_regular_14 text-m_neutral_900">
                  Báo cáo thống kê
                </div>
              </div>
              <div className="flex py-2 ">
                <Tick className="w-7" />
                <div className="body_regular_14 text-m_neutral_900">
                  50 lượt test mỗi tháng
                </div>
              </div>
              <div className="flex py-2 ">
                <Tick className="w-7" />
                <div className="body_regular_14 text-m_neutral_900">
                  Hỗ trợ trong giờ hành chính 24/7
                </div>
              </div>
            </div>
            <hr />
            <div className="pt-8">
              <button className="flex justify-center items-center rounded-lg w-full h-[44px] bg-m_neutral_200 body_semibold_14 text-m_neutral_500">
                Miễn phí
              </button>
            </div>
          </div>
          <div className="max-md:col-span-1 md:col-span-2 lg:col-span-1 border border-m_upgrade_300 rounded-xl bg-white gap-6">
            <div className="flex justify-end">
              <div className="text-white text-center text-xs font-semibold h-6 bg-m_upgrade_300 w-32 rounded-bl-md rounded-tr-md flex items-center justify-center">
                Đang xử dụng
              </div>
            </div>
            <div className="p-6 pt-0 pb-0">
              <div className="body_bold_16">Starter</div>
              <div className="flex items-center">
                <div className="body_semibold_20 pr-1 title_regular_20">
                  3.000.000 VNĐ
                </div>
                <div className="text-m_neutral_500 body_regular_14">/Tháng</div>
              </div>
              <div className="py-5 w-full">
                <div className="flex">
                  <Tick className="w-7" />
                  <div className="body_regular_14 text-m_neutral_900">
                    Mở khoá toàn bộ tính năng
                  </div>
                </div>
                <div className="flex py-2">
                  <Tick className="w-7" />
                  <div className="body_regular_14 text-m_neutral_900">
                    Tạo đề thi online dễ dàng
                  </div>
                </div>
                <div className="flex py-2 ">
                  <Tick className="w-7" />
                  <div className="body_regular_14 text-m_neutral_900">
                    Tổ chức nhiều đợt thi cùng lúc
                  </div>
                </div>
                <div className="flex py-2 ">
                  <Tick className="w-7" />
                  <div className="body_regular_14 text-m_neutral_900">
                    300+ đề thi mẫu
                  </div>
                </div>
                <div className="flex py-2 ">
                  <Tick className="w-7" />
                  <div className="body_regular_14 text-m_neutral_900">
                    Báo cáo thống kê
                  </div>
                </div>
                <div className="flex py-2 ">
                  <Tick className="w-7" />
                  <div className="body_regular_14 text-m_neutral_900">
                    50 lượt test mỗi tháng
                  </div>
                </div>
                <div className="flex py-2 ">
                  <Tick className="w-7" />
                  <div className="body_regular_14 text-m_neutral_900">
                    Hỗ trợ trong giờ hành chính 24/7
                  </div>
                </div>
              </div>
            </div>
            <hr />
            <div className="pt-8 px-6">
              <button className="flex justify-center items-center rounded-lg w-full h-[44px] bg-m_neutral_200 body_semibold_14 text-m_neutral_500">
                Thời hạn: 12/2023 - 12/2024
              </button>
            </div>
          </div>
          <div className="max-md:col-span-1 md:col-span-2 lg:col-span-1 border boder-m_neutral_200 rounded-xl bg-white p-6 gap-6">
            <div className="body_bold_16">Bussiness</div>
            <div className="flex items-center">
              <div className="body_semibold_20 pr-1 title_regular_20">
                6.000.000 VNĐ
              </div>
              <div className="text-m_neutral_500 body_regular_14">/Tháng</div>
            </div>
            <div className="py-5 w-full">
              <div className="flex">
                <Tick className="w-7" />
                <div className="body_regular_14 text-m_neutral_900">
                  Mở khoá toàn bộ tính năng
                </div>
              </div>
              <div className="flex py-2">
                <Tick className="w-7" />
                <div className="body_regular_14 text-m_neutral_900">
                  Tạo đề thi online dễ dàng
                </div>
              </div>
              <div className="flex py-2 ">
                <Tick className="w-7" />
                <div className="body_regular_14 text-m_neutral_900">
                  Tổ chức nhiều đợt thi cùng lúc
                </div>
              </div>
              <div className="flex py-2 ">
                <Tick className="w-7" />
                <div className="body_regular_14 text-m_neutral_900">
                  300+ đề thi mẫu
                </div>
              </div>
              <div className="flex py-2 ">
                <Tick className="w-7" />
                <div className="body_regular_14 text-m_neutral_900">
                  Báo cáo thống kê
                </div>
              </div>
              <div className="flex py-2 ">
                <Tick className="w-7" />
                <div className="body_regular_14 text-m_neutral_900">
                  50 lượt test mỗi tháng
                </div>
              </div>
              <div className="flex py-2 ">
                <Tick className="w-7" />
                <div className="body_regular_14 text-m_neutral_900">
                  Hỗ trợ trong giờ hành chính 24/7
                </div>
              </div>
            </div>
            <hr />
            <div className="pt-8">
              <button
                onClick={() => {
                  router.push("/payment");
                }}
                className="flex justify-center items-center rounded-lg w-full h-[44px] bg-m_primary_500 body_semibold_14 text-white"
              >
                Đăng kí ngay
              </button>
            </div>
          </div> */}
          {data?.map((x: any, key: any) => (
            <div key={key} className="max-md:col-span-1 md:col-span-2 lg:col-span-1 border boder-m_neutral_200 rounded-xl bg-white p-6 gap-6 relative">
              <div className="body_bold_16">{x?.name}</div>
              <div className="flex items-center">
                <div className="body_semibold_20 pr-1 title_regular_20">{x?.price}</div>
                <div className='text-m_neutral_500 body_regular_14'>/ {x?.unit === "year" ? "Năm" : x?.unit === "month" ? "Tháng" : x?.unit === "day" ? "Ngày" : ""}</div>
              </div>
              <div className="py-5 w-full  ">
                {x?.features?.map((e: any, key: any) => (
                  <div key={key} className="flex">
                    <Tick className="min-w-7" />
                    <div className="body_regular_14 text-m_neutral_900">{e?.text}</div>
                  </div>
                ))}
              </div>
              <div className="h-16" />
              <div className="absolute bottom-0 w-[222px]">
                <hr />
                <button
                  onClick={() => {
                    successToast("Gửi yêu cầu báo giá thành công !");
                  }}
                  className="flex justify-center items-center rounded-lg w-full h-[44px] bg-m_primary_500 body_semibold_14 text-white my-4"
                >
                  Nhận báo giá
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </HomeLayout>
  );
}
