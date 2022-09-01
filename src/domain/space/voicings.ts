// lib
import { pluck } from "ramda";
// src
import Highlights from "./highlights";
import { createFinder } from "./utils";

const { s3, s4, s5, s6 } = Highlights;

// Within a 4 notes chord, moves describe incremental jumps (0 => pick current, 1 => pick next...)
// Examples in comments are given for a 1, 3, 5, 7 chord, ↑ meaning "one octave up"
const Index: { [key: string]: Voicing } = {
  close: {
    id: "close",
    name: "close",
    shortName: "close",
    moves: [0, 1, 1, 1], // picks 1, 3, 5, 7
    stringHighlightIds: pluck('id', [s4, s5, s6]),
  },
  drop2: {
    id: "drop2",
    name: "drop 2",
    shortName: "dp 2",
    moves: [0, 2, 1, 2], // picks 1, 5, 7, ↑3
    stringHighlightIds: pluck('id', [s4, s5, s6]),
  },
  drop3: {
    id: "drop3",
    name: "drop 3",
    shortName: "dp 3",
    moves: [0, 3, 2, 1], // picks 1, 7, ↑3, ↑5
    stringHighlightIds: pluck('id', [s5, s6]),
  },
  drop23: {
    id: "drop23",
    name: "drop 2 3",
    shortName: "dp 2 3",
    moves: [0, 1, 2, 3], // picks 1, 3, 7, ↑5
    stringHighlightIds: pluck('id', [s5, s6]),
  },
  drop24: {
    id: "drop24",
    name: "drop 2 4",
    shortName: "dp 2 4",
    moves: [0, 2, 3, 2], // picks 1, 5, ↑3, ↑7
    stringHighlightIds: pluck('id', [s5, s6]),
  },
  drop223: {
    id: "drop223",
    name: "drop 2² 3",
    shortName: "dp 2²3",
    moves: [0, 3, 3, 3], // picks 1, 7, ↑5, ↑↑3
    stringHighlightIds: pluck('id', [s6]),
  },
  drop4: {
    id: "drop4",
    name: "drop 4",
    shortName: "dp 4",
    moves: [0, 5, 1, 1], // picks 1, ↑3, ↑5, ↑7
    stringHighlightIds: pluck('id', [s6]),
  },
  drop34: {
    id: "drop34",
    name: "drop 3 4",
    shortName: "dp 3 4",
    moves: [0, 1, 5, 1], // picks 1, 3, ↑5, ↑7
    stringHighlightIds: pluck('id', [s6]),
  },
  drop234: {
    id: "drop234",
    name: "drop 2 3 4",
    shortName: "dp 234",
    moves: [0, 1, 1, 5], // picks 1, 3, 5, ↑7
    stringHighlightIds: pluck('id', [s6]),
  },
  triadClose: {
    id: "triadClose",
    name: "close",
    shortName: "close",
    moves: [0, 1, 1], // picks 1, 3, 5
    stringHighlightIds: pluck('id', [s3, s4, s5, s6]),
  },
  triadDrop2: {
    id: "triadDrop2",
    name: "drop 2",
    shortName: "dp 2",
    moves: [0, 2, 2], // picks 1, 5, ↑3
    stringHighlightIds: pluck('id', [s4, s5, s6]),
  },
  triadDrop3: {
    id: "triadDrop3",
    name: "drop 3",
    shortName: "dp 3",
    moves: [0, 4, 1], // picks 1, ↑3, ↑5
    stringHighlightIds: pluck('id', [s5, s6]),
  },
};

export default Index;

export const findById = createFinder(Index);
export const triadTetraSwitchVoicing = (id: string): Voicing => {
  if (id === "triadClose") return Index.close;
  if (id === "triadDrop2") return Index.drop2;
  if (id === "triadDrop3") return Index.drop3;
  if (id === "close") return Index.triadClose;
  if (id === "drop2") return Index.triadDrop2;
  if (id === "drop3") return Index.triadDrop3;
  return Index.triadClose;
}
