import { useEffect, useRef, useState } from "preact/hooks"

type xy = { x: number, y: number };

type MovingRainbowBoxState = {
  pos: xy;
  border: xy;
  hslColor: number;
  increaseXBy: number;
  increaseYBy: number;
  speed: number;
}

function increaseHsl(last: number): number {
  return ++last && last <= 360 ? last : 0
}

export function MovingRainbowBox() {
  const [states, setStates] = useState<MovingRainbowBoxState>({
    pos: { x: 100, y: 150 },
    border: { x: 0, y: 0 },
    hslColor: 0,
    increaseXBy: 1,
    increaseYBy: 1,
    speed: 10,
  });

  let box = useRef<HTMLDivElement>();
  let loopers: number = 0;

  const loop = () => {
    setStates((prev) => {
      // parentBounding
      let pb = box.current.parentElement.getBoundingClientRect();
      let me = box.current.getBoundingClientRect();
      let add = 4;
      let temp = {
        pos: {
          x: prev.pos.x + prev.increaseXBy,
          y: prev.pos.y + prev.increaseYBy
        }
      };

      // Math.ceil(me.x + me.height + add) >= pb.height || Math.ceil( me.y + me.width + add) >= pb.width

      let top = pb.top >= me.y - add;
      let right = pb.right <= me.x + me.width + add;
      let bottom = pb.bottom <= me.y + me.height + add;
      let left = pb.left >= me.x - add;

      if (
        top ||
        right ||
        bottom ||
        left
      ) {
        temp = {
          ...temp,
          pos: {
            x: me.x,
            y: me.y
          },
        }

        let y = prev.increaseYBy;
        let x = prev.increaseXBy;
        const calcAngle = (x: number) => {
          //return Math.max(Math.min(.9, Math.random()), .7)
          return 1
        }

        if (top) {
          y = Number(Math.abs(calcAngle(y)));
        }

        if (bottom) {
          y = Number(-Math.abs(calcAngle(y)));
        }

        if (right) {
          x = Number(-Math.abs(calcAngle(x)));
        }

        if (left) {
          x = Number(Math.abs(calcAngle(x)));
        }

        temp["increaseYBy"] = y;
        temp["increaseXBy"] = x;

        temp.pos = {
          x: prev.pos.x + prev.increaseXBy,
          y: prev.pos.y + prev.increaseYBy
        }
      }

      return ({
        ...prev,
        ...temp,
        hslColor: increaseHsl(prev.hslColor)
      })
    });
  }

  useEffect(() => {
    loopers = setInterval(loop, states.speed);

    return () => {
      clearInterval(loopers);
    }

  }, [])


  return (

    <div className={"w-[725px] h-[427px] rounded border-2 border-white"}>
      <div
        ref={box}
        className={"absolute transition"}
        style={{
          left: states.pos.x,
          top: states.pos.y,
        }}>
        <div className={"h-24 w-24 rounded-xl grid place-items-center transition-move"} style={{
          backgroundColor: `hsl(${states.hslColor}, 70%, 50%)`
        }}>
          <div className={"h-20 w-20 bg-zinc-900 rounded-xl"}>

          </div>
        </div>
      </div>
    </div>
  )
}
