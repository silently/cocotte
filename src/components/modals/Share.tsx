// lib
import React, { useEffect } from "react";
import { map, reduce, splitEvery } from "ramda";
// src
import { ActionType } from "state/actions";
import { MAX_TITLE_LENGTH } from "state/constants";
import { columnsFromLength } from "components/grid/utils";


type Props = {
  title: string;
  link: string;
  sequence: Sequence;
  dispatch: Dispatch
};

const genMarkDownLine = (line: string[]) => reduce(
  (acc: string, elem: string) => `${acc} ${elem} |`,
  "|",
  line
);

const genMarkDownLineSubHeader = (line: string[]) => reduce(
  (acc: string) => `${acc}-|`,
  "|",
  line
);

const genMarkDownTable = (sequence: Sequence) => {
  const flatChords = map(({ vChord: { alteration, color, naturalRoot } }) => {
    const altText = alteration.id === "natural" ? "" : alteration.name;
    let colorText = color.display.base || "";
    colorText += color.display.exp || "";
    colorText += color.display.omit || "";
    colorText += color.display.add || "";
    return `${naturalRoot.name}${altText}${colorText}`;
  }, sequence);
  const grid = splitEvery(columnsFromLength(flatChords.length), flatChords);
  const [first, ...rest] = grid;
  let table = `\n\nGrid:\n${genMarkDownLine(first)}\n${genMarkDownLineSubHeader(first)}\n`;
  for (const line of rest) {
    table += genMarkDownLine(line) + "\n";
  }
  return table;
}

const Share = ({
    title,
    link,
    sequence,
    dispatch
}: Props) => {
  const draft = `[Play in cocotte](${link})${genMarkDownTable(sequence)}
Add any insight about the tune, its interest; then remove this line`;
  const githubLink = encodeURI(`https://github.com/silently/cocotte/issues/new?labels=tune&title=${title}`);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  });

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      dispatch({ type: ActionType.HIDE_SHARE_MODAL });
    }
  };
  
  const handleClose = () => {
    dispatch({ type: ActionType.HIDE_SHARE_MODAL });
  };
  
  const handleSetTitle = (e: React.FormEvent<HTMLInputElement>) => {
    if (!e.currentTarget.validity.valid) return;
    dispatch({ type: ActionType.SET_TITLE, title: e.currentTarget.value });
  };

  const handleSelectText = (e: React.FormEvent<HTMLTextAreaElement>) => {
    e.currentTarget.select();
  };

  return (
    <>
      <div className="modal-bg" onClick={handleClose}/>
      <div className="modal share-modal">
          <div className="close-bg" />
          <div className="close-action" onClick={handleClose}>⨯</div>
          <div className="modal-contents">
            <h2>How do I share?</h2>
            <fieldset className="fieldset-title">
              <label>Give this tune a title</label>
              <input
                onChange={handleSetTitle}
                value={title}
                maxLength={MAX_TITLE_LENGTH}
                type="text"
              />
            </fieldset>
            <hr />
            <fieldset>
            <label><strong>Option #simple:</strong> copy and share this direct link</label>
              <textarea
                value={link}
                onClick={handleSelectText}
                readOnly
              />
            </fieldset>
            <hr />
          <p><strong>Option #preferred:</strong> share it as a GitHub issue for others to find</p>
          <p className="light">One may remix a previously pusblished tune and share it as variation (but let's avoid pure duplicates). If so, please add a reference to the original tune/issue in the description.</p>
          <fieldset>
          <label>1· Copy this draft description:</label>
            <textarea
              className="draft"
              value={draft}
              onClick={handleSelectText}
              readOnly
            />
          </fieldset>
          <p>2· <a href={githubLink} target="_blank">Create a new issue</a> on cocotte's GitHub repository.</p>
          <p>3· Paste and edit the draft description above, then click "Submit new issue"</p>
          <p>As a result, your tune is publicly listed under cocotte <a href="https://github.com/silently/cocotte/issues?q=is%3Aopen+label%3Atune+sort%3Areactions-%2B1-desc" target="_blank">GitHub issues</a> with the <em>tune</em> label. By doing so, you accept that other users may find, comment or remix it.</p>
          </div>
      </div>
    </>
  );
}

export default Share;
