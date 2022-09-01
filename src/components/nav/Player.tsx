// lib
import React, { useEffect } from "react";
// src
import { ActionType } from "state/actions";

type Props = {
  isPlaying: boolean;
  isMuted: boolean;
  inputFocus: boolean;
  isModalOpen: boolean;
  bpm: number; 
  dispatch: Dispatch
};

const Player = ({ isPlaying, isMuted, inputFocus, isModalOpen, bpm, dispatch }: Props) => {

  const handleKeyPress = (e: KeyboardEvent) => {
    if (isModalOpen || inputFocus) return;
    if (e.key === " ") { // space
      e.preventDefault();
      handleTogglePlay();
    } else if (e.key === "b") {
      e.preventDefault();
      handleRewind();
    } else if (e.key === "m") {
      e.preventDefault();
      handleToggleMute();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  });

  const handleTogglePlay = () => {
    dispatch({ type: ActionType.TOGGLE_PLAY, dispatch });
  };
  const handleRewind = () => {
    dispatch({ type: ActionType.REWIND, dispatch });
  };
  const handleToggleMute = () => {
    dispatch({ type: ActionType.TOGGLE_MUTE });
  };
  const handleBPM = (e: React.FormEvent<HTMLInputElement>) => {
    if (!e.currentTarget.validity.valid) return;
    const newBPM = parseInt(e.currentTarget.value, 10) || 0;
    dispatch({ type: ActionType.SET_BPM, payload: newBPM });
  };
  const handleFocus = () => {
    dispatch({ type: ActionType.INPUT_FOCUS_ON });
  };
  const handleBlur = () => {
    dispatch({ type: ActionType.INPUT_FOCUS_OFF });
  };
  const handleHelp = () => {
    dispatch({ type: ActionType.SHOW_HELP_MODAL });
  };
  const handleShare = () => {
    dispatch({ type: ActionType.SHOW_SHARE_MODAL });
  };

  const cnPlay = isPlaying ? "play show-pause" : "play show-play";
  const cnMute = isMuted ? "small muted mute" : "small mute";
  return (
    <div className="player">
      <button className="rewind small" title="[b] key" onClick={handleRewind}>
        <div className="logo1"></div>
        <div className="logo2"></div>
      </button>
      <button className={cnPlay} title="[space] key" onClick={handleTogglePlay}>
        <div className="logo"></div>
      </button>
      <button className={cnMute} title="[m] key" onClick={handleToggleMute}>
        <div className="logo1"></div>
        <div className="logo2"></div>
        <div className="bar"></div>
      </button>
      <input
        onChange={handleBPM}
        value={bpm.toString()}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="bpm"
        type="number"
        step="1"
        min="1"
        max="240"
      />
      <div className="info">bpm</div>
      <button className="help" onClick={handleHelp}>help</button>
      <button className="share" onClick={handleShare}>share …</button>
    </div>
  );
};

export default Player;
