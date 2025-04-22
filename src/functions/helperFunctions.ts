import { Chord } from "../components/ChordConfigBar";
import { majorFamily, minorFamily, rootNotes } from "../data/ChordConfigData";

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

export const chordMaker = (chord: Chord) => {
  return { ...chord, id: `custom${chord.rootNote}${chord.scale}` };
};
