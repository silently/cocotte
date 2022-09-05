// lib
import * as R from "ramda";
// src
import { KeyFocus, BEATS_PER_BAR, BEEP, TERSE_DEFAULT_STATE } from "./constants";
import { serialize } from "./serialize";
import { isTriad, bassHighlights } from "domain/space/colors";
import D from "domain/space/durations";
import { triadTetraSwitchVoicing } from "domain/space/voicings";
import { findById as findHighlightById } from "domain/space/highlights";
import { keysWithFingeringGroup } from "domain/processors/fingering";
import { ActionType } from "./actions";
import { load, save } from "./storage";

const addPassage = (sequence: Sequence): Sequence => {
  const lastPassage = sequence[sequence.length - 1];
  const newVoicedChord = R.clone(lastPassage.vChord);
  const newPassage: Passage = {
    vChord: newVoicedChord,
    index: sequence.length,
    duration: D.four,
  };
  return R.append(
    newPassage,
    sequence
  )
};

type PositionsAcc = {
  // final interesting result
  beatInPassage: number;
  currentCellIndex: number;
  // local acc state
  previousPassagesLength: number;
};

const getPositions = (sequence: Sequence, beat: number): PositionsAcc =>
  R.reduce(
    (acc: PositionsAcc, passage: Passage) => {
      const newPreviousPassagesLength =
        acc.previousPassagesLength + passage.duration.beats;
      if (newPreviousPassagesLength > beat)
        return R.reduced({
          beatInPassage: beat - acc.previousPassagesLength,
          currentCellIndex: passage.index,
          previousPassagesLength: newPreviousPassagesLength, // useless in final result
        });
      return { ...acc, previousPassagesLength: newPreviousPassagesLength };
    },
    { beatInPassage: 0, currentCellIndex: 0, previousPassagesLength: 0 },
    sequence
  );

const getKeys = (sequence: Sequence, index: number): ScaleKey[] =>
  keysWithFingeringGroup(sequence[index].vChord);

const getVoicedChord = (sequence: Sequence, index: number): VoicedChord => {
  return sequence[index].vChord;
};

const getNextCellIndex = (state: State) => {
  if (state.currentCellIndex + 1 >= state.sequence.length) return 0;
  return state.currentCellIndex + 1;
}

// derived states compute

const resetBeat = (state: State): State => ({
  ...state,
  beat: state.currentCellIndex * BEATS_PER_BAR,
  beatInPassage: 0,
  beatLength: R.sum(R.map(({ duration: { beats } }) => beats, state.sequence))
});

const computeSerializedState = (state: State): State => {
  const serializedSequence = serialize(state.sequence);
  const link = `${window.location.origin}${window.location.pathname}#&title=${encodeURIComponent(state.title)}&tune=${serializedSequence}&bpm=${state.bpm}`

  return {
    ...state,
    serializedSequence,
    link
  }
};

const computeFingerings = (state: State): State => {
  if (state.isAddNewCell) return state;

  const nexCellIndex = getNextCellIndex(state);
  return {
    ...state,
    currentVChord: getVoicedChord(state.sequence, state.currentCellIndex),
    currentKeys: getKeys(state.sequence, state.currentCellIndex),
    nextVChord: getVoicedChord(state.sequence, nexCellIndex),
    nextKeys: getKeys(state.sequence, nexCellIndex),
  }
};

const computeDerivedState = R.pipe(resetBeat, computeSerializedState, computeFingerings);

// not every color implies the same set of color (triad VS tetrachords)
// and not every voicing implies the same set of highlights
const computeVChord = (prev: VoicedChord, target: VoicedChord): VoicedChord => {
  if (isTriad(prev.color) != isTriad(target.color)) {
    target.voicing = triadTetraSwitchVoicing(prev.voicing.id);
  }
  const targetstringHighlightIds = target.voicing.stringHighlightIds;
  const targetBassighlights = bassHighlights(target.color);
  if (R.includes(prev.highlight.id, targetstringHighlightIds)) return target;
  if (R.includes(prev.highlight.id, targetBassighlights)) return target;
  // else
  target.highlight = findHighlightById(R.last(target.voicing.stringHighlightIds)!);
  return target;
}

// player
let playerTimer: ReturnType<typeof setInterval>;
const playerStart = (bpm: number, dispatch: Dispatch) =>
  setInterval(function () {
    dispatch({ type: ActionType.INC_BEAT });
  }, 60000 / bpm);
const playerStop = () => clearInterval(playerTimer);

// API

// derived properties added
export const INITIAL_STATE = computeDerivedState(
  load(TERSE_DEFAULT_STATE)
);

export const reducer: Reducer = (state, action) => {
  switch (action.type) {
    case ActionType.INC_BEAT: {
      const newBeat = (state.beat + 1) % state.beatLength;
      const {
        currentCellIndex: newCurrentCellIndex,
        beatInPassage: newBeatInPassage,
      } = getPositions(state.sequence, newBeat);

      !state.isMuted && BEEP.play();

      return computeFingerings({
        ...state,
        beat: newBeat,
        beatInPassage: newBeatInPassage,
        currentCellIndex: newCurrentCellIndex,
      });
    }
    case ActionType.SET_CURRENT_CELL: {
      const newDiff = {
        currentCellIndex: action.payload!,
        isAddNewCell: action.payload! >= state.sequence.length,
        beatInPassage: 0
      };

      return computeDerivedState({
        ...state,
        ...newDiff
      });
    }
    case ActionType.TOGGLE_PLAY: {
      // stop
      if (state.isPlaying) {
        playerStop();
        return resetBeat({
          ...state,
          isPlaying: false,
        });
      }
      // play
      !state.isMuted && BEEP.play();
      playerTimer = playerStart(state.bpm, action.dispatch!);
      return {
        ...state,
        isPlaying: true,
      };
    }
    case ActionType.REWIND: {
      if (state.isPlaying) {
        playerStop();
        !state.isMuted && BEEP.play();
        playerTimer = playerStart(state.bpm, action.dispatch!);
      }
      return computeDerivedState({
        ...state,
        currentCellIndex: 0,
      });
    }
    case ActionType.DELETE_CURRENT_CELL: {
      const newSequence = R.remove(action.payload!, 1, state.sequence);
      const newCurrentCellIndex = action.payload! === 0 ? 0 : action.payload! - 1;

      return save(
        computeDerivedState({
          ...state,
          sequence: newSequence,
          currentCellIndex: newCurrentCellIndex,
          beatInPassage: 0
        })
      );
    }
    case ActionType.ADD_VCHORD: {
      const newSequence = addPassage(state.sequence);
      return save(
        computeDerivedState({
          ...state,
          sequence: newSequence,
          currentCellIndex: newSequence.length - 1,
        })
      );
    }
    case ActionType.UPDATE_VCHORD: {
      const updatedPassage = state.sequence[action.payload!];
      const newVChord = computeVChord(updatedPassage.vChord, action.vChord!);
      updatedPassage.vChord = newVChord;
      const newSequence = R.update(
        action.payload!,
        updatedPassage,
        state.sequence
      );
      return save(
        computeDerivedState({
          ...state,
          sequence: newSequence,
          currentCellIndex: action.payload!,
        })
      );
    }
    case ActionType.DELETE_GRID: {
      return save(
        computeDerivedState(TERSE_DEFAULT_STATE)
      );
    }
    case ActionType.SET_TITLE: {
      return save(
        computeSerializedState({
          ...state,
          title: action.title!
        })
      );
    }
    case ActionType.SET_BPM: {
      return computeSerializedState({
        ...state,
        bpm: action.payload!
      });
    }
    case ActionType.TOGGLE_KEY_FOCUS: {
      return {
        ...state,
        keyFocus:
          state.keyFocus === KeyFocus.Grid ? KeyFocus.Explorer : KeyFocus.Grid,
      };
    }
    case ActionType.INPUT_FOCUS_ON: {
      return {
        ...state,
        inputFocus: true
      };
    }
    case ActionType.INPUT_FOCUS_OFF: {
      return {
        ...state,
        inputFocus: false
      };
    }
    case ActionType.SHOW_SHARE_MODAL: {
      playerStop();
      return {
        ...state,
        isSharing: true,
        isPlaying: false,
        inputFocus: true,
      };
    }
    case ActionType.HIDE_SHARE_MODAL: {
      return {
        ...state,
        isSharing: false,
        inputFocus: false,
      };
    }
    case ActionType.SHOW_HELP_MODAL: {
      playerStop();
      return {
        ...state,
        isHelped: true,
        isPlaying: false,
      };
    }
    case ActionType.HIDE_HELP_MODAL: {
      return {
        ...state,
        isHelped: false,
      };
    }
    case ActionType.TOGGLE_MUTE: {
      return {
        ...state,
        isMuted: !state.isMuted,
      };
    }
    default:
      throw new Error();
  }
};
