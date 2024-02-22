import MInput from "@/app/components/config/MInput";
import { Button, ColorPicker, Divider } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { CameraFilled } from "@ant-design/icons";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import MButton from "@/app/components/config/MButton";

function StudioInfo() {
  const [showCamLogo, setShowCamLogo] = useState<boolean>(false);
  const [showCamBanner, setShowCamBanner] = useState<boolean>(false);
  const { t } = useTranslation("account");
  const common = useTranslation();
  const user = useSelector((state: RootState) => state.user);

  const [selectedLogo, setSelectedLogo] = useState(null);
  const [selectedBanner, setSelectedBanner] = useState(null);

  const [previewLogo, setPreviewLogo] = useState<any>("");
  const [previewBanner, setPreviewBanner] = useState<any>("");

  const logoInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  const [buttonColor, setButtonColor] = useState<string>("7572FF");
  const [textColor, setTextColor] = useState<string>("ffffff");

  const handleLogoChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedLogo(file);
        setPreviewLogo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedBanner(file);
        setPreviewBanner(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleButtonLogoClick = () => {
    if (logoInputRef) {
      (logoInputRef!.current! as any).click();
    }
  };

  const handleButtonBannerClick = () => {
    if (bannerInputRef) {
      (bannerInputRef!.current! as any).click();
    }
  };
  return (
    <div className="w-full p-5 flex flex-col">
      <input
        accept=".svg,.jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*"
        type="file"
        ref={logoInputRef}
        style={{ display: "none" }}
        onChange={handleLogoChange}
      />
      <input
        accept=".svg,.jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*"
        type="file"
        ref={bannerInputRef}
        style={{ display: "none" }}
        onChange={handleBannerChange}
      />
      <div className="w-full mt-2 title_semibold_20">
        {t("business_information")}
      </div>
      <Divider className="my-5" />
      <div className="body_semibold_14 mb-4">{t("logo")}</div>

      <button
        onClick={handleButtonLogoClick}
        onMouseOver={() => {
          setShowCamLogo(true);
        }}
        onMouseLeave={() => {
          setShowCamLogo(false);
        }}
        className="hover:bg-neutral-400 mb-4 w-[76px] h-[76px] rounded-full border border-m_primary_900 flex justify-center items-center relative "
      >
        {showCamLogo && (
          <div className="z-20">
            <CameraFilled className=" scale-[2] text-white z-20" />
          </div>
        )}
        {previewLogo ? (
          <Image
            className="absolute top-0 bottom-0 right-0 left-0 rounded-[50%]"
            objectFit="cover"
            fill
            src={previewLogo}
            alt="Preview"
          />
        ) : (
          <div
            className={` ${
              !previewLogo
                ? "bg-[url('/images/logo-default.png')] bg-no-repeat bg-cover"
                : ""
            }  absolute top-2 bottom-2 left-2 right-2`}
          ></div>
        )}
      </button>

      <MInput
        value={user.studio?.full_name}
        required
        title={t("studio_name")}
        id="studio_name"
        name="studio_name"
      />
      <div className="italic text-sm">{t("cap_studio_name")}</div>
      <div className="body_semibold_14 mt-2 mb-4">{t("banner_studio")}</div>

      <button
        onClick={handleButtonBannerClick}
        onMouseOver={() => {
          setShowCamBanner(true);
        }}
        onMouseLeave={() => {
          setShowCamBanner(false);
        }}
        className="0 mb-4 w-full min-h-80 sm:min-h-[500px] flex justify-center items-center relative "
      >
        {showCamBanner && (
          <div className="z-20">
            <CameraFilled className=" scale-[2] text-white z-20" />
          </div>
        )}
        {previewBanner ? (
          <Image
            className="absolute top-0 bottom-0 right-0 left-0 "
            objectFit="cover"
            fill
            src={previewBanner}
            alt="Preview"
          />
        ) : (
          <div className="hover:bg-neutral-400 absolute top-0 bottom-0 right-0 left-0 bg-[url('/images/banner-default.jpeg')] bg-no-repeat bg-cover w-full max-h-lg" />
        )}
      </button>

      <div className="body_semibold_14 mb-1">{t("color_button")}</div>
      <ColorPicker
        value={buttonColor}
        onChange={(v) => setButtonColor(v.toHex())}
      >
        <button
          style={{ background: `#${buttonColor}` }}
          className={`h-12 w-full rounded-lg border border-m_primary_900`}
        />
      </ColorPicker>
      <div className="body_semibold_14 mt-4 mb-1">{t("color_text")}</div>
      <ColorPicker value={textColor} onChange={(v) => setTextColor(v.toHex())}>
        <button
          style={{ background: `#${textColor}` }}
          className={`h-12 w-full rounded-lg border border-m_primary_900`}
        />
      </ColorPicker>

      <div className="body_semibold_14 mt-4">{"Preview"}</div>
      <div className="w-full flex justify-center mb-2">
        <Button
          style={{ background: `#${buttonColor}`, color: `#${textColor}` }}
          className={`w-[107px] h-[40px] mb-4 rounded-lg body_semibold_16`}
        >
          {t("sample")}
        </Button>
      </div>
      <div className="w-full flex justify-center">
        <MButton type="secondary" className="w-36" text={t("preview")} />
        <div className="w-4" />
        <MButton className="w-36" text={common.t("update")} />
      </div>
    </div>
  );
}

export default StudioInfo;
