import { DndContext, DragEndEvent } from "@dnd-kit/core";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { useRef, useState } from "react";
import "./App.css";
import Canvas, { CanvasState } from "./components/Canvas";
import { Chord } from "./components/ChordConfigBar";
import DropBox from "./components/DropBox";
import Hero from "./components/Hero";
import { MetaData } from "./components/MetaData";
import { ChordContext } from "./stateManagement/chordContext";
import { MetaDataContext } from "./stateManagement/metaDataContext";

export interface renderChords extends Chord {
  overid: string;
}

function App() {
  const [chordsToRender, setChordsToRender] = useState<renderChords[]>([]);
  const [potentialChords, setPotentialChords] = useState<Chord[]>([]);
  const [customChord, setCustomChord] = useState<Chord>({} as Chord);
  const [songMetaData, setSongMetaData] = useState({} as MetaData);
  const [canvas, setCanvas] = useState<CanvasState[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setIsDragging(false);

    if (!over) return;
    const activeId = active.id as string;
    const overId = over.id as string;
    console.log("active Id", activeId);
    console.log("over Id", overId);

    if (overId === "deleteBox") {
      setChordsToRender((prev) =>
        prev.filter((chord) => chord.id !== activeId)
      );
      setCanvas((prev) => {
        const newCanvas = [...prev];
        const lyricIndex = parseInt(activeId.split("-")[1]);
        const chordIndex = parseInt(activeId.split("-")[2]);
        const Chords = newCanvas[lyricIndex].ChordBoxes;
        if (Chords[chordIndex]) {
          Chords[chordIndex].count = Math.max(
            (Chords[chordIndex].count || 1) - 1,
            0
          );
          if (Chords[chordIndex].count === 0) {
            Chords[chordIndex].isEmpty = true;
          }
        }
        return newCanvas;
      });

      return;
    }
    var draggedChord = potentialChords.find((chord) => chord.id === activeId);
    if (!draggedChord) {
      if (customChord.id === activeId) {
        draggedChord = customChord;
      } else {
        return chordsToRender;
      }
    }
    const newChord = {
      ...draggedChord,
      id: `${draggedChord.rootNote}${chordsToRender.length}-${overId.substring(
        6
      )}`,
    };

    setCanvas((prev) => {
      const lyricIndex = parseInt(overId.split("-")[1]);
      const chordBoxIndex = parseInt(overId.split("-")[2]);
      const newCanvas = [...prev];
      const currentBox = newCanvas[lyricIndex].ChordBoxes[chordBoxIndex];
      newCanvas[lyricIndex].ChordBoxes[chordBoxIndex] = {
        count: (currentBox?.count || 0) + 1,
        isEmpty: false,
      };

      return newCanvas;
    });

    setChordsToRender(() => {
      const newRender = [...chordsToRender, { ...newChord, overid: overId }];
      console.log("newRender", newRender);
      return newRender;
    });

    console.log("canvas", canvas);
  };

  return (
    <>
      <div className="p-10  bg-white ">
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <ChordContext.Provider
            value={{
              canvasState: canvas,
              setCanvasState: setCanvas,
              chordsToRender: chordsToRender,
              setChordsToRender: setChordsToRender,
              customChord: customChord,
              setCustomChord: setCustomChord,
              potentialChords: potentialChords,
              setPotentialChords: setPotentialChords,
              isDragging: isDragging,
            }}
          >
            <MetaDataContext.Provider
              value={{
                songMetaData: songMetaData,
                setSongMetaData: setSongMetaData,
              }}
            >
              <div className="flex flex-col lg:justify-center lg:items-center overflow-auto">
                <Hero />

                <Canvas />

                <div className="download p-2 bg-blue-500 rounded-md w-fit">
                  <button>Download</button>
                </div>
              </div>
            </MetaDataContext.Provider>
          </ChordContext.Provider>
        </DndContext>
      </div>
    </>
  );
}

export default App;
