import { useContext } from "react";
import ChordBox from "./ChordBox";
import ChordConfigBar from "./ChordConfigBar";
import { ChordContext } from "../stateManagement/chordContext";

const Hero = () => {
  const context = useContext(ChordContext);
  return (
    <div>
      <ChordConfigBar />

      <div className="flex-col mb-10">
        <h1>Chords</h1>
        <div className="flex gap-2">
          {context?.potentialChords &&
            context.potentialChords.map((chord, index) => (
              <ChordBox key={index} chord={chord} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
