import { render } from "preact";
import { MovingRainbowBox } from "./components/MovingRainbowBox";
import "preact/debug";
import "./style.css";
import { useState } from "preact/hooks";


const IridescentComponent = () => {
  return (
    <div className="relative group w-90 m-8">
      <div className="absolute inset-0 bg-gradient-to-r from-violet-500 via-blue-500 to-purple-500 opacity-75 blur-xl group-hover:opacity-100 transition-opacity duration-300 animate-gradient-xy"></div>
      <div className="relative bg-black bg-opacity-90 p-6 rounded-lg">
      </div>
    </div>
  );
}

interface NumberProps {
  number: number
}

const NumberThingy = (props: NumberProps) => {
  return (
    <div className={"overflow-auto h-16 text-6xl"}>
      {Array.from({length: 10}, (_, i) => i).map((v) => {
        return (
          <p>{v}</p>
        )
      })}
    </div>
  )
}

const UpDownNumbers = () => {
  const [time, setTime] = useState(new Date());


  return (
    <div className={"h-50 w-100 bg-white ring-1 ring-white ml-4 rounded-lg"}>
      <NumberThingy number={4} />
    </div>
  )
}

export function App() {
  return (
    <div class={"h-screen w-screen bg-zinc-900"}>
      <MovingRainbowBox />
      <IridescentComponent />
      <UpDownNumbers />
    </div>

  );
}

render(<App />, document.getElementById("app"));
