// lib
import { take } from "ramda";
// src
import { deserialize } from "./serialize";
import { MAX_GRID_LENGTH, MAX_TITLE_LENGTH } from "./constants";

// from https://stackoverflow.com/questions/1397329/how-to-remove-the-hash-from-window-location-url-with-javascript-without-page-r/5298684#5298684
const removeHash = () => history.pushState("", document.title, window.location.pathname + window.location.search);

const stateFromHash = (): PublicState | void => {
  const params = new URLSearchParams(location.hash);
  // parse sequence
  let sequence = deserialize(params.get("tune") || "");
  if (!sequence) return;
  sequence = take(MAX_GRID_LENGTH, sequence);
  // parse title
  const title = (params.get("title") || "").substring(0, MAX_TITLE_LENGTH);
  // parse title
  let issue;
  const rawIssue = parseInt(params.get("issue") || "", 10);
  if (!isNaN(rawIssue) && rawIssue > 0) issue = rawIssue;
  // parse BPM
  let bpm = 60;
  const rawBPM = parseInt(params.get("bpm") || "", 10);
  if (!isNaN(rawBPM)) bpm = rawBPM;
  // clean URL
  removeHash();

  return {
    sequence,
    title,
    bpm,
    issue,
  }
}

// API

export const load = (defaultState: State): State => {
  // load from hash
  const publicState = stateFromHash();
  if (publicState) return { ...defaultState, ...publicState };

  // load from localStorage
  const serializedSequence = localStorage.getItem("sequence");
  if (!serializedSequence) return defaultState;
  const sequence = deserialize(serializedSequence);
  if (!sequence) return defaultState;
  return { ...defaultState, serializedSequence, sequence };
};

export const save = (state: State) => {
  localStorage.setItem("sequence", state.serializedSequence);
  return state;
};