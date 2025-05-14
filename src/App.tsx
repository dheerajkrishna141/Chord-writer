import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { useState } from "react";
import "./App.css";
import Canvas, { CanvasType } from "./components/Canvas";
import ChordBar from "./components/ChordBar";
import { Chord } from "./components/ChordConfigBar";
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
  const [canvas, setCanvas] = useState<CanvasType[]>([]);
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

    if (overId.startsWith("add")) return;

    if (overId === "deleteBox") {
      if (!activeId.includes("-")) {
        return;
      }
      setChordsToRender((prev) =>
        prev.filter((chord) => chord.id !== activeId)
      );

      setCanvas((prev) => {
        const newCanvas = [...prev];
        const sectionIndex = parseInt(activeId.split("-")[1]);
        const lyricIndex = parseInt(activeId.split("-")[2]);
        const chordBoxIndex = parseInt(activeId.split("-")[3]);
        const currentSection = newCanvas[sectionIndex].SectionState[lyricIndex];
        const chords = currentSection.ChordBoxes;
        if (chords[chordBoxIndex]) {
          chords[chordBoxIndex].count = Math.max(
            (chords[chordBoxIndex].count || 1) - 1,
            0
          );
          if (chords[chordBoxIndex].count === 0) {
            chords[chordBoxIndex].isEmpty = true;
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
      id: `${draggedChord.rootNote}${Date.now()}-${overId}`,
    };

    setCanvas((prev) => {
      const sectionIndex = parseInt(overId.split("-")[0]);
      const lyricIndex = parseInt(overId.split("-")[1]);
      const chordBoxIndex = parseInt(overId.split("-")[2]);
      const newCanvas = [...prev];
      const currentSection = newCanvas[sectionIndex].SectionState[lyricIndex];
      const currentBox = currentSection.ChordBoxes[chordBoxIndex];
      currentSection.ChordBoxes[chordBoxIndex] = {
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
        <DndContext
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          autoScroll={false}
        >
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
              <div className="flex flex-col lg:justify-center lg:items-center ">
                <Hero />
                <ChordBar />
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
