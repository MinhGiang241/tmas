"use client";
import React, { useEffect, useState } from "react";
import { Button, Modal, Tooltip } from "antd";
import Image from "next/image";
import MButton from "../components/config/MButton";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import CreateExaminationIntroduce from "./createExamination/CreateExamination";
import {
  DataGroupChild,
  getExamTopic,
  getListExam,
  getListExamChild,
  getTopic,
  getTopicChild,
  onBoardingTopic,
  trained,
} from "@/services/api_services/onboarding";
import { createExamGroupTest } from "@/services/api_services/exam_api";
import { errorToast, successToast } from "../components/toast/customToast";
import { useRouter } from "next/navigation";
import { BaseTmasQuestionExamData, ExamData, TmasData } from "@/data/exam";
import { DocumentObject, PartObject } from "@/data/form_interface";
import { mapTmasQuestionToStudioQuestion } from "@/services/ui/mapTmasToSTudio";
import _ from "lodash";
import { importTmasExamData } from "@/services/api_services/question_api";
import { countExamQuestion } from "@/services/api_services/count_exam_api";
import { changeStudio } from "@/services/api_services/account_services";
import { setUserData, userClear } from "@/redux/user/userSlice";
import { useAppDispatch } from "@/redux/hooks";
import { UserData } from "@/data/user";
import { deleteToken, setToken } from "@/utils/cookies";

let mapping: { [key: string]: string } = {};
var childrenIds: string[] = [];
export default function Introduce() {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user?.user);
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(true);
  const [selectedItems, setSelectedItems] = useState<onBoardingTopic[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [value, setValue] = useState<number | undefined>();
  const [dataTopic, setDataTopic] = useState<onBoardingTopic[]>([]);
  const [dataTopicChild, setDataTopicChild] = useState<onBoardingTopic[]>([]);
  const [dataExamTopicVersion, setDataExamTopicVersion] = useState([]);
  const [dataTopicNew, setDataTopicNew] = useState<DataGroupChild[]>([]);
  const [dataNewChildren, setDataNewChildren] = useState<
    { id?: string; oldId?: string; [key: string]: any }[]
  >([]);

  const getDataTopic = async () => {
    const res = await getTopic();
    // console.log("getDataTopic", res);

    if (res?.code === 0) {
      setDataTopic(res?.data);
      return;
    }
    errorToast(res?.message ?? "");
  };

  useEffect(() => {
    getDataTopic();
  }, []);

  // const getDataTopicChild = async () => {
  //   const res = await getTopicChild(
  //     selectedItems.map((x: onBoardingTopic) => x?._id)
  //   );
  //   console.log("getTopicChild aa", res);

  //   if (res?.code === 0) {
  //     setDataTopicChild(res?.data);
  //     var a: DataGroupChild[] = selectedItems?.map<DataGroupChild>((e) => {
  //       var children = res?.data
  //         ?.filter((c: any) => c?.parentId == e?._id)
  //         ?.map((r: any) => r?.name);
  //       return {
  //         id: e?._id,
  //         name: e?.name
  //       };
  //     });
  //     setDataTopicNew([...a]);
  //     return;
  //   }
  //   errorToast(res?.message ?? "");
  // };

  const getDataTopicChild = async () => {
    try {
      const res = await getTopicChild(
        selectedItems.map((x: onBoardingTopic) => x?._id)
      );
      console.log("getTopicChild response", res);
      if (res?.code === 0) {
        setDataTopicChild(res?.data);
        var transformedData: DataGroupChild[] = selectedItems.map((item) => {
          var children = res.data
            .filter((w: any) => w.parentId === item._id)
            .map((child: any) => ({ id: child?._id, name: child.name }));
          return {
            parent: {
              id: item._id,
              name: item.name,
            },
            children,
          };
        });
        setDataTopicNew([...transformedData]);
        const listExamChildResponse = await getListExamChild(transformedData);
        const arr = listExamChildResponse?.data?.reduce(
          (a: any, b: any) => [...a, ...b?.children],
          []
        );

        setDataNewChildren(arr);
        dataExamByTopic(res?.data);
      } else {
        errorToast(res?.message ?? "An error occurred");
      }
    } catch (error) {
      console.error("Error in getDataTopicChild:", error);
      errorToast("An unexpected error occurred");
    }
  };

  // useEffect(() => {
  //   if (selectedItems?.length != 0) {
  //     getDataTopicChild();
  //   }
  // }, [selectedItems]);

  const dataExamByTopic = async (childs: onBoardingTopic[]) => {
    console.log("dataTopicChild", childs);

    const res = await getListExam(childs?.map((e) => e._id));
    console.log("getListExam", res?.data);
    if (res) {
      setDataExamTopicVersion(res?.data?.filter(onlyUnique));
    }
  };
  function onlyUnique(value: any, index: any, array: any) {
    return (
      array.findIndex(
        (t: any) => t?.version?.examId == value?.version?.examId
      ) === index
    );
  }
  const dispatch = useAppDispatch();
  const onChangeStudio = async (ownerId?: string) => {
    try {
      var data = await changeStudio(ownerId);
      deleteToken();
      if (sessionStorage.getItem("access_token")) {
        sessionStorage.removeItem("access_token");
        sessionStorage.setItem("access_token", data["token"]);
      } else {
        setToken(data["token"]);
      }
      var userNew = data["user"] as UserData;
      dispatch(userClear({}));
      dispatch(setUserData(userNew));

      // await loadMembersWhenChangeStudio();
      // await loadingQuestionsAndExams(true, userNew.studio?._id);
    } catch (e: any) {}
  };

  useEffect(() => {
    setVisible(true);
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
      // console.log("selectedItems", selectedItems);
      return prevSelectedItems;
    });
  };

  const handleContinue = async () => {
    if (selectedItems.length >= 3) {
      setCurrentStep(currentStep + 1);
      // for (let i of selectedItems) {
      //   let submitData = {
      //     name: i?.name,
      //     level: 0,
      //     studioId: user?.studio?._id,
      //     requiredCheckName: true,
      //   };
      //   var res = await createExamGroupTest(submitData);
      //   if (res?.code != 0) {
      //     continue;
      //   }

      //   var newChildren = dataTopicChild.filter((d) => d.parentId == i?._id);
      //   for (let j of newChildren) {
      //     let submitDataChild = {
      //       name: j.name,
      //       level: 1,
      //       idParent: res.data,
      //       studioId: user?.studio?._id,
      //     };
      //     var res = await createExamGroupTest(submitDataChild);
      //     if (res?.code != 0) {
      //       continue;
      //     }
      //     childrenIds.push(j._id!);
      //     mapping[j._id!] = res.data;
      //   }
      // }

      getDataTopicChild();
    }
  };

  const [active, setActive] = useState<TmasData | undefined>();
  const [idExam, setIdExam] = useState();

  const handleContinueStep2 = async () => {
    var documentObj: DocumentObject[] = (
      active?.version?.examData?.Documents ?? []
    ).map((e) => ({
      contentType: e?.ContentType,
      createdBy: e?.CreatedBy,
      createdTime: e?.CreatedTime,
      fileName: e?.FileName,
      fileSize: e?.FileSize,
      fileType: e?.FileType,
      id: e?.Id,
      idSession: e?.IdSession,
      link: e?.Link,
      ownerId: e?.OwnerId,
      studioId: e?.StudioId,
      updateBy: e?.UpdatedBy,
      updateTime: e?.UpdateTime,
    }));

    var partObj: PartObject[] = (active?.version?.examData?.Parts ?? []).map(
      (e) => ({
        id: e?._id,
        description: e?.Description,
        name: e?.Name,
        jsonExamQuestions: e?.Questions?.map((d) => {
          var q = _.cloneDeep(d?.Base) as BaseTmasQuestionExamData;
          q.IsQuestionBank = false;
          q.GroupQuestionName = d.GroupQuestionName;
          return JSON.stringify(mapTmasQuestionToStudioQuestion(q));
        }),
      })
    );

    var indexIdGroup = dataNewChildren?.findIndex(
      (e) => e?.oldId === active?._id
    );
    console.log("indexIdGroup", indexIdGroup, active, dataNewChildren);

    var groupId =
      indexIdGroup != -1 ? dataNewChildren[indexIdGroup]?.id : undefined;

    var examObj: ExamData = {
      timeLimitMinutes: active?.version?.examData?.TimeLimitMinutes,
      changePositionQuestion: active?.version?.examData?.ChangePositionQuestion,
      description: active?.version?.examData?.Description,
      examNextQuestion: active?.version?.examData?.ExamNextQuestion,
      examViewQuestionType: active?.version?.examData?.ExamViewQuestionType,
      externalLinks: active?.version?.examData?.ExternalLinks,
      idDocuments: active?.version?.examData?.IdDocuments,
      idExamGroup:
        dataNewChildren?.length === 0
          ? undefined
          : indexIdGroup === -1
          ? dataNewChildren[0]?.id
          : groupId,
      idSession: active?.version?.examData?.IdSession,
      studioId: active?.version?.examData?.StudioId,
      name: active?.version?.name,
      numberOfQuestions: active?.version?.examData?.NumberOfQuestions,
      numberOfTests: active?.version?.examData?.NumberOfTests,
      totalPoints: (active?.version?.examData?.TotalPointsAsInt ?? 0) / 100,
      tags: active?.version?.examData?.Tags,
      playAudio: active?.version?.examData?.PlayAudio,
      version: active?.version?.examData?.Version,
      examType: active?.version?.examData?.ExamType,
      scoreRanks: active?.version?.examData?.ScoreRanks,
    };

    var res = await importTmasExamData({
      examFulls: [
        {
          documents: documentObj,
          exam: examObj,
          jsonExamQuestions: (partObj ?? []).reduce(
            (a: any, b: any) => [...a, ...(b?.jsonExamQuestions ?? [])],
            []
          ),
          parts: partObj,
        },
      ],
    });
    setIdExam(res?.data[0]?.idExam);
    // console.log(res?.data[0]?.idExam);
    console.log(res, "examDataa123");

    if (res.code != 0) {
      errorToast(res.message ?? "");
      return;
    }
    if (value != undefined) {
    }
    await countExamQuestion(active?.version?._id);

    setCurrentStep(currentStep + 1);
  };

  return (
    <div>
      <Tooltip
        rootClassName="onboarding"
        title={
          currentStep === 1 ? (
            <div>
              <div>
                Chào <span className="font-medium">{user?.full_name}</span>🖐🏻
              </div>
              Mình là TmasAI 😊, Mình sẽ hỗ trợ bạn trong quá trình sử dụng
              Tmas. Đầu tiên hãy chọn lĩnh vực mà bạn đang quan tâm...
            </div>
          ) : currentStep === 2 ? (
            <div>
              <div>Tuyệt vời🎉</div>
              Dựa theo các lĩnh vực mà bạn đã chọn, Tmas gợi ý các đề thi đã có
              sẵn trên ngân hàng đề thi. Hãy chọn đề thi đầu tiên cho đợt tuyển
              dụng của bạn...
            </div>
          ) : currentStep === 3 ? (
            <div>
              <div>Sắp xong rồi 💪🏻</div>
              Đề thi đã được tạo sẵn cho bạn, Bây giờ hãy tạo đợt thi đầu tiên
              và sẵn sàng gửi tới ứng viên ngay thôi...🥰
            </div>
          ) : (
            <div>
              <div>Hurray!</div>
              Bạn đã hoàn thành tạo đợt thi tuyển đầu tiên từ đề thi{" "}
              {active?.version?.name} trên Tmas. Hãy kiểm tra lại các thông tin
              và gửi tới ứng viên ngay thôi.
            </div>
          )
        }
        color={"#0B8199"}
        placement="leftTop"
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
        closeIcon={
          <div
            className="text-xs text-nowrap text-[#0D1939] border-b border-b-[#0D1939] hover:bg-white min-w-100px mr-6"
            onClick={async () => {
              await trained();
              await onChangeStudio();
              await setOpen(false);
            }}
          >
            Bỏ qua
          </div>
        }
        // onCancel={() => {
        //   setOpen(false);
        // }}
        width={1036}
        footer={null}
        open={open}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <span>Xin chào,</span>
              <span className="font-semibold text-sm ml-2">
                {user?.full_name}
              </span>
            </div>
            <div className="flex justify-center items-center mr-[130px]">
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
              {/* <div className="w-1" />
              <div
                className={`w-[8px] h-[8px] rounded-full ${
                  currentStep >= 4 ? "" : ""
                }`}
              /> */}
            </div>
            {/* <button
              onClick={() => {
                setOpen(false);
              }}
            >
              Bỏ qua
            </button> */}
            <div />
          </div>
          {currentStep === 1 && (
            <div>
              <div className="font-bold text-2xl flex justify-center">
                Chọn lĩnh vực
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
                  (Bạn hãy chọn tối đa 1 đề thi)
                </div>
                {dataExamTopicVersion?.map((x: any, key: any) => (
                  <div className={`pt-3`} key={key}>
                    <button
                      onClick={() => {
                        setValue(key);
                        setActive(x);
                      }}
                      className={`md:w-[653px] md:h-[64px] w-[300px] h-[50px] flex items-center justify-between bg-[#E2F0F3] px-3 rounded-md cursor-pointer mb-2 ${
                        value === key
                          ? "border-[#0B8199] border bg-[#0B8199]"
                          : "bg-[#F4F5F5]"
                      }`}
                    >
                      <div className="font-semibold text-base">
                        {x?.version?.name}
                      </div>
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
                  “{active?.version?.name}”
                </div>
              </div>
              <CreateExaminationIntroduce
                idExam={idExam}
                name={active?.version?.name}
                step={() => {
                  setCurrentStep(4);
                  setOpen(false);
                  setTimeout(() => {
                    onChangeStudio();
                  }, 5000);
                }}
              />
            </div>
          )}
          <div className="flex justify-center items-center">
            {currentStep === 1 && (
              <MButton
                className="w-[168px]"
                htmlType="submit"
                text={"Tiếp tục"}
                disabled={selectedItems.length < 3}
                onClick={() => {
                  handleContinue();
                }}
              />
            )}
            {currentStep === 2 && (
              <MButton
                className="w-[168px]"
                htmlType="submit"
                text={"Tiếp tục"}
                disabled={value == null}
                onClick={() => {
                  handleContinueStep2();
                }}
              />
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
