import { RealtimeChannel, RealtimeClient } from "@supabase/realtime-js";

const client = new RealtimeClient(
  `${process.env.NEXT_PUBLIC_SUPABASE_URL!}/realtime/v1`.replace(
    /^http/i,
    "ws",
  ),
  {
    params: {
      apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    },
  },
);

const DEFAULT_STATE = {
  paused: false,
  volume: 1,
  interval: 0,
};

type State = typeof DEFAULT_STATE;

type Handler = {
  replay?: (message: any) => void;
  skip?: () => void;
  setStatus?: (status?: string) => void;
} & {
  [K in keyof State as `set${Capitalize<K>}`]: (value: State[K]) => void;
};

const capitalize = <T extends string>(s: T) =>
  (s[0].toUpperCase() + s.slice(1)) as Capitalize<T>;

export class Client {
  channel: RealtimeChannel;
  handler: Handler;
  state: State;

  constructor(room: string, handler: Handler) {
    this.channel = client.channel(room);
    this.handler = handler;
    this.state = { ...DEFAULT_STATE };
    this.on("requestState", () => {
      this.send("state", this.state);
    });
    this.on("state", (state) => {
      for (const key in state) {
        this.setState(key as keyof State, state[key]);
      }
    });
    this.on("replay", handler.replay);
    this.on("skip", handler.skip);
    Object.keys(DEFAULT_STATE).forEach((key) => {
      this.onState(key as keyof State);
    });

    this.channel.subscribe((status) => {
      if (status !== "SUBSCRIBED") {
        handler.setStatus?.("[치즈 리모컨] 연결 실패");
        return;
      }
      handler.setStatus?.();
      this.send("requestState");
    });
  }

  close() {
    this.channel.unsubscribe();
  }

  send(event: string, payload?: any) {
    this.channel.send({
      type: "broadcast",
      event,
      payload,
    });
  }

  on(event: string, callback?: (payload: any) => void) {
    if (callback == null) {
      return;
    }
    this.channel.on("broadcast", { event }, ({ payload }) => callback(payload));
  }

  setState<T extends keyof State>(state: T, value: State[T]) {
    this.state[state] = value;
    (this.handler[`set${capitalize(state)}`] as (value: State[T]) => void)(
      value,
    );
  }

  onState<T extends keyof State>(state: T) {
    this.on(state, (value) => this.setState(state, value));
  }

  set<T extends keyof State>(key: T, value: State[T]) {
    this.state[key] = value;
    this.send(key, value);
  }

  replay(msg: any) {
    this.send("replay", msg);
  }

  skip() {
    this.send("skip");
  }
}
