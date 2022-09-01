// lib
import * as R from "ramda";
// src
import Guitar from "domain/space/guitar";

export const getChordId = (vChord: VoicedChord): string =>
  `${vChord.naturalRoot.name}${vChord.alteration.name}${vChord.color.name}`;

export const getScalePitchesFromVoicing = (
  start: ScalePitch,
  intervals: Interval[],
  voicing: Voicing
): ScalePitch[] => {
  const chordLength = intervals.length;
  const pitchOffset = start.pitch - start.interval.pitch;
  const intervalOffset = R.findIndex(R.equals(start.interval), intervals);
  const { notes } = R.reduce(
    ({ notes, moveAcc }, move) => {
      const newMoveAcc = moveAcc + move;
      const octaveJump = Math.floor(
        (intervalOffset + newMoveAcc) / chordLength
      );
      const newInterval =
        intervals[(intervalOffset + newMoveAcc) % chordLength];

      const prevPitch = R.last(notes) ? R.last(notes)!.pitch : pitchOffset;
      let newPitch = pitchOffset + newInterval.pitch + octaveJump * 12;
      while (newPitch < prevPitch) {
        // hack for chords defined over an octave
        newPitch += 12;
      }
      const newScalePitch: ScalePitch = {
        pitch: newPitch,
        interval: newInterval,
      };

      return {
        notes: R.append(newScalePitch, notes),
        moveAcc: newMoveAcc,
      };
    },
    { notes: [] as ScalePitch[], moveAcc: 0 },
    voicing.moves
  );

  return notes;
};

export const getKeysFromScalePitches = (notes: ScalePitch[]): ScaleKey[] =>
  R.reduce(
    (acc: ScaleKey[], key) => {
      const note = R.find((n) => key.pitch === n.pitch, notes);
      if (!note) return acc;
      return R.append({ ...key, ...note }, acc);
    },
    [],
    Guitar.ORDERED_KEYS
  );

export const getGroupKeysByPitch = (keys: ScaleKey[]): ScaleKey[][] => {
  // groupWith works on adjacent pairs, that's why they should be sorted first
  const sortedKeysByPitch = R.sort(
    ({ pitch: p1 }, { pitch: p2 }) => p1 - p2,
    keys
  );
  return R.groupWith(
    ({ pitch: p1 }, { pitch: p2 }) => p1 === p2,
    sortedKeysByPitch
  );
};

// @ts-ignore because of R.sequence
export const comprehend = <T>(items: T[][]): T[][] => R.sequence(R.of, items);
