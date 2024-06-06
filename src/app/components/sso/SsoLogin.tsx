import { Button, Divider } from "antd";
import { useTranslation } from "react-i18next";
import FacebookIcon from "../icons/facebook.svg";
import GoogleIcon from "../icons/google.svg";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";

function SsoLogin({
  signInFacebook,
  signInGoogle,
  isLogin,
  gLoading,
  fLoading,
}: {
  signInGoogle: Function;
  isLogin?: boolean;
  signInFacebook: Function;
  gLoading?: boolean;
  fLoading?: boolean;
}) {
  const { t } = useTranslation();
  const config = useAppSelector((state: RootState) => state?.setting);

  return (
    <div>
      <div className="w-full relative">
        <Divider className="text-m_neutral_300 w-1/2" />
        <div className="absolute z-10 -translate-y-9 w-full">
          <div className="w-12 text-center caption_regular_14 mx-auto bg-white text-m_neutral_300 z-20">
            {t("or")}
          </div>
        </div>
      </div>
      {/* {value && <div>{value}</div>} */}
      {config?.signin?.google && (
        <div className="w-full relative">
          {!gLoading && (
            <div className="h-full absolute px-4 top-[11px] z-10">
              <GoogleIcon />
            </div>
          )}
          <Button
            loading={gLoading}
            className="w-full mb-4 h-12 "
            onClick={() => signInGoogle()}
          >
            {isLogin ? t("signin_google") : t("register_with_google")}
          </Button>
        </div>
      )}
      {config?.signin?.facebook && (
        <div className="w-full relative">
          {!fLoading && (
            <div className="h-full absolute px-4 top-[11px] z-10">
              <FacebookIcon />
            </div>
          )}

          <Button
            loading={fLoading}
            className="w-full mb-4 h-12 "
            onClick={() => signInFacebook()}
          >
            {isLogin ? t("signin_facebook") : t("register_with_facebook")}
          </Button>
        </div>
      )}
    </div>
  );
}

export default SsoLogin;
