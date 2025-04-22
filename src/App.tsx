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

  const ref = useRef<HTMLDivElement>(null);

  const generatePdf = () => {
    if (!ref.current) return;
    const divElement = ref.current;
    console.log("divElement", divElement);

    html2canvas(divElement).then((canvas) => {
      const data = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgProperties = pdf.getImageProperties(data);
      const pdfWidth = pdf.internal.pageSize.getWidth() - 20; // Subtracting 20 for 10 margin on each side
      const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;
      pdf.addImage(data, "PNG", 10, 10, pdfWidth, pdfHeight); // Adding 10 margin
      pdf.save("download.pdf");
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
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
        Chords.splice(chordIndex, 1);
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
      newCanvas[lyricIndex].ChordBoxes[chordBoxIndex] = false;
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
      <div className="p-10 w-[595px] h-[842px] bg-white ">
        <DndContext onDragEnd={handleDragEnd}>
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
            }}
          >
            <MetaDataContext.Provider
              value={{
                songMetaData: songMetaData,
                setSongMetaData: setSongMetaData,
              }}
            >
              <div>
                <Hero />
                <div ref={ref}>
                  <Canvas />
                </div>

                <div>
                  <h1>Drop here to delete</h1>
                  <DropBox id="deleteBox">
                    <div className="w-10 h-10 bg-red-500"></div>
                  </DropBox>
                </div>

                <div className="p-2 bg-blue-500 rounded-md w-fit">
                  <button onClick={generatePdf}>Download</button>
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
