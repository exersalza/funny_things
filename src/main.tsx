import { render } from "preact";
import { MovingRainbowBox } from "./components/MovingRainbowBox";
import "preact/debug";
import "./style.css";
import { useEffect, useReducer, useRef, useState } from "preact/hooks";
import { Plus, Minus, Pause, Play } from "lucide-preact";

const IridescentComponent = () => {
  return (
    <div className="relative group w-90 m-8">
      <div className="absolute inset-0 bg-gradient-to-r from-violet-500 via-blue-500 to-purple-500 opacity-75 blur-xl group-hover:opacity-100 transition-opacity duration-300 animate-gradient-xy"></div>
      <div className="relative bg-black bg-opacity-90 p-6 rounded-lg"></div>
    </div>
  );
};

interface NumberProps {
  number: number | string;
  showAnimation?: boolean;
}
const NumberThingy = (props: NumberProps) => {
  return (
    <div className={"relative"}>
      <div className={"overflow-hidden h-16 text-6xl font-mono"}>
        {Array.from({ length: 10 }, (_, i) => i).map((v) => {
          return (
            <p
              className={`${!!props.showAnimation ? "transition" : ""} select-none`}
              style={{ transform: `translateY(calc(-60px * ${props.number}))` }}
            >
              {v}
            </p>
          );
        })}
      </div>
    </div>
  );
};

const Time = (props: { time: number; showAnimation?: boolean }) => {
  const [time, setTime] = useState("");

  function getTimeForThingy(timestamp: number) {
    const time = new Date(timestamp * 1000);

    return (
      String(time.getHours()).padStart(2, "0") +
      String(time.getMinutes()).padStart(2, "0") +
      String(time.getSeconds()).padStart(2, "0")
    );
  }

  useEffect(() => {
    setTime(getTimeForThingy(props.time));
  }, [props.time]);

  return (
    <div
      className={
        "h-50 w-100 flex items-center select-none justify-center bg-white ring-1 ring-white ml-4 rounded-lg"
      }
    >
      <NumberThingy number={time[0]} showAnimation={props.showAnimation} />
      <NumberThingy number={time[1]} showAnimation={props.showAnimation} />
      <p className={"text-6xl h-16 font-mono"}>:</p>
      <NumberThingy number={time[2]} showAnimation={props.showAnimation} />
      <NumberThingy number={time[3]} showAnimation={props.showAnimation} />
      <p className={"text-6xl h-16 font-mono"}>:</p>
      <NumberThingy number={time[4]} showAnimation={props.showAnimation} />
      <NumberThingy number={time[5]} showAnimation={props.showAnimation} />
    </div>
  );
};

const Countdown = (props: {
  sec: number;
  className?: string;
  showAnimation?: boolean;
}) => {
  const [time, setTime] = useState("");

  const convertTimeToString = (s: number) => {
    const hours = Math.floor(s / 3600);
    const minutes = Math.floor((s % 3600) / 60);
    const seconds = s % 60;

    return (
      String(hours).padStart(3, "0") +
      String(minutes).padStart(2, "0") +
      String(seconds).padStart(2, "0")
    );
  };

  useEffect(() => {
    setTime(convertTimeToString(props.sec));
  }, [props.sec]);

  return (
    <div className={`flex ${props.className}`}>
      <NumberThingy number={time[0]} showAnimation={props.showAnimation} />
      <NumberThingy number={time[1]} showAnimation={props.showAnimation} />
      <NumberThingy number={time[2]} showAnimation={props.showAnimation} />
      <p className={"text-6xl h-16 font-mono"}>:</p>
      <NumberThingy number={time[3]} showAnimation={props.showAnimation} />
      <NumberThingy number={time[4]} showAnimation={props.showAnimation} />
      <p className={"text-6xl h-16 font-mono"}>:</p>
      <NumberThingy number={time[5]} showAnimation={props.showAnimation} />
      <NumberThingy number={time[6]} showAnimation={props.showAnimation} />
    </div>
  );
};

type TimerCompState = {
  time: number;
  timerPaused: boolean;
  text: {
    upper: string;
    lower: string;
  };
  custom: {
    text: {
      upper: string;
      lower: string;
    };
  };
};

type Actions = {
  type: "UpdateTime" | "IncTime" | "DecTime" | "TogglePause" | "UpdateText";
  payload?: any;
};

const TimerComp = () => {
  const reducer = (state: TimerCompState, action: Actions) => {
    switch (action.type) {
      case "UpdateTime":
        return { ...state, time: action.payload.time };
      case "IncTime":
        return { ...state, time: state.time + 1 };
      case "DecTime":
        return { ...state, time: state.time - 1 };
      case "UpdateText":
        return {
          ...state,
          text: { ...state.text, [action.payload.key]: action.payload.value },
        };

      case "TogglePause":
        return {
          ...state,
          timerPaused: !state.timerPaused
        }
      default:
        throw Error("Action is not valid");
    }
  };

  const [state, dispatch] = useReducer(reducer, {
    time: 4000,
    text: { upper: "cool text", lower: "cool text" },
    timerPaused: false,
    custom: {
      text: {
        upper: "",
        lower: "",
      },
    },
  });

  let stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    let i = setInterval(() => {
      if (!stateRef.current.timerPaused) {
        dispatch({ type: "DecTime" });
      }
    }, 1000);

    return () => {
      clearInterval(i);
    };
  }, []);

  const updateText = (e: InputEvent, key: "upper" | "lower") => {
    dispatch({
      type: "UpdateText",
      payload: { key, value: (e.target as HTMLInputElement).value },
    });
  };

  const updateUpper = (e: InputEvent) => {
    updateText(e, "upper");
  };

  const updateLower = (e: InputEvent) => {
    updateText(e, "lower");
  };

  return (
    <div className={"w-150 bg-zinc-100 p-0 ml-4 rounded-lg flex"}>
      <div
        className={
          "h-50 w-100 flex flex-col items-center select-none justify-center bg-white rounded-lg"
        }
      >
        <p className={state.custom.text.upper}>{state.text.upper}</p>
        <Countdown sec={state.time} showAnimation={true} className={""} />
        <p className={state.custom.text.lower}>{state.text.lower}</p>
      </div>
      <div className={"flex flex-col"}>
        <div className={"flex flex-col"}>
          <label for={"upper-text"}>Upper text</label>
          <input
            id="upper-text"
            onInput={updateUpper}
            className={"bg-zinc-200 rounded-lg p-1"}
            value={state.text.upper}
          />
          <label for={"lower-text"}>Lower text</label>
          <input
            id="lower-text"
            onInput={updateLower}
            className={"bg-zinc-200 rounded-lg p-1"}
            value={state.text.lower}
          />
        </div>
        <div className={"flex"}>
          <button
            onClick={() => {
              dispatch({ type: "IncTime" });
            }}
          >
            <Plus />
          </button>
          <button
            onClick={() => {
              dispatch({ type: "DecTime" });
            }}
          >
            <Minus />
          </button>
          <button
            onClick={() => {
              dispatch({ type: "TogglePause" });
            }}
          >
            {
              state.timerPaused ? <Play /> : <Pause />
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export function App() {
  const [time1, setTime1] = useState(new Date().valueOf() / 1000);

  useEffect(() => {
    let i = setInterval(() => {
      setTime1((prev) => prev - 1);
    }, 1000);

    return () => {
      clearInterval(i);
    };
  }, []);

  return (
    <div class={"h-screen w-screen bg-zinc-900"}>
      <MovingRainbowBox />
      <IridescentComponent />
      <Time time={time1} />
      <TimerComp />
    </div>
  );
}

render(<App />, document.getElementById("app"));
