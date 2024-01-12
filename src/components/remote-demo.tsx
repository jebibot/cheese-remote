"use client";

import { useEffect, useState } from "react";
import { IDonation } from "./donation";
import Remote from "./remote";

export default function RemoteDemo() {
  const [step, setStep] = useState(0);
  const [donations, setDonations] = useState<IDonation[]>([]);

  useEffect(() => {
    if (step > 5) {
      return;
    }
    const time = new Date();
    time.setMinutes(time.getMinutes() - 5 + step);
    setDonations((donations) => [
      {
        time: time.getTime(),
        animationUrl: "",
        profile: {
          profileId: "",
          nickname: `${step + 1}번째 후원자`,
          profileImageUrl: "",
          profileColor: "",
        },
        donationId: "",
        payAmount: 1000 * (step + 1),
        donationText: "테스트",
        type: "",
      },
      ...donations,
    ]);
    const timer = setTimeout(() => {
      setStep((step) => step + 1);
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [step]);

  return (
    <Remote
      className="max-w-sm h-96 mx-auto border border-gray-400 rounded-md"
      donations={donations}
      paused={false}
      volume={0.8}
      interval={500}
      isDemo={true}
    />
  );
}
