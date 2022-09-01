// lib
import React, { useEffect, useReducer } from "react";
// src
import "styles/index.scss";
import { ActionType } from "state/actions";
import { KeyFocus } from "state/constants";
import Guitar from "./guitar/Guitar";
import Grid from "./grid/Grid";
import Nav from "./nav/Nav";
import Explorer from "./explorer/Explorer";
import Help from "./modals/Help";
import Share from "./modals/Share";
import { reducer, INITIAL_STATE } from "state/reducer";

const App = () => {
  // state handlers
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  const handleKeyPress = (e: KeyboardEvent) => {
    if (state.inputFocus) return;
    if (e.key === "Tab") {
      e.preventDefault();
      dispatch({
        type: ActionType.TOGGLE_KEY_FOCUS,
      });
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  });

  return (
    <>
      <div className="container">
        <nav>
          <Nav isPlaying={state.isPlaying} isMuted={state.isMuted} inputFocus={state.inputFocus}  isModalOpen={state.isSharing || state.isHelped} bpm={state.bpm} dispatch={dispatch} />
        </nav>
        <main>
          <Grid
            isPlaying={state.isPlaying}
            isEnabled={state.keyFocus === KeyFocus.Grid}
            isAddNewCell={state.isAddNewCell}
            inputFocus={state.inputFocus}
            currentCellIndex={state.currentCellIndex}
            sequence={state.sequence}
            title={state.title}
            issue={state.issue}
            beat={state.beat}
            beatInPassage={state.beatInPassage}
            dispatch={dispatch}
          />
          <Guitar
            isPlaying={state.isPlaying}
            isNext={false}
            vChord={state.currentVChord}
            keys={state.currentKeys}
            showFingering={!state.isAddNewCell}
          />
          {state.isPlaying ? (
            <Guitar
              isPlaying={state.isPlaying}
              vChord={state.nextVChord}
              keys={state.nextKeys}
              showFingering={!state.isAddNewCell}
              isNext={true}
            />
          ) : (
            <Explorer
              isEnabled={state.keyFocus === KeyFocus.Explorer}
              inputFocus={state.inputFocus}
              currentCellIndex={state.currentCellIndex}
              showVChord={!state.isAddNewCell}
              vChord={state.currentVChord}
              dispatch={dispatch}
            />
          )}
        </main>
      </div>
      {state.isSharing && (
        <Share title={state.title} link={state.link} sequence={state.sequence} dispatch={dispatch}  />
      )}
      {state.isHelped && (
        <Help dispatch={dispatch} />
      )}
    </>
  );
};

export default App;
