import { useContext, useEffect, useState } from "react";
import { IoAddCircleSharp } from "react-icons/io5";
import { parseCanvasSavedState } from "../functions/helperFunctions";
import { ChordContext } from "../stateManagement/chordContext";
import useLocalStorage from "../stateManagement/useLocalStorage";
import MetaData from "./MetaData";
import Section from "./Section";
import { MdClose } from "react-icons/md";

export interface SectionState {
  ChordBoxes: { isEmpty: boolean; count: number }[];
  Lyrics: string;
  Multiplier?: string;
}
export interface CanvasType {
  SubHeading: string;
  SectionState: SectionState[];
}

const Canvas = () => {
  const [sectionFocus, setSectionFocus] = useState(false);

  const context = useContext(ChordContext);
  const { getItem } = useLocalStorage("canvasState");
  const savedState = getItem()
    ? parseCanvasSavedState(getItem() || "")
    : undefined;
  const chordsToRender = context.chordsToRender;
  const canvas = context.canvasState;
  const setCanvas = context.setCanvasState;
  const setChordsToRender = context.setChordsToRender;

  const addSection = () => {
    setCanvas((prev) => {
      console.log("prev", prev);

      const newCanvas = [
        ...prev,
        {
          SubHeading: "",
          SectionState: [
            {
              ChordBoxes: [],
              Lyrics: "",
              Multiplier: "",
            },
          ],
        },
      ];
      console.log("newCanvas", newCanvas);
      return newCanvas;
    });
  };

  const addLyric = (sectionIndex: number) => {
    console.log("chordsToRender", chordsToRender);
    console.log("canvas", canvas);

    setCanvas((prev) => {
      const newCanvas = [...prev];
      newCanvas[sectionIndex].SectionState.push({
        ChordBoxes: [],
        Lyrics: "",
        Multiplier: "",
      });
      return newCanvas;
    });
  };

  const handleSubHeading = (sectionIndex: number, subHeading: string) => {
    setCanvas((prev) => {
      const newCanvas = [...prev];
      newCanvas[sectionIndex].SubHeading = subHeading;
      return newCanvas;
    });
  };

  const handleSectionDelete = (sectionIndex: number) => {
    setCanvas((prev) => {
      const newCanvas = [...prev];
      newCanvas.splice(sectionIndex, 1);
      return newCanvas;
    });
    setChordsToRender((prev) => {
      const chordsToUpdate: typeof prev = [];
      const remaining: typeof prev = [];
      prev.forEach((chord) => {
        const chordID = chord.id.toString();
        const currSectionIndex = parseInt(chordID.split("-")[1]);
        if (currSectionIndex > sectionIndex) {
          chordsToUpdate.push(chord);
        } else {
          remaining.push(chord);
        }
      });
      const remainingChords = remaining.filter(
        (chord) => !chord.overid.startsWith(`${sectionIndex}-`)
      );
      const newChords = chordsToUpdate.map((chord) => {
        const chordID = chord.id.toString();
        const chordBoxID = parseInt(chordID.split("-")[3]);
        const lyricIndex = parseInt(chordID.split("-")[2]);
        const currSectionIndex = parseInt(chordID.split("-")[1]);
        const newChordID = `${chordID.split("-")[0]}-${
          currSectionIndex - 1
        }-${lyricIndex}-${chordBoxID}`;
        const newOverId = `${currSectionIndex - 1}-${lyricIndex}-${chordBoxID}`;
        return { ...chord, id: newChordID, overid: newOverId };
      });

      return [...newChords, ...remainingChords];
    });
  };

  useEffect(() => {
    if (savedState) {
      setChordsToRender(savedState.chordsToRender);
      setCanvas(savedState.canvasState);
    }
    console.log("Canvas mounted with saved state:", savedState);
  }, []);

  return (
    <div className="canvas-content border-2 border-gray-300 rounded-md p-4 w-[8.5in] h-fit bg-white ">
      <MetaData></MetaData>
      <div className="flex flex-col gap-4 ">
        {canvas.map((canvasItem, sectionIndex) => {
          return (
            <div
              key={sectionIndex}
              className="relative"
              onMouseEnter={() => setSectionFocus(true)}
              onMouseLeave={() => setSectionFocus(false)}
            >
              {sectionFocus && (
                <div
                  onClick={() => handleSectionDelete(sectionIndex)}
                  className="remove-lyric absolute top-0 right-0 p-2 cursor-pointer hover:scale-105 transition-all duration-100 ease-in-out"
                >
                  <MdClose color="red" size={"30px"} />
                </div>
              )}

              <div>
                <input
                  type="text"
                  className=" mb-3 mt-1 text-2xl"
                  placeholder="Sub Heading"
                  value={canvasItem.SubHeading}
                  onChange={(e) =>
                    handleSubHeading(sectionIndex, e.target.value)
                  }
                />
              </div>
              {canvasItem.SectionState?.map((sectionItem, lyricIndex) => {
                return (
                  <Section
                    chordsToRender={chordsToRender}
                    lyricIndex={lyricIndex}
                    sectionItem={sectionItem}
                    key={lyricIndex}
                    sectionIndex={sectionIndex}
                  />
                );
              })}
              <button
                className="add-lyric flex justify-center items-center gap-2 bg-blue-500 text-white rounded-md px-2 py-1 mt-4 cursor-pointer hover:scale-102 transition-all duration-20 ease-in-out"
                onClick={() => addLyric(sectionIndex)}
              >
                <IoAddCircleSharp />
                ADD LYRIC
              </button>
            </div>
          );
        })}
        <button
          className="add-lyric flex justify-center items-center gap-2 bg-blue-500 text-white rounded-md px-2 py-1 mt-4 cursor-pointer hover:scale-102 transition-all duration-20 ease-in-out"
          onClick={addSection}
        >
          <IoAddCircleSharp />
          ADD SECTION
        </button>
      </div>
    </div>
  );
};

export default Canvas;
