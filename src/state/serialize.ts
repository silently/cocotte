// lib
import * as R from "ramda";
// src
import { findById as findNoteById } from "domain/space/notes";
import { findById as findAlterationById } from "domain/space/alterations";
import { findById as findColorById } from "domain/space/colors";
import { findById as findVoicingById } from "domain/space/voicings";
import { findById as findHighlightById } from "domain/space/highlights";
import { findById as findDurationById } from "domain/space/durations";

// current serialization version is 1

const getKeyByValue = (s: Serializer, value: string) => Object.keys(s).find(key => s[key] === value);

const roots: Serializer = {
  "C,flat": "a",
  "C,natural": "b",
  "C,sharp": "c",
  "D,flat": "d",
  "D,natural": "e",
  "D,sharp": "f",
  "E,flat": "g",
  "E,natural": "h",
  "E,sharp": "i",
  "F,flat": "j",
  "F,natural": "k",
  "F,sharp": "l",
  "G,flat": "m",
  "G,natural": "n",
  "G,sharp": "o",
  "A,flat": "p",
  "A,natural": "q",
  "A,sharp": "r",
  "B,flat": "s",
  "B,natural": "t",
  "B,sharp": "u",
}

const colors: Serializer = {
  "maj7": "a",
  "dom": "b",
  "m7M": "c",
  "m7": "d",
  "hdim7": "e",
  "dim7": "f",
  "dim7M": "g",
  "maj6": "h",
  "min6": "i",
  "dom5b": "j",
  "maj5b": "k",
  "maj65b": "l",
  "aug7M": "m",
  "aug7": "n",
  "sus7": "o",
  "maj69": "p",
  "dom79": "q",
  "dom79b": "r",
  "maj": "s",
  "min": "t",
  "aug": "u",
  "altb": "v",
  "dim": "w",
  "sus": "x",
}

const voicings: Serializer = {
  "close": "a",
  "drop2": "b",
  "drop3": "c",
  "drop23": "d",
  "drop24": "e",
  "drop223": "f",
  "drop4": "g",
  "drop34": "h",
  "drop234": "i",
  "triadClose": "j",
  "triadDrop2": "k",
  "triadDrop3": "l",
}

const highlights: Serializer = {
  "s3": "a",
  "s4": "b",
  "s5": "c",
  "s6": "d",
  "b1": "e",
  "b3": "f",
  "b4": "g",
  "b5": "h",
  "b6": "i",
  "b7": "j",
  "b9": "k",
}

const durations: Serializer = {
  "two": "b",
  "four": "d",
  "eight": "h",
  "sixteen": "p",
}

const serializePassage = (p: Passage): string => {
  const root = p.vChord.naturalRoot.id + "," + p.vChord.alteration.id;
  return roots[root] +
    colors[p.vChord.color.id] +
    voicings[p.vChord.voicing.id] +
    highlights[p.vChord.highlight.id] +
    durations[p.duration.id]
}

const deserializePassage = (s: string, index: number): Passage => {
  const root = getKeyByValue(roots, s[0]);
  const [naturalRootId, alterationId] = R.split(",", root!);
  const colorId = getKeyByValue(colors, s[1]);
  const voicingId = getKeyByValue(voicings, s[2]);
  const highlightId = getKeyByValue(highlights, s[3]);
  const durationId = getKeyByValue(durations, s[4]);

  return {
    vChord: {
      naturalRoot: findNoteById(naturalRootId),
      alteration: findAlterationById(alterationId),
      color: findColorById(colorId!),
      voicing: findVoicingById(voicingId!),
      highlight: findHighlightById(highlightId!),
    },
    index,
    duration: findDurationById(durationId!)
  }
}

// URL compatible serialization (leading number corresponds to the serialization version)
export const serialize = (sequence: Sequence) => R.reduce(
  (acc: string, p: Passage) => acc + serializePassage(p), "1", sequence
)

// returning void means deserialize failed
export const deserialize = (s: string): Sequence | void => {
  const version = s[0];
  if (version !== "1") return;
  const passages = R.splitEvery(5, s.substring(1));
  // prefer array map (over Ramda's) for index
  try {
    return passages.map((passage: string, index: number) => deserializePassage(passage, index));
  } catch (error) {
    return;
  }
}