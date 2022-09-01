// lib
import React, { useEffect, useState } from "react";
import { times } from "ramda";
// src
import { ActionType } from "state/actions";
import { BEATS_PER_BAR, MAX_GRID_LINES } from "state/constants";
import { isMoveKey, moveFromKey } from "components/lib/utils";
import ChordSymbol from "components/lib/ChordSymbol";
import { getBrowsableMap, getPointFromCell, getCells, columnsFromLength } from "./utils";

type Props = {
  isPlaying: boolean;
  isEnabled: boolean;
  isAddNewCell: boolean;
  inputFocus: boolean;
  currentCellIndex: number;
  sequence: Passage[];
  title: string;
  issue?: number;
  beat: number;
  beatInPassage: number;
  dispatch: Dispatch;
};

const MAX_CELLS = 16;

const countFills = (cells: object[], columns: number): number => {
  if (cells.length >= MAX_CELLS) return 0;
  const numRowsLastLine = cells.length % columns;
  const numLines = Math.ceil(cells.length / columns);
  if (numLines === MAX_GRID_LINES && numRowsLastLine === 0) return 0;
  if (numRowsLastLine === 0) return 1;
  return columns - numRowsLastLine;
};

const Grid = ({
  isPlaying,
  isEnabled,
  isAddNewCell,
  inputFocus,
  currentCellIndex,
  sequence,
  title,
  issue,
  beat,
  beatInPassage,
  dispatch }: Props) => {
  const cells = getCells(sequence);
  const columns = columnsFromLength(cells.length);
  const fills = countFills(cells, columns);
  const gridMap = getBrowsableMap(cells, columns);

  const [currentPoint, setCurrentPoint] = useState<Point>({ x: 0, y: 0 });

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  });

  useEffect(() => {
    const newPoint = getPointFromCell(currentCellIndex, gridMap);
    setCurrentPoint(newPoint);
  }, [currentCellIndex]);
  
  const handleClick = (cellIndex: number) => {
    dispatch({ type: ActionType.SET_CURRENT_CELL, payload: cellIndex })
  }

  const handleKeyPress = (e: KeyboardEvent) => {
    if (isPlaying || inputFocus || !isEnabled) return;
    if (isMoveKey(e.key)) {
      const newPoint = moveFromKey(currentPoint, e.key, gridMap);
      const newCurrentCellIndex = newPoint.y * columns + newPoint.x;
      dispatch({ type: ActionType.SET_CURRENT_CELL, payload: newCurrentCellIndex })
    } else if (e.key === "Enter" && isAddNewCell) {
      handleAdd();
    } else if (e.key === "Backspace" && !isAddNewCell && sequence.length !== 1) {
      if (window.confirm("Delete this chord?")) {
        dispatch({ type: ActionType.DELETE_CURRENT_CELL, payload: currentCellIndex })
      }
    } 
  };

  const handleAdd = () => dispatch({ type: ActionType.ADD_VCHORD });
  
  const handleDeleteGrid = () => {
    if (window.confirm("Delete the whole grid?")) {
      dispatch({ type: ActionType.DELETE_GRID });
    }
  };

  const cn = isEnabled
    ? `grid col-${columns} enabled`
    : `grid col-${columns} disabled`;
  return (
    <div className="grid-container">
      <div className={cn}>
        {title && (
          <div className="title">
            <span className="quote">
              {issue ? (
                <a href={"https://github.com/silently/cocotte/issues/" + issue} target="_blank">« {title} »</a>
              ) : (
                <>« {title} »</>
              )}
            </span>
          </div>
        )}
        {!isPlaying && (
          <div className="key-focus-container">
            <div className="indicator">⇥</div>
          </div>
        )}
        {cells.map((cell: VoicedChordWithTiming[], cellIndex) => {
          let cellClassName = cell.length > 1 ? "cell split" : "cell";
          const isCurrent = currentCellIndex === cellIndex;
          if (!isAddNewCell && isCurrent) cellClassName += " current";
          const dotsLength = beatInPassage + 1;
          return (
            <div key={cellIndex} className={cellClassName} onClick={() => handleClick(cellIndex)}>
              {isPlaying && isCurrent && (
                <div className="dots">
                  {times((i) => (
                    <div key={i} className="dot"></div>
                  ), dotsLength)}
                  {times((i) => (
                    <div key={i} className="dot empty"></div>
                  ), BEATS_PER_BAR - dotsLength)}
                </div>
              )}
              {cell.map((chord, index) => {
                const cn =
                  beat >= chord.from && beat < chord.to
                    ? "chord-container active"
                    : "chord-container";
                return (
                  <div key={index} className={cn}>
                    <ChordSymbol chord={chord} />
                    <div className="info">
                      {chord.voicing.shortName} · {chord.highlight.name}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
        {!isPlaying && times((f) => {
          if (f > 0) return <div key={f} className="cell fill disabled" />;
          let cn = "cell fill";
          if (isAddNewCell) cn += " current";
          return (<div key={f} className={cn} onClick={handleAdd}>
            <div className="chord-container">
              <div className="chord">
                <span className="root">+</span>
              </div>
              </div>
            </div>);
        }, fills)}
      </div>
      <button className="delete" onClick={handleDeleteGrid}>delete grid</button>
    </div>
  );
};

export default Grid;
