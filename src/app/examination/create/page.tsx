"use client";
import HomeLayout from "@/app/layouts/HomeLayout";
import { Breadcrumb, Switch } from "antd";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { usePathname, useSearchParams } from "next/navigation";
import MButton from "@/app/components/config/MButton";
import { useRouter } from "next/navigation";
import Share from "../components/Share";
import ExaminationCodePage, {
  ExaminationCode,
} from "../components/ExaminationCode";
import { RightOutlined } from "@ant-design/icons";
import ValidExamination from "../components/ValidExamination";
import ResultTest from "../components/ResultTest";
import RequireInfo from "../components/RequireInfo";
import PassPoint from "../components/PassPoint";
import PreventTrick from "../components/PreventTrick";
import MTextArea from "@/app/components/config/MTextArea";
import dynamic from "next/dynamic";
import { FormikErrors, useFormik } from "formik";
import Image from "next/image";
import { CameraFilled } from "@ant-design/icons";
import { ExaminationFormData } from "@/data/form_interface";
import { format } from "path";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import {
  createExamination,
  createSessionUpload,
  getExamById,
  getExaminationById,
  updateExamination,
  uploadStudioDocument,
} from "@/services/api_services/examination_api";
import { errorToast, successToast } from "@/app/components/toast/customToast";
import dayjs from "dayjs";
import { ExamData, ExaminationData } from "@/data/exam";
import { v4 as uuidv4 } from "uuid";
const EditorHook = dynamic(
  () => import("../../exams/components/react_quill/EditorWithUseQuill"),
  {
    ssr: false,
  },
);

function CreateExaminationPage({ examination }: any) {
  useEffect(() => {
    loadExam();
    if (examination) {
      console.log("examination", examination);
      setActive(examination?.isActive ?? false);
      setStartTime(
        examination?.validAccessSetting?.validFrom
          ? dayjs(examination?.validAccessSetting?.validFrom).format(dateFormat)
          : undefined,
      );
      setEndTime(
        examination?.validAccessSetting?.validTo
          ? dayjs(examination?.validAccessSetting?.validTo).format(dateFormat)
          : undefined,
      );

      setShare(examination?.sharingSetting ?? "Public");
      if (examination?.accessCodeSettings?.length === 0) {
        setCode(0);
      } else if (examination?.accessCodeSettings?.length === 1) {
        setCode(1);
      } else {
        setCode(2);
      }
      setCodeList(
        examination?.accessCodeSettings?.map((i: any) => {
          return {
            id: uuidv4(),
            createdDate: Date.now(),
            code: i.code,
          };
        }) ?? [],
      );
      var results = Object.keys(examination?.testResultSetting as any)?.filter(
        (s: any) => (examination?.testResultSetting as any)[s],
      );
      setResultChecked(results);

      var required = Object.keys(
        examination?.requiredInfoSetting as any,
      )?.filter((s: any) => (examination?.requiredInfoSetting as any)[s]);
      setInfoChecked(required);

      var tricks = Object.keys(examination?.cheatingSetting as any)?.filter(
        (s: any) => (examination?.cheatingSetting as any)[s],
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

  const [active, setActive] = useState<boolean>(false);
  const [share, setShare] = useState<"Private" | "Public">("Public");
  const [code, setCode] = useState(0);
  const [startTime, setStartTime] = useState<string | undefined>();
  const [endTime, setEndTime] = useState<string | undefined>();
  const [resultChecked, setResultChecked] = useState<any[]>([]);
  const [infoChecked, setInfoChecked] = useState<any[]>([]);
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
      examination?.idExam ? examination?.idExam : examId,
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
  }
  const initialValues: FormValue = {
    one_code:
      examination?.accessCodeSettings?.length == 1
        ? examination?.accessCodeSettings[0].code
        : undefined,

    start_time: examination?.validAccessSetting?.validFrom
      ? dayjs(examination?.validAccessSetting?.validFrom).format(dateFormat)
      : undefined,
    end_time: examination?.validAccessSetting?.validTo
      ? dayjs(examination?.validAccessSetting?.validTo).format(dateFormat)
      : undefined,

    ips: examination?.validAccessSetting?.ipWhiteLists ?? [],
    pass_point: examination?.passingSetting?.passPointPercent?.toString(),
    inform_pass: examination?.passingSetting?.passMessage,
    inform_fail: examination?.passingSetting?.failMessage,
    out_screen: examination?.cheatingSetting?.limitExitScreen?.toString(),
    examination_name: examination?.name,
    avatarId: examination?.idAvatarThumbnail,
    description: examination?.description,
    turn_per_code:
      examination?.accessCodeSettings &&
      examination?.accessCodeSettings?.length != 0
        ? examination?.accessCodeSettings[0].limitOfAccess?.toString()
        : undefined,
  };

  const user = useAppSelector((state: RootState) => state.user.user);

  const validate = (values: FormValue) => {
    const errors: FormikErrors<FormValue> = {};
    if (!values.examination_name) {
      errors.examination_name = "common_not_empty";
    }
    return errors;
  };
  const onSubmit = (e: any) => {
    e.preventDefault();
    // Object.keys(initialValues).map(async (v) => {
    //   await formik.setFieldTouched(v, true);
    // });
    formik.handleSubmit();
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validate,
    onSubmit: async (values: FormValue) => {
      var idAvatarThumbnail;
      setLoading(true);
      if (selectedAvatar) {
        var idSessionData = await createSessionUpload();
        if (idSessionData?.code != 0) {
          errorToast(idSessionData?.message ?? "");
          setLoading(false);
          return;
        }
        var idSession = idSessionData?.data;
        var formData = new FormData();
        formData.append("files", selectedAvatar);
        var avatarIdData = await uploadStudioDocument(idSession, formData);
        if (avatarIdData.code != 0) {
          errorToast(idSessionData?.message ?? "");
          setLoading(false);
          return;
        }
        idAvatarThumbnail = avatarIdData?.data[0];
      }

      var requiredInfoSetting: any = {};
      var cheatingSetting: any = {};
      var testResultSetting: any = {};
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
        isActive: active,
        accessCodeSettings:
          code == 0
            ? []
            : code == 1
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
        linkJoinTest:
          examination?.linkJoinTest ?? "https://e.tmas.vn/demo123_6434",
        passingSetting: {
          passPointPercent: parseFloat(values?.pass_point?.trim() ?? "0"),
          failMessage: values?.inform_fail?.trim(),
          passMessage: values?.inform_pass?.trim(),
        },
        requiredInfoSetting,
        sharingSetting: share,
        idAvatarThumbnail,
        testResultSetting,
        validAccessSetting: {
          ipWhiteLists: formik.values["ips"],
          validFrom: startTime
            ? dayjs(startTime, dateFormat).toISOString()
            : undefined,
          validTo: endTime
            ? dayjs(endTime, dateFormat).toISOString()
            : undefined,
        },
        idExam:
          exam?.id ?? examination?.id ?? search.get("examId") ?? undefined,
      };

      console.log("submitData", submitData);

      // setLoading(false);
      // return;
      //TODO: Tạm tắt update vì đang lổi api chỗ A Dũng và Tiệp
      var dataResults = examination?.id
        ? await updateExamination(submitData)
        : await createExamination(submitData);
      if (dataResults?.code != 0) {
        setLoading(false);
        errorToast(dataResults?.message ?? "");
        return;
      }

      successToast(
        examination
          ? common.t("success_update")
          : common.t("success_create_new"),
      );
      setLoading(false);
      router.push("/examination");
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

  return (
    <HomeLayout>
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
        <Breadcrumb
          className="max-lg:ml-5 mb-3"
          separator={<RightOutlined />}
          items={[
            {
              title: (
                <Link className="body_regular_14" href={"/examination"}>
                  {t("examination_list")}
                </Link>
              ),
            },
            {
              title: examination ? (
                <button className="text-m_neutral_900 body_regular_14">
                  {examination?.name}
                </button>
              ) : (
                <Link
                  className={`${
                    pathname.includes("/examination/create")
                      ? "text-m_neutral_900"
                      : ""
                  } body_regular_14`}
                  href={"/examination/create"}
                >
                  {t("create_examination")}
                </Link>
              ),
            },
          ]}
        />
        <div className=" mt-3 mb-4 flex max-lg:px-5 w-full justify-between ">
          <div className="w-full flex flex-col">
            <div className=" body_semibold_20">{t("create_exam")}</div>
            {examination ? (
              <div className="flex mt-2">
                <Switch checked={active} onChange={(v) => setActive(v)} />{" "}
                <span className="ml-2">{t("activate")}</span>
              </div>
            ) : null}
          </div>
          <div className="flex">
            <MButton
              onClick={() => {
                router.back();
              }}
              type="secondary"
              text={t("reject")}
            />
            {examination ? (
              <>
                <div className="w-4" />
                <MButton text={t("view_result")} />
              </>
            ) : null}
            <div className="w-4" />
            <MButton
              loading={loading}
              onClick={onSubmit}
              text={t("save_info")}
            />
          </div>
        </div>

        <div className="max-lg:mx-5  grid grid-cols-12 gap-6">
          <div className="max-lg:grid-cols-1 max-lg:mb-5 lg:col-span-6 col-span-12  h-fit rounded-lg">
            <Share value={share} setValue={setShare} />
            <div className="h-4" />
            <ExaminationCodePage
              codeList={codeList}
              setCodeList={setCodeList}
              formik={formik}
              value={code}
              setValue={setCode}
            />
            <div className="h-4" />
            <ValidExamination
              startTime={startTime}
              setStartTime={setStartTime}
              endTime={endTime}
              setEndTime={setEndTime}
              formik={formik}
            />
            <div className="h-4" />
            <ResultTest
              checkedList={resultChecked}
              setCheckedList={setResultChecked}
            />
            <div className="h-4" />
            <RequireInfo value={infoChecked} setValue={setInfoChecked} />
            <div className="h-4" />
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
              maxLength={225}
              required
              placeholder={t("enter_examination_name")}
              id="examination_name"
              name="examination_name"
              title={t("examination_name")}
              action={
                <div className="body_regular_14 text-m_neutral_500">
                  {`${formik.values["examination_name"]?.length ?? 0}/225`}
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
            <div className="text-[#4D7EFF] body_regular_14 underline underline-offset-4">
              {exam?.name ?? ""}
            </div>
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
    </HomeLayout>
  );
}

export default CreateExaminationPage;
