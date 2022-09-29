// lib
import React from "react";
import { isEmpty } from "ramda";
// src
import ChordSymbol from "components/lib/ChordSymbol";

type Props = {
  isPlaying: boolean;
  isNext: boolean;
  showFingering: boolean;
  vChord: VoicedChord;
  keys: ScaleKey[];
};

const getFingeringClassName: (key: ScaleKey) => string = ({
  bassIntervals,
  bassStrings,
}) => {
  if (isEmpty(bassIntervals)) return "";
  const biClasses = bassIntervals!
    .map((bi) => `fg-bass-interval-${bi.diatonicNumber}`)
    .join(" ");
  const bsClasses = bassStrings!.map((bs) => `fg-bass-string-${bs}`).join(" ");
  return `fingering ${biClasses} ${bsClasses}`;
};

const renderKey: (key: ScaleKey) => React.ReactNode = (key) => {
  const {
    string,
    fret,
    interval: { diatonicNumber, quality },
  } = key;
  const className = `string-${string} fret-${fret} interval-${diatonicNumber} quality-${quality} ${getFingeringClassName(
    key
  )}`;
  return (
    <div key={`${string}-${fret}`} className={className}>
      <div className="bg" />
      <div className="twice" />
    </div>
  );
};

const Guitar = ({
  isPlaying,
  isNext,
  showFingering,
  vChord,
  keys
}: Props) => (
  <div className="guitar-container">
    {isPlaying ? (
      <div className="info-container"><div>{isNext ? "next" : "current"}</div></div>
    ) : (
      <div className="info-container legend">
        <p><span className="symbol-root"></span> root</p>
        <p><span className="symbol-root"></span>+<span className="symbol-note"></span> arpeggio</p>
        <p><span className="symbol-fingering"></span><span className="symbol-fingering"></span><span className="symbol-fingering"></span><span className="symbol-fingering"></span> fingering</p>
      </div>
    )}
    <div className="chord-container">
      {showFingering && (
        <>
          <ChordSymbol chord={vChord} />
          <div className="info">
            {vChord.voicing.shortName} · {vChord.highlight.name}
          </div>
        </>
      )}
    </div>
    <div className="guitar">
      <div className="static">
        <div className="start" />
        <div className="markers">
          <div className="marker-5" />
          <div className="marker-7" />
          <div className="marker-12" />
        </div>
        <div className="frets" />
        <div className="low-string" />
      </div>
      <div className="dynamic">
        <div className="keys">{showFingering && keys.map(renderKey)}</div>
      </div>
    </div>
  </div>
);

export default Guitar;
