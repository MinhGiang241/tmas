import { Button, Divider } from "antd";
import { useTranslation } from "react-i18next";
import FacebookIcon from "../icons/facebook.svg";
import GoogleIcon from "../icons/google.svg";

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

  return (
    <div>
      <div className="w-full relative">
        <Divider className="text-m_neutral_300 w-1/2" />
        <div className="absolute z-10 -translate-y-9 w-full">
          <div className="w-4 text-sm mx-auto bg-white text-m_neutral_300 z-20">
            {t("or")}
          </div>
        </div>
      </div>
      {/* {value && <div>{value}</div>} */}
      <div className="w-full relative">
        {!gLoading && (
          <div className="h-full absolute px-4 top-[11px] z-10">
            <GoogleIcon />
          </div>
        )}
        <Button
          loading={gLoading}
          className="w-full mb-4 h-12 text-m_primary_900"
          onClick={() => signInGoogle()}
        >
          {isLogin ? t("signin_google") : t("register_with_google")}
        </Button>
      </div>
      <div className="w-full relative">
        {!fLoading && (
          <div className="h-full absolute px-4 top-[11px] z-10">
            <FacebookIcon />
          </div>
        )}

        <Button
          loading={fLoading}
          className="w-full mb-4 h-12 text-m_primary_900"
          onClick={() => signInFacebook()}
        >
          {isLogin ? t("signin_facebook") : t("register_with_facebook")}
        </Button>
      </div>
    </div>
  );
}

export default SsoLogin;
