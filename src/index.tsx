import { render } from "preact";
import "./style.css";
import { MovingRainbowBox } from "./components/MovingRainbowBox";
import "preact/debug";

export function App() {
  return (
    <div class={"h-screen w-screen bg-zinc-900"}>
      <MovingRainbowBox />
    </div>
  );
}

render(<App />, document.getElementById("app"));
