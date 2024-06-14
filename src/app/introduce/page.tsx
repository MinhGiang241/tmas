"use client";
import React, { useEffect, useState } from "react";
import { Button, Modal, Tooltip } from "antd";
import Image from "next/image";
import MButton from "../components/config/MButton";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import CreateExaminationIntroduce from "./createExamination/page";
import {
  getTopic,
  getTopicChild,
  onBoardingTopic,
  onBoardingTopicChild,
} from "@/services/api_services/onboarding";
import { createChildsGroup } from "@/services/api_services/exam_api";

export default function Introduce() {
  const user = useSelector((state: RootState) => state.user?.user);
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [value, setValue] = useState<number | undefined>();
  const [dataTopic, setDataTopic] = useState<onBoardingTopic[]>([]);
  const [dataTopicChild, setDataTopicChild] = useState<onBoardingTopicChild[]>(
    []
  );
  const [groupName, setGroupName] = useState<string[]>([]);

  const getDataTopicChild = async () => {
    const res = await getTopicChild();
    console.log("getTopicChild", res);

    if (res) {
      setDataTopicChild(res?.data);
    }
  };

  const getDataTopic = async () => {
    const res = await getTopic();
    // console.log("getDataTopic", res);

    if (res) {
      setDataTopic(res?.data);
    }
  };

  useEffect(() => {
    getDataTopic();
    getDataTopicChild();
  }, []);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  const toggleSelection = (item: onBoardingTopic) => {
    setSelectedItems((prevSelectedItems) => {
      if (prevSelectedItems.includes(item._id!)) {
        return prevSelectedItems.filter((i) => i !== item._id);
      } else if (prevSelectedItems.length < 3) {
        setGroupName((name) => [...name, item.name!]);
        return [...prevSelectedItems, item._id!];
      }
      return prevSelectedItems;
    });
  };

  const handleContinue = () => {
    if (selectedItems.length === 3) {
      setCurrentStep(currentStep + 1);
      var submitData = {
        items: groupName,
        action: "Add",
        level: 0,
        idParent: "",
        studioId: user?.studio?._id,
      };
      createChildsGroup(submitData);
    }
  };

  const handleContinueStep2 = () => {
    if (value) {
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
            <div />
          </div>
          {currentStep === 1 && (
            <div>
              <div className="font-bold text-2xl flex justify-center pb-3">
                Cấu hình đề thi
              </div>
              <div className="flex flex-wrap mb-3">
                {dataTopic.map((x, key) => (
                  <div
                    key={key}
                    onClick={() => toggleSelection(x)}
                    className={`cursor-pointer rounded-md border w-auto mr-2 p-1 px-5 mb-2 ${
                      selectedItems.includes(x._id!)
                        ? "bg-[#E2F0F3] text-[#0B8199] border-[#0B8199]"
                        : ""
                    }`}
                  >
                    {x?.name}
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
                {dataTopicChild?.map((x: any, key: any) => (
                  <div className="pt-3" key={key}>
                    <button
                      onClick={() => {
                        setValue(1);
                      }}
                      className="md:w-[653px] md:h-[64px] w-[300px] h-[50px] flex items-center justify-between bg-[#F4F5F5] px-3 rounded-md cursor-pointer mb-2"
                    >
                      <div>{x?.name}</div>
                      <div className="w-[24px] h-[24px] border-[1px] border-[#9EA3B0] p-2 rounded-full flex justify-center items-center">
                        <div
                          className={`w-[15px] h-[15px] rounded-full ${
                            value === 1 ? "bg-[#0B8199] p-2" : ""
                          }`}
                        />
                      </div>
                    </button>
                  </div>
                ))}
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
                onClick={handleContinueStep2}
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
