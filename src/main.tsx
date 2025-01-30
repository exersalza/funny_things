import { render } from "preact";
import "./style.css";
import { MovingRainbowBox } from "./components/MovingRainbowBox";
import "preact/debug";


const IridescentComponent = () => {
  return (
    <div className="relative group w-90 m-8">
      <div className="absolute inset-0 bg-gradient-to-r from-violet-500 via-blue-500 to-purple-500 opacity-75 blur-xl group-hover:opacity-100 transition-opacity duration-300 animate-gradient-xy"></div>
      <div className="relative bg-black bg-opacity-90 p-6 rounded-lg">
        
      </div>
    </div>
  );
}

export function App() {
  return (
    <div class={"h-screen w-screen bg-zinc-900"}>
      <MovingRainbowBox />
      <IridescentComponent />
    </div>

  );
}

render(<App />, document.getElementById("app"));
