"use client";
import HomeLayout from "@/app/layouts/HomeLayout";
import { Breadcrumb, Switch } from "antd";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { usePathname, useSearchParams } from "next/navigation";
import MButton from "@/app/components/config/MButton";
import { useRouter } from "next/navigation";
import { RightOutlined } from "@ant-design/icons";
import MTextArea from "@/app/components/config/MTextArea";
import dynamic from "next/dynamic";
import { FormikErrors, useFormik } from "formik";
import Image from "next/image";
import { CameraFilled } from "@ant-design/icons";
import { ExaminationFormData } from "@/data/form_interface";
import PreventTrick from "@/app/examination/components/PreventTrick";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import {
  createExamination,
  createSession,
  createSessionUpload,
  getExamById,
  getExaminationById,
  updateExamination,
  uploadStudioDocument,
} from "@/services/api_services/examination_api";
import { errorToast, successToast } from "@/app/components/toast/customToast";
import dayjs from "dayjs";
import { ExamData } from "@/data/exam";
import { v4 as uuidv4 } from "uuid";
import { useOnMountUnsafe } from "@/services/ui/useOnMountUnsafe";
import { parseInt } from "lodash";
import GoldPrice from "@/app/examination/components/GoldPrice";
import Share from "@/app/examination/components/Share";
import ExaminationCodePage, {
  ExaminationCode,
} from "@/app/examination/components/ExaminationCode";
import ValidExamination from "@/app/examination/components/ValidExamination";
import ResultTest from "@/app/examination/components/ResultTest";
import RequireInfo from "@/app/examination/components/RequireInfo";
import PassPoint from "@/app/examination/components/PassPoint";
const EditorHook = dynamic(
  () => import("../../exams/components/react_quill/EditorWithUseQuill"),
  {
    ssr: false,
  }
);

function CreateExaminationIntroduce({ examination }: any) {
  const createSessionId = async () => {
    var dataSessionId = await createSession(examination?.idSession ?? "");
    console.log("dataSessionId", dataSessionId);

    if (dataSessionId?.code == 0) {
      setSessionId(dataSessionId?.data);
    }
  };
  useOnMountUnsafe(createSessionId);
  //  const createSessionId = async () => {
  //   if (isEdit && exam) {
  //     var dataSessionId = await createSession(exam?.idSession);
  //     console.log("dataSessionId edit", dataSessionId);
  //     console.log("exam idSession", exam?.idSession);
  //
  //     if (dataSessionId?.code == 0) {
  //       setIdSession(exam?.idSession);
  //     }
  //   } else if (!isEdit) {
  //     var dataSessionId = await createSession();
  //     console.log("dataSessionId notEdit", dataSessionId);
  //     if (dataSessionId?.code == 0) {
  //       setIdSession(dataSessionId?.data);
  //     }
  //   }
  // };

  useEffect(() => {
    loadExam();
    if (examination) {
      console.log("examination", examination);
      setPush(examination?.isPushToBank ?? false);
      setActive(examination?.isActive ?? false);
      setStartTime(
        examination?.validAccessSetting?.validFrom
          ? dayjs(examination?.validAccessSetting?.validFrom).format(dateFormat)
          : undefined
      );
      setEndTime(
        examination?.validAccessSetting?.validTo
          ? dayjs(examination?.validAccessSetting?.validTo).format(dateFormat)
          : undefined
      );

      setShare(examination?.sharingSetting ?? "Public");
      setCode(examination?.accessCodeSettingType);
      if (examination?.accessCodeSettingType == "MultiCode") {
        setCodeList(
          examination?.accessCodeSettings?.map((i: any) => {
            return {
              id: uuidv4(),
              createdDate: Date.now(),
              code: i.code,
            };
          }) ?? []
        );
      }
      var results = Object.keys(examination?.testResultSetting as any)?.filter(
        (s: any) => (examination?.testResultSetting as any)[s]
      );
      setResultChecked(results);

      var required = Object.keys(
        examination?.requiredInfoSetting as any
      )?.filter((s: any) => (examination?.requiredInfoSetting as any)[s]);
      setInfoChecked(required);

      var tricks = Object.keys(examination?.cheatingSetting as any)?.filter(
        (s: any) => (examination?.cheatingSetting as any)[s]
      );
      setPreventChecked(tricks);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examination]);

  const { t } = useTranslation("exam");
  const common = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const [sessionId, setSessionId] = useState<string | undefined>();
  const [active, setActive] = useState<boolean>(false);
  const [share, setShare] = useState<"Private" | "Public">("Public");
  const [code, setCode] = useState<"None" | "One" | "MultiCode" | undefined>(
    "None"
  );
  const [startTime, setStartTime] = useState<string | undefined>();
  const [endTime, setEndTime] = useState<string | undefined>();
  const [resultChecked, setResultChecked] = useState<any[]>([
    "showPoint",
    "showPercent",
    "showPassOrFailDetail",
  ]);
  const [infoChecked, setInfoChecked] = useState<any[]>(["email", "fullName"]);
  const [preventCheched, setPreventChecked] = useState<any[]>([]);
  const [codeList, setCodeList] = useState<ExaminationCode[]>([]);
  const [exam, setExam] = useState<ExamData | undefined>(undefined);

  const dateFormat = "DD/MM/YYYY HH:mm";
  const search = useSearchParams();

  const loadExam = async () => {
    const examId = search.get("examId");
    if (!examId && !examination?.idExam) {
      return;
    }
    const res = await getExamById(
      examination?.idExam ? examination?.idExam : examId
    );
    if (res.code != 0) {
      errorToast(res?.message ?? "");
      return;
    }
    setExam(res?.data?.records[0]);
  };

  interface FormValue {
    one_code?: string;
    turn_per_code?: string;
    start_time?: string;
    end_time?: string;
    ips?: string[];
    pass_point?: string;
    inform_pass?: string;
    inform_fail?: string;
    out_screen?: string;
    examination_name?: string;
    avatarId?: string;
    description?: string;
    gold_price?: string;
  }
  const initialValues: FormValue = {
    gold_price: examination?.goldSetting?.goldPrice
      ? examination?.goldSetting?.goldPrice?.toString()
      : undefined,
    one_code:
      examination?.accessCodeSettingType == "One"
        ? examination?.accessCodeSettings[0].code
        : undefined,

    start_time: examination?.validAccessSetting?.validFrom
      ? dayjs(examination?.validAccessSetting?.validFrom).format(dateFormat)
      : undefined,
    end_time: examination?.validAccessSetting?.validTo
      ? dayjs(examination?.validAccessSetting?.validTo).format(dateFormat)
      : undefined,

    ips: examination?.validAccessSetting?.ipWhiteLists ?? [],
    pass_point:
      examination?.passingSetting?.passPointPercent?.toString() ?? "80",
    inform_pass:
      examination?.passingSetting?.passMessage ?? "Chúc mừng bạn đã Đạt!", //t("default_pass"),
    inform_fail:
      examination?.passingSetting?.failMessage ??
      "Rất tiếc bạn đã không vượt qua. Chúc bạn lần sau đạt kết quả cao hơn!", //t("default_fail"),
    out_screen: examination?.cheatingSetting?.limitExitScreen?.toString(),
    examination_name: examination?.name,
    avatarId: examination?.idAvatarThumbnail,
    description: examination?.description,
    turn_per_code:
      examination?.accessCodeSettings &&
      examination?.accessCodeSettingType == "MultiCode"
        ? examination?.accessCodeSettings[0]?.limitOfAccess?.toString()
        : undefined,
  };

  const user = useAppSelector((state: RootState) => state.user.user);

  const validate = (values: FormValue) => {
    const errors: FormikErrors<FormValue> = {};
    if (!values.examination_name) {
      errors.examination_name = "common_not_empty";
    }
    if (!values.one_code && code == "One" && share === "Private") {
      errors.one_code = "common_not_empty";
    } else if (
      code == "One" &&
      ((values.one_code ?? [])?.length < 3 ||
        (values.one_code ?? [])?.length > 255) &&
      share === "Private"
    ) {
      errors.one_code = "min_max_one_code";
    }

    if (!values.turn_per_code && code == "MultiCode" && share === "Private") {
      errors.turn_per_code = "common_not_empty";
    }
    if (values?.start_time && !values?.end_time && share === "Private") {
      errors.end_time = "common_not_empty";
    }
    if (!values?.start_time && values?.end_time && share === "Private") {
      errors.start_time = "common_not_empty";
    }

    return errors;
  };
  const onSubmit = (e: any) => {
    e.preventDefault();
    // Object.keys(initialValues).map(async (v) => {
    //   await formik.setFieldTouched(v, true);
    // });
    if (codeList.length == 0 && code == "MultiCode") {
      errorToast(t("list_code_not_empty"));
      return;
    }
    formik.handleSubmit();
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validate,
    onSubmit: async (values: FormValue) => {
      var idAvatarThumbnail = examination?.idAvatarThumbnail;
      setLoading(true);
      if (selectedAvatar) {
        var formData = new FormData();
        formData.append("files", selectedAvatar);
        var avatarIdData = await uploadStudioDocument(sessionId, formData);
        if (avatarIdData.code != 0) {
          errorToast(avatarIdData?.message ?? "");
          createSessionId();
          setLoading(false);
          return;
        }
        idAvatarThumbnail = avatarIdData?.data[0];
      }

      var requiredInfoSetting: any = {
        phoneNumber: false,
        fullName: false,
        idGroup: false,
        birthday: false,
        email: false,
        identifier: false,
        jobPosition: false,
      };
      var cheatingSetting: any = {};
      var testResultSetting: any = {
        showPoint: false,
        showPercent: false,
        showPassOrFail: false,
        showPassOrFailDetail: false,
      };
      for (let i of infoChecked) {
        requiredInfoSetting[i] = true;
      }
      for (let i of preventCheched) {
        if (i == "limitExitScreen") {
          cheatingSetting[i] = formik.values["out_screen"]
            ? parseInt(formik.values["out_screen"])
            : undefined;
        } else {
          cheatingSetting[i] = true;
        }
      }
      for (let i of resultChecked) {
        testResultSetting[i] = true;
      }
      var studio = user.studios?.find((d) => d.ownerId == user.studio?._id);

      const submitData: ExaminationFormData = {
        id: examination?.id,
        accessCodeSettingType: code,
        isActive: active,
        accessCodeSettings:
          code == "None" || share === "Public"
            ? []
            : code == "One"
            ? [
                {
                  //TODO: sửa sau cái này để vì _id trong studio là ownerId
                  studioId: studio?._id,
                  ownerId: user?._id,
                  code: formik.values["one_code"],
                  numberOfAccess: 0,
                },
              ]
            : [
                ...codeList.map((e: any) => ({
                  //TODO: sửa sau cái này để vì _id trong studio là ownerId
                  studioId: studio?._id,
                  ownerId: user?._id,
                  code: e.code,
                  limitOfAccess: formik.values["turn_per_code"]
                    ? parseInt(formik.values["turn_per_code"])
                    : undefined,
                  numberOfAccess: 0,
                })),
              ],
        cheatingSetting,
        description: values?.description?.trim(),
        name: values?.examination_name?.trim(),
        linkJoinTest: examination?.linkJoinTest,
        passingSetting: {
          passPointPercent: values?.pass_point
            ? parseFloat(values?.pass_point?.trim()!)
            : 0,
          failMessage: values?.inform_fail?.trim(),
          passMessage: values?.inform_pass?.trim(),
        },
        requiredInfoSetting:
          share == "Public"
            ? {
                phoneNumber: false,
                fullName: false,
                idGroup: false,
                birthday: false,
                email: false,
                identifier: false,
                jobPosition: false,
              }
            : requiredInfoSetting,
        sharingSetting: share,
        idAvatarThumbnail,
        testResultSetting,
        validAccessSetting:
          share === "Public"
            ? {}
            : {
                ipWhiteLists: formik.values["ips"],
                validFrom: values.start_time
                  ? dayjs(values?.start_time, dateFormat).toISOString()
                  : undefined,
                validTo: values?.end_time
                  ? dayjs(values?.end_time, dateFormat).toISOString()
                  : undefined,
              },
        idExam:
          exam?.id ?? examination?.id ?? search.get("examId") ?? undefined,
        idSession: sessionId,
        isPushToBank: push,
        goldSetting:
          share === "Private"
            ? {}
            : {
                goldPrice: values?.gold_price
                  ? parseInt(values?.gold_price)
                  : undefined,
                isEnable: true,
              },
      };

      console.log("submitData", submitData);

      // setLoading(false);
      // return;

      var dataResults = examination?.id
        ? await updateExamination(submitData)
        : await createExamination(submitData);
      if (dataResults?.code != 0) {
        setLoading(false);
        createSessionId();
        errorToast(dataResults?.message ?? "");
        return;
      }

      successToast(
        examination
          ? common.t("success_update")
          : common.t("success_create_new")
      );
      setLoading(false);
      if (exam) {
        createSessionId();
        router?.refresh();
      }
      router.push(`/examination/${dataResults?.data}`);
    },
  });

  const [selectedAvatar, setSelectedAvatar] = useState<any>(null);
  const [previewAvatar, setPreviewAvatar] = useState<any>(null);

  const avatarRef = useRef<any>(undefined);
  const handleAvatarChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedAvatar(file);
        setPreviewAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const [showCamAvatar, setShowCamAvatar] = useState<boolean>(false);
  const [push, setPush] = useState<boolean>(false);

  return (
    <>
      <form
        onSubmit={(e: any) => {
          e.preventDefault();
        }}
      >
        <input
          accept=".jpg, .png, .jpeg,"
          type="file"
          ref={avatarRef}
          style={{ display: "none" }}
          onChange={handleAvatarChange}
        />
        <div className="h-5" />

        <div className="max-lg:mx-5  grid grid-cols-12 gap-6">
          <div className="max-lg:grid-cols-1 max-lg:mb-5 lg:col-span-6 col-span-12  h-fit rounded-lg">
            <Share
              examination={examination}
              push={push}
              setPush={setPush}
              value={share}
              setValue={setShare}
            />
            <div className="h-4" />
            {share != "Private" && <GoldPrice formik={formik} />}
            {share != "Private" && <div className="h-4" />}
            {share === "Private" && (
              <ExaminationCodePage
                examination={examination}
                codeList={codeList}
                setCodeList={setCodeList}
                formik={formik}
                value={code}
                setValue={setCode}
              />
            )}
            {share === "Private" && <div className="h-4" />}

            {share === "Private" && (
              <ValidExamination
                startTime={startTime}
                setStartTime={setStartTime}
                endTime={endTime}
                setEndTime={setEndTime}
                formik={formik}
              />
            )}
            {share === "Private" && <div className="h-4" />}
            <ResultTest
              checkedList={resultChecked}
              setCheckedList={setResultChecked}
            />

            <div className="h-4" />
            {share === "Private" && (
              <RequireInfo value={infoChecked} setValue={setInfoChecked} />
            )}
            {share === "Private" && <div className="h-4" />}
            <PassPoint formik={formik} />
            <div className="h-4" />
            <PreventTrick
              formik={formik}
              values={preventCheched}
              setValues={setPreventChecked}
            />
            <div className="lg:h-4" />
          </div>
          <div className="max-lg:grid-cols-1 max-lg:mb-5 p-4 lg:col-span-6 col-span-12 bg-white h-fit rounded-lg">
            <MTextArea
              // defaultValue={exam?.name}
              maxLength={255}
              required
              placeholder={t("enter_examination_name")}
              id="examination_name"
              name="examination_name"
              title={t("examination_name")}
              action={
                <div className="body_regular_14 text-m_neutral_500">
                  {`${formik.values["examination_name"]?.length ?? 0}/255`}
                </div>
              }
              formik={formik}
            />
            <EditorHook
              // defaultValue={exam?.description}
              id="description"
              name="description"
              formik={formik}
              title={t("describe")}
              maxLength={500}
            />
            <div className="body_semibold_14 mt-2">{t("web_avatar")}</div>

            <button
              onClick={(e: any) => {
                if (avatarRef) {
                  (avatarRef!.current! as any).click();
                }
              }}
              className="my-2"
            >
              {previewAvatar ? (
                <div
                  onMouseOver={() => {
                    setShowCamAvatar(true);
                  }}
                  onMouseLeave={() => {
                    setShowCamAvatar(false);
                  }}
                  className="relative w-[146px] h-[154px]"
                >
                  {showCamAvatar && (
                    <div className="z-20 bg-neutral-900/40 flex justify-center items-center absolute top-0 bottom-0 right-0 left-0 ">
                      <CameraFilled className=" scale-[2] text-white z-20" />
                    </div>
                  )}
                  <Image
                    loading="lazy"
                    className="absolute top-0 bottom-0 right-0 left-0"
                    objectFit="cover"
                    fill
                    src={previewAvatar}
                    alt="Preview"
                  />
                </div>
              ) : examination?.idAvatarThumbnail ? (
                <div
                  onMouseOver={() => {
                    setShowCamAvatar(true);
                  }}
                  onMouseLeave={() => {
                    setShowCamAvatar(false);
                  }}
                  className="relative w-[146px] h-[154px]"
                >
                  {showCamAvatar && (
                    <div className="z-20 bg-neutral-900/40 flex justify-center items-center absolute top-0 bottom-0 right-0 left-0 ">
                      <CameraFilled className=" scale-[2] text-white z-20" />
                    </div>
                  )}
                  <Image
                    loading="lazy"
                    className="absolute top-0 bottom-0 right-0 left-0"
                    objectFit="cover"
                    fill
                    src={`${process.env.NEXT_PUBLIC_API_STU}/api/studio/Document/download/${examination?.idAvatarThumbnail}`}
                    alt="Preview"
                  />
                </div>
              ) : (
                <div className="w-[146px] h-[154px] border-dashed border flex justify-center items-center">
                  <div className="text-[#4D7EFF] body_regular_14 underline underline-offset-4">
                    {t("pick_image")}
                  </div>
                </div>
              )}
            </button>
            <div className="mb-5 italic text-m_neutral_500">
              {t("web_avatar_limit")}
            </div>

            <div className="body_semibold_14">{t("selected_exam")}</div>
            <Link
              // Link ở đây
              href={`/examination/details?examId=${exam?.id}&examTestId=${
                examination?.id ?? ""
              }`}
              // href={`/exams/details/${exam?.id}`}
              className="text-[#4D7EFF] body_regular_14 underline underline-offset-4"
              target="_blank"
              rel="noopener noreferrer"
            >
              {exam?.name ?? ""}
            </Link>
            {examination?.linkJoinTest ? (
              <>
                <div className="h-4" />
                <div className="body_semibold_14">{t("examination_link")}</div>
                <Link
                  target="_blank"
                  href={examination?.linkJoinTest}
                  className="text-[#4D7EFF] body_regular_14 underline underline-offset-4"
                >
                  {examination?.linkJoinTest ?? ""}
                </Link>
              </>
            ) : null}
            {examination?.linkQRJoinTest ? (
              <>
                <div className="h-4" />
                <div className="body_semibold_14">{t("qr_in")}</div>
                <div className="w-[102px] h-[102px] relative">
                  <Image
                    loading="lazy"
                    objectFit="cover"
                    layout="fill"
                    src={examination?.linkQRJoinTest}
                    alt="Preview"
                  />
                </div>
              </>
            ) : null}
          </div>
        </div>
      </form>
    </>
  );
}

export default CreateExaminationIntroduce;
