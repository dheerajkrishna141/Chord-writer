import { useContext, useEffect, useState } from "react";
import { parseCanvasSavedState } from "../functions/helperFunctions";
import { ChordContext } from "../stateManagement/chordContext";
import { MetaDataContext } from "../stateManagement/metaDataContext";
import useLocalStorage from "../stateManagement/useLocalStorage";
import MetaData from "./MetaData";
import Section from "./Section";

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
  const [textSizeState, setTextSizeState] = useState("");

  const context = useContext(ChordContext);
  const metaDataContext = useContext(MetaDataContext);
  const { getItem } = useLocalStorage("canvasState");
  const savedState = getItem()
    ? parseCanvasSavedState(getItem() || "")
    : undefined;
  const chordsToRender = context.chordsToRender;
  const canvas = context.canvasState;
  const setCanvas = context.setCanvasState;
  const setChordsToRender = context.setChordsToRender;
  const textSize = metaDataContext.songMetaData.textSize;

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

  useEffect(() => {
    switch (textSize) {
      case "small":
        setTextSizeState("text-lg");
        break;
      case "medium":
        setTextSizeState("text-xl");
        break;
      case "large":
        setTextSizeState("text-2xl");
        break;
    }
  }, [textSize]);

  return (
    <div className="canvas-content border-2 border-gray-300 rounded-md p-2 sm:p-4 w-[400px] sm:w-fit lg:w-[8.5in] h-fit mt-5 bg-white ">
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
                <div className="print-hide absolute top-0 right-0 p-2  hover:scale-105 transition-all duration-100 ease-in-out">
                  <button
                    className="btn-remove-section"
                    onClick={() => handleSectionDelete(sectionIndex)}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              )}

              <div>
                <input
                  type="text"
                  style={{ width: "100%" }}
                  className={`section-title ${textSizeState}`}
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
                className="print-hide btn btn-secondary text-xs mt-3"
                onClick={() => addLyric(sectionIndex)}
              >
                <i className="fas fa-plus-circle mr-1"></i>Add Lyric
              </button>
            </div>
          );
        })}

        <div className="print-hide text-center mt-8">
          <button onClick={addSection} className="btn btn-secondary w-full">
            <i className="fas fa-layer-group mr-2"></i>Add Section
          </button>
        </div>
      </div>
    </div>
  );
};

export default Canvas;
