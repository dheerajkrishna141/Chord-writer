import { useContext } from "react";
import { IoAddCircleSharp } from "react-icons/io5";
import { ChordContext } from "../stateManagement/chordContext";
import ChordBox from "./ChordBox";
import DropBox from "./DropBox";
import DynamicDropBox from "./DynamicDropBox";
import MetaData from "./MetaData";

export type CanvasState = {
  ChordBoxes: { isEmpty: boolean; count: number }[];
  Lyrics: string;
};

const Canvas = () => {
  const context = useContext(ChordContext);
  const chordsToRender = context.chordsToRender;
  const canvas = context.canvasState;
  const setCanvas = context.setCanvasState;

  const addLyric = () => {
    console.log("canvas", canvas);
    console.log("chordsToRender", chordsToRender);

    setCanvas((prev) => [
      ...prev,
      {
        ChordBoxes: [],
        Lyrics: "",
      },
    ]);
  };

  const deleteChordBox = (lyricIndex: number, chordBoxIndex: number) => () => {
    setCanvas((prev) => {
      const newCanvas = [...prev];
      newCanvas[lyricIndex].ChordBoxes.splice(chordBoxIndex, 1);
      return newCanvas;
    });
  };

  const removeLyric = (lyricIndex: number) => () => {
    setCanvas((prev) => {
      const newCanvas = [...prev];
      newCanvas.splice(lyricIndex, 1);
      //set chordstorender
      return newCanvas;
    });
  };

  return (
    <div className="canvas-content border-2 border-gray-300 rounded-md p-4 w-[8.5in] h-[11in] bg-white ">
      <MetaData></MetaData>
      <div className="flex flex-col gap-2 ">
        {canvas.map((item, lyricIndex) => {
          return (
            <div key={lyricIndex}>
              <div className="flex flex-col gap-2">
                <div>
                  <div className="flex gap-2 items-center">
                    {item.ChordBoxes.map((currentChordBox, chordBoxIndex) => (
                      <div
                        className="flex gap-1 items-center"
                        key={chordBoxIndex}
                      >
                        <DropBox id={`lyric-${lyricIndex}-${chordBoxIndex}`}>
                          {currentChordBox.isEmpty ? (
                            <div
                              className="text-red-400 mx-auto text-center cursor-pointer"
                              onClick={deleteChordBox(
                                lyricIndex,
                                chordBoxIndex
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
                                    `lyric-${lyricIndex}-${chordBoxIndex}`
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
                    <DynamicDropBox id={`add-chordBox-${lyricIndex}`} />
                  </div>
                  <input
                    className="w-100"
                    value={item.Lyrics}
                    placeholder="lyrics go here..."
                    onChange={(e) => {
                      setCanvas([
                        ...canvas.slice(0, lyricIndex),
                        {
                          ...canvas[lyricIndex],
                          Lyrics: e.target.value,
                        },
                        ...canvas.slice(lyricIndex + 1),
                      ]);
                    }}
                  ></input>
                  <button
                    onClick={removeLyric(lyricIndex)}
                    className="remove-lyric px-[3px] py-[1px] bg-red-400 rounded-md text-white cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <button
        className="add-lyric flex justify-center items-center gap-2 bg-blue-500 text-white rounded-md p-[2px]"
        onClick={addLyric}
      >
        <IoAddCircleSharp />
        ADD
      </button>
    </div>
  );
};

export default Canvas;
