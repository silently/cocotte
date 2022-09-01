// lib
import React from "react";
// src
type Props = {
  chord: Chord;
};

const splitExps = (exp: string) =>
  exp.split("").reduce(
    (acc: string[], letter: string) => {
      if (letter.match(/[♯♭]/)) return [...acc, letter, ""];
      acc[acc.length - 1] += letter;
      return acc;
    },
    [""]
  );

const ChordSymbol = ({ chord: { naturalRoot, alteration, color } }: Props) => {
  const altered = alteration && alteration.id !== "natural";
  const className = altered ? "chord altered" : "chord";

  const base = color.display.base;
  const exp = color.display.exp;
  const exps: string[] = exp ? splitExps(exp) : [];

  return (
    <div className={className}>
      <span className="root">{naturalRoot.name}</span>
      {altered && <span className="root-alt">{alteration.name}</span>}
      {base && <span className="base">{base}</span>}
      {exp &&
        exps!.map((e) => {
          const cn = e.match(/[♯♭]/) ? "exp alt" : "exp";
          return (
            <span key={e} className={cn}>
              {e}
            </span>
          );
        })}
    </div>
  );
};

export default ChordSymbol;
