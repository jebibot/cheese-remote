"use client";

import { useToast } from "@chakra-ui/react";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import io from "socket.io-client";
import { Client } from "@/lib/utils/supabase";
import { IDonation } from "./donation";
import Remote from "./remote";
import { useThrottleFn } from "react-use";

interface RemoteProps {
  sessionUrl: string;
}

function parseDonation(donation: string) {
  const d = JSON.parse(donation);
  return {
    time: Date.now(),
    animationUrl: d.animationUrl,
    profile: JSON.parse(d.profile),
    donationId: d.donationId,
    payAmount: d.payAmount,
    donationText: d.donationText,
    type: d.type,
  };
}

interface RemoteProps {
  sessionUrl: string;
}

export default function RemoteImpl({ sessionUrl }: RemoteProps) {
  const params = useParams<{ id: string }>();
  const [client, setClient] = useState<Client | null>(null);
  const [socket, setSocket] = useState<SocketIOClient.Socket | null>(null);
  const [donations, setDonations] = useState<IDonation[]>([]);
  const [paused, setPaused] = useState(false);
  const [volume, setVolume] = useState(1);
  const [interval, setInterval] = useState(0);
  const toast = useToast();

  useEffect(() => {
    const client = new Client(`/donation/${decodeURIComponent(params.id)}`, {
      setPaused,
      setVolume,
      setInterval,
    });
    setClient(client);
    return () => {
      client.close();
    };
  }, [params.id]);

  useEffect(() => {
    const socket = io(sessionUrl, { transports: ["websocket"] });
    socket.on("connect", () => {
      setSocket(socket);
    });
    return () => {
      socket.close();
    };
  }, [sessionUrl]);

  useEffect(() => {
    socket?.on("donation", (donation: string) => {
      setDonations((donations) => [parseDonation(donation), ...donations]);
    });
  }, [socket]);

  useThrottleFn((v) => client?.set("volume", v), 200, [volume]);
  useThrottleFn((i) => client?.set("interval", i), 200, [interval]);

  const showToast = useCallback(
    (title: string) => {
      toast({
        title,
        status: "info",
        duration: 2000,
        isClosable: true,
      });
    },
    [toast],
  );

  return (
    <Remote
      donations={donations}
      paused={paused}
      volume={volume}
      setVolume={setVolume}
      interval={interval}
      setInterval={setInterval}
      onPause={() => {
        if (client != null) {
          setPaused(!paused);
          client.set("paused", !paused);
          showToast(!paused ? "일시정지되었습니다" : "재생되었습니다");
        }
      }}
      onSkip={() => {
        if (client != null) {
          client.skip();
          showToast("스킵되었습니다");
        }
      }}
      onReplay={(donation: IDonation) => {
        if (client != null) {
          client.replay(donation);
          showToast("재생되었습니다");
        }
      }}
    />
  );
}
