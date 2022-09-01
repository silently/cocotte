// src
import { createFinder } from "./utils";

const Index: { [key: string]: Note } = {
  C: { id: "C", name: "C", pitch: 0 },
  D: { id: "D", name: "D", pitch: 2 },
  E: { id: "E", name: "E", pitch: 4 },
  F: { id: "F", name: "F", pitch: 5 },
  G: { id: "G", name: "G", pitch: 7 },
  A: { id: "A", name: "A", pitch: 9 },
  B: { id: "B", name: "B", pitch: 11 },
};

export default Index;

export const findById = createFinder(Index);