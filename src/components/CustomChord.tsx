import { useContext, useState } from "react";
import { rootNotes, types } from "../data/ChordConfigData";
import { customChordMaker } from "../functions/helperFunctions";
import { ChordContext } from "../stateManagement/chordContext";
import { Chord } from "./ChordConfigBar";

interface props {
  className?: string;
}
const CustomChord = ({ className }: props) => {
  const [selectedChord, setSelectedChord] = useState<Chord>({} as Chord);
  const context = useContext(ChordContext);

  const handleClick = () => {
    if (selectedChord.rootNote && selectedChord.scale) {
      const finalChord = customChordMaker(selectedChord);
      context?.setPotentialChords((prev) => {
        if (prev.some((obj) => obj.id === finalChord.id)) return prev;
        return [...prev, finalChord];
      });
    }
  };

  return (
    <div className={`rounded-md ${className} md:flex flex-col `}>
      <p className="font-display text-xl text-center text-[#E2E8F0] mb-2">
        CUSTOM CHORD
      </p>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <select
            name="rootNotes"
            onChange={(e) =>
              setSelectedChord({
                ...selectedChord,
                rootNote: e.currentTarget.value,
              })
            }
          >
            <option value="">Root: </option>
            {rootNotes.map((note) => (
              <option key={note.id} value={note.name}>
                Root: {note.name}
              </option>
            ))}
            <option key={"."} value={"."}>
              .
            </option>
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <select
            name="chordType"
            onChange={(e) =>
              setSelectedChord({
                ...selectedChord,
                scale: e.currentTarget.value,
              })
            }
          >
            <option value="">Type: </option>
            {types.map((type) => (
              <option key={type.id} value={type.name}>
                Type: {type.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <button
        onClick={handleClick}
        className="btn btn-primary w-full mt-5 text-sm"
      >
        Add to Palette
      </button>
    </div>
  );
};

export default CustomChord;
