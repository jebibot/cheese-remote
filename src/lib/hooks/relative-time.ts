import { useState } from "react";
import { useHarmonicIntervalFn } from "react-use";

function formatRelativeTime(relativeTime: number) {
  return relativeTime < 60_000
    ? "방금"
    : relativeTime < 3_600_000
      ? `${Math.floor(relativeTime / 60_000)}분 전`
      : `${Math.floor(relativeTime / 3_600_000)}시간 전`;
}

export default function useRelativeTime(time: number) {
  const [relativeTime, setRelativeTime] = useState(
    formatRelativeTime(Date.now() - time),
  );
  useHarmonicIntervalFn(() => {
    setRelativeTime(formatRelativeTime(Date.now() - time));
  }, 60_000);
  return relativeTime;
}
