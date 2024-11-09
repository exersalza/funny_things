import { render } from 'preact';
import './style.css';
import { MovingRainbowBox } from './components/MovingRainbowBox';
import "preact/debug"


export function App() {
  return (
    <div class={"h-screen w-screen bg-zinc-900"}>
      <div className={"rounded-xl border-2 border-white h-96 w-96"}>
        <MovingRainbowBox />
      </div>
    </div>
  );
}

render(<App />, document.getElementById('app'));
