// lib
import React, { useEffect, useState } from "react";
// src
import { ActionType } from "state/actions";
import ChordSymbol from "components/lib/ChordSymbol";
import { isMoveKey, moveFromKey } from "components/lib/utils";
import { getLayout } from "./layout";
import { getBrowsableMap, getProperty } from "./utils";
import ColorSymbol from "./ColorSymbol";

type Props = {
  isEnabled: boolean;
  inputFocus: boolean;
  showVChord: boolean;
  currentCellIndex: number;
  vChord: VoicedChord;
  dispatch: Dispatch;
};

const renderHighlight = ({ name, display }: Highlight) => {
  if (!display) return name;
  const { base, exp } = display;
  return (
    <div className="highlight-item">
      <span className="base">{base}</span>
      <span className="exp">{exp}</span>
      <div className={"bass-item bass-" + base}></div>
    </div>
  );
};

const renderItem = (item: any, accessor: ChordAccessor) => {
  if (!item) return null;
  if (accessor === "color") return <ColorSymbol color={item as Color} />;
  if (accessor === "highlight") return renderHighlight(item);
  if (accessor === "voicing") return item.shortName;
  return item.name;
};

const renderSubTable = (
  { accessor, offset, matrix }: SubTable,
  isEnabled: boolean,
  focus: Point,
  vChord: VoicedChord,
  showVChord: boolean,
  update: (diff: any, focus: Point) => void
) => {
  const cn = `table ${accessor}`;
  const current = vChord[accessor];
  return (
    <div className={cn}>
      {matrix.map((line, i) => (
        <div key={`l-${i}`} className="line">
          {line.map((item, j) => {
            let cni = "item";
            if (!item) { 
              cni += " empty";
              return (
                <button
                  key={`i-${i}-${j}`}
                  className={cni}
                >
                  {renderItem(item, accessor)}
                </button>
              );
            } else {
              if (showVChord && item && item.id === current.id) cni += " current";
              if (isEnabled && item && i + offset.y === focus.y && j + offset.x === focus.x)
                cni += " focus";
              return (
                <button
                  key={`i-${i}-${j}`}
                  className={cni}
                  onClick={() =>
                    update(
                      { [accessor]: item },
                      { x: j + offset.x, y: i + offset.y }
                    )
                  }
                >
                  {renderItem(item, accessor)}
                </button>
              );
            }
          })}
        </div>
      ))}
    </div>
  );
};

const Explorer = ({
  isEnabled,
  inputFocus,
  currentCellIndex,
  vChord,
  showVChord,
  dispatch
}: Props) => {
  const [focus, setFocus] = useState<Point>({ x: 4, y: 0 });
  const layout = getLayout(vChord);
  const explorerMap = getBrowsableMap(layout);

  const handleKeyPress = (e: any) => {
    if (inputFocus || !isEnabled) return;
    if (isMoveKey(e.key)) return setFocus(moveFromKey(focus, e.key, explorerMap));
    if (e.key === "Enter") {
      const { type, value } = getProperty(explorerMap, focus);
      dispatch({
        type: ActionType.UPDATE_VCHORD,
        payload: currentCellIndex,
        vChord: { ...vChord, [type]: value },
      });
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  });

  const handleUpdate = (diff: any, newFocus: Point) => {
    setFocus(newFocus);
    dispatch({
      type: ActionType.UPDATE_VCHORD,
      payload: currentCellIndex,
      vChord: { ...vChord, ...diff },
    });
  };
  const cn = isEnabled
    ? "explorer controller horizontal enabled"
    : "explorer controller horizontal disabled";
  return (
    <div className={cn} onKeyDown={handleKeyPress}>
      <div className="key-focus-container">
        <div className="indicator">⇥</div>
      </div>
      <div className="group group-root">
        <div className="heading">
          <span>root</span>
        </div>
        {renderSubTable(layout.notes, isEnabled, focus, vChord, showVChord, handleUpdate)}
        {renderSubTable(layout.alterations, isEnabled, focus, vChord, showVChord, handleUpdate)}
      </div>
      <div className="chord-heading-container">
        <div className="explorer-heading">chord explorer</div>
        {showVChord && (
          <ChordSymbol chord={vChord} />
        )}
      </div>
      <div className="group group-color">
        <div className="heading">
          <span>type</span>
        </div>
        <div className="legend-triad-bg" />
        <div className="legend-triad">
          <span>TRIADS</span>
        </div>
        <div className="legend-omit">
          <span>NO 5</span>
        </div>
        <div className="legend-base-bg" />
        <div className="legend-base-bg-2" />
        <div className="legend-base">
          <span>TYPICAL</span>
        </div>
        {renderSubTable(layout.colors, isEnabled, focus, vChord, showVChord, handleUpdate)}
      </div>
      <div className="group group-voicing">
        <div className="heading">
          <span>voicing</span>
        </div>
        {renderSubTable(layout.voicings, isEnabled, focus, vChord, showVChord, handleUpdate)}
      </div>
      <div className="group group-highlight">
        <div className="heading">
          <span>highlight</span>
        </div>
        <div className="legend-string">
          <span>BASS STRING...</span>
        </div>
        <div className="legend-interval">
          <span>... OR BASS NOTE</span>
        </div>
        {renderSubTable(layout.highlights, isEnabled, focus, vChord, showVChord, handleUpdate)}
      </div>
    </div>
  );
};

export default Explorer;
