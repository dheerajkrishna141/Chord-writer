import { useContext } from "react";
import ChordBox from "./ChordBox";
import ChordConfigBar from "./ChordConfigBar";
import { ChordContext } from "../stateManagement/chordContext";
import DropBox from "./DropBox";
import ChordBar from "./ChordBar";

const Hero = () => {
  return (
    <div className="chord-config">
      <ChordConfigBar />
    </div>
  );
};

export default Hero;
