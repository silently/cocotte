// lib
import * as R from "ramda";
// src
import N from "domain/space/notes";
import A from "domain/space/alterations";
import C, { isTriad } from "domain/space/colors";
import V from "domain/space/voicings";
import H, { findById as findHighlightById } from "domain/space/highlights";

const Index: { [key: string]: SubTable } = {
  notes: {
    accessor: "naturalRoot",
    offset: { x: 0, y: 0 },
    matrix: [
      [N.C, N.D, null],
      [N.E, N.F, N.G],
      [null, N.A, N.B],
    ],
  },
  alterations: {
    accessor: "alteration",
    offset: { x: 3, y: 0 },
    matrix: [[A.sharp], [A.natural], [A.flat]],
  },
  colors: {
    accessor: "color",
    offset: { x: 4, y: -1 },
    matrix: [
      [C.maj, C.min, C.dim, C.aug, C.altb, C.sus7],
      [C.maj7, C.m7M, null, C.aug7M, C.maj5b, C.dom79],
      [C.dom, C.m7, C.hdim7, C.aug7, C.dom5b, C.dom79b],
      [C.maj6, C.min6, C.dim7, null, null, C.maj69],
    ],
  }
};

const tetraVoicings: SubTable = {
  accessor: "voicing",
  offset: { x: 10, y: 0 },
  matrix: [
    [V.close, V.drop23, V.drop4],
    [V.drop2, V.drop24, V.drop34],
    [V.drop3, V.drop223, V.drop234],
  ],
};

const triadVoicings: SubTable = {
  accessor: "voicing",
  offset: { x: 10, y: 0 },
  matrix: [
    [V.triadClose, null, null],
    [V.triadDrop2, null, null],
    [V.triadDrop3, null, null],
  ],
};

export const getLayout = ({
  color,
  voicing,
}: VoicedChord): { [key: string]: SubTable } => {
  let stringHighlightIds: any = R.map((id) => findHighlightById(id), voicing.stringHighlightIds);
  let bassHighlights: any = color.intervals.map(
    (i) => H[`b${i.diatonicNumber}`]
  );
  const sDiff = 4 - stringHighlightIds.length;
  if (sDiff > 0)
    stringHighlightIds = R.concat(R.repeat(null, sDiff), stringHighlightIds)!;

  const bDiff = 4 - bassHighlights.length;
  if (bDiff > 0)
    bassHighlights = R.concat(bassHighlights, R.repeat(null, bDiff))!;

  const highlights: SubTable = {
    accessor: "highlight",
    offset: { x: 13, y: -1 },
    matrix: R.transpose([stringHighlightIds, bassHighlights]),
  };
  return {
    ...Index,
    voicings: isTriad(color) ? triadVoicings : tetraVoicings,
    highlights
  };
};
