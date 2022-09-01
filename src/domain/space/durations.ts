// src
import { createFinder } from "./utils";

const Index: { [key: string]: Duration } = {
  two: { id: "two", name: "2", beats: 2 },
  four: { id: "four", name: "4", beats: 4 },
  eight: { id: "eight", name: "8", beats: 8 },
  sixteen: { id: "sixteen", name: "16", beats: 16 },
};

export default Index;

export const findById = createFinder(Index);