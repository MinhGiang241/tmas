"use client";
import React, { useEffect, useState } from "react";
import { Button, Modal, Radio, Space, Tooltip } from "antd";
import Image from "next/image";
import MButton from "../components/config/MButton";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import CreateExaminationIntroduce from "./createExamination/page";

const ITEMS = [
  "IT (Công nghệ thông tin)",
  "Marketing",
  "Thiết kế",
  "Giáo dục",
  "Y tế",
  "Tài chính - Ngân hàng",
];

export default function Introduce() {
  const user = useSelector((state: RootState) => state.user?.user);
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [value, setValue] = useState<number | undefined>();

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  const toggleSelection = (item: string) => {
    setSelectedItems((prevSelectedItems) => {
      if (prevSelectedItems.includes(item)) {
        return prevSelectedItems.filter((i) => i !== item);
      } else if (prevSelectedItems.length < 3) {
        return [...prevSelectedItems, item];
      }
      return prevSelectedItems;
    });
  };

  const handleContinue = () => {
    if (selectedItems.length === 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <div>
      <Tooltip
        title={
          <div>
            Chào {user?.full_name} 🖐🏻 Mình là TmasAI ☺️, Mình sẽ hỗ trợ bạn
            trong quá trình sử dụng Tmas. Đầu tiên hãy chọn lĩnh vực mà bạn đang
            quan tâm...
          </div>
        }
        color={"#0B8199"}
        placement="top"
        visible={visible}
      >
        <Image
          onClick={() => {
            setOpen(true);
          }}
          src="/AI.svg"
          alt="AI icon"
          className="fixed bottom-5 right-5 cursor-pointer"
          width={68}
          height={68}
          priority
        />
      </Tooltip>
      <Modal
        width={1000}
        footer={null}
        open={open}
        onCancel={() => {
          setOpen(false);
        }}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <span>Xin chào</span>
              <span className="font-medium text-sm ml-2">
                {user?.full_name}
              </span>
            </div>
            <div className="flex justify-center items-center mr-[150px]">
              <div
                className={`w-[8px] h-[8px] rounded-full ${
                  currentStep >= 1 ? "bg-black" : "bg-slate-400"
                }`}
              />
              <div className="w-1" />
              <div
                className={`w-[8px] h-[8px] rounded-full ${
                  currentStep >= 2 ? "bg-black" : "bg-slate-400"
                }`}
              />
              <div className="w-1" />
              <div
                className={`w-[8px] h-[8px] rounded-full ${
                  currentStep >= 3 ? "bg-black" : "bg-slate-400"
                }`}
              />
            </div>
            {/* <div className="cursor-pointer" onClick={() => setOpen(false)}>
              Bỏ qua
            </div> */}
            <div />
          </div>
          {currentStep === 1 && (
            <div>
              <div className="font-bold text-2xl flex justify-center pb-3">
                Cấu hình đề thi
              </div>
              <div className="flex flex-wrap mb-3">
                {ITEMS.map((item) => (
                  <div
                    key={item}
                    onClick={() => toggleSelection(item)}
                    className={`cursor-pointer rounded-md border w-auto mr-2 p-1 px-5 mb-2 ${
                      selectedItems.includes(item)
                        ? "bg-[#E2F0F3] text-[#0B8199] border-[#0B8199]"
                        : ""
                    }`}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}
          {currentStep === 2 && (
            <div className="flex flex-wrap mb-3 justify-center">
              <div className="flex justify-center flex-col items-center">
                <div className="font-bold text-2xl">Cấu hình đề thi</div>
                <div className="font-normal text-base">
                  (Bạn hãy chọn tối thiểu 1 đề thi)
                </div>
                <div className="pt-3">
                  <button
                    onClick={() => {
                      setValue(1);
                    }}
                    className="md:w-[653px] md:h-[64px] w-[300px] h-[50px] flex items-center justify-between bg-[#F4F5F5] px-3 rounded-md cursor-pointer mb-2"
                  >
                    <div>Đề thi tuyển dụng fresher Kế toán</div>
                    <div className="w-[24px] h-[24px] border-[1px] border-[#9EA3B0] p-2 rounded-full flex justify-center items-center">
                      <div
                        className={`w-[15px] h-[15px] rounded-full ${
                          value === 1 ? "bg-[#0B8199] p-2" : ""
                        }`}
                      />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}
          {currentStep === 3 && (
            <div className="flex flex-wrap mb-3">
              <div className="flex flex-col m-auto items-center">
                <div className="font-bold text-2xl">
                  Cấu hình đợt thi với đề thi
                </div>
                <div className="font-bold text-2xl">
                  “Tuyển dụng Fresher Kế toán”
                </div>
              </div>
              <CreateExaminationIntroduce />
            </div>
          )}
          {currentStep === 4 && (
            <div className="flex flex-wrap mb-3">step 4 success</div>
          )}
          <div className="flex justify-center items-center">
            {currentStep === 1 && (
              <MButton
                htmlType="submit"
                text={"Tiếp tục"}
                disabled={selectedItems.length !== 3}
                onClick={handleContinue}
              />
            )}
            {currentStep === 2 && (
              <MButton
                htmlType="submit"
                text={"Tiếp tục"}
                disabled={value == null}
                onClick={handleContinue}
              />
            )}
            {currentStep === 3 && (
              <MButton htmlType="submit" text={"Tiếp tục"} />
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
