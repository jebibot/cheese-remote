import { useToast } from "@chakra-ui/react";
import { ReactNode, useCallback, useId } from "react";

interface UrlBoxProps {
  title: string;
  url: string;
  windowFeatures?: string;
  copyIcon: ReactNode;
  windowIcon: ReactNode;
}

export default function UrlBox({
  title,
  url,
  windowFeatures,
  copyIcon,
  windowIcon,
}: UrlBoxProps) {
  const toast = useToast();
  const copy = useCallback(() => {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast({
          title: "복사하였습니다.",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      })
      .catch(() => {
        toast({
          title: "복사에 실패했습니다.",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      });
  }, [url, toast]);

  const id = useId();
  return (
    <div className="relative flex items-center mb-3">
      <div className="shrink-0 m-2 font-semibold dark:text-gray-200">
        {title}
      </div>
      <div className="flex-1 p-3 pr-16 rounded-lg text-sm text-gray-900 dark:text-white dark:placeholder-gray-400 truncate border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-emerald-500 focus:border-emerald-500 outline-none select-all">
        {url}
      </div>
      <button
        className="absolute inset-y-0 right-7 flex items-center pr-3 text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        title="복사"
        onClick={() => {
          copy();
        }}
      >
        {copyIcon}
      </button>
      <button
        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        title="새 창에서 열기"
        onClick={() => {
          window.open(url, title, windowFeatures);
        }}
      >
        {windowIcon}
      </button>
    </div>
  );
}
