// lib
import { map } from "ramda";
// src
import Intervals from "./intervals";
import { createFinder } from "./utils";

const {
  Per1,
  Min3,
  Maj3,
  Per4,
  Dim5,
  Per5,
  Aug5,
  Maj6,
  Dim7,
  Min7,
  Maj7,
  Min9,
  Maj9,
} = Intervals;

const Index: { [key: string]: Color } = {
  maj7: {
    id: "maj7",
    name: "∆",
    display: { exp: "∆" }, //𝝙∆
    intervals: [Per1, Maj3, Per5, Maj7],
  },
  dom: {
    id: "dom",
    name: "7",
    display: { exp: "7" },
    intervals: [Per1, Maj3, Per5, Min7],
  },
  m7M: {
    id: "m7M",
    name: "m∆",
    display: { base: "m", exp: "∆" },
    intervals: [Per1, Min3, Per5, Maj7],
  },
  m7: {
    id: "m7",
    name: "m7",
    display: { base: "m", exp: "7" },
    intervals: [Per1, Min3, Per5, Min7],
  },
  hdim7: {
    id: "hdim7",
    name: "ø", //
    display: { exp: "ø" }, //∅
    intervals: [Per1, Min3, Dim5, Min7],
  },
  dim7: {
    id: "dim7",
    name: "°",
    display: { exp: "⚬" }, // ⚬￮°
    intervals: [Per1, Min3, Dim5, Dim7],
  },
  dim7M: {
    id: "dim7m",
    name: "°∆",
    display: { exp: "⚬∆" },
    intervals: [Per1, Min3, Dim5, Maj7],
  },
  maj6: {
    id: "maj6",
    name: "6",
    display: { exp: "6" },
    intervals: [Per1, Maj3, Per5, Maj6],
  },
  min6: {
    id: "min6",
    name: "m6",
    display: { base: "m", exp: "6" },
    intervals: [Per1, Min3, Per5, Maj6],
  },
  dom5b: {
    id: "dom5b",
    name: "7♭5",
    display: { exp: "7♭5" },
    intervals: [Per1, Maj3, Dim5, Min7],
  },
  maj5b: {
    id: "maj5b",
    name: "∆♭5",
    display: { exp: "∆♭5" },
    intervals: [Per1, Maj3, Dim5, Maj7],
  },
  maj65b: {
    id: "maj65b",
    name: "6♭5",
    display: { exp: "6♭5" },
    intervals: [Per1, Maj3, Dim5, Maj6],
  },
  aug7M: {
    id: "aug7M",
    name: "∆♯5",
    display: { exp: "∆♯5" },
    intervals: [Per1, Maj3, Aug5, Maj7],
  },
  aug7: {
    id: "aug7",
    name: "7♯5",
    display: { exp: "7♯5" },
    intervals: [Per1, Maj3, Aug5, Min7],
  },
  sus7: {
    id: "sus7",
    name: "7sus",
    display: { exp: "7sus" },
    intervals: [Per1, Per4, Per5, Min7],
  },
  maj69: {
    id: "maj69",
    name: "69",
    display: { omit: "o5", exp: "6/9" },
    intervals: [Per1, Maj3, Maj6, Maj9],
  },
  dom79: {
    id: "dom79",
    name: "79",
    display: { omit: "o5", exp: "79" },
    intervals: [Per1, Maj3, Min7, Maj9],
  },
  dom79b: {
    id: "dom79b",
    name: "79b",
    display: { omit: "o5", exp: "7♭9" },
    intervals: [Per1, Maj3, Min7, Min9],
  },
  maj: {
    id: "maj",
    name: "maj",
    display: { base: "maj" },
    intervals: [Per1, Maj3, Per5],
  },
  min: {
    id: "min",
    name: "min",
    display: { base: "min" },
    intervals: [Per1, Min3, Per5],
  },
  aug: {
    id: "aug",
    name: "aug",
    display: { exp: "♯5" },
    intervals: [Per1, Maj3, Aug5],
  },
  altb: {
    id: "altb",
    name: "alt♭",
    display: { exp: "♭5" },
    intervals: [Per1, Maj3, Dim5],
  },
  dim: {
    id: "dim",
    name: "dim",
    display: { base: "dim" },
    intervals: [Per1, Min3, Dim5],
  },
  sus: {
    id: "sus",
    name: "sus",
    display: { base: "sus" },
    intervals: [Per1, Per4, Per5],
  },
};

export default Index;

export const findById = createFinder(Index);

export const isTriad = (c: Color) => c.intervals.length === 3;

export const bassHighlights = (c: Color) => map((i) => `b${i.diatonicNumber}`, c.intervals)
