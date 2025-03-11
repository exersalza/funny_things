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


const Time = (props: { time: Date }) => {
  const [time, setTime] = useState("");

  useEffect(() => {
    const now = props.time;

    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    setTime(hours + minutes + seconds);

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

export function App() {
  const [time1, setTime1] = useState(new Date());
  const [time2, setTime2] = useState(new Date());
  const [time, setTime] = useState(new Date());

  useState(() => {
    let i = setInterval(() => {
      setTime1(new Date())

    }, 1000);

    let f = setInterval(() => {
      let n = new Date();
      setTime2(prev => n - prev);

    }, 1000);

    return () => {
      clearInterval(i)
      clearInterval(f)
    };
  }, [])

  return (
    <div class={"h-screen w-screen bg-zinc-900"}>
      <MovingRainbowBox />
      <IridescentComponent />
      <Time time={time1} />
      <Time time={time2} />
    </div>
  );
}

render(<App />, document.getElementById("app"));
