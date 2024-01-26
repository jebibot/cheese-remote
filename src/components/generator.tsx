"use client";

import { ReactNode, useMemo, useState } from "react";
import UrlBox from "./url-box";

interface GeneratorProps {
  linkIcon: ReactNode;
  infoIcon: ReactNode;
  copyIcon: ReactNode;
  windowIcon: ReactNode;
  children: ReactNode;
}

export default function Generator({
  linkIcon,
  infoIcon,
  copyIcon,
  windowIcon,
  children,
}: GeneratorProps) {
  const [url, setUrl] = useState("");
  const [remoteUrl, alertUrl] = useMemo(() => {
    if (!url) {
      return ["", ""];
    }
    const origin = typeof window !== "undefined" && window.location.origin;
    const id = url.split("/").pop();
    return [`${origin}/remote/${id}`, `${origin}/donation/${id}`];
  }, [url]);

  return (
    <>
      <div className="relative mb-4">
        <label className="hidden" htmlFor="alertUrl">
          후원 알림 주소
        </label>
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500 dark:text-gray-400">
          {linkIcon}
        </div>
        <input
          className="block w-full p-3 pl-10 flex-1 rounded-lg text-sm text-gray-900 dark:text-white dark:placeholder-gray-400 truncate border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
          placeholder="https://chzzk.naver.com/donation/donation@..."
          type="url"
          id="alertUrl"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        ></input>
      </div>
      {url && (
        <>
          <UrlBox
            title="리모컨 주소"
            description="OBS의 사용자 브라우저 독 또는 XSplit의 확장 프로그램으로 추가해주세요"
            url={remoteUrl}
            windowFeatures="width=600,height=900"
            infoIcon={infoIcon}
            copyIcon={copyIcon}
            windowIcon={windowIcon}
          />
          <UrlBox
            title="후원 알림창"
            description="OBS의 브라우저 또는 XSplit의 웹 페이지 소스로 추가해주세요"
            url={alertUrl}
            windowFeatures="width=600,height=500"
            infoIcon={infoIcon}
            copyIcon={copyIcon}
            windowIcon={windowIcon}
          />
          {children}
        </>
      )}
    </>
  );
}
