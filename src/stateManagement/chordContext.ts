import React, { Dispatch } from "react";
import { renderChords } from "../App";
import { CanvasType } from "../components/Canvas";
import { Chord } from "../components/ChordConfigBar";

export interface chordContext {
  potentialChords: Chord[];
  setPotentialChords: Dispatch<React.SetStateAction<Chord[]>>;
  chordsToRender: renderChords[];
  setChordsToRender: Dispatch<React.SetStateAction<renderChords[]>>;
  customChord: Chord;
  setCustomChord: Dispatch<React.SetStateAction<Chord>>;
  canvasState: CanvasType[];
  setCanvasState: Dispatch<React.SetStateAction<CanvasType[]>>;
  isDragging: boolean;
}

export const ChordContext = React.createContext<chordContext>(
  {} as chordContext
);
