// src
import N from "domain/space/notes";
import A from "domain/space/alterations";
import C from "domain/space/colors";
import D from "domain/space/durations";
import V from "domain/space/voicings";
import H from "domain/space/highlights";

export enum KeyFocus {
  Grid,
  Explorer,
}

export const MAX_GRID_LINES = 4;
export const MAX_GRID_LENGTH = 16;
export const BEATS_PER_BAR = 4;
export const MAX_TITLE_LENGTH = 60;

const createSequence = (): Sequence => ([
  {
    vChord: {
      naturalRoot: N.C,
      alteration: A.natural,
      color: C.dom,
      voicing: V.drop2,
      highlight: H.s5,
    },
    index: 0,
    duration: D.four,
  }
]);

const DEFAULT_SEQUENCE = createSequence();
export const TERSE_DEFAULT_STATE: State = {
  // Serialized
  sequence: DEFAULT_SEQUENCE,
  bpm: 60,
  title: "",
  // UX state
  isPlaying: false,
  isMuted: true,
  isSharing: false,
  isHelped: false,
  inputFocus: false,
  keyFocus: KeyFocus.Grid,
  isAddNewCell: false,
  // Sequencer and Player
  currentCellIndex: 0,
  // Sequencer
  beatLength: D.four.beats,
  // Player
  beat: 0,
  beatInPassage: 0,
  // derived properties (see computeState)
  currentVChord: DEFAULT_SEQUENCE[0].vChord,
  currentKeys: [],
  nextVChord: DEFAULT_SEQUENCE[0].vChord,
  nextKeys: [],
  link: "",
  serializedSequence: ""
};

// sound
export const BEEP = new Audio("data:audio/wav;base64,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");