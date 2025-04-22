import { useContext } from "react";
import { IoAddCircleSharp } from "react-icons/io5";
import { ChordContext } from "../stateManagement/chordContext";
import ChordBox from "./ChordBox";
import DropBox from "./DropBox";
import DynamicDropBox from "./DynamicDropBox";
import MetaData from "./MetaData";

export type CanvasState = {
  ChordBoxes: boolean[];
  Lyrics: string;
};

const Canvas = () => {
  const context = useContext(ChordContext);
  const chordsToRender = context.chordsToRender;
  const canvas = context.canvasState;
  const setCanvas = context.setCanvasState;

  const addLyric = () => {
    console.log("canvas", canvas);

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

  return (
    <div>
      <div className=" border-2 border-gray-300 rounded-md p-4">
        <MetaData></MetaData>
        <div className="flex flex-col gap-2">
          {canvas.map((item, lyricIndex) => {
            return (
              <div key={lyricIndex}>
                <div className="flex flex-col gap-4">
                  <div className="flex gap-2">
                    {item.ChordBoxes.map((isEmpty, chordBoxIndex) => (
                      <div
                        className="flex gap-2 items-center"
                        key={chordBoxIndex}
                      >
                        <DropBox id={`lyric-${lyricIndex}-${chordBoxIndex}`}>
                          {isEmpty ? (
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
                            <div className="flex gap-2">
                              {chordsToRender &&
                                chordsToRender.map((chord) => {
                                  return (
                                    chord.overid ===
                                      `lyric-${lyricIndex}-${chordBoxIndex}` && (
                                      <ChordBox key={chord.id} chord={chord} />
                                    )
                                  );
                                })}
                            </div>
                          )}
                        </DropBox>
                        <p>|</p>
                      </div>
                    ))}
                    <DynamicDropBox
                      id={`add-chordBox-${lyricIndex}`}
                    ></DynamicDropBox>
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
                </div>
              </div>
            );
          })}
        </div>
        <button
          data-html2canvas-ignore="true"
          className="flex justify-center items-center gap-2 bg-blue-500 text-white rounded-md p-[2px]"
          onClick={addLyric}
        >
          <IoAddCircleSharp />
          ADD
        </button>
      </div>
    </div>
  );
};

export default Canvas;
