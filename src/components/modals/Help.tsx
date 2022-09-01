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
          <h2>Help, what is cocotte?</h2>
          <p>It's a tool that helps visualizing fingerings of 3 and 4-notes chords on the guitar.</p>
          <p>For instance a C7 chord is made of 4 notes (C, E, G, B♭).If you play each once, there are a number of possible fingerings depending on the order you play them (E-C-G-B♭ or G-C-E-B♭ are indeed different <em>voicings</em>), the set of chosen strings and the region/height on the fretboard.</p>
          <p><em>cocotte</em> helps browsing possible fingerings: you may then experiment, discover, listen and train over chord grids.</p>
          <p>Additional information is available on <a href="https://github.com/silently/cocotte" target="_blank">cocotte's repository</a>. You may also find tunes created by the community under <a href="https://github.com/silently/cocotte/issues?q=is%3Aopen+label%3Atune+sort%3Areactions-%2B1-desc" target="_blank">cocotte GitHub issues</a>.</p>
          <h2>Guitar display</h2>
          <p>If the current chord is a C7, all notes of the C7 arpeggio (C, E, G, B♭) are shown on the fretboard: either as a white circle (for C, the natural root of this chord) or a black circle (any other note of the arpeggio).</p>
          <p>With the chord explorer you define a given <em>voicing</em> and <em>focus</em>: relevant fingerings will be grouped and highlighted with a given color:</p>
          <p><span className="important">Each group of adjacent notes with the same highlight color is a fingering.</span></p>
          <p>You don't need to restrain to the suggested fingerings, and may refer to black/white circles (the whole arpeggio) to find your own, possibly playing the same note several times.</p>
          <p>In the current display, the bottom string maps to the lower E.</p>
          <h2>Modes</h2>
          <ul>
            <li>Edit mode (the chord explorer is shown): add, delete and define chord voicings with the help of the grid and the chord explorer. When editing, the guitar displays voicings of the chord highlighted in the grid</li>
            <li>Play mode (a second guitar is shown): the tune is played at the chosen tempo (<em>bpm</em> setting) and the second guitar displays the next chord to come</li>
          </ul>
          <h2>Interaction</h2>
          <ul>
            <li>[space]: toggles play/pause (and play/edit modes)</li>
            <li>[b]: goes to beginning of the tune</li>
          </ul>
          <p>In edit mode:</p>
          <ul>
            <li>[tab]: toggles keyboard focus between the grid and the chord explorer, showing a ⇥ character near the currently active region</li>
            <li>[arrows] or mouse: browse the grid or chord explorer</li>
            <li>[enter]: selects current</li>
            <li>[backspace]: deletes current</li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default Help;
