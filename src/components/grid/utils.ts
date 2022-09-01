// lib
import * as R from "ramda";
// src
import { getChordId } from "domain/processors/helpers";
import { modulo } from "state/utils";
import { BEATS_PER_BAR, MAX_GRID_LINES } from "state/constants";

export const columnsFromLength = (cellLength: number): number => {
  if (cellLength <= 6) return cellLength + 1;
  return 4;
}

export const getBrowsableMap = (cells: any[], columns: number): BrowsableMap => {
  const isFull = cells.length === columns * MAX_GRID_LINES;
  // if not full, add 1 for "add chord" cell action
  const length = isFull ? cells.length : cells.length + 1;
  const minX = 0;
  const maxX = columns - 1;
  const minY = 0;
  const maxY = Math.ceil(length / columns) - 1;

  const size = { x: maxX - minX + 1, y: maxY - minY + 1 };

  const output = {
    offset: { x: minX, y: minY },
    size,
    matrix: Array(size.y)
      .fill(false)
      .map(() => Array(size.x).fill(false)),
  };
  R.times((i) => {
    const y = Math.floor(i / columns);
    const x = modulo(i, columns);
    output.matrix[y][x] = true;
  }, length);
  return output;
};

// special case with no offset
export const getPointFromCell = (cell: number, bMap: BrowsableMap): Point => ({
  x: modulo(cell, bMap.size.x),
  y: Math.floor(cell / bMap.size.x)
})

export const getCells = (sequence: Sequence): VoicedChordWithTiming[][] => {
  type Acc = VoicedChord[];
  // array of chords for every beat
  const flatChords = R.reduce(
    (acc: Acc, passage: Passage) => {
      return R.concat(acc, R.repeat(passage.vChord, passage.duration.beats));
    },
    [],
    sequence
  );
  // group by cells
  const flatCells = R.splitEvery(BEATS_PER_BAR, flatChords);
  const filteredCells = R.map(R.uniqBy(getChordId), flatCells);
  return filteredCells.map((cell, index) => {
    const [ch1, ch2] = cell;
    if (ch2) {
      return [
        {
          ...ch1,
          from: index * BEATS_PER_BAR,
          to: index * BEATS_PER_BAR + 2,
        },
        {
          ...ch2,
          from: index * BEATS_PER_BAR + 2,
          to: index * BEATS_PER_BAR + 4,
        },
      ];
    }
    return [
      {
        ...ch1,
        from: index * BEATS_PER_BAR,
        to: index * BEATS_PER_BAR + 4,
      },
    ];
  });
};