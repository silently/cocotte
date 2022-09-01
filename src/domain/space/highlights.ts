// lib
import * as R from "ramda";
// src
import { createFinder } from "./utils";

export enum HighlightKind {
  ByString,
  ByBass,
}

const STRINGS_FOR_HIGHLIGHTS = [3, 4, 5, 6];
const STRING_HIGHLIGHTS = R.map(
  (s) => ({
    id: `s${s}`,
    kind: HighlightKind.ByString,
    name: `str ${s}`,
    index: s,
  }),
  STRINGS_FOR_HIGHLIGHTS
);

const INTERVALS_FOR_HIGHLIGHTS = [
  { id: 1, name: "root", display: { base: "root" } },
  { id: 3, name: "3rd", display: { base: "3", exp: "rd" } },
  { id: 4, name: "4th", display: { base: "4", exp: "th" } },
  { id: 5, name: "5th", display: { base: "5", exp: "th" } },
  { id: 6, name: "6th", display: { base: "6", exp: "th" } },
  { id: 7, name: "7th", display: { base: "7", exp: "th" } },
  { id: 9, name: "9th", display: { base: "9", exp: "th" } },
];
const INTERVAL_HIGHLIGHTS = R.map(
  ({ id, name, display }) => ({
    id: `b${id}`,
    kind: HighlightKind.ByBass,
    name,
    display,
    index: id,
  }),
  INTERVALS_FOR_HIGHLIGHTS
);

const Index = R.indexBy(R.prop("id"), [
  ...STRING_HIGHLIGHTS,
  ...INTERVAL_HIGHLIGHTS,
]);

export default Index;

export const findById = createFinder(Index);