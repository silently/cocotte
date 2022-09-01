// src
import { createFinder } from "./utils";

const Index: { [key: string]: Alteration } = {
  sharp: { id: "sharp", pitch: 1, name: "♯" },
  natural: { id: "natural", pitch: 0, name: "♮" },
  flat: { id: "flat", pitch: -1, name: "♭" },
};

export default Index;

export const findById = createFinder(Index);