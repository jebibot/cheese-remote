import type { Fiber } from "react-reconciler";
import {
  findCurrentFiber,
  findReactNode,
  findReactState,
  getReactContainer,
} from "./utils/react";
import { Client } from "./utils/supabase";
import { IDonation } from "@/components/donation";

declare global {
  var __remotePaused: boolean;
  var __remoteInterval: number;
  var __remoteTimer: number;
  var __remoteCallback: () => void;
  var __remoteSkip: boolean;
  var Howler: HowlerGlobal & {
    _howls: Howl[];
  };
}

async function findLiveAlarm(tries = 0): Promise<Fiber | null> {
  const root = document.getElementById("root");
  const container = getReactContainer(root);
  const alarm = findReactNode(container, (node) => {
    if (node.tag === 0) {
      let state = node.memoizedState;
      while (state != null) {
        if (
          Array.isArray(state.baseState) &&
          typeof state.next?.baseState === "boolean"
        ) {
          return true;
        }
        state = state.next;
      }
    }
    return false;
  });
  if (alarm == null) {
    if (tries > 500) {
      return null;
    }
    return new Promise((r) => setTimeout(r, 50)).then(() =>
      findLiveAlarm(tries + 1),
    );
  }
  return alarm;
}

async function waitForHowler(tries = 0): Promise<boolean> {
  if (window.Howler == null) {
    if (tries > 500) {
      return false;
    }
    return new Promise((r) => setTimeout(r, 50)).then(() =>
      waitForHowler(tries + 1),
    );
  }
  return true;
}

const overlay = document.createElement("div");
overlay.style.position = "fixed";
overlay.style.top = "0";
overlay.style.left = "0";
overlay.style.margin = "10px";
overlay.style.padding = "5px 10px";
overlay.style.borderRadius = "5px";
overlay.style.fontSize = "24px";
overlay.style.fontWeight = "bold";
overlay.style.color = "white";
overlay.style.backgroundColor = "black";
overlay.style.zIndex = "1000";
overlay.style.display = "none";
document.body.appendChild(overlay);
const setStatus = (msg?: string) => {
  if (msg) {
    overlay.textContent = msg;
    overlay.style.display = "block";
  } else {
    overlay.style.display = "none";
  }
};

(async () => {
  const alarm = await findLiveAlarm();
  if (alarm == null || !(await waitForHowler())) {
    setStatus("[치즈 리모컨] 초기화에 실패했습니다.");
    return;
  }
  const setDonations = (action: (donations: IDonation[]) => void) => {
    const currentAlarm = findCurrentFiber(alarm);
    const state = findReactState(
      currentAlarm,
      (state) => Array.isArray(state) && typeof state[0] !== "function",
    );
    state.queue.dispatch(action);
  };

  let wasPlaying = false;
  new Client(location.pathname, {
    replay: (message) => {
      const currentAlarm = findCurrentFiber(alarm);
      const state = findReactState(
        currentAlarm,
        (state) => Array.isArray(state) && typeof state[0] !== "function",
      );
      state.queue.dispatch((list: IDonation[]) => {
        const newList = [...list];
        newList.splice(1, 0, message);
        return newList;
      });
    },
    skip: () => {
      const howl = window.Howler._howls[window.Howler._howls.length - 1];
      if (howl.playing()) {
        window.__remoteSkip = true;
        howl.seek(howl.duration());
      } else if (window.__remoteTimer) {
        clearTimeout(window.__remoteTimer);
        window.__remoteTimer = 0;
        window.__remoteCallback();
      }
    },
    setPaused: (paused) => {
      if (window.__remotePaused === paused) {
        return;
      }
      window.__remotePaused = paused;

      const currentAlarm = findCurrentFiber(alarm);
      if (!paused && wasPlaying) {
        wasPlaying = false;
        window.__remoteCallback();
      } else {
        const playing = findReactState(
          currentAlarm,
          (state) => typeof state === "boolean",
        );
        wasPlaying = playing.memoizedState;
        playing.queue.dispatch(paused);
        if (!paused) {
          setDonations((list) => [...list]);
        }
      }

      setStatus(paused ? "일시정지 중" : undefined);
    },
    setVolume: (volume) => {
      window.Howler.volume(volume);
    },
    setInterval: (interval) => {
      window.__remoteInterval = interval;
    },
    setStatus,
  });
})();
