export const rootNotes = [
  { id: "C", name: "C" },
  { id: "C#", name: "C#" },
  { id: "D", name: "D" },
  { id: "D#", name: "D#" },
  { id: "E", name: "E" },
  { id: "F", name: "F" },
  { id: "F#", name: "F#" },
  { id: "G", name: "G" },
  { id: "G#", name: "G#" },
  { id: "A", name: "A" },
  { id: "A#", name: "A#" },
  { id: "B", name: "B" },
];

export const scales = [
  { id: "major", name: "Major", suffix: "" },
  { id: "minor", name: "Minor", suffix: "m" },
  { id: "power", name: "Power Chord", suffix: "5" },
];

export const types = [
  { id: "major", name: "Major", suffix: "" },
  { id: "minor", name: "Minor", suffix: "m" },
  { id: "diminished", name: "Diminished", suffix: "dim" },
  { id: "power", name: "Power Chord", suffix: "5" },
  { id: "major7th", name: "Major 7th", suffix: "7" },
  { id: "minor7th", name: "Minor 7th", suffix: "min7" },
];

//should look into this later
export const timeSignatures = [{}];

export const powerChordFamily = [
  { count: 1, scale: "Power Chord" },
  { count: 1, scale: "Power Chord" },
  { count: 1, scale: "Power Chord" },
  { count: 1, scale: "Power Chord" },
  { count: 1, scale: "Power Chord" },
  { count: 1, scale: "Power Chord" },
  { count: 1, scale: "Power Chord" },
  { count: 1, scale: "Power Chord" },
  { count: 1, scale: "Power Chord" },
  { count: 1, scale: "Power Chord" },
  { count: 1, scale: "Power Chord" },
];

export const minorFamily = [
  { count: 2, scale: "Diminished" },
  { count: 1, scale: "Major" },
  { count: 2, scale: "Minor" },
  { count: 2, scale: "Minor" },
  { count: 1, scale: "Major" },
  { count: 2, scale: "Major" },
];

export const majorFamily = [
  { count: 2, scale: "Minor" },
  { count: 2, scale: "Minor" },
  { count: 1, scale: "Major" },
  { count: 2, scale: "Major" },
  { count: 2, scale: "Minor" },
  { count: 2, scale: "Diminished" },
];
