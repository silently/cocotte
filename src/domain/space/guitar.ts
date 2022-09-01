// lib
import { add, assoc, chain, evolve, juxt, pipe, times } from "ramda";
// src
import { PROCESSED_FRETS } from "domain/space/constants";

const STRINGS: GuitarString[] = [
  { string: 6, pitch: 4 },
  { string: 5, pitch: 9 },
  { string: 4, pitch: 14 },
  { string: 3, pitch: 19 },
  { string: 2, pitch: 23 },
  { string: 1, pitch: 28 },
];

// fretToGuitarKey(*fret2*)(*string3*) => { fret: 2, index: 2, pitch: 25 }
const fretToGuitarKey: (
  fret: number
) => (guitarString: GuitarString) => GuitarKey = (fret: number) =>
    pipe(evolve({ pitch: add(fret) }), assoc("fret", fret));

const expandGuitarString: (guitarString: GuitarString) => GuitarKey[] = juxt(
  times(fretToGuitarKey, PROCESSED_FRETS + 1) // + 1 for open strings
);

export default {
  // All keys on an guitar with NUM_FRETS frets and 6 strings
  ORDERED_KEYS: chain(expandGuitarString, STRINGS),
};
