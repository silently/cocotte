// lib
import React from "react";
// src
import Player from "./Player";

type Props = {
  isPlaying: boolean;
  isMuted: boolean;
  inputFocus: boolean;
  isModalOpen: boolean;
  bpm: number;
  dispatch: Dispatch
};

const Nav = ({ isPlaying, isMuted, inputFocus, isModalOpen, bpm, dispatch }: Props) => (
  <div className="nav-container">
    <div className="github-link">
      <a href="https://github.com/silently/cocotte" target="_blank">on GitHub</a>
    </div>
    <h1>
      <span className="c">c</span>
      <span className="o">o</span>
      <span className="c">c</span>
      <span className="o">o</span>
      <span className="t pad">t</span>
      <span className="t">t</span>
      <span className="e">e</span>
      <div className="motto">chord voicing trainer for guitar</div>
    </h1>
    <Player isPlaying={isPlaying} isMuted={isMuted} inputFocus={inputFocus} isModalOpen={isModalOpen} bpm={bpm} dispatch={dispatch} />
  </div>
  );

export default Nav;
