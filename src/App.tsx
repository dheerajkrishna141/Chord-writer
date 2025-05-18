import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useState } from "react";
import "./App.css";
import Aside from "./components/Aside";
import Canvas, { CanvasType } from "./components/Canvas";
import ChordBar from "./components/ChordBar";
import ChordConfigBar, { Chord } from "./components/ChordConfigBar";
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
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [navActive, setNavActive] = useState(false);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragId(event.active.id as string);
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
      if (activeId.startsWith("custom")) {
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

  const sensors = useSensors(useSensor(PointerSensor), useSensor(TouchSensor));
  return (
    <>
      <div className="m-10 ">
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          autoScroll={false}
        >
          <ChordContext.Provider
            value={{
              activeDragId: activeDragId,
              setActiveDragId: setActiveDragId,
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
              <button
                className="print-hide md:hidden btn btn-secondary mb-4"
                onClick={() => setNavActive(!navActive)}
              >
                <i className="fas fa-music"></i>
              </button>

              <Aside NavActive={navActive} setNavActive={setNavActive} />
              <div
                className={`flex ${
                  navActive &&
                  `bg-black opacity-50 transition-all duration-300 ease-in-out`
                } flex-col justify-center items-center`}
              >
                <div className="chord-config">
                  <ChordConfigBar />
                </div>
                <div className="flex flex-col md:flex-row md:gap-5">
                  <ChordBar />
                  <div>
                    <Canvas />
                    <div className="print-hide container mx-auto mt-4 px-4 md:px-6 pb-6 text-center">
                      <button onClick={window.print} className="btn btn-green">
                        <i className="fas fa-print mr-2"></i>Print to PDF
                      </button>
                    </div>
                  </div>
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
