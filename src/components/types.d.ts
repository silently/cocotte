type ChordAccessor =
  | "naturalRoot"
  | "alteration"
  | "color"
  | "voicing"
  | "highlight";

interface Point {
  x: number;
  y: number;
}

interface Diff {
  type: string;
  value: any;
}

interface BrowsableMap {
  offset: Point;
  size: Point;
  matrix: Diff[][];
}
