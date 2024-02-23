"use client";
import BaseModal, { BaseModalProps } from "@/app/components/config/BaseModal";
import useWindowSize from "@/services/ui/useWindowSize";
import React from "react";
import Image from "next/image";
import { Button, Divider } from "antd";
import { useTranslation } from "react-i18next";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
// import "./full-modal.css";

interface Props extends BaseModalProps {
  buttonColor?: string;
  textColor?: string;
  logo?: any;
  banner?: any;
  company?: string;
}

function PreviewModal(props: Props) {
  const user = useSelector((state: RootState) => state.user);
  const size = useWindowSize();
  const { t } = useTranslation("account");

  return (
    <BaseModal
      offPadding
      centered={size.width <= 1024 ? false : true}
      // width={size.width <= 1024 ? size.width - 20 : size.width * 0.85}
      width={size.width}
      {...props}
    >
      <div className=" flex max-lg:flex-col w-full">
        <div className={`relative w-full lg:w-1/2  lg:min-h-[700px] h-screen`}>
          {props.banner ? (
            <Image
              loading="lazy"
              className=""
              objectFit="cover"
              layout="fill"
              src={props.banner}
              alt="banner"
            />
          ) : user?.stu_banner ? (
            <Image
              loading="lazy"
              className=""
              objectFit="cover"
              layout="fill"
              src={`${process.env.NEXT_PUBLIC_API_BC}/headless/stream/upload?load=${user.stu_banner}`}
              alt="banner"
            />
          ) : (
            <Image
              loading="lazy"
              className=""
              objectFit="cover"
              layout="fill"
              src={`images/empty.png`}
              alt="banner"
            />
          )}
        </div>
        <div className="relative items-center w-full lg:w-1/2 flex flex-col lg:min-h-[700px] ">
          <div className="relative w-16 h-16 rounded-[50%] mt-7 ">
            {props.logo ? (
              <Image
                loading="lazy"
                className=" rounded-[50%]"
                objectFit="cover"
                layout="fill"
                src={props.logo}
                alt="logo"
              />
            ) : user?.stu_logo ? (
              <Image
                loading="lazy"
                className="rounded-[50%]"
                objectFit="cover"
                layout="fill"
                src={`${process.env.NEXT_PUBLIC_API_BC}/headless/stream/upload?load=${user.stu_logo}`}
                alt="logo"
              />
            ) : (
              <Image
                loading="lazy"
                className="rounded-[50%]"
                objectFit="cover"
                layout="fill"
                src={`images/logo-default.png`}
                alt="logo"
              />
            )}
          </div>
          <div className="body_semibold_16">{props.company} </div>
          <div className="w-2/3">
            <Divider className="mt-2 mb-6" />
          </div>
          <div className="title_bold_24">{t("test")}</div>
          <div className="relative h-48 w-48 mt-7 mb-3">
            <Image
              loading="lazy"
              className=""
              objectFit="cover"
              layout="fill"
              src={"/images/qr-default.png"}
              alt="Preview"
            />
          </div>
          <div className="body_regular_14">{t("studio_qr")}</div>
          <div className="lg:h-20 h-10" />
          <Button
            style={{
              background: `#${props.buttonColor}`,
              color: `#${props.textColor}`,
            }}
            className="rounded-lg h-12 w-52 caption_semibold_14"
          >
            {t("join_now")}
          </Button>
          <div className="max-lg:h-10" />
        </div>
      </div>
      {/* <div className="h-8" /> */}
    </BaseModal>
  );
}

export default PreviewModal;
