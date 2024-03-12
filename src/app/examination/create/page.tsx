"use client";
import HomeLayout from "@/app/layouts/HomeLayout";
import { Breadcrumb } from "antd";
import React, { useRef, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { usePathname } from "next/navigation";
import MButton from "@/app/components/config/MButton";
import { useRouter } from "next/navigation";
import Share from "../components/Share";
import ExaminationCode from "../components/ExaminationCode";
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
const EditorHook = dynamic(
  () => import("../../exams/components/react_quill/EditorWithUseQuill"),
  {
    ssr: false,
  },
);

function CreateExaminationPage() {
  const { t } = useTranslation("exam");
  const common = useTranslation();
  const pathname = usePathname();
  const router = useRouter();

  const [share, setShare] = useState(0);
  const [code, setCode] = useState(0);
  const [startTime, setStartTime] = useState<string | undefined>();
  const [endTime, setEndTime] = useState<string | undefined>();
  const [ips, setIps] = useState<string[]>([]);
  const [resultChecked, setResultChecked] = useState<any[]>([]);
  const [infoChecked, setInfoChecked] = useState<any[]>([]);
  const [passPoint, setPassPoint] = useState<string | undefined>();
  const [informWhenPass, setInformWhenPass] = useState<string | undefined>();
  const [informWhenFail, setInformWhenFail] = useState<string | undefined>();
  const [preventCheched, setPreventChecked] = useState<any[]>([]);
  const [numOut, setNumOut] = useState<string | undefined>();

  interface FormValue {}
  const initialValues: FormValue = {};

  const validate = (values: FormValue) => {
    const errors: FormikErrors<FormValue> = {};

    return errors;
  };
  const onSubmit = (e: any) => {
    e.preventDefault();
    Object.keys(initialValues).map(async (v) => {
      await formik.setFieldTouched(v, true);
    });
    formik.handleSubmit();
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validate,
    onSubmit: async (values: FormValue) => {},
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
            title: (
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
      <div className=" flex max-lg:px-5 w-full justify-between mb-3">
        <div className="my-3 body_semibold_20">{t("create_exam")}</div>
        <div className="flex">
          <MButton
            onClick={() => {
              router.back();
            }}
            type="secondary"
            text={t("reject")}
          />
          <div className="w-4" />
          <MButton
            // loading={loading}
            // onClick={onSubmit}
            text={t("save_info")}
          />
        </div>
      </div>

      <div className="max-lg:mx-5  grid grid-cols-12 gap-6">
        <div className="max-lg:grid-cols-1 max-lg:mb-5 lg:col-span-6 col-span-12  h-fit rounded-lg">
          <Share value={share} setValue={setShare} />
          <div className="h-4" />
          <ExaminationCode value={code} setValue={setCode} />
          <div className="h-4" />
          <ValidExamination
            startTime={startTime}
            setStartTime={setStartTime}
            endTime={endTime}
            setEndTime={setEndTime}
            ips={ips}
            setIps={setIps}
          />
          <div className="h-4" />
          <ResultTest
            checkedList={resultChecked}
            setCheckedList={setResultChecked}
          />
          <div className="h-4" />
          <RequireInfo value={infoChecked} setValue={setInfoChecked} />
          <div className="h-4" />
          <PassPoint
            passPoint={passPoint}
            setPassPoint={setPassPoint}
            informWhenFail={informWhenFail}
            setInformWhenFail={setInformWhenFail}
            setInformWhenPass={setInformWhenPass}
          />
          <div className="h-4" />
          <PreventTrick
            numOut={numOut}
            setNumOut={setNumOut}
            values={preventCheched}
            setValues={setPreventChecked}
          />
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
                {/* {`${formik.values["exam_name"]?.length ?? 0}/225`} */}
              </div>
            }
            formik={formik}
          />
          <EditorHook
            // defaultValue={exam?.description}
            id="describe"
            name="describe"
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
        </div>
      </div>
    </HomeLayout>
  );
}

export default CreateExaminationPage;
