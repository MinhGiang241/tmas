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
  const [showCam, setShowCam] = useState<boolean>(false);
  const { t } = useTranslation("account");
  const common = useTranslation();
  const user = useSelector((state: RootState) => state.user);

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState<any>("");
  const fileInputRef = useRef(null);

  const [buttonColor, setButtonColor] = useState<string>("fff");
  const [textColor, setTextColor] = useState<string>("fff");

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFile(file);
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef) {
      (fileInputRef!.current! as any).click();
    }
  };

  useEffect(() => {}, [buttonColor, textColor]);

  return (
    <div className="w-full p-5 flex flex-col">
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <div className="w-full mt-2 title_semibold_20">
        {t("business_information")}
      </div>
      <Divider className="my-5" />
      <div className="body_semibold_14 mb-4">{t("logo")}</div>

      <button
        onClick={handleButtonClick}
        onMouseOver={() => {
          setShowCam(true);
        }}
        onMouseLeave={() => {
          setShowCam(false);
        }}
        className="hover:bg-neutral-400 mb-4 w-[76px] h-[76px] rounded-full border border-m_primary_900 flex justify-center items-center relative "
      >
        {showCam && (
          <div className="z-20">
            <CameraFilled className=" scale-[2] text-white z-20" />
          </div>
        )}
        {preview ? (
          <Image
            className="absolute top-0 bottom-0 right-0 left-0 rounded-[50%]"
            objectFit="cover"
            fill
            // objectFit="fill"
            // width={76}
            // height={76}
            src={preview}
            alt="Preview"
          />
        ) : (
          <div
            className={` ${
              !preview
                ? "bg-[url('/images/logo-default.png')] bg-no-repeat bg-cover"
                : ""
            }  absolute top-2 bottom-2 left-2 right-2`}
          >
            {preview && (
              <Image
                className="absolute top-0 bottom-0 right-0 left-0 rounded-[50%]"
                objectFit="cover"
                fill
                // objectFit="fill"
                // width={76}
                // height={76}
                src={preview}
                alt="Preview"
              />
            )}
          </div>
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
      <div className="body_semibold_14">{t("color_button")}</div>
      <ColorPicker
        value={buttonColor}
        onChange={(v) => setButtonColor(v.toHex())}
      >
        <button
          style={{ background: `#${buttonColor}` }}
          className={`h-12 w-full rounded-lg border border-m_primary_900`}
        />
      </ColorPicker>
      <div className="body_semibold_14">{t("color_text")}</div>
      <ColorPicker value={textColor} onChange={(v) => setTextColor(v.toHex())}>
        <button
          style={{ background: `#${textColor}` }}
          className={`h-12 w-full rounded-lg border border-m_primary_900`}
        />
      </ColorPicker>

      <div className="body_semibold_14">{"Preview"}</div>
      <Button
        style={{ background: `#${buttonColor}`, color: `#${textColor}` }}
        className={`w-[107px] h-[40px] mb-4 rounded-lg`}
      >
        {t("sample")}
      </Button>
      <MButton className="w-36" text={t("preview")} />
    </div>
  );
}

export default StudioInfo;
