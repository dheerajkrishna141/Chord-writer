import React, { Dispatch } from "react";
import { renderChords } from "../App";
import { CanvasState } from "../components/Canvas";
import { Chord } from "../components/ChordConfigBar";

export interface chordContext {
  potentialChords: Chord[];
  setPotentialChords: Dispatch<React.SetStateAction<Chord[]>>;
  chordsToRender: renderChords[];
  setChordsToRender: Dispatch<React.SetStateAction<renderChords[]>>;
  customChord: Chord;
  setCustomChord: Dispatch<React.SetStateAction<Chord>>;
  canvasState: CanvasState[];
  setCanvasState: Dispatch<React.SetStateAction<CanvasState[]>>;
}

export const ChordContext = React.createContext<chordContext>(
  {} as chordContext
);
