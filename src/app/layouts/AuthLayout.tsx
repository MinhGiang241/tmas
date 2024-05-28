import React, {
  ReactNode,
  Suspense,
  cloneElement,
  useEffect,
  useState,
} from "react";
import Image from "next/image";
import useWindowSize from "@/services/ui/useWindowSize";
import LoadingPage from "../loading";
import { redirect } from "next/navigation";
import { SettingData } from "@/data/user";
import { useOnMountUnsafe } from "@/services/ui/useOnMountUnsafe";
import { loadConfig } from "@/services/api_services/account_services";
import { useAppDispatch } from "@/redux/hooks";
import { setSettingConfig } from "@/redux/setting/settingSlice";

function AuthLayout({ children }: { children: ReactNode }) {
  const size = useWindowSize();
  const [loading, setLoading] = useState<boolean>(false);
  const [config, setConfig] = useState<SettingData | undefined>();
  const dispatch = useAppDispatch();

  const getSetting = async () => {
    var res = await loadConfig();
    if (res.code != 0) {
      return;
    }
    setConfig(res.data);
    dispatch(setSettingConfig(res?.data));
  };

  useOnMountUnsafe(() => {
    getSetting();
  });

  return (
    <>
      <div className=" w-full lg:h-screen max-h-screen flex max-lg:justify-center">
        <div className="lg:flex hidden lg:w-1/2 h-full bg-[url('/images/background.png')] bg-cover"></div>
        <div className="overflow-auto lg:w-1/2  w-full  h-full min-h-screen flex flex-col items-center ">
          <div className="flex  flex-col xl:w-3/5 w-5/6 my-6">
            <div className="w-full flex justify-center ">
              <Image
                loading="lazy"
                src="/images/logo.png"
                alt="logo"
                width={size.width <= 1024 ? 250 : 325}
                height={size.width <= 1024 ? 70 : 98}
              />
            </div>
            <div className="h-9" />
            {children}
            <div className="h-4" />
          </div>
        </div>
      </div>
    </>
  );
}

export default AuthLayout;
