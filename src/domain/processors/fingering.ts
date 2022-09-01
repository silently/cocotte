// lib
import * as R from "ramda";
// src
import { MAX_FRET_RANGE, VISIBLE_FRETS } from "domain/space/constants";
import { HighlightKind } from "domain/space/highlights";
import { getArpeggioKeys } from "./arpeggio";
import {
  comprehend,
  getGroupKeysByPitch,
  getKeysFromScalePitches,
  getScalePitchesFromVoicing,
} from "./helpers";

const sortByString: (x: ScaleKey[]) => ScaleKey[] = R.sort(
  ({ string: s1 }, { string: s2 }) => s1 - s2
);

const filterStartingOnString =
  (onString: GuitarString) =>
    (groups: ScaleKey[][]): ScaleKey[][] => {
      return R.filter((group) => group[0].string === onString.string, groups);
    };

// Qualifies fingering with additional info to help filtering / choosing among best one
const mapAsFingering = R.map((scaleKeys: ScaleKey[]): Fingering => {
  const frets = R.pluck("fret", scaleKeys);
  const highestFret = Math.max(...frets);
  const nonOpenStringFrets = R.reject(R.equals(0), frets);
  const hasOpenString = R.length(frets) !== R.length(nonOpenStringFrets);
  // mean and variance for all keys
  const mean = R.sum(frets) / R.length(frets);
  const variance =
    R.reduce((acc, f) => acc + Math.pow(f - mean, 2), 0, frets) /
    R.length(frets);
  //
  const strings = R.pluck("string", scaleKeys) as number[];
  const stringRange = Math.max(...strings) - Math.min(...strings) + 1;
  // custom formula to be refined
  const bonus = stringRange === scaleKeys.length ? -0.5 : 0;
  const difficulty = variance + bonus;

  return {
    scaleKeys,
    highestFret,
    variance,
    stringRange,
    difficulty,
    hasOpenString,
    fretRangeWithoutOpenStrings:
      Math.max(...nonOpenStringFrets) - Math.min(...nonOpenStringFrets) + 1,
    bassString: scaleKeys[0].string,
    bassInterval: scaleKeys[0].interval,
  };
});

// Rejects if two fingers on same string and fretRangeWithoutOpenStrings is too big
const filterPossibleFingering = (length: number) =>
  R.filter((fingering: Fingering) => {
    // groupWith works on adjacent pairs, that's why they should be sorted first
    const groupWithString = R.groupWith(
      ({ string: s1 }, { string: s2 }) => s1 === s2,
      sortByString(fingering.scaleKeys)
    );
    // not possible if two keys belong to the same string
    if (groupWithString.length !== length) return false;
    // not possible if fretRangeWithoutOpenStrings is too big
    return fingering.fretRangeWithoutOpenStrings <= MAX_FRET_RANGE;
  });

// Returns true for 6,4,3,2 and false for 6,4,2,3.
// Relies on the fact that the keys list is pitch ordered
const diff = (a: number, b: number) => a - b;
const isFromLowToHigh = (fingering: Fingering) => {
  const reversedStrings = R.reverse(R.pluck("string", fingering.scaleKeys));
  const sorted = R.sort(diff, reversedStrings);
  return R.equals(reversedStrings, sorted);
};

// keys have to be played in ascending order according to strings
const filterFromLowToHighFingering = R.filter(isFromLowToHigh);

const isFretInRange = ({ highestFret }: Fingering) => highestFret <= VISIBLE_FRETS;

// keys have to be in range
const filterFretInRange = R.filter(isFretInRange);

const sortByVariance = (
  { difficulty: v1 }: Fingering,
  { difficulty: v2 }: Fingering
) => v1 - v2;

// Format output as Fingering and choose one if many
const bestAmong = (fingerings: Fingering[]): Fingering | undefined => {
  if (fingerings.length === 0) return undefined;

  // best is least variance
  return R.head(R.sort(sortByVariance, fingerings!));
};

const debug = (arg: any) => {
  console.log(arg);
  return arg;
}

const doGetBestFingeringFromBass = (
  vChord: VoicedChord,
  bass: ScaleKey,
): Fingering | undefined =>
  R.pipe(
    getScalePitchesFromVoicing, // pitches that form the voiced chord starting from the bass
    getKeysFromScalePitches, // gives all possible keys that match one of the pitches above, with possible duplicates
    getGroupKeysByPitch, // group duplicates by pitch
    comprehend, // gives all combinations of scale keys to form the voiced chord (including unplayable ones)
    filterStartingOnString(bass), // some combinations don't respect the bass condition
    mapAsFingering, // create a fingering for every remaining combination of scale keys, with meta data
    filterFretInRange, // filter fingerings with too high frets
    filterFromLowToHighFingering, // filter fingerings that don't play from low to high pitches
    filterPossibleFingering(vChord.color.intervals.length), // some combinations aren't possible
    // debug,
    bestAmong // select the best remaining combination
  )(bass, vChord.color.intervals, vChord.voicing);

const idOfGetBestFingeringFromBass = (vChord: VoicedChord, bass: ScaleKey) =>
  `${bass.string}-${bass.fret}|${vChord.naturalRoot.name}${vChord.alteration.name}-${vChord.color.name}|${vChord.voicing.name}`;

// Memoized version. It's better to memoize doBestFingeringFromScaleKey rather than bestFingering
// Since several guitarKey may imply the "same next on string" scaleKey (thus we memoize less data)
const getBestFingeringFromBass = R.memoizeWith(
  idOfGetBestFingeringFromBass,
  doGetBestFingeringFromBass
);

// Starts anywhere on the guitar neck and finds next (same pitch or higher) ScaleKey on same string
const nextKeyInChord = (key: GuitarKey, chord: Chord): ScaleKey | undefined => {
  const keysInChord = getArpeggioKeys(chord);
  return R.find(
    (k: ScaleKey) => k.string === key.string && k.pitch >= key.pitch,
    keysInChord
  );
};

const bestFingering = R.curry(
  (
    vChord: VoicedChord,
    guitarKey: GuitarKey
  ): Fingering | undefined => {
    const nextBass = nextKeyInChord(guitarKey, vChord);
    if (!nextBass) return undefined;
    return getBestFingeringFromBass(vChord, nextBass);
  }
);

const getPossibleBassesGivenHighlight = (
  keys: ScaleKey[],
  highlight: Highlight
): ScaleKey[] | undefined => {
  if (highlight.kind === HighlightKind.ByString) {
    return R.filter(({ string }: ScaleKey) => string === highlight.index, keys);
  } else if (highlight.kind === HighlightKind.ByBass) {
    return R.filter(
      ({ interval }: ScaleKey) => interval.diatonicNumber === highlight.index,
      keys
    );
  }
};

// return keys within the arpeggio that belongs to a fingering
// if so, extend key as ScaleKey (with bassIntervals and bassStrings that helps selecting highlight)
export const keysWithFingeringGroup = (vChord: VoicedChord): ScaleKey[] => {
  // all keys in chord arpeggio
  const arpeggioKeys = getArpeggioKeys(vChord);
  // possible starts (chord bass)
  const possibleBasses = getPossibleBassesGivenHighlight(arpeggioKeys, vChord.highlight);
  // find fingerings for each start
  const maybeFingerings = R.map(
    bestFingering(vChord),
    possibleBasses
  ) as Fingering[];
  // keeps non empty ones
  const fingerings = R.reject(R.isNil, maybeFingerings);

  // list of keys belonging to and enhanced with fingerings
  const keysWithFingering = R.chain(
    (fingering) =>
      R.map(
        (key) => ({
          ...key,
          fingering,
        }),
        fingering.scaleKeys
      ),
    fingerings
  );

  // all arpeggioKeys (frets up to VISIBLE_FRETS + MAX_FRET_RANGE) where necessary for
  // fingering processing, but we display less of them
  const visibleKeys = R.filter(
    ({ fret }) => fret <= VISIBLE_FRETS,
    arpeggioKeys
  );

  return R.map((key) => {
    const allFingeringsWithKey = R.filter(
      ({ fret, string }) => fret === key.fret && string === key.string,
      keysWithFingering
    );
    if (allFingeringsWithKey) {
      const bassIntervals = R.map(
        ({ fingering }) => fingering.bassInterval,
        allFingeringsWithKey
      ) as Interval[];
      const bassStrings = R.map(
        ({ fingering }) => fingering.bassString,
        allFingeringsWithKey
      ) as stringIndex[];
      return { ...key, bassIntervals, bassStrings };
    }
    return key;
  }, visibleKeys);
};
