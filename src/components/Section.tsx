import React from "react";
import { renderChords } from "../App";
import { ChordContext } from "../stateManagement/chordContext";
import { SectionState } from "./Canvas";
import ChordBox from "./ChordBox";
import DropBox from "./DropBox";
import DynamicDropBox from "./DynamicDropBox";

interface props {
  sectionItem: SectionState;
  lyricIndex: number;
  chordsToRender: renderChords[];
  sectionIndex: number;
}
const Section = ({
  sectionItem,
  lyricIndex,
  chordsToRender,
  sectionIndex,
}: props) => {
  const context = React.useContext(ChordContext);
  const setChordsToRender = context.setChordsToRender;
  const setCanvas = context.setCanvasState;

  const deleteChordBox =
    (lyricIndex: number, chordBoxIndex: number, sectionIndex: number) => () => {
      setCanvas((prev) => {
        const newCanvas = [...prev];
        newCanvas[sectionIndex].SectionState[lyricIndex].ChordBoxes.splice(
          chordBoxIndex,
          1
        );
        return newCanvas;
      });

      setChordsToRender((prev) => {
        const chordsToUpdate: typeof prev = [];
        const remaining: typeof prev = [];

        prev.forEach((chord) => {
          const chordID = chord.id.toString();
          const chordBoxID = parseInt(chordID.split("-")[3]);
          if (
            chordID.includes(`${sectionIndex}-${lyricIndex}-`) &&
            chordBoxID > chordBoxIndex
          ) {
            chordsToUpdate.push(chord);
          } else {
            remaining.push(chord);
          }
        });
        const newChords = chordsToUpdate.map((chord) => {
          const chordID = chord.id.toString();
          const chordBoxID = parseInt(chordID.split("-")[3]);
          const newChordID = `${
            chordID.split("-")[0]
          }-${sectionIndex}-${lyricIndex}-${chordBoxID - 1}`;
          const newOverId = `${sectionIndex}-${lyricIndex}-${chordBoxID - 1}`;
          return { ...chord, id: newChordID, overid: newOverId };
        });

        const newLocal = [...remaining, ...newChords];
        return newLocal;
      });
    };

  const removeLyric = (lyricIndex: number, sectionIndex: number) => () => {
    setCanvas((prev) => {
      const newCanvas = [...prev];
      newCanvas[sectionIndex].SectionState.splice(lyricIndex, 1);
      return newCanvas;
    });

    setChordsToRender((prev) => {
      const newrender = prev.filter(
        (chord) => !chord.overid.startsWith(`${sectionIndex}-${lyricIndex}-`)
      );
      return newrender;
    });
  };

  const setMultiplier = (value: string, lyricIndex: number) => {
    setCanvas((prev) => {
      const newCanvas = [...prev];
      newCanvas[sectionIndex].SectionState[lyricIndex].Multiplier = value;
      return newCanvas;
    });
  };
  return (
    <div>
      <div className="flex flex-col gap-2 mb-4">
        <div>
          <div className="relative flex gap-1 items-center text-lg">
            {sectionItem.ChordBoxes.map((currentChordBox, chordBoxIndex) => (
              <div className="flex gap-1 items-center" key={chordBoxIndex}>
                <DropBox
                  animateOnDrag={currentChordBox.isEmpty ? true : false}
                  id={`${sectionIndex}-${lyricIndex}-${chordBoxIndex}`}
                >
                  {currentChordBox.isEmpty ? (
                    <div
                      className="text-red-400 mx-auto text-center cursor-pointer"
                      onClick={deleteChordBox(
                        lyricIndex,
                        chordBoxIndex,
                        sectionIndex
                      )}
                    >
                      X
                    </div>
                  ) : (
                    <div className="flex">
                      {(() => {
                        const relevantChords = chordsToRender?.filter(
                          (chord) =>
                            chord.overid ===
                            `${sectionIndex}-${lyricIndex}-${chordBoxIndex}`
                        );
                        return relevantChords?.map((chord, index) => (
                          <>
                            <ChordBox
                              className="hover:bg-blue-100"
                              key={chord.id}
                              isPlaced={true}
                              chord={chord}
                            />
                            {currentChordBox.count > 1 &&
                              index < relevantChords.length - 1 && (
                                <p className="mt-1 mr-0.5">,</p>
                              )}
                          </>
                        ));
                      })()}
                    </div>
                  )}
                </DropBox>
                <p>|</p>
              </div>
            ))}
            <DynamicDropBox id={`add-${sectionIndex}-${lyricIndex}`} />
            {sectionItem.Multiplier && (
              <div>{`(x${sectionItem.Multiplier})`}</div>
            )}
            <input
              value={sectionItem.Multiplier}
              placeholder="Enter Multiplier"
              className="remove-multiplier"
              onChange={(e) => setMultiplier(e.target.value, lyricIndex)}
              type="number"
            ></input>
          </div>
          <input
            className="w-100 text-lg"
            value={sectionItem.Lyrics}
            placeholder="lyrics go here..."
            onChange={(e) => {
              setCanvas((prev) => {
                const newCanvas = [...prev];
                newCanvas[sectionIndex].SectionState[lyricIndex].Lyrics =
                  e.target.value;
                return newCanvas;
              });
            }}
          ></input>
          <button
            onClick={removeLyric(lyricIndex, sectionIndex)}
            className="remove-lyric px-2 py-1 bg-red-400 rounded-md text-white cursor-pointer"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default Section;
