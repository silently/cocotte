interface WithId {
  id: string;
}

interface WithName {
  name: string;
}

interface WithPitch {
  pitch: number;
}

// Min3 interval is { number: 3, quality: Quality.MINOR }
interface Interval extends WithPitch {
  diatonicNumber: number;
  quality: Quality;
}

interface Note extends WithPitch, WithName, WithId { }
interface Alteration extends WithId, WithPitch, WithName { }

interface Duration extends WithName, WithId {
  beats: number;
}

// pitch qualified within a scale
interface ScalePitch extends WithPitch {
  interval: Interval;
}

// ∆ color is made of P1, Maj3, P5 and Maj7 intervals
interface Color extends WithId, WithName {
  intervals: Interval[];
  display: { base?: string; add?: string; exp?: string; omit?: string };
}

// C7
interface Chord {
  naturalRoot: Note;
  alteration: Alteration;
  color: Color;
}

interface Highlight extends WithId, WithName {
  kind: HighlightKind;
  index: number;
  display?: { base?: string; exp?: string };
}

interface Voicing extends WithId, WithName {
  moves: number[];
  stringHighlightIds: string[];
  shortName: string;
}

interface VoicedChord extends Chord {
  [key: ChordAccessor]: WithId;
  // naturalRoot, alteration, color from Chord
  voicing: Voicing;
  highlight: Higlight;
}

// guitar-related

type stringIndex = 1 | 2 | 3 | 4 | 5 | 6;

// 1 (high E) to 6 (low E)
interface GuitarString extends WithPitch {
  string: stringIndex;
}

// pitch is deduced from key and index
interface GuitarKey extends WithPitch, GuitarString {
  fret: number;
}

// guitar key qualified within a scale
interface ScaleKey extends GuitarKey {
  interval: Interval;
  // below: defined if within a fingering
  bassIntervals?: Interval[];
  bassStrings?: stringIndex[];
}

// fingering of a VoicedChord made of scaleKeys
interface Fingering {
  scaleKeys: ScaleKey[];
  highestFret: number;
  variance: number;
  stringRange: number;
  difficulty: number;
  hasOpenString: boolean;
  fretRangeWithoutOpenStrings: number;
  bassInterval: Interval;
  bassString: stringIndex;
}

