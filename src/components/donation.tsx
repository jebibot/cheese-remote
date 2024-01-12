import useRelativeTime from "@/lib/hooks/relative-time";

export interface IDonation {
  time: number;
  animationUrl: string;
  profile: {
    profileId: string;
    nickname: string;
    profileImageUrl: string;
    profileColor: string;
  };
  donationId: string;
  payAmount: number;
  donationText: string;
  type: string;
}

interface DonationProps {
  donation: IDonation;
  children: React.ReactNode;
}

export default function Donation({ donation, children }: DonationProps) {
  const relativeTime = useRelativeTime(donation.time);
  return (
    <div className="flex items-center m-1 p-1 border-b border-gray-200 dark:border-gray-600">
      <div className="flex flex-col flex-1 p-2 gap-2">
        <div className="text-gray-500 dark:text-gray-400">
          <span className="text-gray-700 dark:text-gray-300 font-bold">
            {donation.profile.nickname}
          </span>
          님이{" "}
          <span className="text-yellow-500 font-bold">
            {donation.payAmount.toLocaleString()}치즈
          </span>
          를 후원하였습니다 - {relativeTime}
        </div>
        {donation.donationText && <div>{donation.donationText}</div>}
      </div>
      {children}
    </div>
  );
}
