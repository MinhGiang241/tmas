import MInput from "@/app/components/config/MInput";
import { Button, ColorPicker, Divider } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { CameraFilled } from "@ant-design/icons";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import MButton from "@/app/components/config/MButton";
import PreviewModal from "./PreviewModal";
import {
  updateStudioInfo,
  uploadFile,
} from "@/services/api_services/account_services";
import toast from "react-hot-toast";
import { errorToast, successToast } from "@/app/components/toast/customToast";
import { StudioFormData } from "@/data/form_interface";
import { getUserMe } from "@/services/api_services/auth_service";
import { setUserData } from "@/redux/user/userSlice";

function StudioInfo() {
  const dispatch = useDispatch();
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

  const [buttonColor, setButtonColor] = useState<string>(
    user.stu_btn_color ?? "7572FF",
  );
  const [textColor, setTextColor] = useState<string>(
    user.stu_text_color ?? "ffffff",
  );

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

  const [error, setError] = useState<string | undefined>();
  const [value, setValue] = useState<string>(user.studio?.studio_name ?? "");
  const validate = () => {
    if (!value) {
      setError("common_not_empty");
    } else {
      setError(undefined);
    }
  };
  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    validate();
  };
  const onBlur = (e: React.FocusEvent<any, Element>) => {
    validate();
  };

  const [openPreview, setOpenPreview] = useState<boolean>(false);
  const onCancelPreview = () => {
    setOpenPreview(false);
  };

  const uploadImage = async (file: any) => {
    var formData = new FormData();
    formData.append("file", file);
    var results = await uploadFile(formData);
    return results;
  };

  const [loadingUpdate, setLoadingUpdate] = useState<boolean>(false);

  const onSubmit = async () => {
    try {
      validate();
      if (error) return;
      setLoadingUpdate(true);
      if (selectedLogo) {
        var logoId = await uploadImage(selectedLogo);
      }
      if (selectedBanner) {
        var bannerId = await uploadImage(selectedBanner);
      }

      var data: StudioFormData = {
        stu_banner: bannerId ?? user.stu_banner,
        stu_btn_color: buttonColor ?? user.stu_btn_color,
        stu_logo: logoId ?? user?.stu_logo,
        studio_name: value ?? user.studio_name,
        stu_text_color: textColor ?? user?.stu_text_color,
      };

      var results = await updateStudioInfo(data);
      var newUser = await getUserMe();
      dispatch(setUserData(newUser["user"]));

      setLoadingUpdate(false);
      successToast(t("success_update_member"));
      console.log(results);
    } catch (e: any) {
      errorToast(e);
      setLoadingUpdate(false);
    }
  };

  return (
    <div className="w-full p-5 flex flex-col">
      <PreviewModal
        textColor={textColor}
        buttonColor={buttonColor}
        company={value}
        logo={previewLogo}
        banner={previewBanner}
        onCancel={onCancelPreview}
        open={openPreview}
      />

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
            loading="lazy"
            className="absolute top-0 bottom-0 right-0 left-0 rounded-[50%]"
            objectFit="cover"
            fill
            src={previewLogo}
            alt="Preview"
          />
        ) : user?.stu_logo ? (
          <Image
            loading="lazy"
            className="absolute top-0 bottom-0 right-0 left-0 rounded-[50%]"
            objectFit="cover"
            fill
            src={`${process.env.NEXT_PUBLIC_API_BC}/headless/stream/upload?load=${user.stu_logo}`}
            alt="Preview"
          />
        ) : (
          <div className="bg-[url('/images/logo-default.png')] bg-no-repeat bg-cover absolute top-2 bottom-2 left-2 right-2 " />
        )}
      </button>
      <div className="h-2" />
      <MInput
        value={value}
        required
        title={t("studio_name")}
        id="studio_name"
        name="studio_name"
        touch={true}
        error={error}
        onChange={onChangeName}
        onBlur={onBlur}
      />
      <div className="italic text-sm">{t("cap_studio_name")}</div>
      <div className="body_semibold_14 mt-6 mb-4 ">{t("banner_studio")}</div>
      <div className="lg:flex items-center  ">
        <button
          onClick={handleButtonBannerClick}
          onMouseOver={() => {
            setShowCamBanner(true);
          }}
          onMouseLeave={() => {
            setShowCamBanner(false);
          }}
          className="flex-1 mb-4 w-full min-h-96 flex justify-center items-center relative "
        >
          {showCamBanner && (
            <div className="z-20">
              <CameraFilled className=" scale-[2] text-white z-20" />
            </div>
          )}
          {previewBanner ? (
            <Image
              loading="lazy"
              className="absolute top-0 bottom-0 right-0 left-0 "
              objectFit="cover"
              fill
              src={previewBanner}
              alt="Preview"
            />
          ) : user?.stu_banner ? (
            <Image
              loading="lazy"
              className="absolute top-0 bottom-0 right-0 left-0 "
              objectFit="cover"
              fill
              src={`${process.env.NEXT_PUBLIC_API_BC}/headless/stream/upload?load=${user.stu_banner}`}
              alt="Preview"
            />
          ) : (
            <div className="hover:bg-neutral-400 absolute top-0 bottom-0 right-0 left-0 bg-[url('/images/logo-default.png')] bg-no-repeat bg-contain w-full max-h-lg" />
          )}
        </button>
        <div className="hidden lg:block w-8" />
        <div className="flex-1 h-full flex flex-col justify-center">
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
          <ColorPicker
            value={textColor}
            onChange={(v) => setTextColor(v.toHex())}
          >
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
        </div>
      </div>

      <div className="w-full flex lg:justify-start my-3 justify-center">
        <MButton
          onClick={() => {
            setOpenPreview(true);
          }}
          // disabled={!previewLogo || !previewBanner}
          type="secondary"
          className="w-36"
          text={t("preview")}
        />
        <div className="w-4" />
        <MButton
          loading={loadingUpdate}
          onClick={onSubmit}
          // disabled={!previewLogo || !previewBanner}
          className="w-36"
          text={common.t("update")}
        />
      </div>
    </div>
  );
}

export default StudioInfo;
