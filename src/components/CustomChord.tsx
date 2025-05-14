import { useContext, useEffect, useState } from "react";
import { rootNotes, scales } from "../data/ChordConfigData";
import { customChordMaker } from "../functions/helperFunctions";
import { ChordContext } from "../stateManagement/chordContext";
import ChordBox from "./ChordBox";
import { Chord } from "./ChordConfigBar";

const CustomChord = () => {
  const [selectedChord, setSelectedChord] = useState<Chord>({} as Chord);
  const customChord = useContext(ChordContext);

  useEffect(() => {
    if (selectedChord.rootNote && selectedChord.scale) {
      const finalChord = customChordMaker(selectedChord);
      customChord?.setCustomChord(finalChord);
    }
  }, [selectedChord]);

  return (
    <div className="border-2 border-gray-300 rounded-md flex flex-col gap-4 p-4">
      <h3>Custom Chord</h3>
      <div className="flex gap-2">
        <div className="flex flex-col gap-2">
          <h4>Root Note</h4>
          <select
            name="rootNotes"
            onChange={(e) =>
              setSelectedChord({
                ...selectedChord,
                rootNote: e.currentTarget.value,
              })
            }
          >
            <option value="">Select a root note</option>
            {rootNotes.map((note) => (
              <option key={note.id} value={note.name}>
                {note.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <h4>Scale</h4>
          <select
            name="chordType"
            onChange={(e) =>
              setSelectedChord({
                ...selectedChord,
                scale: e.currentTarget.value,
              })
            }
          >
            <option value="">Select a scale</option>
            {scales.map((scale) => (
              <option key={scale.id} value={scale.name}>
                {scale.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      {customChord && (
        <ChordBox
          className="bg-gray-300"
          chord={customChord.customChord}
        ></ChordBox>
      )}
    </div>
  );
};

export default CustomChord;
