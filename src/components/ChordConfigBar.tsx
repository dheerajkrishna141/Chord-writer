import { useContext, useEffect, useState } from "react";
import { rootNotes, scales } from "../data/ChordConfigData";
import { potentialChordFinder } from "../functions/helperFunctions";
import { ChordContext } from "../stateManagement/chordContext";
import { MetaDataContext } from "../stateManagement/metaDataContext";
import CustomChord from "./CustomChord";
import { MetaData } from "./MetaData";

export interface Chord {
  id: number | string;
  rootNote: string;
  scale: string;
}

export type songData = {
  title: string;
  tempo: string;
};

const ChordConfigBar = () => {
  const [chordConfig, setChordConfig] = useState<Chord>({} as Chord);
  const [songConfig, setSongConfig] = useState<songData>({} as songData);
  const context = useContext(ChordContext);
  const metaContext = useContext(MetaDataContext);

  useEffect(() => {
    console.log(chordConfig);
    if (chordConfig.rootNote && chordConfig.scale) {
      const potentialChords = potentialChordFinder(chordConfig);
      context.setPotentialChords(potentialChords);
    }
  }, [chordConfig]);

  useEffect(() => {
    if (
      songConfig.title &&
      songConfig.tempo &&
      chordConfig.scale &&
      chordConfig.rootNote
    ) {
      const songConfigData: MetaData = {
        title: songConfig.title,
        tempo: songConfig.tempo,
        scale: `${chordConfig.rootNote} ${chordConfig.scale}`,
      };
      metaContext.setSongMetaData(songConfigData);
    }
  }, [songConfig]);

  return (
    <div className="flex gap-4">
      <div className="flex flex-col gap-2">
        <h3>Title</h3>
        <input
          className="p-1"
          placeholder="Enter title here.."
          onChange={(e) =>
            setSongConfig((prev) => {
              return { ...prev, title: e.target.value };
            })
          }
        ></input>
      </div>
      <div className="flex flex-col gap-2">
        <h3>Root Note</h3>
        <select
          name="rootNotes"
          onChange={(e) =>
            setChordConfig({ ...chordConfig, rootNote: e.currentTarget.value })
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
        <h3>Scale</h3>
        <select
          name="chordType"
          onChange={(e) =>
            setChordConfig({ ...chordConfig, scale: e.currentTarget.value })
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

      <div className="flex flex-col gap-2">
        <h3>Tempo</h3>
        <input
          type="number"
          placeholder="Type in..."
          onChange={(e) =>
            setSongConfig((prev) => {
              return { ...prev, tempo: e.target.value };
            })
          }
        ></input>
      </div>

      <div>
        <CustomChord></CustomChord>
      </div>
    </div>
  );
};

export default ChordConfigBar;
