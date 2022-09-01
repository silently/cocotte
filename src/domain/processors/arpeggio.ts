// lib
import * as R from "ramda";
// src
import { modulo } from "state/utils";
import Guitar from "domain/space/guitar";

// For A∆, returns all guitar keys within the A∆ chord as ScaleKeys (GuitarKeys qualified with intervals)
const doGetArpeggioKeys: (chord: Chord) => ScaleKey[] = (chord: Chord) => {
  const {
    naturalRoot,
    alteration,
    color: { intervals },
  } = chord;
  const rootPitch = naturalRoot.pitch + alteration.pitch;
  return R.reduce(
    (acc: ScaleKey[], key: GuitarKey) => {
      const interval = R.find(
        (i) => modulo(i.pitch, 12) === modulo(key.pitch - rootPitch, 12),
        intervals
      );
      if (!interval) return acc;
      return R.append({ ...key, interval }, acc);
    },
    [],
    Guitar.ORDERED_KEYS
  );
};

// Export memoized version
const idOfAllArpeggioKeys = (chord: Chord) =>
  `${chord.naturalRoot.name}${chord.alteration.name}-${chord.color.name}`;

export const getArpeggioKeys = R.memoizeWith(idOfAllArpeggioKeys, doGetArpeggioKeys);
