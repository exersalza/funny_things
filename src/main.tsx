import { render } from "preact";
import { MovingRainbowBox } from "./components/MovingRainbowBox";
import "preact/debug";
import "./style.css";
import { useEffect, useState } from "preact/hooks";

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
}
const NumberThingy = (props: NumberProps) => {
  return (
    <div className={"relative"}>
      <div className={"overflow-hidden h-16 text-6xl font-mono"}>
        {Array.from({ length: 10 }, (_, i) => i).map((v) => {
          return (
            <p
              className={"transition select-none"}
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


const Time = (props: { time: number }) => {
  const [time, setTime] = useState("");

  function getTimeForThingy(timestamp: number) {
    const time = new Date(timestamp * 1000);

    return String(time.getHours()).padStart(2, "0") + String(time.getMinutes()).padStart(2, "0") + String(time.getSeconds()).padStart(2, "0")
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
      <NumberThingy number={time[0]} />
      <NumberThingy number={time[1]} />
      <p className={"text-6xl h-16 font-mono"}>:</p>
      <NumberThingy number={time[2]} />
      <NumberThingy number={time[3]} />
      <p className={"text-6xl h-16 font-mono"}>:</p>
      <NumberThingy number={time[4]} />
      <NumberThingy number={time[5]} />
    </div>
  );
};


const Countdown = (props: { sec: number }) => {
  const [time, setTime] = useState("");

  const convertTimeToString = (s: number) => {

    const hours = Math.floor(s / 3600);
    const minutes = Math.floor((s % 3600) / 60);
    const seconds = s % 60;

    return String(hours).padStart(3, "0") + String(minutes).padStart(2, "0") + String(seconds).padStart(2, "0")
  }

  useEffect(() => {
    setTime(convertTimeToString(props.sec))
  }, [props.sec])

  return (
    <div
      className={
        "h-50 w-100 flex items-center select-none justify-center bg-white ring-1 ring-white ml-4 rounded-lg"
      }
    >
      <NumberThingy number={time[0]} />
      <NumberThingy number={time[1]} />
      <NumberThingy number={time[2]} />
      <p className={"text-6xl h-16 font-mono"}>:</p>
      <NumberThingy number={time[3]} />
      <NumberThingy number={time[4]} />
      <p className={"text-6xl h-16 font-mono"}>:</p>
      <NumberThingy number={time[5]} />
      <NumberThingy number={time[6]} />
    </div>
  );
}


export function App() {
  const [time, setTime] = useState(4000);
  const [time1, setTime1] = useState(new Date().valueOf() / 1000);

  useEffect(() => {
    let i = setInterval(() => {
      setTime(prev => prev - 1)
      setTime1(prev => prev - 1)

    }, 1000);

    return () => {
      clearInterval(i)
    };
  }, [])

  return (
    <div class={"h-screen w-screen bg-zinc-900"}>
      <MovingRainbowBox />
      <IridescentComponent />
      <Time time={time1} />
      <Countdown sec={time} />
    </div>
  );
}

render(<App />, document.getElementById("app"));
