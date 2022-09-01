// lib
import React from "react";

type Props = {
  color: Color;
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

const ColorSymbol = ({
  color: {
    display: { base, add, exp },
  },
}: Props) => {
  const exps: string[] = exp ? splitExps(exp) : [];
  const alteredExp = exps.length > 1;
  const cnExp = alteredExp ? "exp alt" : "exp";
  return (
    <>
      {base && <span className="base">{base}</span>}
      {add && <span className="add">{add}</span>}
      {exp &&
        exps!.map((e) => {
          return (
            <span key={e} className={cnExp}>
              {e}
            </span>
          );
        })}
    </>
  );
};

export default ColorSymbol;
