"use client";

import {
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Tooltip,
} from "@chakra-ui/react";
import {
  faForward,
  faPause,
  faPlay,
  faRotateRight,
  faSliders,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Slider from "@/components/slider";
import Donation, { IDonation } from "./donation";
import { useEffect, useState } from "react";

interface RemoteProps {
  className?: string;
  donations: IDonation[];
  paused: boolean;
  volume: number;
  setVolume?: (volume: number) => void;
  interval: number;
  setInterval?: (interval: number) => void;
  onPause?: () => void;
  onSkip?: () => void;
  onReplay?: (donation: IDonation) => void;
  isDemo?: boolean;
}

export default function Remote({
  className,
  donations,
  paused,
  volume,
  setVolume,
  interval,
  setInterval,
  onPause,
  onSkip,
  onReplay,
  isDemo,
}: RemoteProps) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (step > 2) {
      return;
    }
    const timer = setTimeout(() => {
      setStep((step) => step + 1);
    }, 50);
    return () => {
      clearTimeout(timer);
    };
  }, [step]);

  return (
    <div className={`flex flex-col text-sm ${className || ""}`}>
      <div className="flex items-center justify-end bg-emerald-500 dark:bg-emerald-600">
        <Popover
          placement="bottom-end"
          isOpen={isDemo && step > 0}
          autoFocus={!isDemo}
        >
          <Tooltip label="설정">
            <div>
              <PopoverTrigger>
                <button
                  className="p-3 m-2 rounded-md text-gray-200 hover:bg-emerald-400 dark:hover:bg-emerald-500"
                  aria-label="설정"
                >
                  <FontAwesomeIcon icon={faSliders} size="xl" />
                </button>
              </PopoverTrigger>
            </div>
          </Tooltip>
          <PopoverContent>
            <PopoverHeader>설정</PopoverHeader>
            <PopoverArrow />
            <PopoverBody>
              <div className="flex flex-col gap-2 text-gray-800">
                <Slider
                  min={0}
                  max={1}
                  scale={100}
                  value={volume}
                  setValue={setVolume}
                  getLabel={(v) => `${v}%`}
                  name="TTS 볼륨"
                  forceShowTooltip={isDemo && step > 1}
                />
                <Slider
                  min={-5000}
                  max={5000}
                  scale={0.01}
                  value={interval}
                  setValue={setInterval}
                  getLabel={(i) => `${i > 0 ? "+" : ""}${i / 10}초`}
                  name="알림 노출 시간 조절"
                  forceShowTooltip={isDemo && step > 1}
                />
              </div>
            </PopoverBody>
          </PopoverContent>
        </Popover>
        <Tooltip label={paused ? "일시정지 해제" : "일시정지"}>
          <button
            className={`p-3 m-2 rounded-md text-gray-200 ${
              paused
                ? "bg-emerald-700 dark:bg-emerald-800 hover:bg-emerald-600 dark:hover:bg-emerald-700"
                : "bg-emerald-400 dark:bg-emerald-500 hover:bg-emerald-300 dark:hover:bg-emerald-400"
            }`}
            onClick={onPause}
            aria-label={paused ? "일시정지 해제" : "일시정지"}
          >
            <FontAwesomeIcon
              icon={paused ? faPlay : faPause}
              size="xl"
              fixedWidth
            />
          </button>
        </Tooltip>
        <Tooltip label="스킵">
          <button
            className="p-3 m-2 rounded-md text-gray-200 bg-emerald-400 dark:bg-emerald-500 hover:bg-emerald-300 dark:hover:bg-emerald-400"
            onClick={onSkip}
            aria-label="스킵"
          >
            <FontAwesomeIcon icon={faForward} size="xl" />
          </button>
        </Tooltip>
      </div>
      <div className="flex-1 overflow-auto">
        {donations.map((donation, i) => (
          <Donation key={donations.length - i} donation={donation}>
            <Tooltip label="다시 재생" placement="left">
              <button
                className="p-1 m-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800"
                onClick={() => onReplay?.(donation)}
                aria-label="다시 재생"
              >
                <FontAwesomeIcon icon={faRotateRight} />
              </button>
            </Tooltip>
          </Donation>
        ))}
      </div>
    </div>
  );
}
