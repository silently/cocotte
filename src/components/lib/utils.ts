// src
import { modulo } from "state/utils";

const MOVE_KEYS = ["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft"];
export const isMoveKey = (key: string) => MOVE_KEYS.includes(key);

export const moveFromKey = (
  from: Point,
  key: string,
  map: BrowsableMap
): Point => {
  if (key === "ArrowDown") return move(from, { x: 0, y: 1 }, map);
  if (key === "ArrowUp") return move(from, { x: 0, y: -1 }, map);
  if (key === "ArrowRight") return move(from, { x: 1, y: 0 }, map);
  if (key === "ArrowLeft") return move(from, { x: -1, y: 0 }, map);
  return from;
};

const move = (
  from: Point,
  translation: Point,
  map: BrowsableMap,
  iteration = 0
): Point => {
  const to = {
    x: modulo(from.x + translation.x - map.offset.x, map.size.x) + map.offset.x,
    y: modulo(from.y + translation.y - map.offset.y, map.size.y) + map.offset.y,
  };
  // not in hole
  if (map.matrix[to.y - map.offset.y][to.x - map.offset.x]) return to;
  if (iteration > 10) return from;
  // in hole
  return move(
    from,
    {
      x: translation.x + Math.sign(translation.x),
      y: translation.y + Math.sign(translation.y),
    },
    map,
    iteration + 1
  );
};
