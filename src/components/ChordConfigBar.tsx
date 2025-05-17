import { useContext, useEffect, useState } from "react";
import { rootNotes, scales } from "../data/ChordConfigData";
import { potentialChordFinder } from "../functions/helperFunctions";
import { ChordContext } from "../stateManagement/chordContext";
import { MetaDataContext } from "../stateManagement/metaDataContext";
import useLocalStorage from "../stateManagement/useLocalStorage";
import { AnimatePresence } from "framer-motion";
import Toast from "./Toast";

export interface Chord {
  id: number | string;
  rootNote: string;
  scale: string;
}

export type canvasSongData = {
  title: string;
  tempo: string;
  textSize: string;
};

const ChordConfigBar = () => {
  const [chordConfig, setChordConfig] = useState<Chord>({} as Chord);
  const [_, setSongConfig] = useState<canvasSongData>({} as canvasSongData);
  const [toastVisible, setToastVisible] = useState(false);

  const context = useContext(ChordContext);
  const metaContext = useContext(MetaDataContext);
  const { setItem } = useLocalStorage("canvasState");
  const { setItem: setChordContextItem } = useLocalStorage("metaDataState");
  const handleSave = (onClick: boolean) => {
    setItem(context);
    setChordContextItem(metaContext);
    if (onClick) setToastVisible(true);
  };

  useEffect(() => {
    if (toastVisible) {
      const timer = setTimeout(() => {
        setToastVisible(false);
      }, 5000); // 2 seconds

      return () => clearTimeout(timer);
    }
  }, [toastVisible]);

  useEffect(() => {
    const interval = setInterval(() => {
      handleSave(false);
    }, 1 * 60 * 1000); // 1 minute

    return () => clearInterval(interval);
  }, [context]);

  useEffect(() => {
    if (metaContext.songMetaData) {
      setSongConfig({
        tempo: metaContext.songMetaData.tempo,
        title: metaContext.songMetaData.title,
        textSize: metaContext.songMetaData.textSize,
      });
    }
  }, []);
  useEffect(() => {
    if (chordConfig.rootNote && chordConfig.scale) {
      const potentialChords = potentialChordFinder(chordConfig);
      context.setPotentialChords(potentialChords);
      const scale = `${chordConfig.rootNote} ${chordConfig.scale}`;
      metaContext.setSongMetaData({
        ...metaContext.songMetaData,
        scale: scale,
      });
    }
  }, [chordConfig]);

  return (
    <div className="relative print-hide chord-config-bar card flex flex-col items-center md:flex-row gap-4">
      <AnimatePresence mode="popLayout">
        {toastVisible && (
          <Toast
            className="absolute -top-10 right-0 left-0 mx-auto"
            onClick={() => setToastVisible(false)}
          />
        )}
      </AnimatePresence>
      <div className="flex flex-col gap-2">
        <label htmlFor="title-input">Title</label>
        <input
          id="title-input"
          value={metaContext.songMetaData.title}
          className="p-1"
          placeholder="Enter title here.."
          onChange={(e) =>
            metaContext.setSongMetaData({
              ...metaContext.songMetaData,
              title: e.target.value,
            })
          }
        ></input>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="root-note-select">Root Note</label>
        <select
          id="root-note-select"
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
        <label htmlFor="scale-select">Scale</label>
        <select
          id="scale-select"
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
        <label htmlFor="tempo-input">Tempo</label>
        <input
          id="tempo-input"
          value={metaContext.songMetaData.tempo}
          type="number"
          placeholder="Type in..."
          onChange={(e) =>
            metaContext.setSongMetaData({
              ...metaContext.songMetaData,
              tempo: e.target.value,
            })
          }
        ></input>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="text-size">Text Size</label>
        <select
          id="text-size"
          value={metaContext.songMetaData.textSize}
          onChange={(e) =>
            metaContext.setSongMetaData({
              ...metaContext.songMetaData,
              textSize: e.currentTarget.value,
            })
          }
        >
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </div>

      <div className="text-right md:pt-6 ml-20">
        <button
          onClick={() => handleSave(true)}
          className="btn btn-green text-sm"
        >
          <i className="fas fa-save mr-2"></i>Save
        </button>
      </div>
    </div>
  );
};

export default ChordConfigBar;
