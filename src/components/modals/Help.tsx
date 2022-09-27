// lib
import React, { useEffect } from "react";
// src
import { ActionType } from "state/actions";

type Props = {
  dispatch: Dispatch
};

const Help = ({
  dispatch
}: Props) => {
  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  });

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      dispatch({ type: ActionType.HIDE_HELP_MODAL });
    }
  };

  const handleClose = () => {
    dispatch({ type: ActionType.HIDE_HELP_MODAL });
  };

  return (
    <>
      <div className="modal-bg" onClick={handleClose} />
      <div className="modal help-modal">
        <div className="close-bg" />
        <div className="close-action" onClick={handleClose}>⨯</div>
        <div className="modal-contents">
          <h2>What is cocotte?</h2>
          <p>It is a guitar training tool intended to discover fingerings, experiment them, find relations between different chords or voicings, have a better knowledge of intervals.</p>
          <p>As a visualization app for the guitar, it shows:</p>
          <ul>
            <li>the full arpeggio of a given chord on the fretboard (white dots for the root, black dots for other notes)</li>
            <li>possible chord fingerings of this arpeggio (grouped by different colors)</li>
          </ul>
          <p>For a given D7 chord, each colored fingerings includes the different notes of the chord (D-F-A-C) once and only once. Several fingerings are displayed:</p>
          <ul>
            <li>depending on a given voicing (the order in which the notes are stacked, for instance drop 2 is F-D-A-C)</li>
            <li>on a preferred bass (per string or per note)</li>
          </ul>
          <p>Additional information is available on <a href="https://github.com/silently/cocotte" target="_blank">cocotte's repository</a>. You may also find tunes created by the community under <a href="https://github.com/silently/cocotte/issues?q=is%3Aopen+label%3Atune+sort%3Areactions-%2B1-desc" target="_blank">cocotte GitHub issues</a>.</p>
          <h2>About guitar display and colors</h2>
          <p>If the current chord is a C7, all notes of the C7 arpeggio (C, E, G, B♭) are shown on the fretboard: either as a white dot (for C, the natural root of this chord) or a black dot (any other note of the arpeggio).</p>
          <p>With the chord explorer you define a given <em>voicing</em> and <em>focus</em>: relevant fingerings will be grouped and highlighted with a given color:</p>
          <p><span className="important">Each group of adjacent notes with the same highlight color is a fingering.</span></p>
          <p>You don't need to restrain to the suggested fingerings, and may refer to black/white circles (the whole arpeggio) to find your own, possibly playing the same note several times.</p>
          <p>In the current display, the bottom string maps to the lower E.</p>
          <h2>Play and edit modes</h2>
          <ul>
            <li>Edit mode (the chord explorer is shown): add, delete and define chord voicings with the help of the grid and the chord explorer. When editing, the guitar displays voicings of the chord highlighted in the grid</li>
            <li>Play mode (a second guitar is shown): the tune is played at the chosen tempo (<em>bpm</em> setting) and the second guitar displays the next chord to come</li>
          </ul>
          <h2>Keyboard interaction</h2>
          <ul>
            <li><code>[space]</code> toggles play/pause (and play/edit modes)</li>
            <li><code>[b]</code> goes to beginning of the tune</li>
          </ul>
          <p>In edit mode:</p>
          <ul>
            <li><code>[tab]</code> toggles keyboard focus between the grid and the chord explorer, showing a ⇥ character near the currently active region</li>
            <li><code>[arrows]</code> (or mouse) browse the grid or chord explorer</li>
            <li><code>[enter]</code> selects current</li>
            <li><code>[backspace]</code> deletes current</li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default Help;
