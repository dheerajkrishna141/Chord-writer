import { Chord } from "../components/ChordConfigBar";
import { majorFamily, minorFamily, rootNotes } from "../data/ChordConfigData";
import { chordContext } from "../stateManagement/chordContext";
import { MetaDataContext } from "../stateManagement/metaDataContext";

export const potentialChordFinder = (chordConfig: Chord) => {
  var potentialChords: Chord[] = [];
  var index = rootNotes.findIndex((note) => note.name === chordConfig.rootNote);
  if (index === -1) return [];
  potentialChords.push({
    id: `${chordConfig.rootNote}${chordConfig.scale}`,
    rootNote: chordConfig.rootNote,
    scale: chordConfig.scale,
  });

  (chordConfig.scale === "Minor" ? minorFamily : majorFamily).map((count) => {
    index = (index + count.count) % rootNotes.length;
    potentialChords.push({
      id: `${rootNotes[index].name}${count.scale}`,
      rootNote: rootNotes[index].name,
      scale: count.scale,
    });
  });

  return potentialChords;
};

export const customChordMaker = (chord: Chord) => {
  return { ...chord, id: `custom${chord.rootNote}${chord.scale}` };
};

export const parseCanvasSavedState = (savedState: string) => {
  if (savedState === "") return;
  const savedContext: chordContext = JSON.parse(savedState);
  return savedContext;
};

export const parseMetaDataSavedState = (savedState: string) => {
  if (savedState === "") return;
  const savedMetaData: MetaDataContext = JSON.parse(savedState);
  return savedMetaData;
};
