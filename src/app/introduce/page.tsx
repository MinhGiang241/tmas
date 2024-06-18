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
} from "@/services/api_services/onboarding";
import { createChildsGroup } from "@/services/api_services/exam_api";
import { successToast } from "../components/toast/customToast";
import { useRouter } from "next/navigation";
import { CopyQuestion } from "@/services/api_services/question_api";

export default function Introduce() {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user?.user);
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [value, setValue] = useState<number | undefined>();
  const [dataTopic, setDataTopic] = useState<onBoardingTopic[]>([]);
  const [dataTopicChild, setDataTopicChild] = useState<onBoardingTopic[]>([]);

  const getDataTopic = async () => {
    const res = await getTopic();
    // console.log("getDataTopic", res);
    if (res) {
      setDataTopic(res?.data);
    }
  };

  useEffect(() => {
    getDataTopic();
  }, []);

  const getDataTopicChild = async () => {
    const res = await getTopicChild(selectedItems.map((x: any) => x?._id));
    console.log("getTopicChild", res);
    if (res) {
      setDataTopicChild(res.data);
    }
  };

  useEffect(() => {
    getDataTopicChild();
  }, [selectedItems]);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  function selected(item: onBoardingTopic, arr: any) {
    if (arr.find((i: any) => i._id == item._id)) {
      return [...arr.filter((i: any) => i._id != item._id)];
    } else {
      return [...arr, item];
    }
  }

  const toggleSelection = (item: onBoardingTopic) => {
    setSelectedItems((prevSelectedItems) => {
      prevSelectedItems = selected(item, prevSelectedItems);
      // console.log(selectedItems);
      return prevSelectedItems;
    });
  };

  const handleContinue = () => {
    if (selectedItems.length >= 3) {
      setCurrentStep(currentStep + 1);
      var submitData = {
        items: selectedItems?.map((x: any) => {
          return { name: x?.name };
        }),
        action: "Add",
        level: 0,
        idParent: null,
        studioId: user?.studio?._id,
      };
      // console.log(submitData);
      // console.log(selectedItems, "selectedItems");
      createChildsGroup(submitData);
    }
  };

  const handleContinueStep2 = async () => {
    console.log(dataTopicChild[value as number]?._id);

    if (value) {
      setCurrentStep(currentStep + 1);
      const res = await CopyQuestion(dataTopicChild[value as number]?._id);
      console.log("data res", res);

      var submitDataChild = {
        items: selectedItems?.map((x: any) => {
          return { name: x?.name };
        }),
        action: "Add",
        level: 1,
        idParent: res.data,
        studioId: user?.studio?._id,
      };
      console.log(submitDataChild);

      createChildsGroup(submitDataChild);
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
              <span>Xin chào,</span>
              <span className="font-semibold text-sm ml-2">
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
              <div className="font-bold text-2xl flex justify-center">
                Cấu hình đề thi
              </div>
              <div className="font-normal text-base flex justify-center pb-3">
                (Bạn hãy chọn tối thiểu 3 lĩnh vực quan tâm)
              </div>
              <div className="flex flex-wrap mb-3">
                {dataTopic?.map((x: any, key: any) => (
                  <div
                    key={key}
                    onClick={() => toggleSelection(x)}
                    className={`cursor-pointer rounded-md border w-auto mr-2 p-1 px-5 mb-2 ${
                      selectedItems.some((a: any) => x._id! == a._id)
                        ? "bg-[#E2F0F3] text-[#0B8199] border-[#0B8199] font-semibold text-base"
                        : "font-semibold text-base bg-[#F4F5F5] text-[#B6BAC4]"
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
                  <div className={`pt-3`} key={key}>
                    <button
                      onClick={() => {
                        setValue(key);
                      }}
                      className={`md:w-[653px] md:h-[64px] w-[300px] h-[50px] flex items-center justify-between bg-[#E2F0F3] px-3 rounded-md cursor-pointer mb-2 ${
                        value === key
                          ? "border-[#0B8199] border bg-[#0B8199]"
                          : "bg-[#F4F5F5]"
                      }`}
                    >
                      <div className="font-semibold text-base">{x?.name}</div>
                      <div className="w-[24px] h-[24px] border-[1px] border-[#9EA3B0] p-2 rounded-full flex justify-center items-center">
                        <div
                          className={`w-[15px] h-[15px] rounded-full ${
                            value === key ? "bg-[#0B8199] p-2" : ""
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
                  “{dataTopicChild[value as number]?.name}”
                </div>
              </div>
              <CreateExaminationIntroduce />
            </div>
          )}
          {/* {currentStep === 4 && (
            <div className="flex flex-wrap mb-3">step 4 success</div>
          )} */}
          <div className="flex justify-center items-center">
            {currentStep === 1 && (
              <MButton
                htmlType="submit"
                text={"Tiếp tục"}
                disabled={selectedItems.length < 3}
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
              <MButton
                htmlType="submit"
                text={"Tiếp tục"}
                onClick={() => {
                  successToast(
                    "Chúc mừng bạn đã tạo thành công đợt thi đầu tiên trên Tmas"
                  );
                  setOpen(false);
                  router.push(`/examination/${""}`);
                  // createExamination(submitData);
                }}
              />
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
