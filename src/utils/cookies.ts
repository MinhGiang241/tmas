import {
  deleteCookie,
  getCookie as getCookiesLib,
  setCookie,
} from "cookies-next";

const getCookie = (key: string) => {
  if (typeof window === "undefined") {
    const { cookies } = require("next/headers");
    return getCookiesLib(key, { cookies }) || null;
  } else {
    return getCookiesLib(key) || null;
  }
};

const setToken = (token: string) => {
  setCookie("__token", token, {
    domain:
      process.env.NODE_ENV !== "development"
        ? process.env.NEXT_PUBLIC_DOMAIN
        : undefined,
  });
};

const getToken = () => getCookie("__token");

const deleteToken = () =>
  deleteCookie("__token", {
    domain:
      process.env.NODE_ENV !== "development"
        ? process.env.NEXT_PUBLIC_DOMAIN
        : undefined,
  });

export { getCookie, setToken, getToken, deleteToken };
